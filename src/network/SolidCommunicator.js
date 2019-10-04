import User from '../model/User'
import Friend from '../model/Friend'
import { buildFolders, checkFolderIntegrity } from './PodFolderBuilder'
import { buildSolidCommunicator } from './SolidCommunicatorBuilder'

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

class SolidCommunicator {
    constructor(user, values){
      
      //user
      this.user = user;
      user.subscribe(this);
    }

    static async build(user){
      let values = await buildSolidCommunicator(user);
      
      console.log(values);
      user.setName(values.user.name);
      user.setImageUrl(values.user.imageURL);
      user.addFriends(values.user.friends);
      user.setBeerPoints(values.user.points);
      user.setBeginDate(new Date(values.user.startdate));
      
      //make new solidCommunicator
      let solidCommunicator = new SolidCommunicator(user, values);

      return solidCommunicator;
    }  

    update(){
      console.log("update");
    }
}

async function appendSolidResource(url, body){
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

async function getUserFile(url, callBack){
  let userttt = await fileClient.readFile(url);
  let graph = rdfLib.graph();

  try{
    rdfLib.parse(userttt, graph, url, "text/turtle");

    let query = graph.any(undefined, undefined, FOAF('PersonalProfileDocument'));

    if(query){
      let profile = rdfLib.sym(url);
      let nameFN =  graph.any(profile,VCARD('fn'));
      let imageURL =  graph.any(profile,VCARD('hasPhoto')); 

      nameFN = nameFN ? nameFN.value : undefined;
      imageURL = imageURL ? imageURL.value : undefined;
      
      let result = {
        userTTl: userttt,
        url : url,
        name: nameFN,
        imageUrl : imageURL
      }

      callBack(result, false);
    }else{
      callBack(undefined, "not a profile card");
    }

  }catch(err){
    callBack(undefined, "Not a linked data file");
  }    
}

export default SolidCommunicator;

// export default SolidCommunicator;

// const SOLID = $rdf.Namespace( "http://www.w3.org/ns/solid/terms#");

// const BEERCOUNTER = $rdf.Namespace("https://ozcanseker.inrupt.net/vocabulary#");
// const PIM = $rdf.Namespace("http://www.w3.org/ns/pim/space#");

// let BEERCOUNTERRECORD = $rdf.sym("https://ozcanseker.inrupt.net/vocabulary#BeerCounterRecord");

// class SolidCommuncator{

//     /**
//      * 
//      * @param {string} webid 
//      * @param {string} applocation 
//      * @param {store:rdflib} appStore 
//      * @param {BeerCounter} beerCounter 
//      */
//     constructor(webid, applocation, appStore, beerCounter){
//         this.webid = webid;
//         this.applocation = applocation;
//         this.appStore = appStore;

//         //subscribe to model
//         this.beerCounter = beerCounter;
//         this.beerCounter.subscribe(this);
        
//         //for the networking
//         this.queryList = [];
//         this.networking = false;
//     }

//     update(){
//         let query = {
//             date : this.beerCounter.getDateToday(),
//             amount : this.beerCounter.getBeerCount()
//         }

//         this.queryList.push(query);

//         if(!this.networking){
//             this.startSendingFile();
//         }
//     }

//     async startSendingFile(){
//         this.networking = true;

//         while(this.queryList.length > 0){
//             let query = this.queryList.shift();
//             let date = query.date;
//             let blankNode = this.appStore.any(null, null, stringToDate(date));

//             if(blankNode){
//                 let statment = this.appStore.any(blankNode, RDF('value'), null);   
//                 statment.value = query.amount + "";     
//             }else{ 
//                 blankNode = $rdf.blankNode();
//                 this.appStore.add(blankNode, RDF('type'), BEERCOUNTER('BeerCounterRecord'));
//                 this.appStore.add(blankNode, TERMS('created'), stringToDate(date));
//                 this.appStore.add(blankNode, RDF('value'), query.amount);
//             }
//         }

//         let appStoreTTL = await $rdf.serialize(undefined, this.appStore, 'text/turtle');
//         console.log(this.applocation);
//         await fileClient.updateFile(this.applocation, appStoreTTL);

//         if(this.queryList.length > 0){
//             this.startSendingFile();
//         }else{
//             this.networking = false;
//         }
//     }

//     static async build(beerCounter){
//         //get the session of the user logged in
//         const session = await fileClient.checkSession();
//         //make a named node of the session webid of the user
//         const profile = $rdf.sym(session.webId);

//         //get a store of the profile card of the logged in user
//         let storeProfileCard = await this.getUserCard(session);
        
//         //store for the Public Profile Index
//         let ppiObject = await this.getPPILocation(profile, storeProfileCard);

//         //String that shows the location of the public storage of the pod
//         let storagePublic = await this.getStorePublic(profile, storeProfileCard);        

//         //Gets the location for the application or make a new enty in the Public profile index for the application.
//         //also makes an empty file at the application location
//         //string
//         let applicationLocation = await this.getApplicationLocation(ppiObject.ppi , ppiObject.store, storagePublic);

//         //get the application file in store form
//         let appStore = await this.getAppStore(applicationLocation);

//         //make a few example nodes to fill up the file
//         //let newAppFile = await this.addExampleNodes(appStore, applicationLocation);
//         //await fileClient.updateFile(applicationLocation.value, newAppFile);

//         //update the model BeerCounter with data from the file.
//         let map = this.getDatesAndCountsFromStore(appStore);
//         beerCounter.setCountsPerDate(map);

//         return new SolidCommuncator(session.webId, applicationLocation, appStore, beerCounter);
//     }  

//     static async getAppStore(applicationLocation){
//         let appStore = $rdf.graph();
//         let appTTL = await fileClient.fetch(applicationLocation);
//         await $rdf.parse(appTTL, appStore, applicationLocation , "text/turtle");
//         return appStore;
//     }


//    

//     
//     static getDatesAndCountsFromStore(store){
//         let blankNodes = store.each(null , null, BEERCOUNTER('BeerCounterRecord'));
//         let map = new Map();

//         blankNodes.forEach(element => {
//             let value = store.any(element, RDF('value'));
//             let date = store.any(element, TERMS('created'));
//             date = dateToString(new Date(date.value));

//             map.set(date, value.value);
//         });

//         return map;
//     }

//    

//     static async addExampleNodes(appStore, applocation){
//         applocation = $rdf.sym(applocation);
//         let bnode = $rdf.blankNode();
//         let bnode1 = $rdf.blankNode();
//         let bnode2 = $rdf.blankNode();
//         let bnode3 = $rdf.blankNode();

//         appStore.add(applocation, TERMS('references'), bnode);
//         appStore.add(applocation, TERMS('references'), bnode1);
//         appStore.add(applocation, TERMS('references'), bnode2);
//         appStore.add(applocation, TERMS('references'), bnode3);

//         appStore.add(bnode, RDF('type'), BEERCOUNTER('BeerCounterRecord'));
//         appStore.add(bnode, RDF('value'), 4);        
//         appStore.add(bnode, TERMS('created'), stringToDate("17/09/2019"));  

//         appStore.add(bnode1, RDF('type'), BEERCOUNTER('BeerCounterRecord'));
//         appStore.add(bnode1, RDF('value'), 5);        
//         appStore.add(bnode1, TERMS('created'), stringToDate("16/09/2019"));  
        
//         appStore.add(bnode2, RDF('type'), BEERCOUNTER('BeerCounterRecord'));
//         appStore.add(bnode2, RDF('value'), 16);        
//         appStore.add(bnode2, TERMS('created'), stringToDate("15/09/2019"));  

//         appStore.add(bnode3, RDF('type'), BEERCOUNTER('BeerCounterRecord'));
//         appStore.add(bnode3, RDF('value'), 2);
//         appStore.add(bnode3, TERMS('created'), stringToDate("14/09/2019"));  

//         // let query = appStore.each(undefined, undefined, BEERCOUNTER('BeerCounterRecord'));
//         // let query2 = appStore.each(query[0], undefined);

//         let newAppFile = await $rdf.serialize(undefined, appStore,'text/turtle');
//         return newAppFile;
//     }
// }

// function dateToString(date){
//     var dd = String(date.getDate()).padStart(2, '0');
//     var mm = String(date.getMonth() + 1).padStart(2, '0');
//     var yyyy = date.getFullYear();

//     return dd + '/' + mm + '/' + yyyy;
// }

// function stringToDate(dateString){
//     let array = dateString.split('/');
//     let date = new Date(Date.UTC(array[2], array[1] - 1, array[0]));    
//     return date;
// }

// export default SolidCommuncator;