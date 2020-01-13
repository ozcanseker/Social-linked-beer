import Observable from "./Observable";

class Beer extends Observable{
    constructor(ldUrl, name){
        super();
        this._ldUrl = ldUrl;
        this._name = name;
        this._brewers = [];
    }

    updateInformation(type,
                      label,
                      description,
                      alcoholpercentage,
                      style,
                      minSchenkTemperatuur,
                      stamwortgehalte,
                      maxSchenkTemperatuur,
                      depiction,
                      brewer){
        this._type = type;
        this._style = style;
        this._label = label;
        this._description = description;
        this._minSchenkTemperatuur = minSchenkTemperatuur;
        this._maxSchenkTemperatuur = maxSchenkTemperatuur;
        this._stamwortgehalte = stamwortgehalte;
        this._alcoholpercentage = alcoholpercentage;

        this._depiction = depiction;
        this._brewers = brewer;

        this.updateSubscribers();
    }

    getUrl(){
        return this._ldUrl;
    }

    getName(){
        return this._name;
    }

    getBrewers(){
        return this._brewers;
    }
}

export default Beer;