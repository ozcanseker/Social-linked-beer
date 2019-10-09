import AccessError from '../../error/AccessError' 

const rdfLib = require('rdflib');

const ACL = rdfLib.Namespace("http://www.w3.org/ns/auth/acl#");

export function checkacess(storeProfileCard){
    let blankNode = storeProfileCard.any(undefined, ACL('origin'),rdfLib.sym("https://ozcanseker.github.io"));
    let readAcess = storeProfileCard.match(blankNode, ACL('mode'), ACL('Read'));
    let Write = storeProfileCard.match(blankNode, ACL('mode'),ACL('Write'));
    let Append = storeProfileCard.match(blankNode, ACL('mode'),ACL('Append'));
    let Control = storeProfileCard.match(blankNode, ACL('mode'),ACL('Control'));

    if(!readAcess.length){
        throw new AccessError();
    }

    if(!Write.length){
        throw new AccessError();
    }

    if(!Append.length){
        throw new AccessError();
    }

    if(!Control.length){
        throw new AccessError();
    }
}