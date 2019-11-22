import {getAllUserCheckIns, getUserFile, loadFriendData, postSolidFile, putSolidFile} from "./SolidMethods";

import * as SolidTemplates from './rdf/SolidTtlTemplates';
import {buildSolidCommunicator} from './solidCommunicatorInits/SolidCommunicatorBuilder'
import {preApplicationHandelings} from './solidCommunicatorInits/PreApplicationHandelings'

import Beer from '../model/HolderComponents/Beer'
import BeerCheckIn from '../model/HolderComponents/CheckIn'

import * as fileClient from 'solid-file-client';
import * as rdfLib from 'rdflib';

import * as kadasterLabsComm from './DataLavaKadaster/DataLabsKadasterComm';

import {
    APPDATA_FILE,
    APPLICATION_INVITAION_DESC,
    APPLICATION_INVITAION_NAME,
    BEERCHECKINFILENAME,
    BEERDRINKERFOLDER,
    BEERREVIEWFILENAME,
    CHECKIN_FOLDER,
    CHECKIN_INDEX_FILE,
    CHECKIN_INDEX_NAME,
    FRIENDS_FILE,
    FRIENDSHIPREQUEST_ACCEPTED_DESC,
    FRIENDSHIPREQUEST_ACCEPTED_NAME,
    FRIENDSHIPREQUEST_DECLINED_DESC,
    FRIENDSHIPREQUEST_DECLINED_NAME,
    FRIENDSSHIPREQUEST_DESC,
    FRIENDSSHIPREQUEST_NAME,
    GROUP_DATA_FILE,
    GROUP_DATA_FILENAME,
    GROUPFOLDER,
    GROUPINVITATION_DESC,
    GROUPINVITATION_NAME,
    INBOX_FOLDER
} from "./rdf/Constants";
import {DBPEDIA, FOAF, RDF, SCHEMA, SOLID, SOLIDLINKEDBEER, VCARD} from "./rdf/Prefixes";
import Friend from "../model/HolderComponents/Friend";
import Group from "../model/HolderComponents/Group";
import InboxMessage from "../model/HolderComponents/InboxMessage";

class SolidCommunicator {
    /**
     * Build the solid communicator
     * @param {*} modelHolder
     */
    static async build(modelHolder) {
        let solidCommunicator = new SolidCommunicator(modelHolder);

        await buildSolidCommunicator(modelHolder, solidCommunicator);

        //make new solidCommunicator
        return solidCommunicator;
    }

    constructor(modelHolder) {
        this._modelHolder = modelHolder;
        this._user = modelHolder.getUser();
    }

    loadInFriendsStore(friendGroup, friendsRequestedGroup, friendsStore) {
        this._friendsStore = friendsStore;
        this._friendGroup = friendGroup;
        this._friendsRequestedGroup = friendsRequestedGroup;

        preApplicationHandelings(this._user.getBeerDrinkerFolder(), friendGroup, friendsRequestedGroup, friendsStore, this._modelHolder);
    }

    loadInAppStore(store, blankNode) {
        this._appStore = store;
        this._blankNodeAppStore = blankNode;
    }

    setFileLocations() {
        this._beerDrinkerFolder = this._user.getBeerDrinkerFolder();
        this._checkInFolder = this._beerDrinkerFolder + CHECKIN_FOLDER;
        this._appStoreLocation = this._beerDrinkerFolder + APPDATA_FILE;
    }

    /**
     * Get an user file
     * @param {*} url
     */
    async getUserFile(url) {
        return await getUserFile(url);
    }

    /**
     * Get all content from the inbox.
     * @returns {Promise<[]>}
     */
    async getInboxContents() {
        let inbox = this._user.getBeerDrinkerFolder() + INBOX_FOLDER;
        let res = await fileClient.readFolder(inbox);
        let files = [];

        for (let index = 0; index < res.files.length; index++) {
            let file = new InboxMessage(res.files[index].url);
            this.loadFileContents(file);
            files.push(file);
        }

        this._modelHolder.setInboxMessages(files);
    }

