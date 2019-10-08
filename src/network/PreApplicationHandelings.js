import { postSolidFile, putSolidFile, getUserFile } from "./SolidMethods";

const fileClient = require('solid-file-client');
const authClient = require('solid-auth-client');
const rdfLib = require('rdflib');

const SOLID = rdfLib.Namespace( "http://www.w3.org/ns/solid/terms#");
const PIM = rdfLib.Namespace("http://www.w3.org/ns/pim/space#");
const VCARD = rdfLib.Namespace("http://www.w3.org/2006/vcard/ns#");
const TERMS = rdfLib.Namespace('http://purl.org/dc/terms/');
const RDF = rdfLib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SOLIDLINKEDBEER = rdfLib.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');
const FOAF = rdfLib.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = rdfLib.Namespace('http://www.w3.org/ns/ldp#');

export async function preApplicationHandelings(applicationFolder, scValues, user){
    let inbox = applicationFolder + "inbox/";
    let inboxContent = await fileClient.readFolder(inbox);

    let acceptedRequests = inboxContent.files.filter(file => {
        return file.name.includes("Social_Linked_Beer_FriendschipRequestAccepted");
    })
    
    let declinedRequests = inboxContent.files.filter(file => {
        return file.name.includes("Social_Linked_Beer_FriendschipRequestDecline");
    })
    
    await checkAcceptedFriendShipRequests(applicationFolder, acceptedRequests, scValues, user);
    await checkDeclinedFriendShipRequests(applicationFolder, declinedRequests, scValues);
}

async function checkAcceptedFriendShipRequests(applicationFolder,acceptedRequests, scValues, user){
    let postLocation = applicationFolder + 'friends.ttl';
    let friendGraph = scValues.friendsStore;
    let friendsGroup = scValues.group;
    let friendsSent = scValues.sentGroup;
    
    for(let i = 0; i < acceptedRequests.length; i++){
        let graph = rdfLib.graph();
        let filettl = await fileClient.readFile(acceptedRequests[i].url);
        
        rdfLib.parse(filettl, graph, acceptedRequests[i].url, "text/turtle");

        let friend = graph.any(undefined, SOLIDLINKEDBEER('from'));
        friend = graph.any(friend, SOLIDLINKEDBEER('from'));

        friendGraph.add(friendsGroup, VCARD('hasMember'), friend);
        friendGraph.removeMatches(friendsSent, VCARD('hasMember'), friend);
    }

    let friendsTtl = await rdfLib.serialize(undefined, friendGraph, postLocation, 'text/turtle');

    //TODO post new file for user so that he know friendship is accepted
    //TODO maak het zo dat de gebruiker er meteen inkomt inplaats van eerst te verversen
    putSolidFile(postLocation, friendsTtl);
    for(let i = 0; i < acceptedRequests.length; i++){
        let friendFile =  getUserFile( acceptedRequests[i].url);
        console.log();
        
        await fileClient.deleteFile(acceptedRequests[i].url);
    }
}

async function checkDeclinedFriendShipRequests(applicationFolder,declinedRequests, scValues){
    let postLocation = applicationFolder + 'friends.ttl';
    let friendGraph = scValues.friendsStore;
    let friendsSent = scValues.sentGroup;
    
    for(let i = 0; i < declinedRequests.length; i++){
        let graph = rdfLib.graph();
        let filettl = await fileClient.readFile(declinedRequests[i].url);
        
        rdfLib.parse(filettl, graph, declinedRequests[i].url, "text/turtle");

        let friend = graph.any(undefined, SOLIDLINKEDBEER('from'));
        friend = graph.any(friend, SOLIDLINKEDBEER('from'));

        friendGraph.removeMatches(friendsSent, VCARD('hasMember'), friend);
    }

    let friendsTtl = await rdfLib.serialize(undefined, friendGraph, postLocation, 'text/turtle');

    //TODO post new file for user so that he know friendship is declined
    putSolidFile(postLocation, friendsTtl);
    for(let i = 0; i < declinedRequests.length; i++){        
        await fileClient.deleteFile(declinedRequests[i].url);
    }
}