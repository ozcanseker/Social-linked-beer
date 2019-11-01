import Observable from "./Observable";

class CheckInHandler extends Observable {
    constructor() {
        super();

        this._checkInsAmount = 0;
        this._beerReviewsAmount = 0;
        this._beerPoints = 0;
        this._userCheckIns = [];
        this._allCheckinsGotten = false;
    }

    setAllCheckInsGotten(bool){
        this._allCheckinsGotten = bool;
    }

    getAllCheckInsGotten(){
        return this._allCheckinsGotten;
    }

    addBeerPoints(amount) {
        this._beerPoints += amount;
        this.upDateSubScribers();
    }

    setBeerPoints(beerPoints) {
        this._beerPoints = beerPoints;
        console.log(beerPoints);
        this.upDateSubScribers();
    }

    getBeerPoints() {
        return this._beerPoints;
    }

    setBeerReviewsAmount(beerReviews) {
        this._beerReviewsAmount = beerReviews;
        this.upDateSubScribers()
    }

    getBeerReviewsAmount() {
        return this._beerReviewsAmount;
    }

    addBeerReviewToAmount() {
        this._beerReviewsAmount++;
        this.upDateSubScribers()
    }

    setCheckInsAmount(checkIns) {
        this._checkInsAmount = checkIns;
        this.upDateSubScribers()
    }

    getCheckInsAmount() {
        return this._checkInsAmount;
    }

    addToCheckInsAmount() {
        this._checkInsAmount++;
        this.upDateSubScribers()
    }

    setUserCheckIns(userCheckins) {
        this._userCheckIns.forEach(res => {
            res.unsubscribe(this);
        })

        userCheckins.forEach(checkIn => {
            checkIn.subscribe(this);
        });

        this._userCheckIns = userCheckins;
        this.upDateSubScribers();
    }

    addUserCheckIns(userCheckins) {
        userCheckins.forEach(checkIn => {
            checkIn.subscribe(this);
        })

        this._userCheckIns = userCheckins.concat(this._userCheckIns);
        this.upDateSubScribers();
    }

    getUserCheckIns() {
        return this._userCheckIns;
    }

    update() {
        this.upDateSubScribers();
    }
}

export default CheckInHandler;