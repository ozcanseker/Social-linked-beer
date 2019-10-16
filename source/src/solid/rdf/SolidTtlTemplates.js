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

/**
 * 
 * @param {string} postLocation 
 * @param {string} userName 
 * @param {string} webId 
 * @param {url to webresresource} beerLocation 
 * @param {string} beerName 
 * @param {Date} time 
 */
export function beerCheckInTemplate(postLocation, userName, webId, beerLocation, beerName, time){
    let graph = rdfLib.graph();
    let namedNode = rdfLib.sym(postLocation);

    graph.add(namedNode, RDF('type'), SOLIDLINKEDBEER('CheckIn'));
    graph.add(namedNode, SOLIDLINKEDBEER('webId'), rdfLib.sym(webId));
    if(userName){
        graph.add(namedNode, SOLIDLINKEDBEER('username'), userName);
    }
    graph.add(namedNode, SOLIDLINKEDBEER('beerLocation'), rdfLib.sym(beerLocation));
    graph.add(namedNode, SOLIDLINKEDBEER('beerName'), beerName);
    graph.add(namedNode, SOLIDLINKEDBEER('checkInTime'), time);    

    // //make a text file and send
    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}

export function beerReviewInTemplate(postLocation, userName, webId, beerLocation, beerName, time, rating, review){
    let graph = rdfLib.graph();
    let namedNode = rdfLib.sym(postLocation);

    graph.add(namedNode, RDF('type'), SOLIDLINKEDBEER('CheckReview'));
    graph.add(namedNode, SOLIDLINKEDBEER('webId'), rdfLib.sym(webId));
    if(userName){
        graph.add(namedNode, SOLIDLINKEDBEER('username'), userName);
    }
    graph.add(namedNode, SOLIDLINKEDBEER('beerLocation'), rdfLib.sym(beerLocation));
    graph.add(namedNode, SOLIDLINKEDBEER('beerName'), beerName);
    graph.add(namedNode, SOLIDLINKEDBEER('checkInTime'), time);    
    graph.add(namedNode, SOLIDLINKEDBEER('rating'), rating);    
    graph.add(namedNode, SOLIDLINKEDBEER('review'), review);    


    // //make a text file and send
    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');

}