class Brewer {

    constructor(name, groep, opgericht, owners, provincie, email, taxID, telephone, url, postalCode, streetAddress, addressRegion, addressLocality){
        this._name = name;
        this._groep = groep;
        this._opgericht = opgericht;
        this._owners = owners;
        this._provincie = provincie;
        this._email = email;
        this._taxid = taxID;
        this._telephone = telephone;
        this._url = url;
        this._postalcode = postalCode;
        this._streetAdress = streetAddress;
        this._addressRegion = addressRegion;
        this._addressLocality = addressLocality;
        this._beers = [];
    }

    addBeers(beers){
        this._beers.concat(beers);
    }
}

export default Brewer;