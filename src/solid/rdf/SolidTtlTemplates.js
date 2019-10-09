const rdfLib = require('rdflib');

const SOLID = rdfLib.Namespace( "http://www.w3.org/ns/solid/terms#");
const PIM = rdfLib.Namespace("http://www.w3.org/ns/pim/space#");
const VCARD = rdfLib.Namespace("http://www.w3.org/2006/vcard/ns#");
const TERMS = rdfLib.Namespace('http://purl.org/dc/terms/');
const RDF = rdfLib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SOLIDLINKEDBEER = rdfLib.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');
const FOAF = rdfLib.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = rdfLib.Namespace('http://www.w3.org/ns/ldp#');

export function getInviteToLSBInvitation(urlInvitee, invitation, postLocation, userWebId){
    let graph = rdfLib.graph();
    let blankNode = rdfLib.blankNode();

    graph.add(blankNode, RDF('type'), SOLIDLINKEDBEER('Invitation'));
    graph.add(blankNode, SOLIDLINKEDBEER('invitationTo'), rdfLib.sym('https://ozcanseker.github.io/Social-linked-beer/'));
    graph.add(blankNode, SOLIDLINKEDBEER('from'), rdfLib.sym(userWebId));
    graph.add(blankNode, SOLIDLINKEDBEER('to'), rdfLib.sym(urlInvitee));
    graph.add(blankNode, SOLIDLINKEDBEER('description'), invitation);

    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}

export function getFriendShipRequest(urlInvitee, invitation, postLocation, userWebId){
    //make friendrequest
    let graph = rdfLib.graph();
    let blankNode = rdfLib.blankNode();

    graph.add(blankNode, RDF('type'), SOLIDLINKEDBEER('FriendshipRequest'));
    graph.add(blankNode, SOLIDLINKEDBEER('from'), rdfLib.sym(userWebId));
    graph.add(blankNode, SOLIDLINKEDBEER('to'), rdfLib.sym(urlInvitee));
    graph.add(blankNode, SOLIDLINKEDBEER('description'), invitation);

    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}

export function getDeclineFriendshipRequest(from , invitation, postLocation, userWebId){
    let graph = rdfLib.graph();
    let blankNode = rdfLib.blankNode();

    graph.add(blankNode, RDF('type'), SOLIDLINKEDBEER('FriendschipRequestDecline'));
    graph.add(blankNode, SOLIDLINKEDBEER('from'), rdfLib.sym(userWebId));
    graph.add(blankNode, SOLIDLINKEDBEER('to'), rdfLib.sym(from));
    graph.add(blankNode, SOLIDLINKEDBEER('description'), invitation);

    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}

export function getAcceptFriendshipRequest(from, description , postLocation, userWebId){
    let graph = rdfLib.graph();
    let blankNode = rdfLib.blankNode();

    graph.add(blankNode, RDF('type'), SOLIDLINKEDBEER('FriendschipRequestAccepted'));
    graph.add(blankNode, SOLIDLINKEDBEER('from'), rdfLib.sym(userWebId));
    graph.add(blankNode, SOLIDLINKEDBEER('to'), rdfLib.sym(from));
    graph.add(blankNode, SOLIDLINKEDBEER('description'), description);

    //make a text file and send
    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}