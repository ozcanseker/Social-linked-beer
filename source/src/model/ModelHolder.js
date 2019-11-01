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
        this._beers = [];

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

    getUser(){
        return this._user;
    }

    getCheckInHandler(){
        return this._checkInHandler;
    }

    getBrewer(){

    }

    getBeers(){

    }

    setBrewer(){

    }

    setBeers(){

    }

    update(){
        this.upDateSubScribers();
    }
}

export default ModelHolder;