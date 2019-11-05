import * as rdfLib from "rdflib";
import {ACL, RDF, SCHEMA, SOLID, SOLIDLINKEDBEER, VCARD} from "./Prefixes";
import {GROUP_MEMBERS} from "./Constants";

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

export function getGroupAppDataTTL(urlFile,friends, groupName){
    let graph = rdfLib.graph();

    let friendsgroup = rdfLib.sym(urlFile + "#" + GROUP_MEMBERS);

    graph.add(friendsgroup, RDF('type'), VCARD('Group'));
    graph.add(friendsgroup, VCARD('hasUID'), rdfLib.sym("urn:uuid:8831CBAD-1111-2222-8563-F0F4787E5398:ABGroup"));

    friends.forEach(res => {
        graph.add(friendsgroup, VCARD('hasMember'), rdfLib.sym(res));
    });

    graph.add(friendsgroup, SCHEMA('name'), groupName);

    return rdfLib.serialize(undefined, graph, urlFile, 'text/turtle');
}

export function getGroupAclTTL(groupLocation, groupAppDataLocation, groupAcl, webIdOwner){
    let graph = rdfLib.graph();
    let owner = rdfLib.sym(groupAcl + "#Owner");
    let ownerAgent = rdfLib.sym(webIdOwner);

    let members = rdfLib.sym(groupAppDataLocation + "#" + GROUP_MEMBERS);
    let resource = rdfLib.sym(groupLocation);

    //owner
    graph.add(owner, RDF('type'), ACL('Authorization'));

    graph.add(owner, ACL('accessTo'), resource);
    graph.add(owner, ACL('default'), resource);
    graph.add(owner, ACL('agent'), ownerAgent);

    graph.add(owner, ACL('mode'), ACL('Control'));
    graph.add(owner, ACL('mode'), ACL('Read'));
    graph.add(owner, ACL('mode'), ACL('Write'));

    //public
    graph.add(members, RDF('type'), ACL('Authorization'));

    graph.add(members, ACL('accessTo'), resource);
    graph.add(members, ACL('default'), resource);

    graph.add(members, ACL('agentGroup'), members);

    graph.add(members, ACL('mode'), ACL('Read'));

    return rdfLib.serialize(undefined, graph, groupAcl, 'text/turtle');
}

export function getGroupCheckInsAclTTL(groupLocation, groupAppDataLocation, groupAcl, webIdOwner){
    let graph = rdfLib.graph();
    let owner = rdfLib.sym(groupAcl + "#Owner");
    let ownerAgent = rdfLib.sym(webIdOwner);

    let members = rdfLib.sym(groupAppDataLocation + "#" + GROUP_MEMBERS);
    let resource = rdfLib.sym(groupLocation);

    //owner
    graph.add(owner, RDF('type'), ACL('Authorization'));

    graph.add(owner, ACL('accessTo'), resource);
    graph.add(owner, ACL('default'), resource);
    graph.add(owner, ACL('agent'), ownerAgent);

    graph.add(owner, ACL('mode'), ACL('Control'));
    graph.add(owner, ACL('mode'), ACL('Read'));
    graph.add(owner, ACL('mode'), ACL('Write'));

    //public
    graph.add(members, RDF('type'), ACL('Authorization'));

    graph.add(members, ACL('accessTo'), resource);
    graph.add(members, ACL('default'), resource);

    graph.add(members, ACL('agentGroup'), members);
    graph.add(members, ACL('mode'), ACL('Read'));
    graph.add(members, ACL('mode'), ACL('Append'));

    return rdfLib.serialize(undefined, graph, groupAcl, 'text/turtle');
}