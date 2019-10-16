class BeerCheckIn {
    constructor(fileLocation, userWebId, userName, beerLocation, beerName, checkInTime, rating, review){
        this._fileLocation = fileLocation;
        this._type  = rating? "BeerReview" : "BeerCheckIn";
        this._userWebId = userWebId;
        this._userName = userName;
        this._beerLocation = beerLocation;
        this._beerName = beerName;
        this._checkInTime = checkInTime;
        this._rating = rating;
        this._review = review;
    }
}

export default BeerCheckIn;