class User {
    constructor(uri){
        this._uri = uri

        this._name = undefined;
        this._imageUrl = undefined;
        this._beginDate = undefined;
        this._beerPoints = 0;
        this._friends = [];
        this._applicationLocation = undefined;

        //mvc
        this._subscribers = [];
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
        this._friends.concat(newFriends)
        this.upDateSubScribers();
    }

    setName(name){
        this._name = name;
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
        return  new Date(this._beginDate.getTime());
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