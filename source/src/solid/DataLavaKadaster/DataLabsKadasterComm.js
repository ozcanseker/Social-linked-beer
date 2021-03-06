import Beer from "../../model/HolderComponents/Beer";
import Brewer from "../../model/HolderComponents/Brewer";

/**
 * Queries the sparql endpoint for beer information
 * @param query
 * @returns {Promise<[]>}
 */

/**
 * Gets all beer data from the sparql endpoint
 * @param query
 * @returns {Promise<[]>}
 */
export async function getBeerData(query) {
    let res = await queryTriply(getBeerQuery(query));
    res = await res.text();
    res = JSON.parse(res);
    return makeBeerList(res);
}

/**
 * Gets the brewer data from the sparql endpoint
 * @param brewer
 * @returns {Promise<void>}
 */
export async function getBrewerData(brewer) {
    getRegularBrewerData(brewer);
    getBrewerBeers(brewer);
}

/**
 * Gets information about the brewer
 * @param brewer
 * @returns {Promise<void>}
 */
async function getRegularBrewerData(brewer) {
    let res = await queryTriply(getPredicateObject(brewer.getUrl()));
    res = await res.text();
    res = JSON.parse(res);

    let name,
        groep,
        url,
        address,
        type,
        categorie,
        jaarproduktie,
        provincie;

    res = res.results.bindings;

    res.forEach((res) => {
        let pred = res.pred.value;
        let value = res.obj.value;

        if (pred === 'https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/groep') {
            groep = value;
        } else if (pred === "http://schema.org/address") {
            address = value;
        } else if (pred === "http://schema.org/url") {
            url = value;
        } else if (pred === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
            type = value;
        } else if (pred === "http://www.w3.org/2000/01/rdf-schema#label") {
            name = value;
        } else if (pred === "https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/categorie") {
            categorie = value;
        } else if (pred === "https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/jaarproduktie") {
            jaarproduktie = value;
        } else if (pred === "https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/provincie") {
            provincie = value;
        } else if (pred === "https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/address") {
            if (!address) {
                address = value;
            }
        }
    });

    brewer.loadInBrewerInformation(name,
        groep,
        url,
        address,
        type,
        categorie,
        jaarproduktie,
        provincie);

    getAddress(brewer);

    console.log(brewer);
}

/**
 * Gets the address of the brewer
 * @param brewer
 * @returns {Promise<void>}
 */
async function getAddress(brewer) {
    let res = await queryTriply(getPredicateObject(brewer.getAddressUrl()));
    res = await res.text();
    res = JSON.parse(res);
    res = res.results.bindings;

    let addressLocality,
        postalCode,
        streetAddress;

    res.forEach((res) => {
        let pred = res.pred.value;
        let value = res.obj.value;

        if (pred === "http://schema.org/addressLocality") {
            addressLocality = value;
        } else if (pred === "http://schema.org/postalCode") {
            postalCode = value;
        } else if (pred === "http://schema.org/streetAddress") {
            streetAddress = value;
        }
    });

    brewer.addAddressInformation(
        addressLocality,
        postalCode,
        streetAddress
    );
}

/**
 * Get all beers of the brewer
 * @param brewer
 * @returns {Promise<void>}
 */
async function getBrewerBeers(brewer) {
    let res = await queryTriply(getBrewerBeersQuery(brewer.getUrl()));
    res = await res.text();
    res = JSON.parse(res);

    let beers = makeBeerList(res);
    brewer.addBeers(beers);
}

/**
 * Fetch the details of the beer
 * @param beer
 * @returns {Promise<void>}
 */
export async function fetchBeerData(beer) {
    let res = await queryTriply(getBeerDataQuery(beer.getUrl()));
    res = await res.text();
    res = JSON.parse(res);

    let results = res.results.bindings;
    let type,
        label,
        description,
        alcoholpercentage,
        style,
        minSchenkTemperatuur,
        stamwortgehalte,
        maxSchenkTemperatuur,
        depiction;

    let brewer = [];

    results.forEach(res => {
        let obj = res.pred.value;
        let value = res.obj.value;


        if ("http://www.w3.org/1999/02/22-rdf-syntax-ns#type" === obj) {
            type = value;
        } else if ("http://www.w3.org/2000/01/rdf-schema#label" === obj) {
            label = value;
        } else if ("http://purl.org/dc/terms/description" === obj) {
            description = value;
        } else if ("https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/alcoholpercentage" === obj) {
            alcoholpercentage = value;
        } else if ("https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/maxSchenkTemperatuur" === obj) {
            maxSchenkTemperatuur = value;
        } else if ("https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/minSchenkTemperatuur" === obj) {
            minSchenkTemperatuur = value;
        } else if ("https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/stamwortgehalte" === obj) {
            stamwortgehalte = value;
        } else if ("https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/style" === obj) {
            style = value;
        } else if ("http://xmlns.com/foaf/0.1/depiction" === obj) {
            depiction = value;
        } else if("https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/brewedby"  === obj){
            brewer.push(new Brewer(value, res.brouwerijnaam.value));
        }
    });

    beer.updateInformation(type,
        label,
        description,
        alcoholpercentage,
        style,
        minSchenkTemperatuur,
        stamwortgehalte,
        maxSchenkTemperatuur,
        depiction,
        brewer);
}

function makeBeerList(data) {
    let beers = [];
    data = data.results.bindings;

    data.forEach(res => {
        beers.push(new Beer(res.blyat.value, res.name.value));
    });

    return beers;
}

async function queryTriply(query) {
    return await fetch("https://api.labs.kadaster.nl/datasets/dbeerpedia/dbeerpedia/services/dbeerpedia/sparql", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    });
}

function getBrewerBeersQuery(brewerUrl){
    return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX vocab: <https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/>

    SELECT * WHERE {
        ?blyat vocab:brewedby <${brewerUrl}>;
        vocab:beerName ?name.
    }`;
}


function getBeerQuery(name) {
    return `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX vocab: <https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/>
            
            SELECT distinct ?blyat ?name ?brewer WHERE {
              ?blyat a vocab:Beer;
              vocab:beerName ?name.
              
              FILTER(regex(?name, "${name}", "i"))
            } limit 200
`
}

function getPredicateObject(url) {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT * WHERE {
            <${url}> ?pred ?obj .
        }
`;
}

function getBeerDataQuery(url) {
    return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX bier: <https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/id/bier/>
    PREFIX vocab: <https://data.labs.kadaster.nl/dbeerpedia/dbeerpedia/vocab/>

    SELECT ?pred ?obj ?brouwerijnaam {
        <${url}> ?pred ?obj.
        OPTIONAL{?obj rdfs:label ?label}
        bind(
            IF(?pred = vocab:brewedby,
                IF(?label, ?label, replace(str(?obj), ".*[\\\\/#]", "")), "")
            as ?brouwerijnaam)
        }
    `;
}