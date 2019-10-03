import User from '../model/User'
import Friend from '../model/Friend'

const fileClient = require('solid-file-client');
const authClient = require('solid-auth-client');
const $rdf = require('rdflib');

const SOLID = $rdf.Namespace( "http://www.w3.org/ns/solid/terms#");
const PIM = $rdf.Namespace("http://www.w3.org/ns/pim/space#");
const VCARD = $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const TERMS = $rdf.Namespace('http://purl.org/dc/terms/');
const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SOLIDLINKEDBEER = $rdf.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

class SolidCommunicator {
    constructor(user){
        this.user = user;
        user.subscribe(this);
    }

    static async build(){
        //get the session of the user logged in
        const session = await fileClient.checkSession();
        //make a named node of the session webid of the user
        const profile = $rdf.sym(session.webId);

        //get a store of the profile card of the logged in user
        let storeProfileCard = await this.getUserCard(session);
        
        //store for the Public Profile Index
        let ppiObject = await this.getPPILocation(profile, storeProfileCard);

        //String that shows the location of the public storage of the pod
        let storagePublic = await this.getStorePublic(profile, storeProfileCard);     

        //locatie voor de applicatie
        let applicationLocation = await this.getApplicationLocation(ppiObject.ppi , ppiObject.store, storagePublic);

        let friends = await this.getFriends(applicationLocation);
        let appdata = await this.appData(applicationLocation);

        //make new user
        let user = this.makeUser(profile, storeProfileCard, friends, appdata);
        let solidCommunicator = new SolidCommunicator(user);
        return {user: user, solidCommunicator: solidCommunicator};
    }  

