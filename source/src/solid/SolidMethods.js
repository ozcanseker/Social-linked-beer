import CheckIn from "../model/HolderComponents/CheckIn";
import {
    APPDATA_FILE,
    APPLICATION_NAME_PTI,
    BEERDRINKERFOLDER,
    BEERREVIEWFILENAME,
    CHECKIN_FOLDER
} from "./rdf/Constants";
import {ACTIVITYSTREAM, BEER, FOAF, LDP, RDF, SCHEMA, SOLID, SOLIDLINKEDBEER, VCARD} from "./rdf/Prefixes";

const fileClient = require('solid-file-client');
const authClient = require('solid-auth-client');
const rdfLib = require('rdflib');

let user;

export function setUserSolidMethods(url){
    user = url;
}

/**
 * Post a solid file.
 * @param folder The folder you want the file to live in
 * @param filename
 * @param body (ttl file)
 * @returns {Promise<void>}
 */
export async function postSolidFile(folder, filename, body) {
    return await authClient.fetch(folder, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/turtle',
            'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
            'SLUG': filename
        },
        body: body
    });
}

/**
 * Put the solid file. Will replace the current file.
 * @param url The url of the location of the resource.
 * @param body The body you want it to replace with
 * @returns {Promise<void>} ?
 */
export async function putSolidFile(url, body) {
    authClient.fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'text/turtle'
        },
        body: body
    });
}

/**
 * Allows you to append a solid file.
 * @param {*} url of the file you want to append
 * @param {*} body `INSERT DATA { <subject> <predicate> <object> }`
 */
export async function appendSolidResource(url, body) {
    authClient.fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/sparql-update'
        },
        body: body
    });
}

/**
 * Gets an user file. If the user is part of SOLIB it will have an application otherwise if will have an inbox
 * @param url
 * @returns {Promise<{appLocation: (*), imageUrl: (*), name: (*), inbox: (*), url: *}>}
 */
export async function getUserFile(url) {
    let inbox;

    //get url resource
    let userttt = await authClient.fetch(url);
    let graph = rdfLib.graph();

    if (userttt.status === 403) {
        throw new Error("Something went wrong, check if the profile card is correct");
    } else if (userttt.status > 400) {
        throw new Error("Something went wrong, check if the profile card is correct");
    }

    userttt = await userttt.text();

    try {
        //parse to check if it is ttl
        rdfLib.parse(userttt, graph, url, "text/turtle");
    } catch (err) {
        throw new Error("Not a correct profile linked data file");
    }

    //check if it is a profile card
    let query = graph.any(undefined, undefined, FOAF('PersonalProfileDocument'));

    if (query) {

        //check if user has ppi
        let profile = graph.any(undefined, SOLID("publicTypeIndex"));
        let publicProfileIndex = graph.any(profile, SOLID("publicTypeIndex"));

        if (publicProfileIndex) {
            let ppiTTL = await fileClient.readFile(publicProfileIndex.value);
            let ppigraph = rdfLib.graph();
            rdfLib.parse(ppiTTL, ppigraph, publicProfileIndex.value, "text/turtle");

            let app = rdfLib.sym(publicProfileIndex.value + "#" + APPLICATION_NAME_PTI);
            let appQuery = ppigraph.any(app, SOLID("instanceContainer"));

            //get name and Image
            let nameFN = graph.any(profile, VCARD('fn'));

            if (!nameFN) {
                nameFN = graph.any(profile, FOAF('name'));
            }

            let imageURL = graph.any(profile, VCARD('hasPhoto'));

            if (!appQuery) {
                inbox = graph.any(profile, LDP('inbox'));
                console.log(inbox);
            }

            //applocation is not of beerdrinker
            let result = {
                url: url,
                name: nameFN ? nameFN.value : undefined,
                imageUrl: imageURL ? imageURL.value : undefined,
                appLocation: appQuery ? appQuery.value : undefined,
                inbox: inbox ? inbox.value : undefined
            }

            return result;
        } else {
            throw new Error("This user does not have a public type index");
        }
    } else {
        throw new Error("Not a profile card");
    }
}

/**
 * Load data from a friend
 * @param friend
 */
