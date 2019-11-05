import Observable from "./Observable";

class Beer extends Observable{
    constructor(name, type, style, brewer, location){
        super();

        this._name = name;
        this._type = type;
        this._style = style;
        this._brewer = brewer;
        this._location = location;
    }

    getBrewer(){
        return this._brewer;
    }

    updateInformation(name, type, style, brewer, description, containers){
        this._name = name;
        this._type = type;
        this._style = style;
        this._brewer = brewer;
        this._description = description;
        this._containers = containers;

        this.upDateSubScribers();
    }

    getUrl(){
        return this._location;
    }

    getName(){
        return this._name;
    }
}

export default Beer;