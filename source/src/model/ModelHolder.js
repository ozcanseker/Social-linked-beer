import CheckInHandler from "./HolderComponents/CheckInHandler";
import User from "./HolderComponents/User";
import Observable from "./HolderComponents/Observable";

class ModelHolder extends Observable{
    constructor(){
        super();
        this._user = new User("");
        this._checkInHandler = new CheckInHandler();
        this._friends = [];

        this._brewer = undefined;
        this._slectedBeer = undefined;

        this._beers = [];
        this._groups = [];

        this._checkInHandler.subscribe(this);
        this._user.subscribe(this);
    }

    addFriends(newFriends){
        newFriends.forEach(res => {
            res.subscribe(this);
        })

        this._friends = this._friends.concat(newFriends)
        this.upDateSubScribers();
    }

    addFriend(newFriend){
        newFriend.subscribe(this);
        this._friends.push(newFriend);
        this.upDateSubScribers();
    }

    getFriendFromIndex(index){
        return this._friends[index];
    }

    getFriends(){
        return this._friends;
    }

    clearAll(){
        this._user.unsubscribe(this);
        this._checkInHandler.unsubscribe(this);
        this._checkInHandler.clearAll();

        if(this._slectedBeer){
            this._slectedBeer.unsubscribe(this);
        }

        if(this._brewer){
            this._brewer.unsubscribe(this);
        }

        this._friends.forEach(res => {
            res.unsubscribe(this);
            res.clearAll();
        });

        this._groups.forEach(res => {
            res.unsubscribe(this);
        });

        this._beers.forEach(res => {
            res.unsubscribe(this);
        });

        this._user = new User("");
        this._checkInHandler = new CheckInHandler();
        this._friends = [];
        this._groups = [];
        this._beers = [];
        this._brewer = undefined;
        this._slectedBeer = undefined;
    }

    getUser(){
        return this._user;
    }

    getCheckInHandler(){
        return this._checkInHandler;
    }

    setGroups(groups){
        this._groups.forEach(res => {
            res.unsubscribe(this);
        })

        this._groups = groups;

        this._groups.forEach(res => {
            res.subscribe(this);
        })

        this.upDateSubScribers();
    }

    getGroups(){
        return this._groups;
    }

    getBrewer(){
        return this._brewer;
    }

    setBrewer(brewer){
        if(this._brewer){
            this._brewer.unsubscribe();
        }

        this._brewer = brewer;
        this._brewer.subscribe(this);
    }

    getBeers(){
        return this._beers;
    }

    setBeers(beers){
        this._beers = beers;
        this.upDateSubScribers();
    }

    getBeer(){
        return this._slectedBeer;
    }

    setBeer(beer){
        if(this._slectedBeer){
            this.unsubscribe(this)
        }

        this._slectedBeer = beer;
        beer.subscribe(this);

        this.upDateSubScribers();
    }

    update(){
        this.upDateSubScribers();
    }
}

export default ModelHolder;