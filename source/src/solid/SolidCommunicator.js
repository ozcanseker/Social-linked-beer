import {
    appendSolidResource,
    getAllUserCheckIns,
    getUserFile,
    loadFriendData,
    postSolidFile,
    putSolidFile
} from "./SolidMethods";

import * as SolidTemplates from './rdf/SolidTtlTemplates';
import {
    buildSolidCommunicator,
    loadGroupInformation
} from './solidCommunicatorInits/SolidCommunicatorBuilder'
import {preApplicationHandelings} from './solidCommunicatorInits/PreApplicationHandelings'

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
    FRIENDSHIPREQUEST_DECLINED_NAME, FRIENDSHIPREQUESTCLASSNAME,
    FRIENDSSHIPREQUEST_DESC,
    FRIENDSSHIPREQUEST_NAME,
    GROUP_DATA_FILE,
    GROUP_DATA_FILENAME,
    GROUPFOLDER,
    GROUPINVITATION_DESC,
    GROUPINVITATION_NAME, GROUPINVITATIONCLASSNAME,
    INBOX_FOLDER, LIKE_FOLDER, LIKEFILENAME, UNKOWNTYPEINBOXMESSAGE
} from "./rdf/Constants";
import {ACTIVITYSTREAM, FOAF, PURLRELATIONSHIP, RDF, SOLIDLINKEDBEER, VCARD} from "./rdf/Prefixes";
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
        this._NNAppStore = blankNode;
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

        //if not friend request then group request
        let query = graph.any(undefined, RDF('type'), ACTIVITYSTREAM('Offer'));
        let type = FRIENDSHIPREQUESTCLASSNAME;

        if(!query){
            query = graph.any(undefined, RDF('type'), ACTIVITYSTREAM('Invite'));
            type = GROUPINVITATIONCLASSNAME;

            if(!query){
                type = UNKOWNTYPEINBOXMESSAGE;
            }
        }

        let description = graph.any(query, ACTIVITYSTREAM('summary'));
        let from = graph.any(query, ACTIVITYSTREAM('actor'));

        let groupQuery = graph.any(undefined, SOLIDLINKEDBEER('name'));
        let groupName = graph.any(groupQuery, SOLIDLINKEDBEER('name'));

        file.setContents(
            type,
            from.value,
            description.value,
            groupQuery ? groupQuery.value : undefined,
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
        let fileName = APPLICATION_INVITAION_NAME + encodeURI(this._user.getName());
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
            let fileNameName = encodeURI(this._user.getName());

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
        }else{
            throw Error("already send friendship request");
        }
    }

    async declineFriendSchipRequest(message) {
        //send a declined friendship request to other pod
        let result = await this.getUserFile(message.getFrom());
        let inbox = result.appLocation + BEERDRINKERFOLDER + INBOX_FOLDER;

        //get file name and description string
        let fileNameName = encodeURI(this._user.getName());
        let fileName = FRIENDSHIPREQUEST_DECLINED_NAME + fileNameName;
        let invitation = (this._user.getName() ? this._user.getName() : this._user.getUri()) + FRIENDSHIPREQUEST_DECLINED_DESC;

        //get the location is will be posted to
        let postLocation = inbox + fileName + ".ttl";

        //make a text file and send
        let declineTTL = SolidTemplates.getDeclineFriendshipRequest(message.getFrom(), invitation, postLocation, this._user.getUri(), message.getUri());

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

        let userNN = rdfLib.sym(this._user.getUri());

        let friendNN = rdfLib.sym(message.getFrom());

        let relationBn = rdfLib.blankNode();
        this._friendsStore.add(relationBn, RDF('type'), ACTIVITYSTREAM('Relationship'));
        this._friendsStore.add(relationBn, RDF('relationship'), PURLRELATIONSHIP('friendOf'));

        this._friendsStore.add(this._friendGroup, VCARD('hasMember'), friendNN);
        this._friendsStore.add(userNN, FOAF('knows'), friendNN);
        this._friendsStore.add(relationBn, ACTIVITYSTREAM('subject'), userNN);
        this._friendsStore.add(relationBn, ACTIVITYSTREAM('object'), friendNN);

        let friendsTTL = await rdfLib.serialize(undefined, this._friendsStore, friendsFile, 'text/turtle');

        //get file name and description string
        let fileNameName = encodeURI(this._user.getName());
        let fileName = FRIENDSHIPREQUEST_ACCEPTED_NAME + fileNameName;
        let description = this._user.getName() + FRIENDSHIPREQUEST_ACCEPTED_DESC;

        //get the location is will be posted to
        let postLocation = inbox + fileName + ".ttl";

        //make a text file and send
        let acceptedTTL = SolidTemplates.getAcceptFriendshipRequest(message.getFrom(), description, postLocation, this._user.getUri(), message.getUri());

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
        let date = new Date();
        let beerPoints = hasReview ? 10 : 5;
        let filename = hasReview ? date.getTime() + BEERREVIEWFILENAME : date.getTime() + BEERCHECKINFILENAME;

        groups.forEach(res => {
            let ttlFile;
            let postLocation;

            if (hasReview) {
                filename = date.getTime() + BEERREVIEWFILENAME;
                postLocation = res + filename + ".ttl";

                ttlFile = SolidTemplates.beerReviewInTemplate(postLocation,
                    this._user,
                    beer.getUrl(),
                    beer.getName(),
                    date,
                    rating,
                    review);

                beerPoints = 10;
            } else {
                filename = date.getTime() + BEERCHECKINFILENAME;
                postLocation = res + filename + ".ttl";

                ttlFile = SolidTemplates.beerCheckInTemplate(postLocation,
                    this._user,
                    beer.getUrl(),
                    beer.getName(),
                    date);

                beerPoints = 5;
            }

            if (res === this._user.getCheckInLocation()) {
                this._modelHolder.getCheckInHandler().addBeerPoints(beerPoints);
                this.sendBeerPoints(beerPoints);

                if (hasReview) {
                    this._modelHolder.getCheckInHandler().addBeerReviewToAmount();
                } else {
                    this._modelHolder.getCheckInHandler().addToCheckInsAmount();
                }
            } else {
                let group = this._modelHolder.getGroupFromCheckInLocationUri(res);

                fileClient.fetch(group.getGroupCheckInIndex()).then(checkInIndex => {
                    let graph = rdfLib.graph();
                    rdfLib.parse(checkInIndex, graph, group.getGroupCheckInIndex(), "text/turtle");
                    let userNamedNode = graph.any(rdfLib.sym(this._user.getUri()), SOLIDLINKEDBEER('points'));
                    userNamedNode.value = parseInt(userNamedNode.value) + beerPoints + "";

                    let ttlFile = rdfLib.serialize(undefined, graph, group.getGroupCheckInIndex(), 'text/turtle');
                    putSolidFile(group.getGroupCheckInIndex(), ttlFile);
                })
            }

            postSolidFile(res, filename, ttlFile);

            //make checkin to add
            let checkIn = new BeerCheckIn(postLocation);
            checkIn.loadInAttributes(
                this._user.getUri(),
                this._user.getName(),
                beer.getUrl(),
                beer.getName(),
                date.toString(),
                hasReview ? rating : undefined,
                hasReview ? review : undefined,
                false,
                0);

            let group = this._modelHolder.getGroupFromCheckInLocationUri(res);

            if (group !== undefined) {
                group.getCheckInHandler().addUserCheckIns([checkIn]);
            } else {
                this._modelHolder.getCheckInHandler().addUserCheckIns([checkIn]);
            }
        });
    }

    async sendBeerPoints(amount) {
        let beerPointsQueryNow = this._appStore.any(this._NNAppStore, SOLIDLINKEDBEER("points"));
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
        let checkInIndexBody = SolidTemplates.getCheckInIndexBody(checkInsIndex, friends.slice(), this._user);

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

        let group = new Group(groupUrl, true);
        group.setProperties(groupName, checkins, appdataName, checkInsIndex,{member: this._user.getUri(), points: 0}, friends.map(res => {
            return {member: res.getUri(), points:0};
        }));

        this._modelHolder.addGroup(group);
    }

    async acceptGroupRequest(message) {
        //maak een ttl file om het in eigen groep folder te zetten
        let folderLocation = this._user.getBeerDrinkerFolder() + GROUPFOLDER;
        let postlocation = folderLocation + message.getGroupName();
        let groupLocation = message.getLocation();
        let ownGroupBody = SolidTemplates.getGroupOtherPersonTTL(groupLocation, postlocation);

        let group = new Group(message.getLocation(), message.getGroupName());
        loadGroupInformation(group);
        this._modelHolder.addGroup(group);

        await postSolidFile(folderLocation, message.getGroupName(), ownGroupBody);

        //verwijder het bericht
        await fileClient.deleteFile(message.getUri());
    }

    async declineGroupRequest(message) {
        //verwijder het bericht
        await fileClient.deleteFile(message.getUri());

        //TODO decline stuur het door, zodat je eruit wordt getrapt.
    }

    async onLikeClick(checkin) {
        if (!checkin.getLiked()) {
            let encodedUri = checkin._fileLocation.replace(/[\/:|]/gi, "_");
            let fileName = encodedUri.replace(".ttl", "") + LIKEFILENAME;

            let likeFolderLocation = this._user.getBeerDrinkerFolder() + LIKE_FOLDER;
            let likeLocation = likeFolderLocation + fileName + ".ttl";

            let checkInUrl = checkin._fileLocation;
            let body  = `INSERT DATA { <${likeLocation}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/ns/activitystreams#Like>; <https://www.w3.org/ns/activitystreams#object> <${checkin._fileLocation}>}`;

            let likeBody = SolidTemplates.getLikeBody(checkInUrl, likeLocation, this._user.getUri());

            let likeAclLocation = likeLocation + ".acl";
            let likeAclBody = SolidTemplates.getLikeAcl(
                this._user.getUri(),
                checkin._userWebId,
                likeLocation,
                likeAclLocation
            );

            checkin.setLikedTrue();

            fileClient.fetch(likeLocation).then(res => {
                console.log("exists");
            }).catch(res => {
                    postSolidFile(likeFolderLocation, fileName, likeBody);
                    putSolidFile(likeAclLocation, likeAclBody);
                }
            );

            await appendSolidResource(checkInUrl, body);
        }
    }

    async addFriendsToGroup(group, friends) {
        if (friends.length > 0) {
            let friendsGroup = friends.map(res => {
                return {member: res.getUri(), points: "0"};
            });

            group.addMembers(friendsGroup);

            let friendFile = await fileClient.readFile(group.getGroupDataFile());
            let graph = rdfLib.graph();
            await rdfLib.parse(friendFile, graph, group.getGroupDataFile(), "text/turtle");
            let groupNN = graph.any(undefined, SOLIDLINKEDBEER('hasLeader'));

            let checkInIndexFile = await fileClient.readFile(group.getGroupCheckInIndex());
            let graph2 = rdfLib.graph();
            await rdfLib.parse(checkInIndexFile, graph2, group.getGroupDataFile(), "text/turtle");
            let group2NN = graph2.any(undefined, VCARD('hasMember'));

            friends.forEach(res => {
                let friendNN = rdfLib.sym(res.getUri());
                //groupdata.ttl
                graph.add(groupNN, VCARD('hasMember'), friendNN);

                //checkinIndex.ttl
                graph2.add(group2NN, VCARD('hasMember'), friendNN);
                graph2.add(friendNN, SOLIDLINKEDBEER('points'), 0);
                graph2.add(friendNN, RDF('type'), FOAF('Person'));
                graph2.add(friendNN, RDF('type'), SOLIDLINKEDBEER('GroupMember'));
            });

            //stuur de uitnodigingen naar de vrienden
            friends.forEach(res => {
                let fileName = GROUPINVITATION_NAME + group.getName();
                let desc = GROUPINVITATION_DESC + group.getName() + "?";

                let location = res.getBeerDrinkerFolder() + INBOX_FOLDER;
                let postLocation = location + fileName + ".ttl";

                let inv = SolidTemplates.getGroupInvitaion(res.getUri(),
                    desc,
                    postLocation,
                    this._user.getUri(),
                    group.getUrl(),
                    group.getName()
                );

                postSolidFile(location, fileName, inv);
            });

            friendFile = await rdfLib.serialize(undefined, graph, group.getGroupDataFile(), 'text/turtle');
            await putSolidFile(group.getGroupDataFile(), friendFile);

            checkInIndexFile = await rdfLib.serialize(undefined, graph2, group.getGroupCheckInIndex(), 'text/turtle');
            await putSolidFile(group.getGroupCheckInIndex(), checkInIndexFile);
        }
    }
}

export default SolidCommunicator;