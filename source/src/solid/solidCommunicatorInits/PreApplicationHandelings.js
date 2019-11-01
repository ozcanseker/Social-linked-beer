// import { postSolidFile, putSolidFile, getUserFile, fetchFriend } from "../SolidMethods";
//
// const fileClient = require('solid-file-client');
// const rdfLib = require('rdflib');
//
// const VCARD = rdfLib.Namespace("http://www.w3.org/2006/vcard/ns#");
// const SOLIDLINKEDBEER = rdfLib.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');
//
export async function preApplicationHandelings(applicationFolder, friendGroup, friendsRequestedGroup, FriendsStore, user){
//     let inbox = applicationFolder + "inbox/";
//     let inboxContent = await fileClient.readFolder(inbox);
//
//     //add friend from friend requested to friends
//     let acceptedRequests = inboxContent.files.filter(file => {
//         return file.name.includes("Social_Linked_Beer_FriendschipRequestAccepted");
//     })
//
//     //delete user from friends requested if they declined
//     let declinedRequests = inboxContent.files.filter(file => {
//         return file.name.includes("Social_Linked_Beer_FriendschipRequestDecline");
//     })
//
//     if(acceptedRequests.length !== 0){
//         await checkAcceptedFriendShipRequests(applicationFolder, acceptedRequests, friendGroup, friendsRequestedGroup, FriendsStore, user);
//     }
//
//     if(declinedRequests.length !== 0){
//         await checkDeclinedFriendShipRequests(applicationFolder, declinedRequests, friendsRequestedGroup, FriendsStore);
//     }
}
//
// /**
//  * Check if there are accepted friendschip requests
//  * @param {*} applicationFolder
//  * @param {*} acceptedRequests
//  * @param {*} scValues
//  * @param {*} user
//  */
// async function checkAcceptedFriendShipRequests(applicationFolder,acceptedRequests, friendsGroup, friendsSent, friendGraph, user){
//     //get some values
//     let postLocation = applicationFolder + 'friends.ttl';
//
//     for(let i = 0; i < acceptedRequests.length; i++){
//         //make a graph and get file
//         let graph = rdfLib.graph();
//         let filettl = await fileClient.readFile(acceptedRequests[i].url);
//         rdfLib.parse(filettl, graph, acceptedRequests[i].url, "text/turtle");
//
//         //get the blanknode from the message
//         let friend = graph.any(undefined, SOLIDLINKEDBEER('from'));
//         friend = graph.any(friend, SOLIDLINKEDBEER('from'));
//
//         //add from friend requested to friend
//         friendGraph.add(friendsGroup, VCARD('hasMember'), friend);
//         friendGraph.removeMatches(friendsSent, VCARD('hasMember'), friend);
//
//         //get the friend from the internet
//         let friendFile = await fetchFriend(friend.value);
//
//         //adding friend
//         user.addFriend(friendFile);
//
//         //delete the original message
//         await fileClient.deleteFile(acceptedRequests[i].url);
//     }
//
//     //update the original friend file
//     let friendsTtl = await rdfLib.serialize(undefined, friendGraph, postLocation, 'text/turtle');
//     //TODO post new file for user so that he know friendship is accepted
//     //TODO delete afterwards
//     putSolidFile(postLocation, friendsTtl);
// }
//
// async function checkDeclinedFriendShipRequests(applicationFolder,declinedRequests, friendsSent, friendGraph){
//     let postLocation = applicationFolder + 'friends.ttl';
//
//     for(let i = 0; i < declinedRequests.length; i++){
//         let graph = rdfLib.graph();
//         let filettl = await fileClient.readFile(declinedRequests[i].url);
//
//         rdfLib.parse(filettl, graph, declinedRequests[i].url, "text/turtle");
//
//         //get blank node from friend sent
//         let friend = graph.any(undefined, SOLIDLINKEDBEER('from'));
//         friend = graph.any(friend, SOLIDLINKEDBEER('from'));
//
//         //remove friend from the friendssent file
//         friendGraph.removeMatches(friendsSent, VCARD('hasMember'), friend);
//
//         //delete the message
//         await fileClient.deleteFile(declinedRequests[i].url);
//     }
//
//     //post new friend solid file
//     let friendsTtl = await rdfLib.serialize(undefined, friendGraph, postLocation, 'text/turtle');
//     putSolidFile(postLocation, friendsTtl);
//
//     //TODO post new file for user so that he know friendship is declined
//     //TODO delete afterwards
// }