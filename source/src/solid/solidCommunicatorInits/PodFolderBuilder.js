import {postSolidFile, putSolidFile} from "../SolidMethods";

import * as fileClient from "solid-file-client";
import authClient from "solid-auth-client";
import * as rdflib from "rdflib";
import {ACL, FOAF, RDF, SOLID, SOLIDLINKEDBEER, TERMS, VCARD} from "../rdf/Prefixes";
import {
  APPDATA_FILE,
  APPDATA_FILENAME,
  APPFOLDER_NAME,
  BEERDRINKERFOLDER,
  CHECKIN_FOLDER,
  CONTENT_TYPE_TURTLE,
  FRIENDS_FILE,
  FRIENDS_FILENAME, GROUPFOLDER,
  INBOX_FOLDER, LIKE_FOLDER
} from "../rdf/Constants";

export async function buildFolders(publicProfileIndex, storePublicProfileIndex, storagePublic, app, webId) {
  //TODO a whole lot of error checking. Checking for 400 error codes and stuff like that
  let applocation = await createAppNodeForPublicTypeIndex(storePublicProfileIndex, publicProfileIndex, storagePublic, app);
  await makeAppFolderStructure(applocation, webId);

  //sleep zodat de server de requests kan verwerken
  await sleep(2000);

  return applocation;
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export async function checkFolderIntegrity(appfolder, webId) {
  //TODO breidt dit uit

  //Group
  let groupFolder = appfolder + BEERDRINKERFOLDER + GROUPFOLDER;
  let groupRes = await authClient.fetch(groupFolder);

  if(groupRes.status === 404){
    let groupFolderAcl = groupFolder + '.acl';
    await fileClient.createFolder(groupFolder);
    let body = getAclGroupFolder(groupFolder, groupFolderAcl, webId);
    await putSolidFile(groupFolderAcl, body);
  }

  let likeFolder = appfolder + BEERDRINKERFOLDER + LIKE_FOLDER;
  let likeRes = await authClient.fetch(likeFolder);

  if(likeRes.status === 404){
    let likeFolderAcl = likeFolder + '.acl';
    await fileClient.createFolder(likeFolder);
    let body = getAclLikeFolder(likeFolder, likeFolderAcl, webId);
    await putSolidFile(likeFolderAcl, body);
  }
}

/**
 * Adds the applicatioin to the public type index
 * @param {store} store 
 * @param {NN} publicTypeIndex 
 * @param {string} publicLocation 
 * @param {string} app 
 */
async function createAppNodeForPublicTypeIndex(store, publicTypeIndex, publicLocation, app) {
  //find empty folder
  let appLocation = await findEmptyFolder(publicLocation);

  //create a named node for the app
  let appLocationNN = rdflib.sym(appLocation);

  //add values to the pti
  store.add(publicTypeIndex, TERMS('references'), app);
  store.add(app, RDF('type'), SOLID('TypeRegistration'));
  store.add(app, SOLID('instanceContainer'), appLocationNN);

  //serialize and send the pti
  let newTTLpublicTypeindex = await rdflib.serialize(undefined, store, publicTypeIndex.value, CONTENT_TYPE_TURTLE);
  await putSolidFile(publicTypeIndex.value, newTTLpublicTypeindex);

  return appLocation;
}

/**
 * Finds an empty folder for the application
 * @param {} publicLocation 
 */
async function findEmptyFolder(publicLocation) {
  //TODO improve this. You can check if the other folder holds up to your standards. A lot of possibilities
  let appLocation = publicLocation + APPFOLDER_NAME + '/';

  //see if there is a folder at the applocation
  let res = await authClient.fetch(appLocation);

  //make eiher a new random foldername or use the original
  if (res.status % 400 < 100) {
    return appLocation;
  } else {
    return publicLocation + APPFOLDER_NAME + makeRandomString(10) + '/'
  }
}

/**
 * Makes a random string
 * @param {int} length 
 */
function makeRandomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Makes the folder struckture for the application
 * @param {string} appFolderUrl 
 * @param {string} webId 
 */
async function makeAppFolderStructure(appFolderUrl, webId) {
  //TODO make all async
  let body;

  //top folder
  let aclUrl = appFolderUrl + '.acl';

  await fileClient.createFolder(appFolderUrl);
  body = getAclAppFolder(appFolderUrl, aclUrl, webId);
  await putSolidFile(aclUrl, body);

  //beerdrinker
  let beerDrinkerUrl = appFolderUrl + BEERDRINKERFOLDER;
  await fileClient.createFolder(beerDrinkerUrl);

  // friends
  let friendsUrl = beerDrinkerUrl + FRIENDS_FILE;
  body = getFriendsFile(friendsUrl, webId);

  await postSolidFile(beerDrinkerUrl, FRIENDS_FILENAME, body);

  //appData 
  let appDataFile = beerDrinkerUrl + APPDATA_FILE;
  let appDataFileAcl = appDataFile + '.acl';
  
  body = getAppDataInit(appDataFile);
  await postSolidFile(beerDrinkerUrl, APPDATA_FILENAME, body);
  
  body = getAclAppData(appDataFile, appDataFileAcl, webId, friendsUrl);
  await putSolidFile(appDataFileAcl, body);

  //inboxfolder
  let inboxUrl = beerDrinkerUrl + INBOX_FOLDER;
  let inboxUrlacl = inboxUrl + '.acl';
  body = getACLInboxFolder(inboxUrl, inboxUrlacl, webId);

  await fileClient.createFolder(inboxUrl);
  await putSolidFile(inboxUrlacl, body);

  //check in folder        
  let reviewUrl = beerDrinkerUrl + CHECKIN_FOLDER;
  let reviewUrlacl = reviewUrl + '.acl';

  await fileClient.createFolder(reviewUrl);
  body = getACLSubmittersFriends(reviewUrl, reviewUrlacl, webId, friendsUrl);
  await putSolidFile(reviewUrlacl, body);

  //check in folder
  let groupFolder = beerDrinkerUrl + GROUPFOLDER;
  let groupFolderAcl = groupFolder + '.acl';

  //group folder
  await fileClient.createFolder(groupFolder);
  body = getAclGroupFolder(groupFolder, groupFolderAcl, webId);
  await putSolidFile(groupFolderAcl, body);

  //like folder
  let likeFolder = beerDrinkerUrl + LIKE_FOLDER;
  let likeFolderAcl = likeFolder + '.acl';

  await fileClient.createFolder(likeFolder);
  body = getAclLikeFolder(likeFolder, likeFolderAcl, webId);
  await putSolidFile(likeFolderAcl, body);
}

/**
 * The init file for the appdata
 * @param {string} url 
 */
function getAppDataInit(url) {
  let graph = rdflib.graph();

  let bn = rdflib.blankNode();

  graph.add(bn, SOLIDLINKEDBEER('startdate'), new Date());
  graph.add(bn, SOLIDLINKEDBEER('points'), 0);

  return rdflib.serialize(undefined, graph, url, 'text/turtle');
}

/**
 * Makes the acl for the app folder
 * Only owner can see, write and control
 * @param {*} appUrl 
 * @param {*} aclUrl 
 * @param {*} webIdUserLoggedIn 
 */
function getAclAppFolder(appUrl, aclUrl, webIdUserLoggedIn) {
  let graph = rdflib.graph();
  let owner = rdflib.sym(aclUrl + "#Owner");
  let app = rdflib.sym(appUrl);
  let agent = rdflib.sym(webIdUserLoggedIn);

  graph.add(owner, RDF('type'), ACL('Authorization'));

  graph.add(owner, ACL('accessTo'), app);
  graph.add(owner, ACL('default'), app);
  graph.add(owner, ACL('agent'), agent);

  graph.add(owner, ACL('mode'), ACL('Control'));
  graph.add(owner, ACL('mode'), ACL('Read'));
  graph.add(owner, ACL('mode'), ACL('Write'));

  return rdflib.serialize(undefined, graph, aclUrl, 'text/turtle');
}

/**
 * Init for the friends file
 * @param {string} urlFile 
 * @param {*} webId 
 */
function getFriendsFile(urlFile) {
  let graph = rdflib.graph();

  let friendsgroup = rdflib.sym(urlFile + "#Friends");
  let friendsgroupRequested = rdflib.sym(urlFile + "#FriendsRequested");

  graph.add(friendsgroup, RDF('type'), VCARD('Group'));
  graph.add(friendsgroup, VCARD('hasUID'), rdflib.sym("urn:uuid:8831CBAD-1111-2222-8563-F0F4787E5398:ABGroup"));

  graph.add(friendsgroupRequested, RDF('type'), VCARD('Group'));
  graph.add(friendsgroupRequested, VCARD('hasUID'), rdflib.sym("urn:uuid:8831CBAD-1111-2222-8563-F0F4787E5398:CDGroup"));

  return rdflib.serialize(undefined, graph, urlFile, 'text/turtle');
}

/**
 * Get the acl for the inbox folder. Everyone can write but only owner can read
 * @param {} inboxUrl 
 * @param {*} aclUrl 
 * @param {*} webIdUserLoggedIn 
 */
function getACLInboxFolder(inboxUrl, aclUrl, webIdUserLoggedIn) {
  let graph = rdflib.graph();
  let owner = rdflib.sym(aclUrl + "#Owner");
  let _public = rdflib.sym(aclUrl + "#Public");
  let inbox = rdflib.sym(inboxUrl);
  let agent = rdflib.sym(webIdUserLoggedIn);

  //owner
  graph.add(owner, RDF('type'), ACL('Authorization'));

  graph.add(owner, ACL('accessTo'), inbox);
  graph.add(owner, ACL('default'), inbox);
  graph.add(owner, ACL('agent'), agent);

  graph.add(owner, ACL('mode'), ACL('Control'));
  graph.add(owner, ACL('mode'), ACL('Read'));
  graph.add(owner, ACL('mode'), ACL('Write'));

  //public
  graph.add(_public, RDF('type'), ACL('Authorization'));

  graph.add(_public, ACL('accessTo'), inbox);
  graph.add(_public, ACL('default'), inbox);
  graph.add(_public, ACL('agentClass'), FOAF("Agent"));

  graph.add(_public, ACL('mode'), ACL('Append'));

  return rdflib.serialize(undefined, graph, aclUrl, 'text/turtle');
}

/**
 * Acl check in folder. Friend and user can read
 * @param {*} resourceUrl 
 * @param {*} aclUrl 
 * @param {*} webIdUserLoggedIn 
 * @param {*} friendsUrl 
 */
function getACLSubmittersFriends(resourceUrl, aclUrl, webIdUserLoggedIn, friendsUrl) {
  let graph = rdflib.graph();
  let owner = rdflib.sym(aclUrl + "#Owner");
  let group1 = rdflib.sym(aclUrl + "#Friends");
  let resource = rdflib.sym(resourceUrl);
  let agent = rdflib.sym(webIdUserLoggedIn);

  //group who get acess
  let fgroup1 = rdflib.sym(friendsUrl + "#Friends");
  let fgroup2 = rdflib.sym(friendsUrl + "#FriendsRequested");

  //owner
  graph.add(owner, RDF('type'), ACL('Authorization'));

  graph.add(owner, ACL('accessTo'), resource);
  graph.add(owner, ACL('default'), resource);
  graph.add(owner, ACL('agent'), agent);

  graph.add(owner, ACL('mode'), ACL('Control'));
  graph.add(owner, ACL('mode'), ACL('Read'));
  graph.add(owner, ACL('mode'), ACL('Write'));

  //public
  graph.add(group1, RDF('type'), ACL('Authorization'));

  graph.add(group1, ACL('accessTo'), resource);
  graph.add(group1, ACL('default'), resource);

  graph.add(group1, ACL('agentGroup'), fgroup1);
  graph.add(group1, ACL('agentGroup'), fgroup2);

  graph.add(group1, ACL('mode'), ACL('Read'));
  graph.add(group1, ACL('mode'), ACL('Append'));

  return rdflib.serialize(undefined, graph, aclUrl, 'text/turtle');
}

/**
 * Acl app file. Friend and user can read
 * @param {*} resourceUrl 
 * @param {*} aclUrl 
 * @param {*} webIdUserLoggedIn 
 * @param {*} friendsUrl 
 */
function getAclAppData(resourceUrl, aclUrl, webIdUserLoggedIn, friendsUrl) {
  let graph = rdflib.graph();
  let owner = rdflib.sym(aclUrl + "#Owner");
  let group1 = rdflib.sym(aclUrl + "#Friends");
  let resource = rdflib.sym(resourceUrl);
  let agent = rdflib.sym(webIdUserLoggedIn);

  //group who get acess
  let fgroup1 = rdflib.sym(friendsUrl + "#Friends");
  let fgroup2 = rdflib.sym(friendsUrl + "#FriendsRequested");

  //owner
  graph.add(owner, RDF('type'), ACL('Authorization'));

  graph.add(owner, ACL('accessTo'), resource);
  graph.add(owner, ACL('default'), resource);
  graph.add(owner, ACL('agent'), agent);

  graph.add(owner, ACL('mode'), ACL('Control'));
  graph.add(owner, ACL('mode'), ACL('Read'));
  graph.add(owner, ACL('mode'), ACL('Write'));

  //public
  graph.add(group1, RDF('type'), ACL('Authorization'));

  graph.add(group1, ACL('accessTo'), resource);
  graph.add(group1, ACL('default'), resource);

  graph.add(group1, ACL('agentGroup'), fgroup1);
  graph.add(group1, ACL('agentGroup'), fgroup2);

  graph.add(group1, ACL('mode'), ACL('Read'));

  return rdflib.serialize(undefined, graph, aclUrl, 'text/turtle');
}

function getAclGroupFolder(appUrl, aclUrl, webIdUserLoggedIn) {
  let graph = rdflib.graph();
  let owner = rdflib.sym(aclUrl + "#Owner");
  let app = rdflib.sym(appUrl);
  let agent = rdflib.sym(webIdUserLoggedIn);

  graph.add(owner, RDF('type'), ACL('Authorization'));

  graph.add(owner, ACL('accessTo'), app);
  graph.add(owner, ACL('default'), app);
  graph.add(owner, ACL('agent'), agent);

  graph.add(owner, ACL('mode'), ACL('Control'));
  graph.add(owner, ACL('mode'), ACL('Read'));
  graph.add(owner, ACL('mode'), ACL('Write'));

  return rdflib.serialize(undefined, graph, aclUrl, 'text/turtle');
}

function getAclLikeFolder(appUrl, aclUrl, webIdUserLoggedIn){
  let graph = rdflib.graph();
  let owner = rdflib.sym(aclUrl + "#Owner");
  let app = rdflib.sym(appUrl);
  let agent = rdflib.sym(webIdUserLoggedIn);

  graph.add(owner, RDF('type'), ACL('Authorization'));

  graph.add(owner, ACL('accessTo'), app);
  graph.add(owner, ACL('default'), app);
  graph.add(owner, ACL('agent'), agent);

  graph.add(owner, ACL('mode'), ACL('Control'));
  graph.add(owner, ACL('mode'), ACL('Read'));
  graph.add(owner, ACL('mode'), ACL('Write'));

  return rdflib.serialize(undefined, graph, aclUrl, 'text/turtle');
}