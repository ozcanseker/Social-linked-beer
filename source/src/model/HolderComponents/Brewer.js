import Observable from "./Observable";

/**
 * This class represents a brewer
 */
class Brewer extends Observable {
    constructor(url, name) {
        super();

        this._ldurl = url;

        if(!name){
            this._name = this._url.replace(/.*[\\/#]/, "");
        }else{
            this._name = name;
        }

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

        this._groep = groep;
        this._url = url;
        this._address = address;
        this._type = type;
        this._categorie = categorie;
        this._jaarproduktie = jaarproduktie;
        this._provincie = provincie;

        if(!name){
            this._name = this._ldurl.replace(/.*[\\/#]/, "");
        }else{
            this._name = name;
        }

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

    getName(){
        return this._name;
    }
}

export default Brewer;