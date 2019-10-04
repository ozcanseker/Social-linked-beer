class User {
    constructor(uri){
        this._uri = uri

        //mvc
        this.subscribers = [];
    }

    subscribe(subscriber){
        this.subscribers.push(subscriber);
    }

    getWebId(){
        return this._uri;
    }

    getFriends(){
        return this.friends;
    }

    getFriendFromIndex(index){
        return this.friends[index];
    }
}

export default User;