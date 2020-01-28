import Observable from "./Observable";

/**
 * This class will hold checkins for different parties
 */
class CheckInHandler extends Observable {
    constructor() {
        super();

        this._checkInsAmount = 0;
        this._beerReviewsAmount = 0;
        this._beerPoints = 0;
        this._userCheckIns = [];
        this._allCheckinsGotten = false;
    }

    setReviesCheckInsAndUserCheckIns(reviews, checkIns, userBeerCheckIns){
        this._beerReviewsAmount = reviews;
        this._checkInsAmount = checkIns;

        userBeerCheckIns.forEach(checkIn => {
            checkIn.subscribe(this);
        });

        this._userCheckIns = userBeerCheckIns;

        this.updateSubscribers();
    }

    setAllCheckInsGotten(bool){
        this._allCheckinsGotten = bool;
    }

    getAllCheckInsGotten(){
        return this._allCheckinsGotten;
    }

    addBeerPoints(amount) {
        this._beerPoints += amount;
        this.updateSubscribers();
    }

    setBeerPoints(beerPoints) {
        this._beerPoints = beerPoints;
        this.updateSubscribers();
    }

    getBeerPoints() {
        return this._beerPoints;
    }

    setBeerReviewsAmount(beerReviews) {
        this._beerReviewsAmount = beerReviews;
        this.updateSubscribers()
    }

    getBeerReviewsAmount() {
        return this._beerReviewsAmount;
    }

    addBeerReviewToAmount() {
        this._beerReviewsAmount++;
        this.updateSubscribers()
    }

    setCheckInsAmount(checkIns) {
        this._checkInsAmount = checkIns;
        this.updateSubscribers()
    }

    getCheckInsAmount() {
        return this._checkInsAmount;
    }

    addToCheckInsAmount() {
        this._checkInsAmount++;
        this.updateSubscribers()
    }

    setUserCheckIns(userCheckins) {
        this._userCheckIns.forEach(res => {
            res.unsubscribe(this);
        });

        userCheckins = userCheckins.userBeerCheckIns;

        userCheckins.forEach(checkIn => {
            checkIn.subscribe(this);
        });

        this._userCheckIns = userCheckins;
        this.updateSubscribers();
    }

    clearAll(){
        this._userCheckIns.forEach(res => {
            res.unsubscribe(this);
        })
    }

    addUserCheckIns(userCheckins) {
        userCheckins.forEach(checkIn => {
            checkIn.subscribe(this);
        })

        this._userCheckIns = userCheckins.concat(this._userCheckIns);
        this.updateSubscribers();
    }

    getUserCheckIns() {
        return this._userCheckIns;
    }

    update() {
        this.updateSubscribers();
    }
}

export default CheckInHandler;