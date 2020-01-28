import CheckInHandler from "./CheckInHandler";
import Observable from "./Observable";

/**
 * This class represents a Group
 */
class Group extends Observable{
    constructor(url, createdByMe){
        super();

        this._url = url;
        this._name = url;

        this._createdByMe = createdByMe;
        this._checkInHandler = new CheckInHandler();
        this._checkInHandler.subscribe(this);

        this._groupLeader = undefined;
        this._members = [];
    }

    setProperties(naam, checkInsLocation, groupDataLocation, groupCheckInIndex, groupLeader, groupMembers){
        this._name = naam;
        this._checkInsLocation = checkInsLocation;
        this._groupDataLocation = groupDataLocation;
        this._groupLeader = groupLeader;
        this._members = groupMembers;
        this._groupCheckInIndex = groupCheckInIndex;

        this.updateSubscribers();
    }

    addMembers(members){
        this._members = this._members.concat(members);
        this.updateSubscribers();
    }

    getMembers(){
        return this._members;
    }

    getGroupCheckInIndex(){
        return this._groupCheckInIndex;
    }

    getLeader(){
        return this._groupLeader;
    }

    setUrl(url){
        this._url = url;
        this.updateSubscribers();
    }

    getCheckInHandler(){
        return this._checkInHandler;
    }

    getName(){
        return this._name;
    }

    getUrl(){
        return this._url;
    }

    getCheckInLocation(){
        return this._checkInsLocation;
    }

    getGroupDataFile(){
        return this._groupDataLocation;
    }

    clearAll(){
        this._checkInHandler.clearAll();
    }

    update(){
        this.updateSubscribers();
    }
}

export default Group;