import * as rdfLib from "rdflib";
import {ACL, ACTIVITYSTREAM, BEER, FOAF, PURLRELATIONSHIP, RDF, SCHEMA, SOLIDLINKEDBEER, VCARD} from "./Prefixes";
import {APPLICATION_NAME, APPURL, GROUP_MEMBERS} from "./Constants";

export function getInviteToLSBInvitation(urlInvitee, invitation, postLocation, userWebId){
    let graph = rdfLib.graph();

    //document
    let documentNN = rdfLib.sym(postLocation);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    //application
    let applicationNN = rdfLib.sym(APPURL);
    graph.add(applicationNN, RDF('type'), ACTIVITYSTREAM("Application"));
    graph.add(applicationNN, RDF('type'), ACTIVITYSTREAM("Page"));
    graph.add(applicationNN, ACTIVITYSTREAM('name'), APPLICATION_NAME);
    graph.add(applicationNN, ACTIVITYSTREAM('url'), APPURL);

    //invite
    let inviteBN = rdfLib.blankNode();
    graph.add(inviteBN, RDF('type'), ACTIVITYSTREAM('Invite'));
    graph.add(inviteBN, ACTIVITYSTREAM('summary'), invitation);

    let inviterNN = rdfLib.sym(userWebId);
    let inviteeNN = rdfLib.sym(urlInvitee);

    //connections
    graph.add(inviteBN, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), inviteBN);

    graph.add(inviteBN, ACTIVITYSTREAM('object'), applicationNN);

    graph.add(inviteBN, ACTIVITYSTREAM('actor'), inviterNN);
    graph.add(inviteBN, ACTIVITYSTREAM('target'), inviteeNN);

    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}

export function getFriendShipRequest(urlInvitee, invitation, postLocation, userWebId){
    //make friendrequest
    let graph = rdfLib.graph();

    //document
    let documentNN = rdfLib.sym(postLocation);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    //Relationship
    let relationshipBN = rdfLib.blankNode();
    graph.add(relationshipBN, RDF('type'),  ACTIVITYSTREAM('Relationship'));
    graph.add(relationshipBN, ACTIVITYSTREAM('relationship'), PURLRELATIONSHIP('friendOf'));

    //offer
    let offerBN = rdfLib.blankNode();
    graph.add(offerBN, RDF('type'), ACTIVITYSTREAM('Offer'));
    graph.add(offerBN, ACTIVITYSTREAM('summary'), invitation);

    let inviteeNN = rdfLib.sym(urlInvitee);
    let inviterNN = rdfLib.sym(userWebId);

    graph.add(offerBN, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), offerBN);

    graph.add(offerBN, ACTIVITYSTREAM('object'), relationshipBN);
    graph.add(offerBN, ACTIVITYSTREAM('actor'), inviterNN);
    graph.add(offerBN, ACTIVITYSTREAM('target'), inviteeNN);

    graph.add(relationshipBN, ACTIVITYSTREAM('subject'), inviterNN);
    graph.add(relationshipBN, ACTIVITYSTREAM('object'), inviteeNN);

    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}

export function getDeclineFriendshipRequest(from , description, postLocation, userWebId, friendshipRequestUri){
    let graph = rdfLib.graph();

    //doc
    let documentNN = rdfLib.sym(postLocation);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    //accept
    let rejectBN = rdfLib.blankNode();
    graph.add(rejectBN, RDF('type'), ACTIVITYSTREAM('Reject'));
    graph.add(rejectBN, ACTIVITYSTREAM('summary'), description);

    //balls
    graph.add(rejectBN, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), rejectBN);

    graph.add(rejectBN, ACTIVITYSTREAM('object'), rdfLib.sym(friendshipRequestUri));
    graph.add(rejectBN, ACTIVITYSTREAM('actor'), rdfLib.sym(userWebId));

    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}

