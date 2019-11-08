import CheckInHandler from "./HolderComponents/CheckInHandler";
import User from "./HolderComponents/User";
import Observable from "./HolderComponents/Observable";

class ModelHolder extends Observable {
    constructor() {
        super();
        this._user = new User("");
        this._checkInHandler = new CheckInHandler();
        this._friends = [];

        this._brewer = undefined;
        this._slectedBeer = undefined;

        this._beers = [];
        this._groups = [];
        this._inboxMessages = [];

        this._checkInHandler.subscribe(this);
        this._user.subscribe(this);
    }

    setInboxMessages(inboxMessages){
        this._inboxMessages.forEach(res => {
            res.unsubscribe(this);
        });

        this._inboxMessages = inboxMessages;

        this._inboxMessages.forEach(res => {
            res.subscribe(this);
        });
    }

    getInboxMessages(){
        return this._inboxMessages;
    }

    spliceAtIndex(index){
        this._inboxMessages.splice(index, 1);
        this.updateSubscribers();
    }

    addFriends(newFriends) {
        newFriends.forEach(res => {
            res.subscribe(this);
        })

        this._friends = this._friends.concat(newFriends)
        this.updateSubscribers();
    }

    addFriend(newFriend) {
        newFriend.subscribe(this);
        this._friends.push(newFriend);
        this.updateSubscribers();
    }

    getFriendFromIndex(index) {
        return this._friends[index];
    }

    getFriends() {
        return this._friends;
    }

    clearAll() {
        this._user.unsubscribe(this);
        this._checkInHandler.unsubscribe(this);
        this._checkInHandler.clearAll();

        if (this._slectedBeer) {
            this._slectedBeer.unsubscribe(this);
        }

        if (this._brewer) {
            this._brewer.unsubscribe(this);
        }

        this._friends.forEach(res => {
            res.unsubscribe(this);
            res.clearAll();
        });

        this._groups.forEach(res => {
            res.unsubscribe(this);
            res.clearAll();
        });

        this._beers.forEach(res => {
            res.unsubscribe(this);
        });

        this._inboxMessages.forEach(res => {
            res.unsubscribe(this);
        });

        this._user = new User("");
        this._checkInHandler = new CheckInHandler();
        this._friends = [];
        this._groups = [];
        this._beers = [];
        this._inboxMessages = [];
        this._brewer = undefined;
        this._slectedBeer = undefined;
    }

    getUser() {
        return this._user;
    }

    getCheckInHandler() {
        return this._checkInHandler;
    }

    setGroups(groups) {
        this._groups.forEach(res => {
            res.unsubscribe(this);
        })

        this._groups = groups;

        this._groups.forEach(res => {
            res.subscribe(this);
        })

        this.updateSubscribers();
    }

    addGroup(group) {
        this._groups.push(group);
        group.subscribe(this);
        this.updateSubscribers();
    }

    getGroups() {
        return this._groups;
    }

    getBrewer() {
        return this._brewer;
    }

    setBrewer(brewer) {
        if (this._brewer) {
            this._brewer.unsubscribe();
        }

        this._brewer = brewer;
        this._brewer.subscribe(this);
    }

    getBeers() {
        return this._beers;
    }

    setBeers(beers) {
        this._beers = beers;
        this.updateSubscribers();
    }

    getBeer() {
        return this._slectedBeer;
    }

    setBeer(beer) {
        if (this._slectedBeer) {
            this.unsubscribe(this)
        }

        this._slectedBeer = beer;
        beer.subscribe(this);

        this.updateSubscribers();
    }

    update() {
        this.updateSubscribers();
    }

    getFriendFromUri(uri) {
        for (let i = 0; i < this._friends.length; i++) {
            if (this._friends[i].getUri() === uri) {
                return this._friends[i];
            }
        }

        return undefined;
    }

    getGroupFromIndex(index) {
        return this._groups[index];
    }

    getGroupFromCheckInLocationUri(uri){
        for (let i = 0; i < this._groups.length; i++) {
            if (this._groups[i].getCheckInLocation() === uri) {
                return this._groups[i];
            }
        }

        return undefined;
    }
}

export default ModelHolder;