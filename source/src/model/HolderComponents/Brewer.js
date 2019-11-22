import Observable from "./Observable";

class Brewer extends Observable {
    constructor(url) {
        super();

        this._ldurl = url;
        this._beers = [];
    }

    loadInBrewerInformation(name,
                            groep,
                            url,
                            address,
                            type,
                            categorie,
                            jaarproduktie,
                            provincie) {

        this._name = name;
        this._groep = groep;
        this._url = url;
        this._address = address;
        this._type = type;
        this._categorie = categorie;
        this._jaarproduktie = jaarproduktie;
        this._provincie = provincie;

        this.updateSubscribers();
    }

    getAddressUrl() {
        return this._address;
    }

    addAddressInformation(addressLocality,
                          postalCode,
                          streetAddress) {

        this._addressLocality = addressLocality;
        this._postalCode = postalCode;
        this._streetAddress = streetAddress;

        this.updateSubscribers();
    }

    addBeers(beers) {
        this._beers = this._beers.concat(beers);
        this.updateSubscribers();
    }

    getUrl() {
        return this._ldurl;
    }

    update() {
        this.updateSubscribers();
    }

    getGroep() {
        return this._groep;
    }

    getAddress(){
        return ""
            + (this._streetAddress ? this._streetAddress + ", " : "")
            + (this._addressLocality ? this._addressLocality + ", " : "" )
            + (this._postalCode ? this._postalCode + " " : "");
    }
}

export default Brewer;