export function getAcceptFriendshipRequest(from, description , postLocation, userWebId, friendshipRequestUri){
    let graph = rdfLib.graph();

    //doc
    let documentNN = rdfLib.sym(postLocation);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    //accept
    let acceptBN = rdfLib.blankNode();
    graph.add(acceptBN, RDF('type'), ACTIVITYSTREAM('Accept'));
    graph.add(acceptBN, ACTIVITYSTREAM('summary'), description)

    //balls
    graph.add(acceptBN, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), acceptBN);

    graph.add(acceptBN, ACTIVITYSTREAM('object'), rdfLib.sym(friendshipRequestUri));
    graph.add(acceptBN, ACTIVITYSTREAM('actor'), rdfLib.sym(userWebId));

    //make a text file and send
    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}

export function getGroupInvitaion(urlInvitee, invitation, postLocation, userWebId, groupUrl, groupName){
    //make friendrequest
    let graph = rdfLib.graph();

    //document
    let documentNN = rdfLib.sym(postLocation);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    //groupnn
    let groupNN = rdfLib.sym(groupUrl);
    graph.add(groupNN, RDF('type'), SOLIDLINKEDBEER('Group'));
    graph.add(groupNN, SOLIDLINKEDBEER('name'), groupName);

    //invite bn
    let inviteBN = rdfLib.blankNode();
    graph.add(inviteBN, RDF('type'), ACTIVITYSTREAM('Invite'));
    graph.add(inviteBN, ACTIVITYSTREAM('summary'), invitation);

    let inviteeNN = rdfLib.sym(urlInvitee);
    let inviterNN = rdfLib.sym(userWebId);

    graph.add(inviteBN, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), inviteBN);

    graph.add(inviteBN, ACTIVITYSTREAM('object'), groupNN);
    graph.add(inviteBN, ACTIVITYSTREAM('actor'), inviterNN);
    graph.add(inviteBN, ACTIVITYSTREAM('target'), inviteeNN);

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
export function beerCheckInTemplate(postLocation, user, beerLocation, beerName, time){
    let graph = rdfLib.graph();

    //doc
    let documentNN = rdfLib.sym(postLocation);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    //beer
    let beerNode = rdfLib.sym(beerLocation);
    graph.add(beerNode, RDF('type'), BEER('Beer'));
    graph.add(beerNode, BEER('beerName'), beerName);

    //user
    let userNN = rdfLib.sym(user.getUri());
    graph.add(userNN, RDF('type'), FOAF('Person'));

    if(user.getIsNick()){
        graph.add(userNN, FOAF('nick'), user.getName());
    }else{
        graph.add(userNN, FOAF('name'), user.getName());
    }

    //consume action
    let consumeActionBN = rdfLib.blankNode();
    graph.add(consumeActionBN, RDF('type'), SCHEMA('ConsumeAction'));

    //checkIn BlankNode
    let checkInBlankNode = rdfLib.blankNode();
    graph.add(checkInBlankNode, RDF('type'), ACTIVITYSTREAM('Activity'));
    graph.add(checkInBlankNode, RDF('type'), SOLIDLINKEDBEER('CheckIn'));
    graph.add(checkInBlankNode, ACTIVITYSTREAM('published'), time);

    //interaction between nodes.
    graph.add(consumeActionBN, SCHEMA('object'), beerNode);
    graph.add(consumeActionBN, SCHEMA('agent'), userNN);

    graph.add(checkInBlankNode, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), checkInBlankNode);

    graph.add(checkInBlankNode, SOLIDLINKEDBEER('checkInOf'), consumeActionBN);

    // //make a text file and send
    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}

