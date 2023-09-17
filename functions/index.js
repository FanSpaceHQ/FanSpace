const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const admin = require("firebase-admin");
const { getDatabase } = require("firebase-admin/database");

const axios = require("axios");
const { getAuth } = require("firebase-admin/auth");

admin.initializeApp();

// Sanity check function
exports.helloWorld = onRequest((_, res) => {
    logger.info("Hello logs!", { structuredData: true });
    res.send("Hello from Firebase!");
});

// Get events from Ticketmaster every 2 hours
exports.syncEvents = onSchedule(
    { schedule: "every 2 hours", secrets: ["TICKETMASTER_KEY"] },
    async () => {
        logger.info("Syncing events from Ticketmaster");

        const db = getDatabase();

        // Retrieve events using Ticketmaster API
        const events = await axios.get(
            "https://app.ticketmaster.com/discovery/v2/events",
            {
                params: {
                    apikey: process.env.TICKETMASTER_KEY,
                    dmaId: 324,
                    classificationName: "music",
                },
            }
        );

        let prevEvents = {};
        try {
            prevEvents = await db.ref("eventsData").get();
            if (prevEvents) {
                prevEvents = prevEvents.val() || {};
                logger.info("found events");
            }
        } catch {}

        for (let event of events.data._embedded.events) {
            let artist = "";
            eventEmbedded = event._embedded;
            if (
                eventEmbedded &&
                eventEmbedded.attractions &&
                eventEmbedded.attractions[0]
            ) {
                artist = eventEmbedded.attractions[0].name;
            }

            let address = "";
            if (
                eventEmbedded &&
                eventEmbedded.venues &&
                eventEmbedded.venues[0] &&
                eventEmbedded.venues[0].address
            ) {
                address =
                    eventEmbedded.venues[0].address.line1 +
                    " " +
                    eventEmbedded.venues[0].city.name +
                    ", " +
                    eventEmbedded.venues[0].state.name;
            }

            let venue = "TBD";
            let city = "TBD";
            let state = "TBD";

            if (
                eventEmbedded &&
                eventEmbedded.venues &&
                eventEmbedded.venues[0]
            ) {
                if (eventEmbedded.venues[0].name) {
                    venue = eventEmbedded.venues[0].name;
                }

                if (eventEmbedded.venues[0].city.name) {
                    city = eventEmbedded.venues[0].city.name;
                }

                if (eventEmbedded.venues[0].state.name) {
                    state = eventEmbedded.venues[0].state.stateCode;
                }
            }

            let eventInfo = {
                name: event.name,
                artist,
                image: event.images.reduce((p, c) =>
                    p.width > c.width ? p : c
                ).url,
                dateTime: event.dates.start.dateTime,
                venue,
                address,
                city,
                state,
            };

            const prevEvent = Object.entries(prevEvents).find(
                (val) => val[1].name === event.name
            );
            if (prevEvent) {
                db.ref("eventsData/" + prevEvent[0]).set(eventInfo);
            } else {
                db.ref("eventsData/" + event.id).set(eventInfo);
                prevEvents[event.id] = eventInfo;
            }
        }
        logger.info("Finished syncing events from Ticketmaster");
    }
);

// Check if username is available
// @param username
exports.usernameAvailable = onCall(async (request) => {
    const db = getDatabase();
    const snap = await db
        .ref("users")
        .orderByChild("username")
        .equalTo(request.data.username)
        .limitToFirst(1)
        .get();

    return snap.val() ? false : true;
});

// Create user
// @param firstName
// @param lastName
// @param username
// @param email
// @param password
exports.createUser = onCall(async (request) => {
    try {
        const { email, password, firstName, lastName, username } = request.data;
        if (!email || !password || !firstName || !lastName || !username) {
            throw new HttpsError('invalid-argument', 'Not enough arguments');
        }
        const user = await getAuth().createUser({
            uid: username,
            email,
            password,
            displayName: firstName + " " + lastName,
            disabled: false
        });

        await getDatabase().ref("users/" + user.uid).set({
            firstName,
            lastName,
            email,
            username
        });

        return user.uid;
    } catch (err) {
        throw new HttpsError('invalid-argument', err.message);
    }
});

