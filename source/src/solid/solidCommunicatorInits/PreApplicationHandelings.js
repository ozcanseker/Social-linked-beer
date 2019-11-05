import { postSolidFile, putSolidFile, getUserFile, loadFriendData } from "../SolidMethods";
import {FRIENDS_FILE, FRIENDSHIPREQUEST_ACCEPTED_NAME, INBOX_FOLDER} from "../rdf/Constants";
import {SOLIDLINKEDBEER, VCARD} from "../rdf/Prefixes";
import Friend from "../../model/HolderComponents/Friend";

const fileClient = require('solid-file-client');
const rdfLib = require('rdflib');

export async function preApplicationHandelings(beerDrinkerFolder, friendGroup, friendsRequestedGroup, FriendsStore, modelHolder){
    let inbox = beerDrinkerFolder + INBOX_FOLDER;
    let inboxContent = await fileClient.readFolder(inbox);

    //add friend from friend requested to friends
    let acceptedRequests = inboxContent.files.filter(file => {
        return file.name.includes(FRIENDSHIPREQUEST_ACCEPTED_NAME);
    })

    if(acceptedRequests.length !== 0){
        checkAcceptedFriendShipRequests(beerDrinkerFolder, acceptedRequests, friendGroup, friendsRequestedGroup, FriendsStore, modelHolder);
    }

    //delete user from friends requested if they declined
    let declinedRequests = inboxContent.files.filter(file => {
        return file.name.includes("Social_Linked_Beer_FriendschipRequestDecline");
    })

    if(declinedRequests.length !== 0){
        await checkDeclinedFriendShipRequests(beerDrinkerFolder, declinedRequests, friendsRequestedGroup, FriendsStore);
    }
}

/**
 * Check if there are accepted friendschip requests
 * @param {*} beerdrinkerFolder
 * @param {*} acceptedRequests
 * @param {*} scValues
 * @param {*} user
 */
async function checkAcceptedFriendShipRequests(beerdrinkerFolder, acceptedRequests, friendsGroup, friendsSent, friendGraph, modelHolder){
    //get some values
    let postLocation = beerdrinkerFolder + FRIENDS_FILE;

    for(let i = 0; i < acceptedRequests.length; i++){
        //make a graph and get file
        let graph = rdfLib.graph();
        let filettl = await fileClient.readFile(acceptedRequests[i].url);
        rdfLib.parse(filettl, graph, acceptedRequests[i].url, "text/turtle");

        //get the blanknode from the message
        let friend = graph.any(undefined, SOLIDLINKEDBEER('from'));
        friend = graph.any(friend, SOLIDLINKEDBEER('from'));

        //add from friend requested to friend
        friendGraph.add(friendsGroup, VCARD('hasMember'), friend);
        friendGraph.removeMatches(friendsSent, VCARD('hasMember'), friend);

        //get the friend from the internet
        friend = new Friend(friend.value);
        loadFriendData(friend);

        //adding friend
        modelHolder.addFriend(friend);
    }

    //update the original friend file
    let friendsTtl = await rdfLib.serialize(undefined, friendGraph, postLocation, 'text/turtle');
    //TODO post new file for user so that he know friendship is accepted
    await putSolidFile(postLocation, friendsTtl);

    acceptedRequests.forEach(res => {
        //delete the original message
        fileClient.deleteFile(res.url);
    })
}

async function checkDeclinedFriendShipRequests(beerDrinkerFolder, declinedRequests, friendsSent, friendGraph){
    let postLocation = beerDrinkerFolder + FRIENDS_FILE;

    for(let i = 0; i < declinedRequests.length; i++){
        let graph = rdfLib.graph();
        let filettl = await fileClient.readFile(declinedRequests[i].url);

        rdfLib.parse(filettl, graph, declinedRequests[i].url, "text/turtle");

        //get blank node from friend sent
        let friend = graph.any(undefined, SOLIDLINKEDBEER('from'));
        friend = graph.any(friend, SOLIDLINKEDBEER('from'));

        //remove friend from the friendssent file
        friendGraph.removeMatches(friendsSent, VCARD('hasMember'), friend);
    }

    //post new friend solid file
    let friendsTtl = await rdfLib.serialize(undefined, friendGraph, postLocation, 'text/turtle');
    putSolidFile(postLocation, friendsTtl);

    declinedRequests.forEach(res => {
        //delete the original message
        fileClient.deleteFile(res.url);
    })
//     //TODO post new file for user so that he know friendship is declined
}