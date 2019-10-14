import { postSolidFile, putSolidFile, getUserFile, fetchFriend } from "./SolidMethods";
import Beer from '../model/Beer'
import { buildSolidCommunicator } from './solidCommunicatorInits/SolidCommunicatorBuilder'
import { preApplicationHandelings } from './solidCommunicatorInits/PreApplicationHandelings'
import { getInviteToLSBInvitation, getDeclineFriendshipRequest, getFriendShipRequest, getAcceptFriendshipRequest} from './rdf/SolidTtlTemplates'

const fileClient = require('solid-file-client');
const authClient = require('solid-auth-client');
const rdfLib = require('rdflib');

const SOLID = rdfLib.Namespace("http://www.w3.org/ns/solid/terms#");
const PIM = rdfLib.Namespace("http://www.w3.org/ns/pim/space#");
const VCARD = rdfLib.Namespace("http://www.w3.org/2006/vcard/ns#");
const TERMS = rdfLib.Namespace('http://purl.org/dc/terms/');
const RDF = rdfLib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SOLIDLINKEDBEER = rdfLib.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');
const FOAF = rdfLib.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = rdfLib.Namespace('http://www.w3.org/ns/ldp#');
const DBPEDIA = rdfLib.Namespace('http://dbeerpedia.com/def#');
const SCHEMA = rdfLib.Namespace('http://schema.org/');

class SolidCommunicator {
  /**
   * Build the solid communicator
   * @param {*} user 
   */
  static async build(user) {
    let values = await buildSolidCommunicator(user);

    user.setName(values.user.name);
    user.setImageUrl(values.user.imageURL);
    user.addFriends(values.user.friends);
    user.setBeerPoints(values.user.points);
    user.setBeginDate(new Date(values.user.startdate));
    user.setApplicationLocation(values.user.applicationLocation + "beerdrinker/");

    await preApplicationHandelings(user.getApplicationLocation(), values.sc, user);

    //make new solidCommunicator
    let solidCommunicator = new SolidCommunicator(user, values.sc, user);

    return solidCommunicator;
  }

  constructor(user, values) {
    this._friendsStore = values.friendsStore;
    this._friendGroup = values.group;
    this._friendsRequested = values.sentGroup;

    //user
    this._user = user;
  }

  /**
   * Get an user file 
   * @param {*} url 
   */
  async getUserFile(url) {
    return await getUserFile(url);
  }

  /**
   * Check if user is already friend
   * @param {*} url 
   */
  async getInboxContents() {
    let inbox = this._user.getApplicationLocation() + "inbox/"
    let res = await fileClient.readFolder(inbox);
    let files = [];

    for (let index = 0; index < res.files.length; index++) {
      let file = await this.fetchFile(res.files[index].url);
      files.push(file);
    }

    return files;
  }

