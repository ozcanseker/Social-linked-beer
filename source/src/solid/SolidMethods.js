import CheckIn from "../model/HolderComponents/CheckIn";
import {
    APPDATA_FILE,
    APPLICATION_NAME_PTI,
    BEERDRINKERFOLDER,
    BEERREVIEWFILENAME,
    CHECKIN_FOLDER
} from "./rdf/Constants";
import {FOAF, LDP, SOLID, SOLIDLINKEDBEER, VCARD} from "./rdf/Prefixes";

const fileClient = require('solid-file-client');
const authClient = require('solid-auth-client');
const rdfLib = require('rdflib');

export async function postSolidFile(folder, filename, body) {
    authClient.fetch(folder, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/turtle',
            'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
            'SLUG': filename
        },
        body: body
    });
}

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
 * // let body = `INSERT DATA { <${this.state.webId+"#comment"}> <${SOLIDLINKEDBEER('points6').value}> <${8}> }`;
 // let appDataFile;
 // appendSolidResource(appDataFile, {body})
 * @param {*} url
 * @param {*} body
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
 *
 * @param url
 * @returns {Promise<{appLocation: (*), imageUrl: (*), name: (*), inbox: (*), url: *}>}
 */
export async function getUserFile(url) {
    let inbox;

    //get url resource
    let userttt = await authClient.fetch(url);
    let graph = rdfLib.graph();

    if (userttt.status === 403) {
        throw new Error("403: user unauthorized");
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
        let profile = rdfLib.sym(url);

        //check if user has ppi
        const publicProfileIndex = graph.any(profile, SOLID("publicTypeIndex"));

        if (publicProfileIndex) {
            let ppiTTL = await fileClient.readFile(publicProfileIndex.value);
            let ppigraph = rdfLib.graph();
            rdfLib.parse(ppiTTL, ppigraph, publicProfileIndex.value, "text/turtle");

            let app = rdfLib.sym(publicProfileIndex.value + "#" + APPLICATION_NAME_PTI);
            let appQuery = ppigraph.any(app, SOLID("instance"));

            //get name and Image
            let nameFN = graph.any(profile, VCARD('fn'));
            let imageURL = graph.any(profile, VCARD('hasPhoto'));

            if (!appQuery) {
                inbox = graph.any(profile, LDP('inbox'));
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
            throw new Error("no ppi");
        }
    } else {
        throw new Error("not a profile card");
    }
}


/**
 *
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

        let blankNode = graph.any(undefined, SOLIDLINKEDBEER('startdate'));

        let startdate = graph.any(blankNode, SOLIDLINKEDBEER('startdate'));
        let points = graph.any(blankNode, SOLIDLINKEDBEER('points'));

        friend.setAppData(new Date(startdate.value));
        friend.getCheckInHandler().setBeerPoints(points.value);
    });

    getTenUserCheckIns(friend.getBeerDrinkerFolder()).then(res => {
        friend.getCheckInHandler().setReviesCheckInsAndUserCheckIns(res.reviews, res.checkIns, res.userBeerCheckIns)
    });
}

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

    return userBeerCheckIns;
}

export async function loadValuesInCheckInFile(beerCheckIn) {
    fileClient.readFile(beerCheckIn.getFileLocation()).then(ttlFile => {
        let graph = rdfLib.graph();
        let namedNode = rdfLib.sym(beerCheckIn.getFileLocation());
        rdfLib.parse(ttlFile, graph, beerCheckIn.getFileLocation(), "text/turtle");

        let webId = graph.any(namedNode, SOLIDLINKEDBEER('webId'));
        let userId = graph.any(namedNode, SOLIDLINKEDBEER('username'));
        let beerlocation = graph.any(namedNode, SOLIDLINKEDBEER('beerLocation'));
        let beername = graph.any(namedNode, SOLIDLINKEDBEER('beerName'));
        let checkinTime = graph.any(namedNode, SOLIDLINKEDBEER('checkInTime'));
        let rating = graph.any(namedNode, SOLIDLINKEDBEER('rating'));
        let review = graph.any(namedNode, SOLIDLINKEDBEER('review'));

        beerCheckIn.loadInAttributes(
            webId.value,
            userId ? userId.value : undefined,
            beerlocation.value,
            beername.value,
            checkinTime.value,
            rating ? rating.value : undefined,
            review ? review.value : undefined
        );
    });
}