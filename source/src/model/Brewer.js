class Brewer {

    constructor(){

    }

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
    graph.add(blankNode, SCHEMA("taxID"), biertestbierbrouwer.kvk)
    graph.add(blankNode, SCHEMA("taxID"), biertestbierbrouwer.kvk)
}

export default Brewer;