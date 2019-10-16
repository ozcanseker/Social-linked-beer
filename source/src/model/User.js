class User {
    constructor(uri){
        this._uri = uri

        this._name =  this.getUserName(uri);
        this._imageUrl = undefined;
        this._beginDate = undefined;
        this._beerPoints = 0;
        this._checkIns = 0;
        this._beerReviews = 0;
        this._friends = [];
        this._applicationLocation = undefined;
        this._userCheckIns = [];

        //mvc
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

    addCheckIn(){
        this._checkIns++;
        this.upDateSubScribers()

    }

    addBeerReviews(){
        this._beerReviews++;
        this.upDateSubScribers()

    }

    addBeerPoints(amount){
        this._beerPoints += amount;
        this.upDateSubScribers();
    }

    getUserName(uri){
        return  uri.replace("https://", "").replace(/\..*/, "");
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

    addFriends(newFriends){
        this._friends = this._friends.concat(newFriends)
        this.upDateSubScribers();
    }

    addFriend(newFriend){
        this._friends.push(newFriend);
        this.upDateSubScribers();
    }

    setName(name){
        if(name){
            this._name = name;
        }
    }

    setImageUrl(imageUrl){
        this._imageUrl = imageUrl;
    }

    setBeerPoints(beerPoints){
        this._beerPoints = beerPoints;
        this.upDateSubScribers();
    }

    setBeginDate(beginDate){
        this._beginDate = beginDate;
        this.upDateSubScribers();
    }

    setApplicationLocation(applicationLocation){
        this._applicationLocation = applicationLocation;
        this.upDateSubScribers();
    }

    addUserCheckIns(userCheckins){
        this._userCheckIns = userCheckins.concat(this._userCheckIns);
        this.upDateSubScribers();
    }

    getUserCheckIns(){
        return this._userCheckIns;
    }

    getWebId(){
        return this._uri;
    }

    getFriends(){
        return this._friends;
    }

    getFriendFromIndex(index){
        return this._friends[index];
    }

    getBeginDate(){
        return new Date(this._beginDate.getTime());
    }

    getImageUrl(){
        return this._imageUrl;
    }

    getName(){
        return this._name;
    }

    getBeerPoints(){
        return this._beerPoints;
    }

    getApplicationLocation(){
        return this._applicationLocation;
    }
}

export default User;