    async getUserFile(url, callBack){
      let userttt = await fileClient.readFile(url);
      let graph = $rdf.graph();

      try{
        $rdf.parse(userttt, graph, url, "text/turtle");

        let query = graph.any(undefined, undefined, FOAF('PersonalProfileDocument'));

        if(query){
          let profile = $rdf.sym(url);
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

    static async appData(url){
      let appdataLocation = url + 'appdata.ttl';

      let appdatattl = await fileClient.readFile(appdataLocation);
      let graph = $rdf.graph();
      $rdf.parse(appdatattl, graph, appdataLocation, "text/turtle");

      let blankNode = graph.any(undefined, SOLIDLINKEDBEER('startdate'));

      let startdate = graph.any(blankNode, SOLIDLINKEDBEER('startdate'));
      let points = graph.any(blankNode, SOLIDLINKEDBEER('points'));
      
      return {startdate: startdate.value, points: points.value}
    }

    static async getFriends(applicationLocation){
      let friendsLocation = applicationLocation + "friends.ttl";
      let ttlFriends = await fileClient.readFile(friendsLocation);
      let group = $rdf.sym(friendsLocation + "#Friends");

      let friends = [];

      let graph = $rdf.graph();
      $rdf.parse(ttlFriends, graph, friendsLocation, "text/turtle");
      graph.add(group, VCARD('hasMember'), $rdf.sym("https://ozcanseker.inrupt.net/profile/card#me"));


      let query = graph.each(group, VCARD('hasMember'), undefined); 

      for (let index = 0; index < query.length; index++) {
        let friend = await this.fetchFriend(query[index]);
        friends.push(friend);
        console.log(friend);
      }

      return friends;
    }

    static async fetchFriend(friendNamedNode){
      let friendttl = await fileClient.readFile(friendNamedNode.value);
      let graph = $rdf.graph();
      $rdf.parse(friendttl, graph, friendNamedNode.value, "text/turtle");

      let nameFN =  graph.any(friendNamedNode, VCARD('fn'));
      let imageURL =  graph.any(friendNamedNode, VCARD('hasPhoto')); 

      nameFN = nameFN ? nameFN.value : undefined;
      imageURL = imageURL ? imageURL.value : undefined;

      return new Friend(friendNamedNode.value, nameFN, imageURL);
    }

    static async getUserCard(session){
        const profileCardTTl = await fileClient.fetch(session.webId); 
        const storeProfileCard = $rdf.graph(); 
        $rdf.parse(profileCardTTl, storeProfileCard, session.webId, "text/turtle");
        return storeProfileCard;
    }
            
    static async getPPILocation(profile, storeProfileCard){
        const publicProfileIndex = storeProfileCard.any(profile, SOLID("publicTypeIndex"));
        const storePublicTypeIndex = $rdf.graph();
        const publicTypeIndexTTL = await fileClient.fetch(publicProfileIndex.value);
        $rdf.parse(publicTypeIndexTTL, storePublicTypeIndex, publicProfileIndex.value, "text/turtle");
        return {store : storePublicTypeIndex, ppi : publicProfileIndex};
    }

    static getStorePublic(profile, storeProfileCard){
        let locationStorage = storeProfileCard.any(profile, PIM("storage"));
        return locationStorage.value + "public/";
    }

    static makeUser(profile, storeProfileCard, friends, appdata){
        let nameFN =  storeProfileCard.any(profile,VCARD('fn'));
        let imageURL =  storeProfileCard.any(profile,VCARD('hasPhoto')); 

        nameFN = nameFN ? nameFN.value : undefined;
        imageURL = imageURL ? imageURL.value : undefined;

        return new User(profile.value, nameFN, imageURL, friends, appdata.startdate , appdata.points);
    }

    static async getApplicationLocation(publicProfileIndex, storePublicProfileIndex, storagePublic){
        let app = $rdf.sym(publicProfileIndex.value + "#SocialLinkedBeer");
        let appQuery = storePublicProfileIndex.any(app, SOLID("instance"));

        if(!appQuery){
            //make a new entery in the ppi and make a file for you application
            return await this.createAppNodeForPublicTypeIndex(storePublicProfileIndex, publicProfileIndex, storagePublic, app);
        }else{
            //get the applocation
            return appQuery.value;
        }
    }

    static async createAppNodeForPublicTypeIndex(store, publicTypeIndex, publicLocation, app){
        //TODO check if there is a file here otherwise make a new file

        let appLocation = publicLocation + "sociallinkedbeer4/"
        await fileClient.createFolder(appLocation);

        await this.makeAppFolderStructure(appLocation);

        appLocation = $rdf.sym(appLocation);
        
        store.add(publicTypeIndex, TERMS('references'), app);
        store.add(app, RDF('type'), SOLID('TypeRegistration'));
        store.add(app, SOLID('instance'), appLocation);
        
        let newTTLpublicTypeindex = await $rdf.serialize(undefined, store, publicTypeIndex.value, 'text/turtle');

        await fileClient.updateFile(publicTypeIndex.value, newTTLpublicTypeindex, "text/turtle"); 

        return appLocation.value;
    }

    static async makeAppFolderStructure(url){
        let body;

        //top folder
        let aclUri = url + '.acl';

        await fileClient.createFolder(url);
        body = getAclAppFolder();
        await createSolidResource(aclUri, {body});

        //friends
        let groupurlFile = url + 'friends.ttl';
        let groupurl = groupurlFile + "#Friends";

        await fileClient.createFile(groupurlFile, getGroupFile(groupurlFile, groupurl, "text/turtle")); 

        //appData 
        let appDataFile = url + 'appdata.ttl';
        await fileClient.createFile(appDataFile, getAppDataInit(appDataFile), "text/turtle");
        
        //inboxfolder
        let inboxUrl = url + 'inbox/';
        let inboxUrlacl = inboxUrl + '.acl';   
        body = getACLInboxFolder();

        await fileClient.createFolder(inboxUrl);
        await createSolidResource(inboxUrlacl, {body});

        //check in folder        
        let reviewUrl = url + 'checkins/';
        let reviewUrlacl = reviewUrl + '.acl';

        await fileClient.createFolder(reviewUrl);
        body = getACLCheckInFolder();
        await createSolidResource(reviewUrlacl, {body});                  
    }
}

function getGroupFile(url, friendsurl){
    let graph = $rdf.graph();
    
    let guy1 = $rdf.sym("https://ozcanseker.solid.community/profile/card#me");
    let friendsgroup = $rdf.sym(friendsurl);
  
    graph.add(friendsgroup, RDF('type'), VCARD('Group'));
    graph.add(friendsgroup, VCARD('hasUID'), $rdf.sym("urn:uuid:8831CBAD-1111-2222-8563-F0F4787E5398:ABGroup"));

    // graph.add(friendsgroup, VCARD('hasMember'), guy1);
  
    let newTTLpublicTypeindex = $rdf.serialize(undefined, graph, url, 'text/turtle');
    return newTTLpublicTypeindex;
  }

  function getAppDataInit(url){
    let graph = $rdf.graph();
    
    let bn = $rdf.blankNode();

    graph.add(bn, SOLIDLINKEDBEER('startdate'), new Date());
    graph.add(bn, SOLIDLINKEDBEER('points'), 0);
  
    let ttl = $rdf.serialize(undefined, graph, url, 'text/turtle');
    return ttl;
  }
  
  function getACL(){
    return "@prefix : <#>.\n" +
    "@prefix n0: <http://www.w3.org/ns/auth/acl#>.\n" +
    "@prefix c: </profile/card#>.\n" +
    "@prefix c0: <https://ozcanseker.solid.community/profile/card#>.\n" +
    "@prefix n1: <http://xmlns.com/foaf/0.1/>.\n" +
    
    ":ControlReadWrite\n" +
        "a n0:Authorization;\n" +
        "n0:accessTo <test7.ttl>;\n" +
        "n0:agent c:me, c0:me, <https://ozcan.inrupt.net/profile/card#me>;\n" +
        "n0:mode n0:Control, n0:Read, n0:Write.";  
  }
  
  function getAclAppFolder(){
    return "@prefix : <#>.\n" + 
    "@prefix n0: <http://www.w3.org/ns/auth/acl#>.\n" + 
    "@prefix app: <./>.\n" + 
    "@prefix c: </profile/card#>.\n" + 
    
    ":ControlReadWrite\n" + 
        "a n0:Authorization;\n" + 
        "n0:accessTo app:;\n" + 
        "n0:agent c:me;\n" + 
        "n0:default app:;\n" + 
        "n0:mode n0:Control, n0:Read, n0:Write.\n";
  }
  
  function getACLInboxFolder(){
    return "@prefix : <#>.\n" + 
      "@prefix n0: <http://www.w3.org/ns/auth/acl#>.\n" +
      "@prefix inbox: <./>.\n" +
      "@prefix n1: <http://xmlns.com/foaf/0.1/>.\n" +
      "@prefix c: </profile/card#>.\n" +
  
      ":Append\n" +
        "a n0:Authorization;\n" +
        "n0:accessTo inbox:;\n" +
        "n0:agentClass n1:Agent;\n" +
        "n0:default inbox:;\n" +
        "n0:mode n0:Append.\n" +
      ":ControlReadWrite\n" +
        "a n0:Authorization;\n" +
        "n0:accessTo inbox:;\n" +
        "n0:agent c:me;\n" +
        "n0:default inbox:;\n" +
        "n0:mode n0:Control, n0:Read, n0:Write.\n";
  }
  
  function getACLCheckInFolder(){
    return "@prefix : <#>.\n" + 
      "@prefix n0: <http://www.w3.org/ns/auth/acl#>.\n" +
      "@prefix inbox: <./>.\n" +
      "@prefix n1: <http://xmlns.com/foaf/0.1/>.\n" +
      "@prefix c: </profile/card#>.\n" +
  
      ":Append\n" +
        "a n0:Authorization;\n" +
        "n0:accessTo inbox:;\n" +
        "n0:agentClass n1:Agent;\n" +
        "n0:default inbox:;\n" +
        "n0:mode n0:Read.\n" +
      ":ControlReadWrite\n" +
        "a n0:Authorization;\n" +
        "n0:accessTo inbox:;\n" +
        "n0:agent c:me;\n" +
        "n0:default inbox:;\n" +
        "n0:mode n0:Control, n0:Read, n0:Write.\n";
  }
  
  async function createSolidResource(url, options){
      authClient.fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/turtle'
        },
        ...options
  });}

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