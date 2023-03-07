const admin = require('firebase-admin');
const {database}=require('../index.js');
const {FieldValue}=require('@google-cloud/firestore');
const axios = require('axios');
const {TICKETMASTERKEY} = require('../constants/ticketmasterConstants');

const getEventInfo = async(id) => {
    const url = 'https://app.ticketmaster.com/discovery/v2/events/';
    try {
        const event = await axios.get(url + id + '.json?apikey=' + TICKETMASTERKEY);
        const eData = event.data;
        return {
            name: eData.name,
            artist: eData._embedded.attractions[0].name,
            date: eData.dates.start.localDate,
            time: eData.dates.start.localTime,
            image: eData.images[0].url,
            address: eData._embedded.venues[0].address.line1 + ' ' + eData._embedded.venues[0].city.name + ', ' + eData._embedded.venues[0].state.name,
        };
    } catch (error) {
        return {
            error: 'Event not found'
        };
    }
};

const getEvent=async (req,res) =>{
    console.log("getting event...")
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'Event ID is required' });
    }

    getEventInfo(id).then((event) => {
        res.status(200).json(event); 
        
    }).catch((error) => {
        res.status(404).json({ error: error });
    });       

}

module.exports= {
    getEvent,
    getEventInfo
}