  async fetchFile(url) {
    let graph = rdfLib.graph();
    let fileTTL = await fileClient.readFile(url);

    await rdfLib.parse(fileTTL, graph, url, "text/turtle");

    let blanknode = graph.any(undefined, RDF('type'));

    let type = graph.any(blanknode, RDF('type'));
    let description = graph.any(blanknode, SOLIDLINKEDBEER('description'));
    let from = graph.any(blanknode, SOLIDLINKEDBEER('from'));

    let file = {
      type: type.value.replace(/.*#/, ""),
      from: from.value,
      description: description.value,
      url: url
    }

    return file;
  }

  checkIfUserIsFriend(url) {
    let query1 = this._friendsStore.match(this._friendsRequested, VCARD('hasMember'), rdfLib.sym(url));
    let query2 = this._friendsStore.match(this._friendGroup, VCARD('hasMember'), rdfLib.sym(url));

    if (query1.length !== 0 || query2.length !== 0) {
      console.log("already friend");
      return true;
    }

    return false;
  }

   /**
   * Send invitation to user for the application
   * @param {*} urlInvitee 
   * @param {*} inbox 
   */
  async inviteUserToSolib(urlInvitee, inbox) {
    //name for file
    let fileName = "Social_Linked_Beer_invation_" + (this._user.getName ? "from_" + this._user.getName() : "")
    let invitation = (this._user.getName() ? this._user.getName() : this._user.getWebId()) + " invites you to drink a beer with him on https://ozcanseker.github.io/Social-linked-beer/ .";

    //name of the location where it will be posted
    let postLocation = inbox + fileName + ".ttl";

    //get ttl file for invitation
    let invitationTTL = getInviteToLSBInvitation(urlInvitee, invitation, postLocation, this._user.getWebId());

    await postSolidFile(inbox, fileName, invitationTTL);
  }

  /**
   * Sends a friendship request to user
   * @param {*} urlInvitee 
   * @param {*} appLocation 
   */
  async sendFriendshipRequest(urlInvitee, appLocation) {
    if (!this.checkIfUserIsFriend(urlInvitee)) {
      //get url without https and profile card.me
      let fileNameName = this._user.getWebId().replace("https://", "").replace(/\/.*/, "");

      //make a file name
      let fileName = "Social_Linked_Beer_invation_from_" + fileNameName;

      //the invitation
      let invitation = (this._user.getName() ? this._user.getName() : this._user.getWebId()) + " invites you to share your stories with him.";
      
      //locations to be posted
      let location = appLocation + "beerdrinker/inbox";
      let postLocation = location + fileName + ".ttl";

      //the ttl file
      let invitationTTL = getFriendShipRequest(urlInvitee, invitation, postLocation, this._user.getWebId());

      //add friend to friend request send
      let friendsFile = this._user.getApplicationLocation() + 'friends.ttl';
      this._friendsStore.add(this._friendsRequested, VCARD('hasMember'), rdfLib.sym(urlInvitee));
      let friendsTTL = await rdfLib.serialize(undefined, this._friendsStore, friendsFile, 'text/turtle');

      // send files
      await postSolidFile(location, fileName, invitationTTL);
      await putSolidFile(friendsFile, friendsTTL);
    }
  }

  async declineFriendSchipRequest(message) {
    //send a declined friendship request to other pod
    let result = await this.getUserFile(message.from);
    let inbox = result.appLocation + 'beerdrinker/inbox/';

    //get file name and description string
    let fileNameName = this._user.getWebId().replace("https://", "").replace(/\/.*/, "");
    let fileName = "Social_Linked_Beer_FriendschipRequestDecline_from_" + fileNameName;
    let invitation = (this._user.getName() ? this._user.getName() : this._user.getWebId()) + " declined your friendship request.";

    //get the location is will be posted to
    let postLocation = inbox + fileName + ".ttl";

    //make a text file and send
    let declineTTL = getDeclineFriendshipRequest(message.from, invitation, postLocation, this._user.getWebId());

    //delete friendship request from own pod
    await postSolidFile(inbox, fileName, declineTTL);
    await fileClient.deleteFile(message.url);
  }

  async acceptFriendSchipRequest(message) {
    //get user
    let friend = await fetchFriend(message.from);
    let inbox = friend.getApplocation() + 'beerdrinker/inbox/';

    //add user as friend
    let friendsFile = this._user.getApplicationLocation() + 'friends.ttl';
    this._friendsStore.add(this._friendGroup, VCARD('hasMember'), rdfLib.sym(message.from));
    let friendsTTL = await rdfLib.serialize(undefined, this._friendsStore, friendsFile, 'text/turtle');

    //get file name and description string
    let fileNameName = this._user.getWebId().replace("https://", "").replace(/\/.*/, "");
    let fileName = "Social_Linked_Beer_FriendschipRequestAccepted_from_" + fileNameName;
    let description = (this._user.getName() ? this._user.getName() : this._user.getWebId()) + " accepted your friendship request.";

    //get the location is will be posted to
    let postLocation = inbox + fileName + ".ttl";
    
    //make a text file and send
    let acceptedTTL = getAcceptFriendshipRequest(message.from, description, postLocation, this._user.getWebId());

    //send friendship accepted to user
    await postSolidFile(inbox, fileName, acceptedTTL);
    //delete friendship request from own pod      
    await fileClient.deleteFile(message.url);
    //update FriendsFile
    await putSolidFile(friendsFile, friendsTTL);

    this._user.addFriends(friend);
  }

  async fetchBeerData() {
    let url = "https://testbrouwer.inrupt.net/public/brewerInformation/beers/beersIndex.ttl";
    let beersIndexTTl = await fileClient.readFile(url);
    
    let graph = rdfLib.graph();
    rdfLib.parse(beersIndexTTl, graph, url, "text/turtle");

    let query = graph.each(undefined, RDF('type') ,SOLIDLINKEDBEER('Beer'));
    let beers = []; 
    query.forEach(blankNode => {
      let brewer = graph.any(blankNode, SOLIDLINKEDBEER('brewedBy'));
      let type = graph.any(blankNode, SOLIDLINKEDBEER('type'));
      let name = graph.any(blankNode, SCHEMA('name'));
      let style = graph.any(blankNode, SOLIDLINKEDBEER('style'));
      let location = graph.any(blankNode, SOLID('instance'));
      
      beers.push(new Beer(name.value, type.value, style.value, brewer.value, location.value));
    })

    return beers;
  }

  async fetchBeer(url, beer) {
    let beerTTl = await fileClient.readFile(url);
    
    let graph = rdfLib.graph();
    rdfLib.parse(beerTTl, graph, url, "text/turtle");
    
    let blankNode = graph.any(undefined, SOLIDLINKEDBEER('beerDescription'));

    let brewer = graph.any(blankNode, SOLIDLINKEDBEER('brewedBy'));
    let type = graph.any(blankNode, SOLIDLINKEDBEER('type'));
    let name = graph.any(blankNode, SCHEMA('name'));
    let style = graph.any(blankNode, SOLIDLINKEDBEER('style'));
    let description = graph.any(blankNode, SOLIDLINKEDBEER('beerDescription'));
    let containers= [];
    graph.each(blankNode, SOLIDLINKEDBEER('container')).forEach(container => {
      containers.push(container.value);
    });
    
    beer.updateInformation(name.value, type.value, style.value, brewer.value, description.value, containers);
    return beer;
  }

}

export default SolidCommunicator;