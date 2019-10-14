import Friend from '../model/Friend';

const fileClient = require('solid-file-client');
const authClient = require('solid-auth-client');
const rdfLib = require('rdflib');

const SOLID = rdfLib.Namespace("http://www.w3.org/ns/solid/terms#");
const VCARD = rdfLib.Namespace("http://www.w3.org/2006/vcard/ns#");
const FOAF = rdfLib.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = rdfLib.Namespace('http://www.w3.org/ns/ldp#');
const SOLIDLINKEDBEER = rdfLib.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');

export async function postSolidFile(folder, filename, body) {
  authClient.fetch(folder, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/turtle',
      'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
      'SLUG': filename
    },
    body: body
  });
}

export async function putSolidFile(url, body) {
  authClient.fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'text/turtle'
    },
    body: body
  });
}

// let body = `INSERT DATA { <${this.state.webId+"#comment"}> <${SOLIDLINKEDBEER('points6').value}> <${8}> }`;
// let appDataFile;
// appendSolidResource(appDataFile, {body})
/**
 * 
 * @param {*} url 
 * @param {*} body 
 */
export async function appendSolidResource(url, body) {
  authClient.fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/sparql-update'
    },
    body: body
  });
}

export async function getUserFile(url) {
  let inbox;

  //get url resource
  let userttt = await authClient.fetch(url);
  let graph = rdfLib.graph();

  if(userttt.status > 403){
    throw new Error("403: user unauthorized");
  }else if(userttt.status > 400){
    throw new Error("file not found");
  }

  userttt = await userttt.text();

  try {
    //parse to check if it is ttl
    rdfLib.parse(userttt, graph, url, "text/turtle");

    //check if it is a profile card
    let query = graph.any(undefined, undefined, FOAF('PersonalProfileDocument'));

    if (query) {
      let profile = rdfLib.sym(url);

      //check if user has ppi
      const publicProfileIndex = graph.any(profile, SOLID("publicTypeIndex"));

      if (publicProfileIndex) {
        let ppiTTL = await fileClient.readFile(publicProfileIndex.value);
        let ppigraph = rdfLib.graph();
        rdfLib.parse(ppiTTL, ppigraph, publicProfileIndex.value, "text/turtle");

        let app = rdfLib.sym(publicProfileIndex.value + "#SocialLinkedBeer");
        let appQuery = ppigraph.any(app, SOLID("instance"));

        //get name and Image            
        let nameFN = graph.any(profile, VCARD('fn'));
        let imageURL = graph.any(profile, VCARD('hasPhoto'));

        if (!appQuery) {
          inbox = graph.any(profile, LDP('inbox'));
        }

        //applocation is not of beerdrinker
        let result = {
          url: url,
          name: nameFN ? nameFN.value : undefined,
          imageUrl: imageURL ? imageURL.value : undefined,
          appLocation: appQuery ? appQuery.value : undefined,
          inbox: inbox ? inbox.value : undefined
        }

        return result;
      } else {
        throw new Error("no ppi");
      }
    } else {
      throw new Error("not a profile card");
    }
  } catch (err) {
    throw new Error("Not a correct profile linked data file");
  }
}

/**
 * 
 * @param {String} friendUrl 
 */
export async function fetchFriend(friendUrl){
  try{
    let friend = await getUserFile(friendUrl);

    let friendAppdataLocation = friend.appLocation + 'beerdrinker/appdata.ttl';
    let friendsAppdata = await fileClient.readFile(friendAppdataLocation);
  
    let graph = rdfLib.graph();
    rdfLib.parse(friendsAppdata, graph, friendAppdataLocation, "text/turtle");
  
    let blankNode = graph.any(undefined, SOLIDLINKEDBEER('startdate'));
  
    let startdate = graph.any(blankNode, SOLIDLINKEDBEER('startdate'));
    let points = graph.any(blankNode, SOLIDLINKEDBEER('points'));
  
    return new Friend(friendUrl, friend.name, friend.imageUrl, friend.appLocation, new Date(startdate.value), points.value);
  }catch(e){
    //TODO delete user from friends if 403
    //TODO general error handling
    console.log(e);
    return undefined;
  }
}