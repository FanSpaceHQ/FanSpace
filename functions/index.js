const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const admin = require("firebase-admin");
const { getDatabase } = require("firebase-admin/database");

const axios = require("axios");

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
                logger.info("found events")
            }
        } catch {
            
        }

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
                image: event.images.reduce((p, c) => p.width > c.width ? p : c).url,
                dateTime: event.dates.start.dateTime,
                venue,
                address,
                city,
                state,
            };

            const prevEvent = Object.entries(prevEvents).find(val => val[1].name === event.name);
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
