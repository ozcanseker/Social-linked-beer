import Friend from '../model/Friend';
import BeerCheckIn from "../model/BeerCheckIn";

const fileClient = require('solid-file-client');
const authClient = require('solid-auth-client');
const rdfLib = require('rdflib');

const SOLID = rdfLib.Namespace("http://www.w3.org/ns/solid/terms#");
const VCARD = rdfLib.Namespace("http://www.w3.org/2006/vcard/ns#");
const FOAF = rdfLib.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = rdfLib.Namespace('http://www.w3.org/ns/ldp#');
const SOLIDLINKEDBEER = rdfLib.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');
const RDF = rdfLib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");

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
  
    friend = new Friend(friendUrl, friend.name, friend.imageUrl, friend.appLocation, new Date(startdate.value), points.value);

    getTenUserCheckIns(friend.getApplocation()).then(res => {
      friend.addUserCheckIns(res.userBeerCheckIns);
      friend.setBeerReviews(res.reviews);
      friend.setCheckIns(res.checkIns);
    });

    return friend;
  }catch(e){
    //TODO delete user from friends if 403
    //TODO general error handling
    console.log(e);
    return undefined;
  }
}

export async function getTenUserCheckIns(applicationLocation){
  let checkinLocation = applicationLocation + 'beerdrinker/checkins/';
  let fileContents = (await fileClient.readFolder(checkinLocation)).files.reverse();
  let userBeerCheckIns = [];

  let checkIns = 0;
  let reviews = 0;

  for (let i = 0; i < fileContents.length && i < 10; i++) {
    let ttlFile = await fileClient.readFile(fileContents[i].url);

    let graph = rdfLib.graph();
    let namedNode = rdfLib.sym(fileContents[i].url);
    rdfLib.parse(ttlFile, graph, fileContents[i].url, "text/turtle");

    let type = graph.any(namedNode, RDF('type'));
    let webId = graph.any(namedNode, SOLIDLINKEDBEER('webId'));
    let userId = graph.any(namedNode, SOLIDLINKEDBEER('username'));
    let beerlocation = graph.any(namedNode, SOLIDLINKEDBEER('beerLocation'));
    let beername = graph.any(namedNode, SOLIDLINKEDBEER('beerName'));
    let checkinTime = graph.any(namedNode, SOLIDLINKEDBEER('checkInTime'));
    let rating = graph.any(namedNode, SOLIDLINKEDBEER('rating'));
    let review = graph.any(namedNode, SOLIDLINKEDBEER('review'));

    let beerCheckIn = new BeerCheckIn(fileContents[i].url,
        webId.value,
        userId? userId.value : undefined,
        beerlocation.value,
        beername.value,
        checkinTime.value,
        rating ? rating.value : undefined,
        review ? review.value : undefined
    );

    if(rating){
      reviews++;
    }else{
      checkIns++;
    }

    userBeerCheckIns.push(beerCheckIn);
  }

  return {userBeerCheckIns : userBeerCheckIns, reviews : reviews, checkIns : checkIns};
}