// Add user to event (expects authentication)
// @param evid
// @param type
exports.addToEvent = onCall(async (request) => {
    const uid = request.auth.uid;
    const { evid, type } = request.data;
    if (!evid || !type || ['going', 'interested', 'selling'].indexOf(type) < 0) {
        throw new HttpsError('invalid-argument', 'Not enough arguments');
    }
    try {
        const db = getDatabase();
        const evSnap = await db.ref(`eventsData/${evid}`).get();
        if (!evSnap.val()) throw new HttpsError('invalid-argument', 'Not enough arguments');

        const initSnap = await db.ref(`users/${uid}/${type}/${evid}`).get();
        if (initSnap.val()) {
            await db.ref(`users/${uid}/${type}/${evid}`).remove();
            await db.ref(`events/${evid}/${type}/${uid}`).remove();
        } else {
            await db.ref(`users/${uid}/${type}/${evid}`).set(1);
            await db.ref(`events/${evid}/${type}/${uid}`).set(1);
        }

        return true;
    } catch (err) {
        throw new HttpsError('invalid-argument', err.message);
    }
})

// Make friend request (expects authentication)
// @param fuid
exports.makeFriendRequest = onCall(async (request) => {
    const uid = request.auth.uid;
    const { fuid } = request.data;
    if (!fuid) {
        throw new HttpsError('invalid-argument', 'Not enough arguments');
    }

    if (fuid === uid) {
        throw new HttpsError('invalid-argument', 'Cannot friend yourself');
    }

    try {
        const db = getDatabase();
        const friendExistsSnap = await db.ref(`users/${fuid}`).get();
        if (!friendExistsSnap.val()) {
            throw new HttpsError('invalid-argument', 'Friend does not exist');
        }
        const alreadyFriendSnap = await db.ref(`users/${uid}/friends/${fuid}`).get();
        if (alreadyFriendSnap.val()) {
            await db.ref(`users/${fuid}/friends/${uid}`).remove();
            await db.ref(`users/${uid}/friends/${fuid}`).remove();
            return true;
        }

        const otherReqExists = await db.ref(`users/${uid}/pendingIncoming/${fuid}`).get();
        if (otherReqExists.val()) {
            await db.ref(`users/${uid}/pendingIncoming/${fuid}`).remove();
            await db.ref(`users/${fuid}/pendingOutgoing/${uid}`).remove();
            await db.ref(`users/${fuid}/friends/${uid}`).set(1);
            await db.ref(`users/${uid}/friends/${fuid}`).set(1);
            return true;
        }

        const reqExists = await db.ref(`users/${fuid}/pendingIncoming/${uid}`).get();
        if (reqExists.val()) {
            await db.ref(`users/${fuid}/pendingIncoming/${uid}`).remove();
            await db.ref(`users/${uid}/pendingOutgoing/${fuid}`).remove();
        } else {
            await db.ref(`users/${fuid}/pendingIncoming/${uid}`).set(1);
            await db.ref(`users/${uid}/pendingOutgoing/${fuid}`).set(1);
        }

        return true;
    } catch (err) {
        throw new HttpsError('invalid-argument', err.message)
    }
});

// Search for user (from query)
// @param query
exports.searchForUser = onCall(async (request) => {
    const db = getDatabase();
    const snap = await db
        .ref("users")
        .orderByChild("username")
        .equalTo(request.data.query)
        .limitToFirst(1)
        .get();

   if (snap.val()) return Object.keys(snap.val())[0];
   return null; 
});

// Remove friend request (expects authentication)
// @param fuid
exports.removeFriendRequest = onCall(async (request) => {
    const uid = request.auth.uid;
    const { fuid } = request.data;
    if (!fuid) {
        throw new HttpsError('invalid-argument', 'Not enough arguments');
    }

    if (fuid === uid) {
        throw new HttpsError('invalid-argument', 'Cannot unfriend yourself');
    }

    try {
        const db = getDatabase();
        const friendExistsSnap = await db.ref(`users/${fuid}`).get();
        if (!friendExistsSnap.val()) {
            throw new HttpsError('invalid-argument', 'Friend does not exist');
        }

        await db.ref(`users/${uid}/pendingIncoming/${fuid}`).remove();
        await db.ref(`users/${fuid}/pendingOutgoing/${uid}`).remove();

        return true;
    } catch (err) {
        throw new HttpsError('invalid-argument', err.message)
    }
})
