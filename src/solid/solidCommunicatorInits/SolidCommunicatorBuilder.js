import { buildFolders, checkFolderIntegrity } from './PodFolderBuilder'
import { postSolidFile, putSolidFile, getUserFile, fetchFriend } from "../SolidMethods";
import Friend from '../../model/Friend';
import {checkacess} from './AccessChecker'

const fileClient = require('solid-file-client');
const authClient = require('solid-auth-client');
const rdfLib = require('rdflib');

const SOLID = rdfLib.Namespace( "http://www.w3.org/ns/solid/terms#");
const VCARD = rdfLib.Namespace("http://www.w3.org/2006/vcard/ns#");
const TERMS = rdfLib.Namespace('http://purl.org/dc/terms/');
const RDF = rdfLib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SOLIDLINKEDBEER = rdfLib.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');
const FOAF = rdfLib.Namespace('http://xmlns.com/foaf/0.1/');
const ACL = rdfLib.Namespace("http://www.w3.org/ns/auth/acl#");
const PIM = rdfLib.Namespace("http://www.w3.org/ns/pim/space#");
const LDP = rdfLib.Namespace('http://www.w3.org/ns/ldp#');

export async function buildSolidCommunicator(user){
  //TODO do some thing parallel
  //TODO check acl
    let returnObject = {};

    //make a named node of the session webid of the user
    //namednode
    const webIdNN = rdfLib.sym(user.getWebId());

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
    let storagePublic = await getStorePublic(webIdNN, storeProfileCard);     

    //locatie voor de applicatie
    //string
    let applicationLocation = await getApplicationLocation(ppiObject.ppi , ppiObject.store, storagePublic, webIdNN.value);


    //returnobject
    returnObject.sc = {};
    returnObject.user = {};

    returnObject.user = getUserDetails(webIdNN, storeProfileCard);
    let appData = await getAppData(applicationLocation);

    returnObject.user = {...returnObject.user , ...appData};
    
    let friendsData = await getFriends(applicationLocation);
    returnObject.user.friends = friendsData.friends;
    returnObject.sc.friendsStore = friendsData.friendsStore;
    returnObject.sc.group = friendsData.group;
    returnObject.sc.sentGroup = friendsData.sentGroup;
  
    returnObject.user.applicationLocation = applicationLocation;

    return returnObject;
}

function getUserDetails(profile, storeProfileCard){
  let nameFN =  storeProfileCard.any(profile,VCARD('fn'));
  let imageURL =  storeProfileCard.any(profile,VCARD('hasPhoto')); 

  nameFN = nameFN ? nameFN.value : undefined;
  imageURL = imageURL ? imageURL.value : undefined;

  return {name: nameFN, imageURL: imageURL};
}

async function getUserCard(webIdUrl){
    const profileCardTTl = await fileClient.fetch(webIdUrl); 
    const storeProfileCard = rdfLib.graph(); 
    rdfLib.parse(profileCardTTl, storeProfileCard, webIdUrl, "text/turtle");
    
    return storeProfileCard;
}

async function getPPILocation(profile, storeProfileCard){
    const publicProfileIndex = storeProfileCard.any(profile, SOLID("publicTypeIndex"));
    
    const storePublicTypeIndex = rdfLib.graph();
    const publicTypeIndexTTL = await fileClient.fetch(publicProfileIndex.value);
    rdfLib.parse(publicTypeIndexTTL, storePublicTypeIndex, publicProfileIndex.value, "text/turtle");
    
    return {store : storePublicTypeIndex, ppi : publicProfileIndex};
}

function getStorePublic(profile, storeProfileCard){
    let locationStorage = storeProfileCard.any(profile, PIM("storage"));
    return locationStorage.value + "public/";
}

async function getApplicationLocation(publicProfileIndex, storePublicProfileIndex, storagePublic, webId){
    let app = rdfLib.sym(publicProfileIndex.value + "#SocialLinkedBeer");
    let appQuery = storePublicProfileIndex.any(app, SOLID("instance"));

    if(appQuery){
      checkFolderIntegrity();
      return appQuery.value;
    }else{
        return await buildFolders(publicProfileIndex, storePublicProfileIndex, storagePublic, app, webId);
    }
}

async function getAppData(url){
  //TODO one place to save all urls
  let appdataLocation = url + 'beerdrinker/appdata.ttl';

  let appdatattl = await fileClient.readFile(appdataLocation);
  let graph = rdfLib.graph();
  rdfLib.parse(appdatattl, graph, appdataLocation, "text/turtle");

  let blankNode = graph.any(undefined, SOLIDLINKEDBEER('startdate'));

  let startdate = graph.any(blankNode, SOLIDLINKEDBEER('startdate'));
  let points = graph.any(blankNode, SOLIDLINKEDBEER('points'));
  
  return {startdate: startdate.value, points: points.value}
}

 async function getFriends(applicationLocation){
  let friendsLocation = applicationLocation + 'beerdrinker/friends.ttl';
  let ttlFriends = await fileClient.readFile(friendsLocation);
  let group = rdfLib.sym(friendsLocation + "#Friends");
  let sentGroup = rdfLib.sym(friendsLocation + "#FriendsRequested");

  let friends = [];

  let graph = rdfLib.graph();
  rdfLib.parse(ttlFriends, graph, friendsLocation, "text/turtle");

  let query = graph.each(group, VCARD('hasMember'), undefined); 

  for (let index = 0; index < query.length; index++) {
    let friend = await fetchFriend(query[index].value);
    friends.push(friend);
  }

  return {friends: friends, friendsStore: graph, group: group, sentGroup: sentGroup};
}
 