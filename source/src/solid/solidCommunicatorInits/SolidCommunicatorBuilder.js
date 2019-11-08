import {buildFolders, checkFolderIntegrity} from './PodFolderBuilder';
import {getAllUserCheckIns, getTenUserCheckIns, loadFriendData} from "../SolidMethods";
import {checkacess} from './AccessChecker';
import {PIM, SCHEMA, SOLID, SOLIDLINKEDBEER, VCARD} from "../rdf/Prefixes";

import * as fileClient from "solid-file-client";
import * as rdfLib from "rdflib";
import {
    APPDATA_FILE,
    APPLICATION_NAME_PTI,
    BEERDRINKERFOLDER, CHECKIN_FOLDER, CHECKIN_INDEX_FILE, CONTENT_TYPE_TURTLE,
    FRIENDS_FILE,
    FRIENDSGROUPNAME,
    FRIENDSSENTGROUPNAME, GROUP_DATA_FILE, GROUPFOLDER
} from "../rdf/Constants";
import Friend from "../../model/HolderComponents/Friend";
import Group from "../../model/HolderComponents/Group";

export async function buildSolidCommunicator(modelHolder, solidCommunicator) {
    let returnObject = {};
    let user = modelHolder.getUser();
    let checkInHandler = modelHolder.getCheckInHandler();

    //make a named node of the session webid of the user
    //namednode
    const webIdNN = rdfLib.sym(user.getUri());

    //get a store of the profile card of the logged in user
    //store
    let storeProfileCard = await getUserCard(webIdNN.uri);

    //check the acess before trying to make an application
    checkacess(storeProfileCard);

    //store for the Public Profile Index
    //object with store and nn
    let ppiObject = await getPPILocation(webIdNN, storeProfileCard);

    //String that shows the location of the public storage of the pod
    //string 
    let storagePublic = getStorePublic(webIdNN, storeProfileCard);

    //locatie voor de applicatie
    //string
    let applicationLocation = await getApplicationLocation(ppiObject.ppi, ppiObject.store, storagePublic, webIdNN.value);

    //returnobject
    returnObject.sc = {};

    let userDetails = getUserDetails(webIdNN, storeProfileCard);
    user.loadInUserValues(userDetails.name,
        userDetails.imageURL,
        applicationLocation,
        applicationLocation + BEERDRINKERFOLDER,
        applicationLocation + BEERDRINKERFOLDER + CHECKIN_FOLDER);
    solidCommunicator.setFileLocations();

    getAppData(user.getBeerDrinkerFolder()).then(res => {
        user.loadInAppData(new Date(res.startdate));
        modelHolder.getCheckInHandler().setBeerPoints(parseInt(res.points));
        solidCommunicator.loadInAppStore(res.store, res.blankNode);
    });

    getTenUserCheckIns(user.getBeerDrinkerFolder()).then(res => {
        checkInHandler.addUserCheckIns(res.userBeerCheckIns);
        checkInHandler.setBeerReviewsAmount(res.reviews);
        checkInHandler.setCheckInsAmount(res.checkIns);
    });

    getFriends(user.getBeerDrinkerFolder()).then(res => {
        modelHolder.addFriends(res.friends);
        solidCommunicator.loadInFriendsStore(res.group, res.sentGroup, res.friendsStore);
    });

    getGroups(user.getBeerDrinkerFolder()).then(res => {
        modelHolder.setGroups(res);
    })
}

async function getGroups(beerDrinkerFolder) {
    let groupsLocation = beerDrinkerFolder + GROUPFOLDER;
    let res = await fileClient.readFolder(groupsLocation);
    let groups = [];

    let myGroups = res.folders;
    let friendsGroups = res.files;

    myGroups.forEach(res => {
        let group = new Group(res.url, true);

        loadGroupInformation(group);
        groups.push(group);
    });

    friendsGroups.forEach(res => {
        let group = new Group(res.url, false);

        loadFriendGroupData(group);
        groups.push(group);
    });

    return groups;
}

async function loadFriendGroupData(group) {
    let file = await fileClient.fetch(group.getUrl());

    let graph = rdfLib.graph();
    rdfLib.parse(file, graph, group.getUrl(), CONTENT_TYPE_TURTLE);

    let blankNode = graph.any(undefined, SOLIDLINKEDBEER('location'));
    let urlGroup = graph.any(blankNode, SOLIDLINKEDBEER('location'));

    group.setUrl(urlGroup.value);

    await loadGroupInformation(group);
}

