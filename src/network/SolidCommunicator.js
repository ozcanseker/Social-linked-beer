import User from '../model/User'
import Friend from '../model/Friend'
import { buildSolidCommunicator } from './SolidCommunicatorBuilder'
import { preApplicationHandelings } from './PreApplicationHandelings'

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

class SolidCommunicator {
    constructor(user, values){
      this._friendsStore = values.friendsStore;
      this._friendGroup = values.group;
      this._friendsRequested = values.sentGroup;
      
      //user
      this._user = user;
      user.subscribe(this);
    }

    static async build(user){
      let values = await buildSolidCommunicator(user);
      
      user.setName(values.user.name);
      user.setImageUrl(values.user.imageURL);
      user.addFriends(values.user.friends);
      user.setBeerPoints(values.user.points);
      user.setBeginDate(new Date(values.user.startdate));
      user.setApplicationLocation(values.user.applicationLocation + "beerdrinker/");

      await preApplicationHandelings(user.getApplicationLocation(), values.sc);

      //make new solidCommunicator
      let solidCommunicator = new SolidCommunicator(user, values.sc, user);

      return solidCommunicator;
    }  

    async getUserFile(url, callBack){
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

    async inviteUserToSolib(urlInvitee, inbox){
      let graph = rdfLib.graph();
      let blankNode = rdfLib.blankNode();
      
      let fileName =  "Social_Linked_Beer_invation_" + (this._user.getName ? "from_" + this._user.getName() : "")
      let invitation = (this._user.getName() ? this._user.getName() : this._user.getWebId()) + " invites you to drink a beer with him on https://ozcanseker.github.io/Social-linked-beer/ .";
      
      let postLocation = inbox + fileName + ".ttl";

      graph.add(blankNode, RDF('type'), SOLIDLINKEDBEER('Invitation'));
      graph.add(blankNode, SOLIDLINKEDBEER('invitationTo'), rdfLib.sym('https://ozcanseker.github.io/Social-linked-beer/'));
      graph.add(blankNode, SOLIDLINKEDBEER('from'), rdfLib.sym(this._user.getWebId()));
      graph.add(blankNode, SOLIDLINKEDBEER('to'), rdfLib.sym(urlInvitee));
      graph.add(blankNode, SOLIDLINKEDBEER('description'), invitation);

      let invitationTTL = await rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');

      await postSolidFile(inbox, fileName, invitationTTL);
    }

    checkIfUserIsFriend(url){
      let query1 = this._friendsStore.match(this._friendsRequested, VCARD('hasMember'), rdfLib.sym(url));
      let query2 = this._friendsStore.match(this._friendGroup, VCARD('hasMember'), rdfLib.sym(url));

      console.log(query1);
      console.log(query2);

      if(query1.length !== 0 || query2.length !== 0){
        console.log("already friend");
        return true;
      }

      return false;
    }

    async sendFriendshipRequest(urlInvitee, appLocation){
      if(!this.checkIfUserIsFriend(urlInvitee)){
         //make friendrequest
        let graph = rdfLib.graph();
        let blankNode = rdfLib.blankNode();

        let fileNameName =  this._user.getWebId().replace("https://", "").replace(/\/.*/, "");
        
        let fileName =  "Social_Linked_Beer_invation_from_" + fileNameName;
        let invitation = (this._user.getName() ? this._user.getName() : this._user.getWebId()) + " invites you to share your stories with him.";
        
        let postLocation = appLocation + fileName + ".ttl";

        graph.add(blankNode, RDF('type'), SOLIDLINKEDBEER('FriendshipRequest'));
        graph.add(blankNode, SOLIDLINKEDBEER('from'), rdfLib.sym(this._user.getWebId()));
        graph.add(blankNode, SOLIDLINKEDBEER('to'), rdfLib.sym(urlInvitee));
        graph.add(blankNode, SOLIDLINKEDBEER('description'), invitation);

        let invitationTTL = await rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
        let location = appLocation + "beerdrinker/inbox";
        
        //add friend to friend request send
        let friendsFile = this._user.getApplicationLocation() + 'friends.ttl';
        this._friendsStore.add(this._friendsRequested, VCARD('hasMember'), rdfLib.sym(urlInvitee));
        let friendsTTL = await rdfLib.serialize(undefined, this._friendsStore, friendsFile, 'text/turtle');

        // send files
        await postSolidFile(location, fileName, invitationTTL);
        await putSolidFile(friendsFile, friendsTTL);
      }
    }

    async getInboxContents(){
      let inbox = this._user.getApplicationLocation() + "inbox/"
      let res = await fileClient.readFolder(inbox);
      let files = [];
      
      for (let index = 0; index < res.files.length; index++) {
        let file = await this.fetchFile(res.files[index].url);
        files.push(file);
      }   
      
      return files;
    }

    async fetchFile(url){
      let graph = rdfLib.graph();
      let fileTTL = await fileClient.readFile(url);
      
      await rdfLib.parse(fileTTL, graph, url , "text/turtle");

      let blanknode = graph.any(undefined, RDF('type'));

      let type = graph.any(blanknode, RDF('type'));
      let description = graph.any(blanknode, SOLIDLINKEDBEER('description'));
      let from = graph.any(blanknode, SOLIDLINKEDBEER('from'));

      let file = {
        type: type.value.replace(/.*#/, ""),
        from: from.value,
        description: description.value,
        url : url
      }

      return file;
    }

    async declineFriendSchipRequest(message){
      //send a declined friendship request to other pod
      let result = await this.getUserFile(message.from);
      let inbox = result.appLocation + 'beerdrinker/inbox/';

      //get file name and description string
      let fileNameName =  this._user.getWebId().replace("https://", "").replace(/\/.*/, "");
      let fileName =  "Social_Linked_Beer_FriendschipRequestDecline_from_" + fileNameName;
      let invitation = (this._user.getName() ? this._user.getName() : this._user.getWebId()) + " declined your friendship request.";
      
      //get the location is will be posted to
      let postLocation = inbox + fileName + ".ttl";

      //make the graph and nodes
      let graph = rdfLib.graph();
      let blankNode = rdfLib.blankNode();

      graph.add(blankNode, RDF('type'), SOLIDLINKEDBEER('FriendschipRequestDecline'));
      graph.add(blankNode, SOLIDLINKEDBEER('from'), rdfLib.sym(this._user.getWebId()));
      graph.add(blankNode, SOLIDLINKEDBEER('to'), rdfLib.sym(message.from));
      graph.add(blankNode, SOLIDLINKEDBEER('description'), invitation);

      //make a text file and send
      let declineTTL = await rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');
      
      //delete friendship request from own pod
      await postSolidFile(inbox, fileName, declineTTL);
      await fileClient.deleteFile(message.url);
    }

    async acceptFriendSchipRequest(message){
      //get user
      let result = await this.getUserFile(message.from);
      let inbox = result.appLocation + 'beerdrinker/inbox/';

      //add user as friend
      let friendsFile = this._user.getApplicationLocation() + 'friends.ttl';
      
      this._friendsStore.add(this._friendGroup, VCARD('hasMember'), rdfLib.sym(message.from));

      let friendsTTL = await rdfLib.serialize(undefined, this._friendsStore, friendsFile, 'text/turtle');

      //get file name and description string
      let fileNameName =  this._user.getWebId().replace("https://", "").replace(/\/.*/, "");
      let fileName =  "Social_Linked_Beer_FriendschipRequestAccepted_from_" + fileNameName;
      let description = (this._user.getName() ? this._user.getName() : this._user.getWebId()) + " accepted your friendship request.";
      
      //get the location is will be posted to
      let postLocation = inbox + fileName + ".ttl";

      //make the graph and nodes
      let graph = rdfLib.graph();
      let blankNode = rdfLib.blankNode();
 
      graph.add(blankNode, RDF('type'), SOLIDLINKEDBEER('FriendschipRequestAccepted'));
      graph.add(blankNode, SOLIDLINKEDBEER('from'), rdfLib.sym(this._user.getWebId()));
      graph.add(blankNode, SOLIDLINKEDBEER('to'), rdfLib.sym(message.from));
      graph.add(blankNode, SOLIDLINKEDBEER('description'), description);

      //make a text file and send
      let acceptedTTL = await rdfLib.serialize(undefined, graph, postLocation, 'text/turtle');

      //send friendship accepted to user
      await postSolidFile(inbox, fileName, acceptedTTL);
      //delete friendship request from own pod      
      await fileClient.deleteFile(message.url);
      //update FriendsFile
      await putSolidFile(friendsFile, friendsTTL);

      this._user.addFriends(new Friend(message.from, result.name, result.imageUrl, result.appLocation));
    }

    update(){
      console.log("update");
    }
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


      //after this
      //when opening folder pod check inbox and handle messages.
      //  -delete user from friendsrequested if declined
      //  -Add user to FriendsRequested
      //friendspage

export default SolidCommunicator;