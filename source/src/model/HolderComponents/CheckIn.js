import Observable from "./Observable";

class CheckIn extends Observable{
    constructor(fileLocation){
        super();
        this._fileLocation = fileLocation;
    }

    getFileLocation(){
        return this._fileLocation;
    }

    loadInAttributes(userWebId, userName, beerLocation, beerName, checkInTime, rating, review){
        this._type  = rating? "BeerReview" : "BeerCheckIn";
        this._userWebId = userWebId;
        this._userName = userName;
        this._beerLocation = beerLocation;
        this._beerName = beerName;
        this._checkInTime = checkInTime;
        this._rating = rating;
        this._review = review;

        this.updateSubscribers();
    }
}

export default CheckIn;