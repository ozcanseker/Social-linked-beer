class User {
    constructor(uri, name, imageUrl, friends, startDate, beerPoints){
        this.uri = uri
        this.name = name;
        this.imageUrl = imageUrl;

        this.startDate = startDate;
        this.beerPoints = beerPoints;

        this.friends = friends;

        //mvc
        this.subscribers = [];
    }

    subscribe(subscriber){
        this.subscribers.push(subscriber);
    }

    getFriends(){
        return this.friends;
    }

    getFriendFromIndex(index){
        return this.friends[index];
    }
}

export default User;