const axios = require('axios');
const {TICKETMASTERKEY} = require('./constants/ticketmasterConstants');

const test = async() =>{
    const event = await axios.get('https://app.ticketmaster.com/discovery/v2/events',{
        params:{
            apikey: TICKETMASTERKEY,
            // sort: 'relevance,desc',
            // keyword: "SZA new york",
            // classificationId: 'KnvZfZ7vAeA',
            id: 'vvG1FZ9In-1eZj',
            // radius: 20
            // attractionId: 'K8vZ917GJc7',
        }
    });
    const eData = event.data;
    // console.log(eData._embedded.attractions[0].classifications);  
    console.log(eData._embedded.events[0]._embedded.venues)
}

test();