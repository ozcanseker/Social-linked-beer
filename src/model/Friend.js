class Friend {
    constructor(uri, name, pictureurl, applicationFolder){
        this._name = name;
        this.uri = uri;
        this._imageUrl = pictureurl;
        this.applicationFolder = applicationFolder;
    } 

    getImageUrl(){
        return this._imageUrl;
    }

    getName(){
        return this._name;
    }
}

export default Friend;