export function beerReviewInTemplate(postLocation, user, beerLocation, beerName, time, rating, review){
    let graph = rdfLib.graph();

    //doc
    let documentNN = rdfLib.sym(postLocation);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    //beer
    let beerNode = rdfLib.sym(beerLocation);
    graph.add(beerNode, RDF('type'), BEER('Beer'));
    graph.add(beerNode, BEER('beerName'), beerName);

    //user
    let userNN = rdfLib.sym(user.getUri());
    graph.add(userNN, RDF('type'), FOAF('Person'));

    if(user.getIsNick()){
        graph.add(userNN, FOAF('nick'), user.getName());
    }else{
        graph.add(userNN, FOAF('name'), user.getName());
    }

    //consume action
    let consumeActionBN = rdfLib.blankNode();
    graph.add(consumeActionBN, RDF('type'), SCHEMA('ConsumeAction'));

    //checkIn BlankNode
    let reviewBlankNode = rdfLib.blankNode();
    graph.add(reviewBlankNode, RDF('type'), ACTIVITYSTREAM('Activity'));
    graph.add(reviewBlankNode, RDF('type'), SOLIDLINKEDBEER('CheckIn'));
    graph.add(reviewBlankNode, RDF('type'), SOLIDLINKEDBEER('Review'));
    graph.add(reviewBlankNode, RDF('type'), SCHEMA('Review'));

    graph.add(reviewBlankNode, ACTIVITYSTREAM('published'), time);
    graph.add(reviewBlankNode, SCHEMA('reviewBody'), review);

    //Rating
    let ratingBN = rdfLib.blankNode();

    graph.add(ratingBN, RDF('type'), SCHEMA('Rating'));
    graph.add(ratingBN, SCHEMA('worstRating'), 1);
    graph.add(ratingBN, SCHEMA('bestRating'), 5);
    graph.add(ratingBN, SCHEMA('ratingValue'), rating);

    //interaction between nodes.
    graph.add(consumeActionBN, SCHEMA('object'), beerNode);
    graph.add(consumeActionBN, SCHEMA('agent'), userNN);

    graph.add(reviewBlankNode, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), reviewBlankNode);

    graph.add(reviewBlankNode, SOLIDLINKEDBEER('checkInOf'), consumeActionBN);
    graph.add(reviewBlankNode, SCHEMA('itemReviewed'), beerNode);
    graph.add(reviewBlankNode, SCHEMA('reviewRating'), ratingBN);

    // //make a text file and send
    return rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
}

export function getGroupAppDataTTL(urlFile, friends, leader, groupName){
    let graph = rdfLib.graph();

    let documentNN = rdfLib.sym(urlFile);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    let groupNN = rdfLib.sym(urlFile + "#" + GROUP_MEMBERS);

    graph.add(groupNN, RDF('type'), VCARD('Group'));
    graph.add(groupNN, RDF('type'), SOLIDLINKEDBEER('Group'));

    graph.add(groupNN, SOLIDLINKEDBEER('hasLeader'), rdfLib.sym(leader));

    friends.forEach(res => {
        graph.add(groupNN, VCARD('hasMember'), rdfLib.sym(res.getUri()));
    });

    graph.add(groupNN, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), groupNN);

    graph.add(groupNN, SOLIDLINKEDBEER('name'), groupName);

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

    let documentNN = rdfLib.sym(postlocation);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    let groupNN = rdfLib.sym(groupLocation);
    graph.add(groupNN, RDF('type'), VCARD('Group'));
    graph.add(groupNN, RDF('type'), SOLIDLINKEDBEER('Group'));

    graph.add(groupNN, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), groupNN);

    return rdfLib.serialize(undefined, graph, postlocation, 'text/turtle');
}

export function getCheckInIndexBody(postlocation, members, user){
    let graph = rdfLib.graph();

    let documentNN = rdfLib.sym(postlocation);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    let namedNode = rdfLib.sym(postlocation + "#" + GROUP_MEMBERS);
    members.push(user);

    graph.add(namedNode, RDF('type'), VCARD('Group'));

    members.forEach(res => {
        let member = rdfLib.sym(res.getUri());
        graph.add(namedNode, VCARD('hasMember'), member);
        graph.add(member, RDF('type'), FOAF('Person'));
        graph.add(member, RDF('type'), SOLIDLINKEDBEER('GroupMember'));
        graph.add(member, SOLIDLINKEDBEER('points'), 0);
    });

    graph.add(namedNode, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), namedNode);

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

    let documentNN = rdfLib.sym(likeLocation);
    graph.add(documentNN, RDF('type'), FOAF('Document'));

    let likeBN = rdfLib.blankNode();
    graph.add(likeBN, RDF('type'), ACTIVITYSTREAM('Like'));

    graph.add(likeBN, ACTIVITYSTREAM('actor'), rdfLib.sym(userWebId));
    graph.add(likeBN, ACTIVITYSTREAM('object'), rdfLib.sym(checkInLocation));

    graph.add(likeBN, FOAF('isPrimaryTopicOf'), documentNN);
    graph.add(documentNN, FOAF('primaryTopic'), likeBN);

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