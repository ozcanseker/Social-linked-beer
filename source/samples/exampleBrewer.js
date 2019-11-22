const rdfLib = require('rdflib');

const SOLID = rdfLib.Namespace( "http://www.w3.org/ns/solid/terms#");
const PIM = rdfLib.Namespace("http://www.w3.org/ns/pim/space#");
const VCARD = rdfLib.Namespace("http://www.w3.org/2006/vcard/ns#");
const TERMS = rdfLib.Namespace('http://purl.org/dc/terms/');
const RDF = rdfLib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SOLIDLINKEDBEER = rdfLib.Namespace('https://ozcanseker.inrupt.net/solidlinkedbeer#');
const FOAF = rdfLib.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = rdfLib.Namespace('http://www.w3.org/ns/ldp#');
const DBPEDIA = rdfLib.Namespace('http://dbeerpedia.com/def#');
const SCHEMA = rdfLib.Namespace('http://schema.org/');


let biertestbierbrouwer = {
    "name": "Examplebrewer",
	"categorie": "Brouwerijhuurder",
	"groep": "Onafhankelijk",
	"opgericht": "2019",
	"provincie": "Gelderland",
	"kvk": "00000001",
	"telefoon": "06-00000001",
	"url": "http://www.test.nl",
	"email": "test@test.nl",
	"owners": ["Test brewer1", "Test brewer2"],
	"postaddress": {
		"street": "teststraat 1",
		"postcode": "9999 TT",
		"city": "Apeldoorn",
    }
};

let blankNode = rdfLib.blankNode();
let graph = rdfLib.graph();

graph.add(blankNode, RDF('type'), FOAF('Organization'));
graph.add(blankNode, FOAF("name"), biertestbierbrouwer.name)
graph.add(blankNode, DBPEDIA("groep"), biertestbierbrouwer.groep)
graph.add(blankNode, DBPEDIA("opgericht"), biertestbierbrouwer.opgericht)
graph.add(blankNode, DBPEDIA("owners"), biertestbierbrouwer.owners[0])
graph.add(blankNode, DBPEDIA("owners"), biertestbierbrouwer.owners[1])
graph.add(blankNode, DBPEDIA("provincie"), biertestbierbrouwer.provincie)
graph.add(blankNode, DBPEDIA("groep"), biertestbierbrouwer.groep)
graph.add(blankNode, SCHEMA("email"), biertestbierbrouwer.email)
graph.add(blankNode, SCHEMA("name"), biertestbierbrouwer.name)
graph.add(blankNode, SCHEMA("taxID"), biertestbierbrouwer.kvk)
graph.add(blankNode, SCHEMA("telephone"), biertestbierbrouwer.telefoon)
graph.add(blankNode, SCHEMA("url"), biertestbierbrouwer.url)

let blankNodeAdress = rdfLib.blankNode();
graph.add(blankNode, SCHEMA("address"), blankNodeAdress)
graph.add(blankNodeAdress, SCHEMA("postalCode"), biertestbierbrouwer.postaddress.postcode);
graph.add(blankNodeAdress, SCHEMA("streetAddress"), biertestbierbrouwer.postaddress.street);
graph.add(blankNodeAdress, SCHEMA("addressRegion"), biertestbierbrouwer.provincie);
graph.add(blankNodeAdress, SCHEMA("addressLocality"), biertestbierbrouwer.postaddress.city);

let ttl =  rdfLib.serialize(undefined, graph, "https://testbrouwer.inrupt.net/public/brewerInformation/brewerinfromation.ttl", 'text/turtle');

let beergraph1 = rdfLib.graph();
let beergraph2 = rdfLib.graph();
let beergraph3 = rdfLib.graph();

let beerBlanknode1 = rdfLib.blankNode();
let beerBlanknode2 = rdfLib.blankNode();
let beerBlanknode3 = rdfLib.blankNode();

beergraph1.add(beerBlanknode1, RDF('type'), SOLIDLINKEDBEER('Beer'));
beergraph1.add(beerBlanknode1, SOLIDLINKEDBEER('brewedBy'), rdfLib.sym("https://testbrouwer.inrupt.net/public/brewerInformation/brewerinfromation.ttl"));
beergraph1.add(beerBlanknode1, SOLIDLINKEDBEER('type'), SOLIDLINKEDBEER('Lager'));
beergraph1.add(beerBlanknode1, SCHEMA('name'), SOLIDLINKEDBEER('TestLager'));
beergraph1.add(beerBlanknode1, SOLIDLINKEDBEER('style'), SOLIDLINKEDBEER('Golden'));
beergraph1.add(beerBlanknode1, SOLIDLINKEDBEER('container'), SOLIDLINKEDBEER('Can'));
beergraph1.add(beerBlanknode1, SOLIDLINKEDBEER('beerDescription'), 'This is a Test lager');

let ttlb1 =  rdfLib.serialize(undefined, beergraph1, "https://testbrouwer.inrupt.net/public/brewerInformation/beers/testBeer1.ttl", 'text/turtle');
// console.log(ttlb1);


