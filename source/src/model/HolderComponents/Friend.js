import Observable from "./Observable";

class Friend extends Observable{
    constructor(uri){
        super();
        this._profileUri = uri;

        this._name = undefined;
        this._imageUrl = undefined;
        this._beerDrinkerFolder = undefined;
        this._startDate = undefined;
        this._points = undefined;

        this._userCheckIns = [];
        this._checkIns = 0;
        this._beerReviews = 0;
    }

    setUserDetails(name, pictureurl, beerDrinkerFolder){
        this._name = name ? name : this.getUserName(this._profileUri);

        this._imageUrl = pictureurl;
        this._beerDrinkerFolder = beerDrinkerFolder;


        this.upDateSubScribers();
    }

    setAppData(startdate, points){
        this._startDate = startdate;
        this._points = points;

        this.upDateSubScribers();
    }

    setCheckInData(beerReviews, checkIns, userCheckins){
        this._beerReviews = beerReviews;
        this._checkIns = checkIns;
        this._userCheckIns = userCheckins.concat(this._userCheckIns);

        this.upDateSubScribers();
    }

    getCheckIns(){
        return this._checkIns;
    }

    getBeerReviews(){
        return this._beerReviews;
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

    getPoints(){
        return this._points;
    }

    getUserCheckIns(){
        return this._userCheckIns;
    }
}

export default Friend;