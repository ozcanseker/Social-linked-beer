import Observable from "./Observable";

class Brewer extends Observable{
    constructor( url){
        super();

        this._url = url;
        this._beers = [];
    }

    loadInBrewerInformation(name, groep, opgericht, owners, provincie, email, taxID, telephone, postalCode, streetAddress, addressRegion, addressLocality){
        this._name = name;
        this._groep = groep;
        this._opgericht = opgericht;
        this._owners = owners;
        this._provincie = provincie;
        this._email = email;
        this._taxid = taxID;
        this._telephone = telephone;
        this._postalcode = postalCode;
        this._streetAdress = streetAddress;
        this._addressRegion = addressRegion;
        this._addressLocality = addressLocality;

        this.updateSubscribers();
    }

    addBeers(beers){
        this._beers = this._beers.concat(beers);
        this.updateSubscribers();
    }

    getUrl(){
        return this._url;
    }

    update(){
        this.updateSubscribers();
    }

    getGroep(){
        return this._groep;
    }
}

export default Brewer;