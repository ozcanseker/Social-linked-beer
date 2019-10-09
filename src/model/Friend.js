class Friend {
    constructor(uri, name, pictureurl, applicationFolder, startdate, points){
        this._name = name;
        this._uri = uri;
        this._imageUrl = pictureurl;
        this._applicationFolder = applicationFolder;
        this._startDate = startdate;
        this._points = points;
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
}

export default Friend;