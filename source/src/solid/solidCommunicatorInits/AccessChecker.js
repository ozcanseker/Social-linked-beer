import * as rdfLib from "rdflib"

import AccessError from '../../error/AccessError'
import {ACL} from '../rdf/Prefixes'

export function checkacess(storeProfileCard){
    let blankNode = storeProfileCard.any(undefined, ACL('origin'),rdfLib.sym("https://ozcanseker.github.io"));
    let readAcess = storeProfileCard.match(blankNode, ACL('mode'), ACL('Read'));
    let Write = storeProfileCard.match(blankNode, ACL('mode'),ACL('Write'));
    let Append = storeProfileCard.match(blankNode, ACL('mode'),ACL('Append'));
    let Control = storeProfileCard.match(blankNode, ACL('mode'),ACL('Control'));

    if(!readAcess.length){
        throw new AccessError("Read access");
    }

    if(!Write.length){
        throw new AccessError("Write access");
    }

    if(!Append.length){
        throw new AccessError("Append access");
    }

    if(!Control.length){
        throw new AccessError("Control access");
    }
}