beergraph2.add(beerBlanknode2, RDF('type'), SOLIDLINKEDBEER('Beer'));
beergraph2.add(beerBlanknode2, SOLIDLINKEDBEER('brewedBy'), rdfLib.sym("https://testbrouwer.inrupt.net/public/brewerInformation/brewerinfromation.ttl"));
beergraph2.add(beerBlanknode2, SOLIDLINKEDBEER('type'), SOLIDLINKEDBEER('Malt'));
beergraph2.add(beerBlanknode2, SCHEMA('name'), SOLIDLINKEDBEER('TestMalt'));
beergraph2.add(beerBlanknode2, SOLIDLINKEDBEER('style'), SOLIDLINKEDBEER('Golden'));
beergraph2.add(beerBlanknode2, SOLIDLINKEDBEER('container'), SOLIDLINKEDBEER('Can'));
beergraph2.add(beerBlanknode2, SOLIDLINKEDBEER('beerDescription'), 'This is a Malt lager');

let ttlb2 =  rdfLib.serialize(undefined, beergraph2, "https://testbrouwer.inrupt.net/public/brewerInformation/beers/testBeer2.ttl", 'text/turtle');
// console.log(ttlb2);

beergraph3.add(beerBlanknode3, RDF('type'), SOLIDLINKEDBEER('Beer'));
beergraph3.add(beerBlanknode3, SOLIDLINKEDBEER('brewedBy'), rdfLib.sym("https://testbrouwer.inrupt.net/public/brewerInformation/brewerinfromation.ttl"));
beergraph3.add(beerBlanknode3, SOLIDLINKEDBEER('type'), SOLIDLINKEDBEER('Ale'));
beergraph3.add(beerBlanknode3, SCHEMA('name'), SOLIDLINKEDBEER('TestStout'));
beergraph3.add(beerBlanknode3, SOLIDLINKEDBEER('style'), SOLIDLINKEDBEER('Amber'));
beergraph3.add(beerBlanknode3, SOLIDLINKEDBEER('container'), SOLIDLINKEDBEER('Can'));
beergraph3.add(beerBlanknode3, SOLIDLINKEDBEER('container'), SOLIDLINKEDBEER('Bottle'));
beergraph3.add(beerBlanknode3, SOLIDLINKEDBEER('beerDescription'), 'This is a Test Ale');

let ttlb3 =  rdfLib.serialize(undefined, beergraph3, "https://testbrouwer.inrupt.net/public/brewerInformation/beers/testBeer3.ttl", 'text/turtle');

let indexGraph = rdfLib.graph();

let node1 =  rdfLib.sym("https://testbrouwer.inrupt.net/public/brewerInformation/beers/testBeer1.ttl");
let node2 =  rdfLib.sym("https://testbrouwer.inrupt.net/public/brewerInformation/beers/testBeer2.ttl");
let node3 =  rdfLib.sym("https://testbrouwer.inrupt.net/public/brewerInformation/beers/testBeer3.ttl");

indexGraph.add(beerBlanknode1, RDF('type'), SOLIDLINKEDBEER('Beer'));
indexGraph.add(beerBlanknode1, SOLIDLINKEDBEER('brewedBy'), rdfLib.sym("https://testbrouwer.inrupt.net/public/brewerInformation/brewerinfromation.ttl"));
indexGraph.add(beerBlanknode1, SCHEMA('name'), 'TestStout');
indexGraph.add(beerBlanknode1, SOLIDLINKEDBEER('type'), SOLIDLINKEDBEER('Ale'));
indexGraph.add(beerBlanknode1, SOLIDLINKEDBEER('style'), SOLIDLINKEDBEER('Amber'));
indexGraph.add(beerBlanknode1, SOLID('instance'), node1);

indexGraph.add(beerBlanknode2, RDF('type'), SOLIDLINKEDBEER('Beer'));
indexGraph.add(beerBlanknode2, SOLIDLINKEDBEER('brewedBy'), rdfLib.sym("https://testbrouwer.inrupt.net/public/brewerInformation/brewerinfromation.ttl"));
indexGraph.add(beerBlanknode2, SOLIDLINKEDBEER('type'), SOLIDLINKEDBEER('Malt'));
indexGraph.add(beerBlanknode2, SCHEMA('name'), 'TestMalt');
indexGraph.add(beerBlanknode2, SOLIDLINKEDBEER('style'), SOLIDLINKEDBEER('Golden'));
indexGraph.add(beerBlanknode2, SOLID('instance'), node2);

indexGraph.add(beerBlanknode3, RDF('type'), SOLIDLINKEDBEER('Beer'));
indexGraph.add(beerBlanknode3, SOLIDLINKEDBEER('brewedBy'), rdfLib.sym("https://testbrouwer.inrupt.net/public/brewerInformation/brewerinfromation.ttl"));
indexGraph.add(beerBlanknode3, SOLIDLINKEDBEER('type'), SOLIDLINKEDBEER('Ale'));
indexGraph.add(beerBlanknode3, SCHEMA('name'), 'TestStout');
indexGraph.add(beerBlanknode3, SOLIDLINKEDBEER('style'), SOLIDLINKEDBEER('Amber'));
indexGraph.add(beerBlanknode3, SOLID('instance'), node3);


let ttlIndex =  rdfLib.serialize(undefined, indexGraph, "https://testbrouwer.inrupt.net/public/brewerInformation/beers/beersIndex.ttl", 'text/turtle');

