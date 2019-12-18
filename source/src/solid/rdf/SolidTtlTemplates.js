import * as rdfLib from "rdflib";
import {ACL, ACTIVITYSTREAM, RDF, SCHEMA, SOLIDLINKEDBEER, VCARD} from "./Prefixes";
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

export function getGroupInvitaion(urlInvitee, invitation, postLocation, userWebId, groupUrl, groupName){
    //make friendrequest
    let graph = rdfLib.graph();
    let blankNode = rdfLib.blankNode();

    graph.add(blankNode, RDF('type'), SOLIDLINKEDBEER('GroupInvitation'));
    graph.add(blankNode, SOLIDLINKEDBEER('from'), rdfLib.sym(userWebId));
    graph.add(blankNode, SOLIDLINKEDBEER('to'), rdfLib.sym(urlInvitee));
    graph.add(blankNode, SOLIDLINKEDBEER('description'), invitation);
    graph.add(blankNode, SOLIDLINKEDBEER('location'), rdfLib.sym(groupUrl));
    graph.add(blankNode, SOLIDLINKEDBEER('groupName'), groupName);

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
    return rdfLib.serialize(undefined, graph, "", 'text/turtle');
}

export function getGroupAppDataTTL(urlFile,friends, leader,groupName){
    let graph = rdfLib.graph();

    let friendsgroup = rdfLib.sym(urlFile + "#" + GROUP_MEMBERS);

    graph.add(friendsgroup, RDF('type'), VCARD('Group'));
    graph.add(friendsgroup, VCARD('hasUID'), rdfLib.sym("urn:uuid:8831CBAD-1111-2222-8563-F0F4787E5398:ABGroup"));
    graph.add(friendsgroup, VCARD('hasLeader'), rdfLib.sym(leader));

    friends.forEach(res => {
        graph.add(friendsgroup, VCARD('hasMember'), rdfLib.sym(res.getUri()));
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

export function getGroupOtherPersonTTL(groupLocation, postlocation){
    let graph = rdfLib.graph();
    let blankNode = rdfLib.blankNode();

    graph.add(blankNode, RDF('type'), VCARD('Group'));
    graph.add(blankNode, SOLIDLINKEDBEER('location'), rdfLib.sym(groupLocation));

    return rdfLib.serialize(undefined, graph, postlocation, 'text/turtle');
}

export function getCheckInIndexBody(postlocation, members, user){
    let graph = rdfLib.graph();
    let blankNode = rdfLib.sym(postlocation + "#" + GROUP_MEMBERS);

    graph.add(blankNode, RDF('type'), VCARD('Group'));
    members.forEach(res => {
        let member = rdfLib.sym(res.getUri());
        graph.add(blankNode, VCARD('hasMember'), member);
        graph.add(member, SOLIDLINKEDBEER('points'), 0);
    });

    let member = rdfLib.sym(user.getUri());
    graph.add(blankNode, VCARD('hasMember'), member);
    graph.add(member, SOLIDLINKEDBEER('points'), 0);

    return rdfLib.serialize(undefined, graph, postlocation, 'text/turtle');
}

export function groupCheckInIndexAcl(groupLocation, groupAppDataLocation, groupAcl, webIdOwner){
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
    graph.add(members, ACL('mode'), ACL('Write'));
    graph.add(members, ACL('mode'), ACL('Append'));

    return rdfLib.serialize(undefined, graph, groupAcl, 'text/turtle');
}

export function getLikeBody(checkInLocation, likeLocation, userWebId){
    let graph = rdfLib.graph();
    let likeLocationNN = rdfLib.sym(likeLocation);

    graph.add(likeLocationNN, RDF('type'), ACTIVITYSTREAM('Like'));
    graph.add(likeLocationNN, RDF('actor'), rdfLib.sym(userWebId));
    graph.add(likeLocationNN, RDF('object'), rdfLib.sym(checkInLocation));

    return rdfLib.serialize(undefined, graph, likeLocation, 'text/turtle');
}

export function getLikeAcl(likerWebid, likedUserWebid, likeFile, likefileAclLocation){
    let graph = rdfLib.graph();
    let owner = rdfLib.sym(likefileAclLocation + "#Owner");
    let ownerPost = rdfLib.sym(likefileAclLocation + "#OwnerPost");
    let resource = rdfLib.sym(likeFile);

    graph.add(owner, RDF('type'), ACL('Authorization'));

    graph.add(owner, ACL('accessTo'), resource);
    graph.add(owner, ACL('default'), resource);
    graph.add(owner, ACL('agent'), rdfLib.sym(likerWebid));

    graph.add(owner, ACL('mode'), ACL('Control'));
    graph.add(owner, ACL('mode'), ACL('Read'));
    graph.add(owner, ACL('mode'), ACL('Write'));

    if(likerWebid !== likedUserWebid){
        //public
        graph.add(ownerPost, RDF('type'), ACL('Authorization'));

        graph.add(ownerPost, ACL('accessTo'), resource);
        graph.add(ownerPost, ACL('default'), resource);
        graph.add(ownerPost, ACL('agent'), rdfLib.sym(likedUserWebid));

        graph.add(ownerPost, ACL('mode'), ACL('Read'));
    }

    return rdfLib.serialize(undefined, graph, likefileAclLocation, 'text/turtle');
}