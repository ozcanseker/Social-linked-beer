const fileClient = require('solid-file-client');
const authClient = require('solid-auth-client');
const rdfLib = require('rdflib');

const SOLID = rdfLib.Namespace( "http://www.w3.org/ns/solid/terms#");
const PIM = rdfLib.Namespace("http://www.w3.org/ns/pim/space#");
const VCARD = rdfLib.Namespace("http://www.w3.org/2006/vcard/ns#");
const TERMS = rdfLib.Namespace('http://purl.org/dc/terms/');
const RDF = rdfLib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SOLIDLINKEDBEER = rdfLib.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');
const FOAF = rdfLib.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = rdfLib.Namespace('http://www.w3.org/ns/ldp#');

export async function postSolidFile(folder, filename , body){
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

export async function putSolidFile(url, body){
    authClient.fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/turtle'      
        },
        body: body
  });
  }
  
export async function appendSolidResource(url, body){
    authClient.fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/sparql-update'
      },
      body : body
    });
  
      // let body = `INSERT DATA { <${this.state.webId+"#comment"}> <${SOLIDLINKEDBEER('points6').value}> <${8}> }`;
      // let appDataFile;
      // appendSolidResource(appDataFile, {body})
  }

export async function getUserFile(url, callBack){
    let inbox;

    //get url resource
    let userttt = await fileClient.readFile(url);
    let graph = rdfLib.graph();

    try{
        //parse to check if it is ttl
        rdfLib.parse(userttt, graph, url, "text/turtle");

        //check if it is a profile card
        let query = graph.any(undefined, undefined, FOAF('PersonalProfileDocument'));

        if(query){
        let profile = rdfLib.sym(url);
        
        //check if user has ppi
        const publicProfileIndex = graph.any(profile, SOLID("publicTypeIndex"));

        if(publicProfileIndex){
            let ppiTTL = await fileClient.readFile(publicProfileIndex.value);
            let ppigraph = rdfLib.graph();
            rdfLib.parse(ppiTTL, ppigraph, publicProfileIndex.value, "text/turtle");

            let app = rdfLib.sym(publicProfileIndex.value + "#SocialLinkedBeer");
            let appQuery = ppigraph.any(app, SOLID("instance"));

            //get name and Image            
            let nameFN =  graph.any(profile,VCARD('fn'));
            let imageURL =  graph.any(profile,VCARD('hasPhoto')); 

            if(!appQuery){
            inbox = graph.any(profile, LDP('inbox'));
            }

            let result = {
            url : url,
            name: nameFN ? nameFN.value : undefined,
            imageUrl :  imageURL ? imageURL.value : undefined,
            appLocation : appQuery ? appQuery.value : undefined,
            inbox : inbox ? inbox.value : undefined
            }

            return result;
        }else{
            throw new Error("no ppi");
        }
        }else{
        throw new Error("not a profile card");
        }
    }catch(err){
        throw new Error("Not a linked data file");
    }    
}