export async function loadFriendData(friend) {
    //getUserFile
    let userDetails = await getUserFile(friend.getUri());
    friend.setUserDetails(userDetails.name, userDetails.imageUrl, userDetails.appLocation + BEERDRINKERFOLDER);

    //appdatafile
    let friendAppdataLocation = userDetails.appLocation + BEERDRINKERFOLDER + APPDATA_FILE;

    fileClient.readFile(friendAppdataLocation).then(friendsAppdata => {
        let graph = rdfLib.graph();
        rdfLib.parse(friendsAppdata, graph, friendAppdataLocation, "text/turtle");

        let blankNode = graph.any(undefined, SOLIDLINKEDBEER('startDate'));

        let startdate = graph.any(blankNode, SOLIDLINKEDBEER('startDate'));
        let points = graph.any(blankNode, SOLIDLINKEDBEER('points'));

        friend.setAppData(new Date(startdate.value));
        friend.getCheckInHandler().setBeerPoints(points.value);
    });

    getTenUserCheckIns(friend.getBeerDrinkerFolder()).then(res => {
        friend.getCheckInHandler().setReviesCheckInsAndUserCheckIns(res.reviews, res.checkIns, res.userBeerCheckIns)
    });
}

/**
 * Get ten checkins from the given folder.
 * @param beerDrinkerFolder
 * @returns {Promise<{userBeerCheckIns: [], reviews: number, checkIns: number}>}
 */
export async function getTenUserCheckIns(beerDrinkerFolder) {
    let checkinLocation = beerDrinkerFolder + CHECKIN_FOLDER;
    let fileContents = (await fileClient.readFolder(checkinLocation)).files.reverse();
    let userBeerCheckIns = [];

    let checkIns = 0;
    let reviews = 0;

    for (let i = 0; i < fileContents.length; i++) {
        if (i < 10) {
            let beerCheckIn = new CheckIn(fileContents[i].url);
            loadValuesInCheckInFile(beerCheckIn);
            userBeerCheckIns.push(beerCheckIn);
        }

        if (fileContents[i].url.includes(BEERREVIEWFILENAME)) {
            reviews++;
        } else {
            checkIns++;
        }
    }

    return {userBeerCheckIns: userBeerCheckIns, reviews: reviews, checkIns: checkIns};
}

/**
 * Get all the checkin from a folder.
 * @param beerdrinkerFolder
 * @returns {Promise<{userBeerCheckIns: [], reviews: number, checkIns: number}>}
 */
export async function getAllUserCheckIns(beerdrinkerFolder) {
    let checkinLocation = beerdrinkerFolder + CHECKIN_FOLDER;
    let fileContents = (await fileClient.readFolder(checkinLocation)).files.reverse();
    let userBeerCheckIns = [];

    let checkIns = 0;
    let reviews = 0;

    for (let i = 0; i < fileContents.length; i++) {
        let beerCheckIn = new CheckIn(fileContents[i].url);
        loadValuesInCheckInFile(beerCheckIn);
        userBeerCheckIns.push(beerCheckIn);

        if (fileContents[i].url.includes(BEERREVIEWFILENAME)) {
            reviews++;
        } else {
            checkIns++;
        }

    }

    return {userBeerCheckIns: userBeerCheckIns, reviews: reviews, checkIns: checkIns};
}

/**
 * Load the values of a checkin of the given url.
 * @param beerCheckIn
 * @returns {Promise<void>}
 */
export async function loadValuesInCheckInFile(beerCheckIn) {
    fileClient.readFile(beerCheckIn.getFileLocation()).then(ttlFile => {
        let graph = rdfLib.graph();
        rdfLib.parse(ttlFile, graph, beerCheckIn.getFileLocation(), "text/turtle");

        let checkinBN = graph.any(undefined, RDF('type'), ACTIVITYSTREAM('Activity'));
        let checkinTime = graph.any(checkinBN, ACTIVITYSTREAM('published'));

        //person nn
        let personNN = graph.any(undefined, FOAF('name'));
        let userID = graph.any(personNN, FOAF('name'));
        if(!userID){
            userID = graph.any(personNN, FOAF('nick'));
        }

        //beer nn
        let beerNN = graph.any(undefined, BEER('beerName'));
        let beerName = graph.any(beerNN, BEER('beerName'));

        let reviewNN = graph.any(undefined, SCHEMA('reviewBody'));
        let review = graph.any(reviewNN, SCHEMA('reviewBody'));

        let ratingBN = graph.any(undefined, SCHEMA('ratingValue'));
        let rating = graph.any(ratingBN, SCHEMA('ratingValue'));

        let query = graph.each(undefined, RDF('type') , ACTIVITYSTREAM("Like"));
        let amount = query.length;

        let liked;
        query.forEach(res => {
            if(res.value.includes(user._appFolder)){
                liked = true;
            }
        });

        beerCheckIn.loadInAttributes(
            personNN.value,
            userID ? userID.value : undefined,
            beerNN.value,
            beerName.value,
            checkinTime.value,
            rating ? rating.value : undefined,
            review ? review.value : undefined,
            liked,
            amount
        );
    });
}