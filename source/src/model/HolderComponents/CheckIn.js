import Observable from "./Observable";

/**
 * This class represents a check in or a review.
 */
class CheckIn extends Observable{
    constructor(fileLocation){
        super();
        this._fileLocation = fileLocation;
    }

    getFileLocation(){
        return this._fileLocation;
    }

    loadInAttributes(userWebId, userName, beerLocation, beerName, checkInTime, rating, review, liked, amountOfLikes){
        this._type  = rating? "BeerReview" : "BeerCheckIn";
        this._userWebId = userWebId;
        this._userName = userName;
        this._beerLocation = beerLocation;
        this._beerName = beerName;
        this._checkInTime = checkInTime;
        this._rating = rating;
        this._review = review;
        this._liked = liked;
        this._amountOfLikes = amountOfLikes;

        this.updateSubscribers();
    }

    setLikedTrue(){
        this._liked = true;
        this._amountOfLikes++;
        this.updateSubscribers();
    }

    getLiked(){
        return this._liked;
    }

    getAmountOfLiked() {
        return this._amountOfLikes;
    }
}

export default CheckIn;