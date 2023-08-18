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

        // 
        const eventArr = events.data._embedded.events;

        for (let i = 0; i < eventArr.length; i++) {
            let event = eventArr[i];

            let artist = "";
            eventEmbedded = event._embedded;
            if (
                eventEmbedded &&
                eventEmbedded.attractions &&
                eventEmbedded.attractions[0]
            ) {
                artist = eventEmbedded.attractions[0].name;
            }

            // Handle if address is undefined
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

            // Handle if localTime is undefined
            let localTime = "TBD";
            let monthDay = "TBD";
            if (
                event.dates &&
                event.dates.start &&
                event.dates.start.localTime
            ) {
                const localDate = eventArr[0].dates.start.localDate;
                const date = new Date(localDate);
                const localtime = eventArr[0].dates.start.localTime;
                const dated = eventArr[0].dates.start.localDate.split("-");
                const month = months[date.getMonth()];
                const day = weekdays[date.getDay()];
                let time = "TBD";
                const intTime = localtime.split(":");
                let hour = parseInt(intTime[0]);

                if (hour >= 12) {
                    if (hour > 12) {
                        hour -= 12;
                    }
                    time = `${hour}:${intTime[1]}pm`;
                } else {
                    time = `${hour}:${intTime[1]}am`;
                }
                localTime = `${month} ${dated[2]}, ${dated[0]} - ${day}, ${time}`;
                monthDay = `${month} ${dated[2]}`;
            }

            // Handle if dateTime is undefined
            let dateTime = "TBD";
            if (
                event.dates &&
                event.dates.start &&
                event.dates.start.dateTime
            ) {
                dateTime = event.dates.start.dateTime;
            }

            let venue = "TBD";
            let city = "TBD";
            let state = "TBD";

            // Store only the information on each event we need
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
                image: event.images[0].url,
                localTime,
                dateTime,
                monthDay,
                venue,
                address,
                city,
                state,
            };
            processedEvents[event.id] = eventInfo;
        }

        // Push to Realtime Database
        const db = getDatabase();
        db.ref("eventsData")
            .set(processedEvents)
            .then(
                () => logger.info("Updated events"),
                (res) => logger.warn(`Failed to update events: ${res}`)
            )
            .catch((res) => logger.warn(`Failed to update events: ${res}`));
    }
);
