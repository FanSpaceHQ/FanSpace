const axios = require('axios');
const {TICKETMASTERKEY} = require('./constants/ticketmasterConstants');

const test = async() =>{
    const key = 'sza';

    const events = await axios.get(
        "https://app.ticketmaster.com/discovery/v2/events",
        {
            params: {
                apikey: TICKETMASTERKEY,
                keyword: key,
                includeSpellcheck: "yes",
            },
        }
    );
    console.log(events.data);
}

test();