async function loadGroupInformation(group) {
    let groupCheckInsLocation = group.getUrl() + CHECKIN_FOLDER;
    let groupDataLocation = group.getUrl() + GROUP_DATA_FILE;
    let checkIndexLocation = group.getUrl() + CHECKIN_INDEX_FILE;

    //krijg de checkins van de grop
    getTenUserCheckIns(group.getUrl()).then(res => {
        group.getCheckInHandler().setReviesCheckInsAndUserCheckIns(res.reviews, res.checkIns, res.userBeerCheckIns);
    })

    let res = await fileClient.fetch(groupDataLocation);
    let groupDataGraph = rdfLib.graph();
    rdfLib.parse(res, groupDataGraph, groupDataLocation, CONTENT_TYPE_TURTLE);

    //krijg de members
    let hasMemberGroup = groupDataGraph.any(undefined, VCARD('hasLeader'));
    let leader = groupDataGraph.any(hasMemberGroup, VCARD('hasLeader'));

    let name = groupDataGraph.any(hasMemberGroup, SCHEMA('name'));

    //checkInIndex
    let checkInIndex = await fileClient.fetch(checkIndexLocation);
    let checkInIndexGraph = rdfLib.graph();
    rdfLib.parse(checkInIndex, checkInIndexGraph, checkIndexLocation, CONTENT_TYPE_TURTLE);

    let pointsMemberGroup = checkInIndexGraph.any(undefined, VCARD('hasMember'));

    let members = [];
    checkInIndexGraph.each(pointsMemberGroup, VCARD('hasMember')).map(res => {
        let points = checkInIndexGraph.any(res, SOLIDLINKEDBEER('points'));

        if(res.value === leader.value){
            leader = {member: res.value, points: points.value};
        }else{
            members.push({member: res.value, points: points.value});
        }
    });

    group.setProperties(name.value, groupCheckInsLocation, groupDataLocation,checkIndexLocation, leader, members);
}

/**
 * Get the user profile card in the form of a rdflib graph.
 *
 * @param webIdUrl the uri for the profile card
 * @returns {Promise<void>} graph of user VCARD
 */
async function getUserCard(webIdUrl) {
    const profileCardTTl = await fileClient.fetch(webIdUrl);
    const storeProfileCard = rdfLib.graph();
    rdfLib.parse(profileCardTTl, storeProfileCard, webIdUrl, "text/turtle");

    return storeProfileCard;
}

async function getPPILocation(profile, storeProfileCard) {
    const publicProfileIndex = storeProfileCard.any(profile, SOLID("publicTypeIndex"));

    const storePublicTypeIndex = rdfLib.graph();
    const publicTypeIndexTTL = await fileClient.fetch(publicProfileIndex.value);
    rdfLib.parse(publicTypeIndexTTL, storePublicTypeIndex, publicProfileIndex.value, "text/turtle");

    return {store: storePublicTypeIndex, ppi: publicProfileIndex};
}

function getStorePublic(profile, storeProfileCard) {
    let locationStorage = storeProfileCard.any(profile, PIM("storage"));
    return locationStorage.value + "public/";
}

async function getApplicationLocation(publicProfileIndex, storePublicProfileIndex, storagePublic, webId) {
    let app = rdfLib.sym(publicProfileIndex.value + "#" + APPLICATION_NAME_PTI);
    let appQuery = storePublicProfileIndex.any(app, SOLID("instance"));

    if (appQuery) {
        await checkFolderIntegrity(appQuery.value, webId);
        return appQuery.value;
    } else {
        return await buildFolders(publicProfileIndex, storePublicProfileIndex, storagePublic, app, webId);
    }
}

function getUserDetails(profile, storeProfileCard) {
    let nameFN = storeProfileCard.any(profile, VCARD('fn'));
    let imageURL = storeProfileCard.any(profile, VCARD('hasPhoto'));

    nameFN = nameFN ? nameFN.value : undefined;
    imageURL = imageURL ? imageURL.value : undefined;

    return {name: nameFN, imageURL: imageURL};
}

async function getAppData(beerDrinkerFolder) {
    //TODO one place to save all urls
    let appdataLocation = beerDrinkerFolder + APPDATA_FILE;

    let appdatattl = await fileClient.readFile(appdataLocation);
    let graph = rdfLib.graph();
    rdfLib.parse(appdatattl, graph, appdataLocation, "text/turtle");

    let blankNode = graph.any(undefined, SOLIDLINKEDBEER('startdate'));

    let startdate = graph.any(blankNode, SOLIDLINKEDBEER('startdate'));
    let points = graph.any(blankNode, SOLIDLINKEDBEER('points'));

    return {startdate: startdate.value, points: points.value, store: graph, blankNode: blankNode};
}

async function getFriends(beerDrinkerFolder) {
    let friendsLocation = beerDrinkerFolder + FRIENDS_FILE;
    let ttlFriends = await fileClient.readFile(friendsLocation);

    let group = rdfLib.sym(friendsLocation + "#" + FRIENDSGROUPNAME);
    let sentGroup = rdfLib.sym(friendsLocation + "#" + FRIENDSSENTGROUPNAME);
    let friends = [];

    let graph = rdfLib.graph();
    rdfLib.parse(ttlFriends, graph, friendsLocation, CONTENT_TYPE_TURTLE);

    let query = graph.each(group, VCARD('hasMember'), undefined);

    for (let index = 0; index < query.length; index++) {
        let friend = new Friend(query[index].value);
        loadFriendData(friend);

        if (friend) {
            friends.push(friend);
        }
    }

    return {friends: friends, friendsStore: graph, group: group, sentGroup: sentGroup};
}

