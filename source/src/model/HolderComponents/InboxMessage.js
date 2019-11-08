import Observable from "./Observable";

class InboxMessage extends Observable{
    constructor(uri){
        super();
        this._uri = uri;
        this._type = undefined;
        this._from = undefined;
        this._desc = undefined;
        this._location = undefined;
        this._groupName = undefined;
    }

    setContents(type, from, desc, location, groupName){
        this._type = type;
        this._from = from;
        this._desc = desc;
        this._location = location;
        this._groupName = groupName;
        this.updateSubscribers();
    }

    getUri(){
        return this._uri;
    }

    getFrom(){
        return this._from;
    }

    getType(){
        return this._type;
    }

    getDesc(){
        return this._desc;
    }

    getLocation(){
        return this._location;
    }

    getGroupName(){
        return this._groupName;
    }
}

export default InboxMessage;