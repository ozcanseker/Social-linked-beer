import * as rdfLib from "rdflib";
import {RDF, SOLIDLINKEDBEER} from "./Prefixes";

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