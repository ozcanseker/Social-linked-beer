class Beer {
    constructor(name, type, style, brewer, location){
        this._name = name;
        this._type = type;
        this._style = style;
        this._brewer = brewer;
        this._location = location;
    }

    updateInformation(name, type, style, brewer, description, containers){
        this._name = name;
        this._type = type;
        this._style = style;
        this._brewer = brewer;
        this._description = description;
        this._containers = containers;
    }
}

export default Beer;