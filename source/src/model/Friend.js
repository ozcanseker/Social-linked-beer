class Friend {
    constructor(uri, name, pictureurl, applicationFolder, startdate, points){
        this._name = name ? name : this.getUserName(uri);
        this._uri = uri;
        this._imageUrl = pictureurl;
        this._applicationFolder = applicationFolder;
        this._startDate = startdate;
        this._points = points;
        this._userCheckIns = [];
        this._checkIns = 0;
        this._beerReviews = 0;

        this._subscribers = [];
    }

    setBeerReviews(beerReviews){
        this._beerReviews = beerReviews;
        this.upDateSubScribers()

    }

    setCheckIns(checkIns){
        this._checkIns = checkIns;
        this.upDateSubScribers()

    }

    getCheckIns(){
        return this._checkIns;
    }

    getBeerReviews(){
        return this._beerReviews;
    }

    upDateSubScribers(){
        this._subscribers.map(subscriber => subscriber.update());
    }

    subscribe(subscriber){
        this._subscribers.push(subscriber);
    }

    unsubscribe(subscriber){
        this._subscribers.filter(subscriberList  => {
            return subscriberList !== subscriber;
        });
    }

    getUserName(uri){
        return  uri.replace("https://", "").replace(/\..*/, "");
    }

    getApplocation(){
        return this._applicationFolder;
    }

    getUri(){
        return this._uri;
    }

    getImageUrl(){
        return this._imageUrl;
    }

    getName(){
        return this._name;
    }

    getStartDate(){
        //send a copy of the date back and not the date itself
        return new Date(this._startDate.getTime())
    }

    getPoints(){
        return this._points;
    }

    addUserCheckIns(userCheckins){
        this._userCheckIns = userCheckins.concat(this._userCheckIns);
        this.upDateSubScribers();
    }

    getUserCheckIns(){
        return this._userCheckIns;
    }
}

export default Friend;