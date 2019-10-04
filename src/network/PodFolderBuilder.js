const fileClient = require('solid-file-client');
const authClient = require('solid-auth-client');
const rdflib = require('rdflib');

const SOLID = rdflib.Namespace( "http://www.w3.org/ns/solid/terms#");
const VCARD = rdflib.Namespace("http://www.w3.org/2006/vcard/ns#");
const TERMS = rdflib.Namespace('http://purl.org/dc/terms/');
const RDF = rdflib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SOLIDLINKEDBEER = rdflib.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');
const FOAF = rdflib.Namespace('http://xmlns.com/foaf/0.1/');
const ACL = rdflib.Namespace("http://www.w3.org/ns/auth/acl#");

const appName = "sociallinkedbeer";

export async function buildFolders(publicProfileIndex, storePublicProfileIndex, storagePublic, app, webId){
  //TODO a whole lot of error checking. Checking for 400 error codes and stuff like that
  let applocation = await createAppNodeForPublicTypeIndex(storePublicProfileIndex, publicProfileIndex, storagePublic, app);
  await makeAppFolderStructure(applocation, webId);

  return applocation;
}

export async function checkFolderIntegrity(){
    //TODO Check integrity
    console.log("TODO checkFolderIntegrity");
}

async function createAppNodeForPublicTypeIndex(store, publicTypeIndex, publicLocation, app){
    let appLocation = await findEmptyFolder(publicLocation);
        
    let appLocationNN = rdflib.sym(appLocation);
    
    store.add(publicTypeIndex, TERMS('references'), app);
    store.add(app, RDF('type'), SOLID('TypeRegistration'));
    store.add(app, SOLID('instance'), appLocationNN);
    
    let newTTLpublicTypeindex = await rdflib.serialize(undefined, store, publicTypeIndex.value, 'text/turtle');
    await putSolidFile(publicTypeIndex.value, newTTLpublicTypeindex); 
 
    return appLocation;
}

async function findEmptyFolder(publicLocation){
  //TODO improve this. You can check if the other folder holds up to your standards. A lot of possibilities

  let appLocation = publicLocation + appName + '/'

  let res = await authClient.fetch(appLocation);
  if(res.status % 400 < 100){
    return appLocation;
  }else{
    return appLocation = publicLocation + appName + makeRandomString(10) +'/'
  }
}

function makeRandomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * 
 * @param {string} appFolderUrl 
 * @param {string} webId 
 */
async function makeAppFolderStructure(appFolderUrl, webId){
  //TODO make all async
  let body;
    
  //top folder
  let aclUrl = appFolderUrl + '.acl';

  await fileClient.createFolder(appFolderUrl);
  body = getAclAppFolder(appFolderUrl, aclUrl, webId);
  await putSolidFile(aclUrl , body);

  //beerdrinker
  let beerDrinkerUrl = appFolderUrl + "beerdrinker/";
  await fileClient.createFolder(beerDrinkerUrl);

  // friends
  let friendsUrl = beerDrinkerUrl + 'friends.ttl';
  body = getFriendsFile(friendsUrl, webId);

  await postSolidFile(beerDrinkerUrl, 'friends' ,body);
  
  //appData 
  let appDataFile = beerDrinkerUrl + 'appdata.ttl';
  body = getAppDataInit(appDataFile);
  await postSolidFile(beerDrinkerUrl,'appdata' ,body);
  
  //inboxfolder
  let inboxUrl = beerDrinkerUrl + 'inbox/';
  let inboxUrlacl = inboxUrl + '.acl';   
  body = getACLInboxFolder(inboxUrl, inboxUrlacl, webId);

  await fileClient.createFolder(inboxUrl);
  await putSolidFile(inboxUrlacl, body);

  //check in folder        
  let reviewUrl = beerDrinkerUrl + 'checkins/';
  let reviewUrlacl = reviewUrl + '.acl';

  await fileClient.createFolder(reviewUrl);
  body = getACLCheckInFolder(reviewUrl, reviewUrlacl, webId, friendsUrl);
  await putSolidFile(reviewUrlacl, body);                     
}


function getAppDataInit(url){
  let graph = rdflib.graph();
  
  let bn = rdflib.blankNode();

  graph.add(bn, SOLIDLINKEDBEER('startdate'), new Date());
  graph.add(bn, SOLIDLINKEDBEER('points'), 0);

  let ttl = rdflib.serialize(undefined, graph, url, 'text/turtle');
  return ttl;
}

function getAclAppFolder(appUrl, aclUrl, webIdUserLoggedIn){
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

function getFriendsFile(urlFile, webId){
  let graph = rdflib.graph();

  let friendsgroup = rdflib.sym(urlFile + "#Friends");
  let friendsgroupRequested = rdflib.sym(urlFile + "#FriendsRequested");

  graph.add(friendsgroup, RDF('type'), VCARD('Group'));
  graph.add(friendsgroup, VCARD('hasUID'), rdflib.sym("urn:uuid:8831CBAD-1111-2222-8563-F0F4787E5398:ABGroup"));

  graph.add(friendsgroupRequested, RDF('type'), VCARD('Group'));
  graph.add(friendsgroupRequested, VCARD('hasUID'), rdflib.sym("urn:uuid:8831CBAD-1111-2222-8563-F0F4787E5398:CDGroup"));

  return rdflib.serialize(undefined, graph, urlFile, 'text/turtle');
}

function getACLInboxFolder(inboxUrl, aclUrl, webIdUserLoggedIn){
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

function getACLCheckInFolder(ciUrl, aclUrl, webIdUserLoggedIn, friendsUrl){
  let graph = rdflib.graph();
  let owner = rdflib.sym(aclUrl + "#Owner");
  let group1 = rdflib.sym(aclUrl + "#Friends");
  let ci = rdflib.sym(ciUrl);
  let agent = rdflib.sym(webIdUserLoggedIn);

  //group who get acess
  let fgroup1 = rdflib.sym(friendsUrl + "#Friends");
  let fgroup2 = rdflib.sym(friendsUrl + "#FriendsRequested"); 
  
  //owner
  graph.add(owner, RDF('type'), ACL('Authorization'));
  
  graph.add(owner, ACL('accessTo'), ci);
  graph.add(owner, ACL('default'), ci);  
  graph.add(owner, ACL('agent'), agent);
 
  graph.add(owner, ACL('mode'), ACL('Control'));
  graph.add(owner, ACL('mode'), ACL('Read'));
  graph.add(owner, ACL('mode'), ACL('Write'));

  //public
  graph.add(group1, RDF('type'), ACL('Authorization'));
  
  graph.add(group1, ACL('accessTo'), ci);
  graph.add(group1, ACL('default'), ci);  

  graph.add(group1, ACL('agentGroup'), fgroup1);
  graph.add(group1, ACL('agentGroup'), fgroup2);

  graph.add(group1, ACL('mode'), ACL('Append'));
 
  return rdflib.serialize(undefined, graph, aclUrl, 'text/turtle');
}

async function postSolidFile(folder, filename , body){
  authClient.fetch(folder, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/turtle',
      'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
      'SLUG' : filename
    },
    body : body
});
}

async function putSolidFile(url, body){
  authClient.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/turtle'      
      },
      body: body
});
}