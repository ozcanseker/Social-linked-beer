import Observable from "./Observable";

class User extends Observable{
    constructor(uri){
        super();
        this._uri = uri
        this._name =  this.getUserName(uri);
        this._imageUrl = undefined;
        this._startDate = undefined;
        this._appFolder = undefined;
        this._beerDrinkerFoler = undefined;
        this._checkInFolder = undefined;
    }

    setUri(uri){
        this._uri = uri;

        if(!this._name){
            this._name = this.getUserName(uri);
        }

        this.updateSubscribers();
    }

    loadInUserValues(name, imageURL, appFolder,beerDrinkerFolder, checkInFolder){
        if(name){
            this._name = name;
        }

        this._imageUrl = imageURL;
        this._appFolder = appFolder;
        this._beerDrinkerFoler = beerDrinkerFolder;
        this._checkInFolder = checkInFolder;

        this.updateSubscribers();
    }

    loadInAppData(startDate){
        this._startDate = startDate;

        this.updateSubscribers();
    }

    getUri(){
        return this._uri;
    }

    getUserName(uri){
        return  uri.replace("https://", "").replace(/\..*/, "");
    }

    getAppFolder(){
        return this._appFolder;
    }

    getName(){
        return this._name;
    }

    getBeginDate(){
        if(this._startDate){
            return new Date(this._startDate.getTime());
        }else {
            return undefined;
        }
    }

    getImageUrl(){
        return this._imageUrl;
    }

    getBeerDrinkerFolder(){
        return this._beerDrinkerFoler;
    }

    getCheckInLocation(){
        return this._checkInFolder;
    }
}

export default User;