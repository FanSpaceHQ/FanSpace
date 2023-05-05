const admin = require('firebase-admin');
const {database}=require('../index.js');
const {FieldValue}=require('@google-cloud/firestore');
const axios = require('axios');
const {TICKETMASTERKEY} = require('../constants/ticketmasterConstants');

const addUserToEvent=async(req,res)=>{ //take in three params, the user we're changing, the event we're changing their relation to, and which field we're chaning (interested, selling, going)
    const uid=req.params.uid
    const event=req.params.event
    const field=req.params.field
    
    if(!event || !uid || (field!='interested' && field!='going' && field != 'selling')) //check for all parameters
      return res.status(400).json({
        error:"one or more parameters are missing from the request"
      }) 
    const[userdoc, eventdoc]=await Promise.all([database.collection('users').doc(uid).get(), database.collection('events').doc(event).get()]) //query the user and the event
    if(!userdoc.exists) {
      return res.status(400).json({
        error: "user not found"
      })
    }
    else{
        let allUserData = userdoc.data()
        //if the specified field doesn't exist, intialize the specified field to empty for the user
        if (!allUserData[field]) {
            allUserData[field] = {}
        }

         //call ticketmaster api
         const ticketMasterData = await getEventInfo(event)

        //initialize event fields to empty and time
        let going={}
        let interested={}
        let selling={}
        let time = ticketMasterData.dateTime

        let userInterested = allUserData.interested || {};
        let userGoing = allUserData.going || {};
        let userSelling = allUserData.selling || {};

        //define userData
        let userData = {
            firstName: allUserData.firstName,
            lastName: allUserData.lastName,
            image: allUserData.image,
        }

        //define eventData
        let eventData = {
            artist: ticketMasterData.artist,
            image: ticketMasterData.image,
        }

        let allEventData = eventdoc.data()
        let addUser=true

        if(eventdoc.exists){
         //first thing, set going, interested, and selling to the existing doc's going, interested, selling
            going=allEventData.going,
            interested=allEventData.interested,
            selling=allEventData.selling

            //if user already added remove user from field
            const userAlreadyAdded = (allEventData[field]&&Object.keys(allEventData[field]).includes(uid))

            if (userAlreadyAdded) {
                delete allEventData[field][uid]
                delete allUserData[field][event]
                addUser=false
            }
        }

        //add user and event data if it has not been added
        if(addUser){
         //then add person to corresponding field
            allEventData[field][uid]=userData
            allUserData[field][event]=eventData
        }

        //set the fields
        await database.collection('events').doc(event).set({
            going: going,
            interested: interested,
            selling: selling,
            time: time
        })

      //create copy of userdoc.data(), add the new concert to the appropriate field and then set it with .set()
        userData.interested = userInterested;
        userData.going = userGoing;
        userData.selling = userSelling;
        await database.collection('users').doc(uid).set(
            {going:userGoing,
            interested:userInterested,
            selling:userSelling},
            {merge: true});
    }
    res.status(200).json({message:'success'});
}

const getEventInfo = async(id) => {
    const url = 'https://app.ticketmaster.com/discovery/v2/events/';
    try {
        const [event, eventDoc] = await Promise.all([axios.get(url + id + '.json?apikey=' + TICKETMASTERKEY), database.collection('events').doc(id).get()]);
        const eData = event.data;

        let artist = '';
        if (eData._embedded && eData._embedded.attractions && eData._embedded.attractions[0]) {
            artist = eData._embedded.attractions[0].name;
        }
        
        let address = '';
        if (eData._embedded && eData._embedded.venues && eData._embedded.venues[0] && eData._embedded.venues[0].address) {
            address = eData._embedded.venues[0].address.line1 + ' ' + eData._embedded.venues[0].city.name + ', ' + eData._embedded.venues[0].state.name;
        }
        
        return {
            name: eData.name,
            artist,
            date: eData.dates.start.localDate,
            time: eData.dates.start.localTime,
            dateTime: eData.dates.start.dateTime,
            image: eData.images[0].url,
            address,
            eventDoc: eventDoc.data()
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

const populateEvents=async(req, res) => {
    console.log("test")
    const url = 'https://app.ticketmaster.com/discovery/v2/events';
    const radius = 50;
    try {
        console.log("Hi")
        const events = await Promise.all([axios.get(url + '.json?&apikey=' + TICKETMASTERKEY + '&radius=' + radius)]);
        const eData = events[0].data._embedded
        
        console.log(eData)

        // let artist = '';
        // if (eData._embedded && eData._embedded.attractions && eData._embedded.attractions[0]) {
        //     artist = eData._embedded.attractions[0].name;
        // }
        
        // let address = '';
        // if (eData._embedded && eData._embedded.venues && eData._embedded.venues[0] && eData._embedded.venues[0].address) {
        //     address = eData._embedded.venues[0].address.line1 + ' ' + eData._embedded.venues[0].city.name + ', ' + eData._embedded.venues[0].state.name;
        // }
        
        return {
            // events: allEvents,
            // name: eData.name,
            // artist,
            // date: eData.dates.start.localDate,
            // time: eData.dates.start.localTime,
            // dateTime: eData.dates.start.dateTime,
            // image: eData.images[0].url,
            // address,
        };
    } catch (error) {
        console.log("error")
        return {
            error: 'Event not found'
        };
    }
};

//getEventInfo("vvG1jZ9KbsbPCD")
//getEventInfo("vvG17Z9JEPDzpN")
populateEvents();

module.exports= {
    getEvent,
    addUserToEvent
}
