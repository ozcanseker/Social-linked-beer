import Observable from "./Observable";
import CheckInHandler from "./CheckInHandler";

/**
 * This class represents a Friend
 */
class Friend extends Observable{
    constructor(uri){
        super();
        this._profileUri = uri;

        this._name = undefined;
        this._imageUrl = undefined;
        this._beerDrinkerFolder = undefined;
        this._startDate = undefined;

        this._checkInHandler = new CheckInHandler();
        this._checkInHandler.subscribe(this);
    }

    clearAll(){
        this._checkInHandler.unsubscribe(this);
        this._checkInHandler.clearAll();
    }

    setUserDetails(name, pictureurl, beerDrinkerFolder){
        this._name = name ? name : this.getUserName(this._profileUri);

        this._imageUrl = pictureurl;
        this._beerDrinkerFolder = beerDrinkerFolder;


        this.updateSubscribers();
    }

    setAppData(startdate){
        this._startDate = startdate;

        this.updateSubscribers();
    }

    update(){
        this.updateSubscribers();
    }

    getCheckInHandler(){
        return this._checkInHandler;
    }

    getUserName(uri){
        return  uri.replace("https://", "").replace(/\..*/, "");
    }

    getBeerDrinkerFolder(){
        return this._beerDrinkerFolder;
    }

    getUri(){
        return this._profileUri;
    }

    getImageUrl(){
        return this._imageUrl;
    }

    getName(){
        return this._name;
    }

    getStartDate(){
        if(this._startDate){
            //send a copy of the date back and not the date itself
            return new Date(this._startDate.getTime())
        }else{
            return undefined;
        }
    }
}

export default Friend;