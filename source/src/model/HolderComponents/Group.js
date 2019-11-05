import CheckInHandler from "./CheckInHandler";
import Observable from "./Observable";

class Group extends Observable{
    constructor(url, checkInsLocation, groupDataLocation, createdByMe){
        super();

        this._url = url;
        this._name = url;
        this._checkInsLocation = checkInsLocation;
        this._groupDataLocation = groupDataLocation;

        this._createdByMe = createdByMe;

        this._checkInHandler = new CheckInHandler();
    }

    setName(naam){
        this._name = naam;
        this.upDateSubScribers();
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
        this.upDateSubScribers();
    }
}

export default Group;