    async loadFileContents(file) {
        let url = file.getUri();
        let graph = rdfLib.graph();
        let fileTTL = await fileClient.readFile(url);

        await rdfLib.parse(fileTTL, graph, url, "text/turtle");

        let blanknode = graph.any(undefined, RDF('type'));

        let type = graph.any(blanknode, RDF('type'));
        let description = graph.any(blanknode, SOLIDLINKEDBEER('description'));
        let from = graph.any(blanknode, SOLIDLINKEDBEER('from'));
        let location = graph.any(blanknode, SOLIDLINKEDBEER('location'));
        let groupName = graph.any(blanknode, SOLIDLINKEDBEER('groupName'));

        file.setContents(
            type.value.replace(/.*#/, ""),
            from.value,
            description.value,
            location ? location.value : undefined,
            groupName ? groupName.value : undefined
        );
    }

    /**
     * Check if user is already friend
     * @param {*} url
     */
    checkIfUserIsFriend(url) {
        let query1 = this._friendsStore.match(this._friendsRequestedGroup, VCARD('hasMember'), rdfLib.sym(url));
        let query2 = this._friendsStore.match(this._friendGroup, VCARD('hasMember'), rdfLib.sym(url));

        if (query1.length !== 0 || query2.length !== 0) {
            console.log("already friend");
            return true;
        }

        return false;
    }

    /**
     * Send invitation to user for the application
     * @param {*} urlInvitee
     * @param {*} inbox
     */
    async inviteUserToSolib(urlInvitee, inbox) {
        //name for file
        let fileName = APPLICATION_INVITAION_NAME + this._user.getName();
        let invitation = this._user.getName() + APPLICATION_INVITAION_DESC;

        //name of the location where it will be posted
        let postLocation = inbox + fileName + ".ttl";

        //get ttl file for invitation
        let invitationTTL = SolidTemplates.getInviteToLSBInvitation(urlInvitee, invitation, postLocation, this._user.getUri());

        await postSolidFile(inbox, fileName, invitationTTL);
    }

    /**
     * Sends a friendship request to user
     * @param {*} urlInvitee
     * @param {*} appLocation
     */
    async sendFriendshipRequest(urlInvitee, appLocation) {
        if (!this.checkIfUserIsFriend(urlInvitee)) {
            //get url without https and profile card.me
            let fileNameName = this._user.getName();

            //make a file name
            let fileName = FRIENDSSHIPREQUEST_NAME + fileNameName;

            //the invitation
            let invitation = (this._user.getName() ? this._user.getName() : this._user.getUri()) + FRIENDSSHIPREQUEST_DESC;

            //locations to be posted
            let location = appLocation + BEERDRINKERFOLDER + INBOX_FOLDER;
            let postLocation = location + fileName + ".ttl";

            //the ttl file
            let invitationTTL = SolidTemplates.getFriendShipRequest(urlInvitee, invitation, postLocation, this._user.getUri());

            //add friend to friend request send
            let friendsFile = this._user.getBeerDrinkerFolder() + FRIENDS_FILE;
            this._friendsStore.add(this._friendsRequestedGroup, VCARD('hasMember'), rdfLib.sym(urlInvitee));
            let friendsTTL = await rdfLib.serialize(undefined, this._friendsStore, friendsFile, 'text/turtle');

            // send files
            await postSolidFile(location, fileName, invitationTTL);
            await putSolidFile(friendsFile, friendsTTL);
        }
    }

    async declineFriendSchipRequest(message) {
        //send a declined friendship request to other pod
        let result = await this.getUserFile(message.getFrom());
        let inbox = result.appLocation + BEERDRINKERFOLDER + INBOX_FOLDER;

        //get file name and description string
        let fileNameName = this._user.getName();
        let fileName = FRIENDSHIPREQUEST_DECLINED_NAME + fileNameName;
        let invitation = (this._user.getName() ? this._user.getName() : this._user.getUri()) + FRIENDSHIPREQUEST_DECLINED_DESC;

        //get the location is will be posted to
        let postLocation = inbox + fileName + ".ttl";

        //make a text file and send
        let declineTTL = SolidTemplates.getDeclineFriendshipRequest(message.getFrom(), invitation, postLocation, this._user.getUri());

        //delete friendship request from own pod
        await postSolidFile(inbox, fileName, declineTTL);
        await fileClient.deleteFile(message.getUri());
    }

    async acceptFriendSchipRequest(message) {
        //get user
        let friend = new Friend(message.getFrom());
        await loadFriendData(friend);

        let inbox = friend.getBeerDrinkerFolder() + INBOX_FOLDER;

        //add user as friend
        let friendsFile = this._user.getBeerDrinkerFolder() + FRIENDS_FILE;
        this._friendsStore.add(this._friendGroup, VCARD('hasMember'), rdfLib.sym(message.getFrom()));
        let friendsTTL = await rdfLib.serialize(undefined, this._friendsStore, friendsFile, 'text/turtle');

        //get file name and description string
        let fileNameName = this._user.getName();
        let fileName = FRIENDSHIPREQUEST_ACCEPTED_NAME + fileNameName;
        let description = this._user.getName() + FRIENDSHIPREQUEST_ACCEPTED_DESC;

        //get the location is will be posted to
        let postLocation = inbox + fileName + ".ttl";

        //make a text file and send
        let acceptedTTL = SolidTemplates.getAcceptFriendshipRequest(message.getFrom(), description, postLocation, this._user.getUri());

        //send friendship accepted to user
        await postSolidFile(inbox, fileName, acceptedTTL);
        //delete friendship request from own pod
        await fileClient.deleteFile(message.getUri());
        //update FriendsFile
        await putSolidFile(friendsFile, friendsTTL);

        this._modelHolder.addFriend(friend);
    }

    async fetchBeerList(searchQuery) {
        let res = await kadasterLabsComm.getBeerData(searchQuery);
        this._modelHolder.setBeers(res);
    }

    async fetchBeerData(beer) {
        await kadasterLabsComm.fetchBeerData(beer);
    }

    async postBeerReview(hasReview, beer, rating, review, groups) {
        let ttlFile;

        let date = new Date();

        let checkingFolder = this._checkInFolder;
        let filename;
        let postLocation;
        let beerpoints = 0;

        if (hasReview) {
            filename = date.getTime() + BEERREVIEWFILENAME;
            postLocation = checkingFolder + filename + ".ttl";

            ttlFile = SolidTemplates.beerReviewInTemplate(postLocation,
                this._user.getName(),
                this._user.getUri(),
                beer.getUrl(),
                beer.getName(),
                date,
                rating,
                review);

            beerpoints = 10;
        } else {
            filename = date.getTime() + BEERCHECKINFILENAME;
            postLocation = checkingFolder + filename + ".ttl";
            ttlFile = SolidTemplates.beerCheckInTemplate(postLocation,
                this._user.getName(),
                this._user.getUri(),
                beer.getUrl(),
                beer.getName(),
                date);

            beerpoints = 5;
        }

        groups.forEach(res => {
            if (res === this._user.getCheckInLocation()) {
                this._modelHolder.getCheckInHandler().addBeerPoints(beerpoints);
                this.sendBeerPoints(beerpoints);

                if (hasReview) {
                    this._modelHolder.getCheckInHandler().addBeerReviewToAmount();
                } else {
                    this._modelHolder.getCheckInHandler().addToCheckInsAmount();
                }
            }else{
                let group = this._modelHolder.getGroupFromCheckInLocationUri(res);
                fileClient.fetch(group.getGroupCheckInIndex()).then(checkInIndex => {
                    let graph = rdfLib.graph();
                    rdfLib.parse(checkInIndex, graph, group.getGroupCheckInIndex(), "text/turtle");
                    let userNamedNode = graph.any(rdfLib.sym(this._user.getUri()), SOLIDLINKEDBEER('points'));
                    userNamedNode.value = parseInt(userNamedNode.value) + beerpoints + "";

                    let ttlFile = rdfLib.serialize(undefined, graph, group.getGroupCheckInIndex(), 'text/turtle');
                    putSolidFile(group.getGroupCheckInIndex(),ttlFile);
                })
            }

            postSolidFile(res, filename, ttlFile);
        });

        let checkIn = new BeerCheckIn(postLocation);
        checkIn.loadInAttributes(
            this._user.getUri(),
            this._user.getName(),
            beer.getUrl(),
            beer.getName(),
            date.toString(),
            hasReview ? rating : undefined,
            hasReview ? review : undefined);

        groups.forEach(res => {
            let group = this._modelHolder.getGroupFromCheckInLocationUri(res);

            if(group !== undefined){
                group.getCheckInHandler().addUserCheckIns([checkIn]);
            }else{
                console.log(res);
            }
        });
        this._modelHolder.getCheckInHandler().addUserCheckIns([checkIn]);
    }

    async sendBeerPoints(amount) {
        let beerPointsQueryNow = this._appStore.any(this._blankNodeAppStore, SOLIDLINKEDBEER("points"));
        beerPointsQueryNow.value = parseInt(beerPointsQueryNow.value) + amount + "";

        let appTTL = await rdfLib.serialize(undefined, this._appStore, this._appStoreLocation, 'text/turtle');
        putSolidFile(this._appStoreLocation, appTTL);
    }

    async getBrewerInformation(brewer) {
        await kadasterLabsComm.getBrewerData(brewer);
    }

    async getAllCheckInsLoggedInUser() {
        if (!this._modelHolder.getCheckInHandler().getAllCheckInsGotten()) {
            this._modelHolder.getCheckInHandler().setUserCheckIns(
                await getAllUserCheckIns(
                    this._modelHolder.getUser().getBeerDrinkerFolder()
                )
            );

            this._modelHolder.getCheckInHandler().setAllCheckInsGotten(true);
        }
    }

    async makeNewGroup(beerdrinkerUrl, groupName, friends) {
        let groupUrl = beerdrinkerUrl + GROUPFOLDER + groupName + "/";
        let groupUrlAcl = groupUrl + ".acl";
        let appdataName = groupUrl + GROUP_DATA_FILE;

        //maak groep folder aan
        await fileClient.createFolder(groupUrl);

        //maak appdata file aan
        let body = SolidTemplates.getGroupAppDataTTL(appdataName, friends, this._user.getUri(), groupName);
        await postSolidFile(groupUrl, GROUP_DATA_FILENAME, body);

        //maak checkins folder aan
        let checkins = groupUrl + CHECKIN_FOLDER;
        let checkInsAcl = checkins + ".acl";

        await fileClient.createFolder(checkins);
        let groupCheckInAclTtl = SolidTemplates.getGroupCheckInsAclTTL(checkins, appdataName, checkInsAcl, this._user.getUri());
        await putSolidFile(checkInsAcl, groupCheckInAclTtl);

        //zet de acl van de groups folder online
        let groupAclTtl = SolidTemplates.getGroupAclTTL(groupUrl, appdataName, groupUrlAcl, this._user.getUri());
        await putSolidFile(groupUrlAcl, groupAclTtl);

        //make checkins index
        let checkInsIndex = groupUrl + CHECKIN_INDEX_FILE;
        let checkInsIndexAcl = checkInsIndex + ".acl";
        let checkInIndexBody = SolidTemplates.getCheckInIndexBody(checkInsIndex, friends, this._user);

        await postSolidFile(groupUrl, CHECKIN_INDEX_NAME, checkInIndexBody);

        let aclBody = SolidTemplates.groupCheckInIndexAcl(
            checkInsIndex,
            appdataName,
            checkInsIndexAcl,
            this._user.getUri());
        await putSolidFile(checkInsIndexAcl, aclBody);

        //stuur de uitnodigingen naar de vrienden
        friends.forEach(res => {
            let fileName = GROUPINVITATION_NAME + groupName;
            let desc = GROUPINVITATION_DESC + groupName + "?";

            let location = res.getBeerDrinkerFolder() + INBOX_FOLDER;
            let postLocation = location + fileName + ".ttl";

            let inv = SolidTemplates.getGroupInvitaion(res.getUri(),
                desc,
                postLocation,
                this._user.getUri(),
                groupUrl,
                groupName
            );

            postSolidFile(location, fileName, inv);
        });

        let group = new Group(groupUrl);
        group.setProperties(groupName, checkins, appdataName, this._user.getUri(), friends.map(res => {
            return res.getUri()
        }));
        this._modelHolder.addGroup(group);
    }

    async acceptGroupRequest(message) {
        //see if the person is your friend
        let friend = this._modelHolder.getFriendFromUri(message.getFrom());

        //TODO maak een ttl file voor het accepteren en verzend deze naar de persoon.

        //maak een ttl file om het in eigen groep folder te zetten
        let folderLocation = this._user.getBeerDrinkerFolder() + GROUPFOLDER;
        let postlocation = folderLocation + message.getGroupName();
        let groupLocation = message.getLocation();
        let ownGroupBody = SolidTemplates.getGroupOtherPersonTTL(groupLocation, postlocation);

        await postSolidFile(folderLocation, message.getGroupName(), ownGroupBody);

        //verwijder het bericht
        await fileClient.deleteFile(message.getUri());
    }

    async declineGroupRequest(message) {
        //verwijder het bericht
        await fileClient.deleteFile(message.getUri());

        //TODO decline stuur het door, zodat je eruit wordt getrapt.
    }
}

export default SolidCommunicator;