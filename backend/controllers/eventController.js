const admin = require('firebase-admin');
const {database}=require('../index.js');
const {FieldValue}=require('@google-cloud/firestore');
const axios = require('axios');
const {TICKETMASTERKEY} = require('../constants/ticketmasterConstants');

const addUserToEvent=async(req,res)=>{ //take in three params, the user we're changing, the event we're changing their relation to, and which field we're chaning (interested, selling, going)
    const uid=req.params.uid
    const event=req.params.event
    const field=req.params.field
    
    //make sure there is a parameter sepcifying if someone if intersted, going, or selling tickets for an event
    if(!event || !uid || (field!='interested' && field!='going' && field != 'selling')) 
      return res.status(400).json({
        error:"one or more parameters are missing from the request"
      }) 
    const[userdoc, eventdoc]=await Promise.all([database.collection('users').doc(uid).get(), database.collection('events').doc(event).get()]) //query the user and the event
    
    //check if the user already exists, if not make a new field for the user
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
//get Event details by eventId and only keep desired fields
const getEventInfo = async(id) => {
    const url = 'https://app.ticketmaster.com/discovery/v2/events/';
    try {
        const [event, eventDoc] = await Promise.all([axios.get(url + id + '.json?apikey=' + TICKETMASTERKEY), database.collection('events').doc(id).get()]);
    
        const eData = event.data;
        //console.log(eData)

        //handle if artist is undefined
        let artist = '';
        if (eData._embedded && eData._embedded.attractions && eData._embedded.attractions[0]) {
            artist = eData._embedded.attractions[0].name;
        }
        
        //handle if address is undefined
        let address = '';
        if (eData._embedded && eData._embedded.venues && eData._embedded.venues[0] && eData._embedded.venues[0].address) {
            address = eData._embedded.venues[0].address.line1 + ' ' + eData._embedded.venues[0].city.name + ', ' + eData._embedded.venues[0].state.name;
        }
        
        //handle if localTime is undefined
        localTime = '';
        if (eData.dates && eData.dates.start && eData.dates.start.localTime) {
            localTime = eData.dates.start.localTime;
        }

        //handle if dateTime is undefined
        let dateTime = '';
        if (eData.dates && eData.dates.start && eData.dates.start.dateTime) {
            dateTime = eData.dates.start.dateTime;
        }
        
        //return wanted data
        return {
            name: eData.name,
            artist,
            date: eData.dates.start.localDate,
            localTime,
            dateTime,
            image: eData.images[0].url,
            address,
            eventDoc: eventDoc.data()
        };
    } catch (error) {
        return {
            //this error message is printed for events not found
            error: 'Event not found'
        };
    }
};

const getEvent=async (req,res) =>{
    console.log("getting event...")
    const id = req.params.id;
    //handle if needed parameter is missing
    if (!id) {
        return res.status(400).json({ error: 'Event ID is required' });
    }
    //call fetEventInfo and handle errors accordingly
    getEventInfo(id).then((event) => {
        res.status(200).json(event); 
        
    }).catch((error) => {
        res.status(404).json({ error: error });
    });       

}
//getEventInfo("vvG1jZ9KbsbPCD")
getEventInfo("vvG17Z9JEPDzpN")

const searchEvent = async (req, res) => {
    console.log('Searching for events...')
    const key = req.body.keyword
    try {
      const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events', {
        params: {
          apikey: TICKETMASTERKEY,
          keyword: key,
        },
      });
      console.log(response)
      const events = response.data._embedded;
      console.log(events)
      res.status(200).json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while searching for events.' });
    }
  };

//gets all events within a 50 mile radius of UCLA
const populateEvents=async(req, res) => {
    const url = 'https://app.ticketmaster.com/discovery/v2/events';

    //parameters
    const radius = 50;
    const zipCode = 90024;

    try {
        //fetch events from Ticketmaster API
        //const events = await Promise.all([axios.get(url + '.json?&apikey=' + TICKETMASTERKEY + '&postalCode=' + zipCode + '&radius=' + radius)]);
    
        //const events = await axios.get('https://app.ticketmaster.com/discovery/v2/events',{
        const events = await axios.get('https://app.ticketmaster.com/discovery/v2/events',{
            params:{
                apikey: TICKETMASTERKEY,
                postalCode: 90024,
                radius: 50,
            }
        });
        const eData = events.data._embedded
        const eventArr = eData.events
        const processedEvents = [];

        const weekdays = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        // console.log(eventArr)
        for (let i = 0; i < eventArr.length; i++) {
            let event = eventArr[i];

            let artist = '';
            eventEmbedded = event._embedded;
            if (eventEmbedded && eventEmbedded.attractions && eventEmbedded.attractions[0]) {
                artist = eventEmbedded.attractions[0].name;
            }
            
            //handle if address is undefined
            let address = '';
            if (eventEmbedded && eventEmbedded.venues && eventEmbedded.venues[0] && eventEmbedded.venues[0].address) {
                address = eventEmbedded.venues[0].address.line1 + ' ' + eventEmbedded.venues[0].city.name + ', ' + eventEmbedded.venues[0].state.name;
            }

            //handle if localTime is undefined
            let localTime = 'TBD';
            if (event.dates && event.dates.start && event.dates.start.localTime) {
                let dateString = '';
                const localDate = eventArr[0].dates.start.localDate;
                const date = new Date(localDate);
                const localtime = eventArr[0].dates.start.localTime;
                const dated = eventArr[0].dates.start.localDate.split('-');
                const month = months[date.getMonth()]
                const day = weekdays[date.getDay()];
                let time = 'TBD';
                const intTime = localtime.split(':');
                const hour = parseInt(intTime[0])
                if (hour >= 12){
                    time = `${hour}:${intTime[1]}pm`
                } else{
                    time = `${hour}:${intTime[1]}am`;
                }
                localTime = `${month} ${dated[2]}, ${dated[0]} - ${day}, ${time}`
            }

            //handle if dateTime is undefined
            let dateTime = 'TBD';
            if (event.dates && event.dates.start && event.dates.start.dateTime) {
                dateTime = event.dates.start.dateTime;
            }

            let venue = 'TBD';
            let city = 'TBD';
            let state = 'TBD';
            //store only the information on each event we need
            if (eventEmbedded && eventEmbedded.venues && eventEmbedded.venues[0]) {
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
                id: i + 1,
                name: event.name,
                artist,
                image: event.images[0].url,
                localTime,
                dateTime,
                venue,
                address,
                city,
                state
            }
            processedEvents.push(eventInfo);
        }

        res.status(200).json(processedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "An error occurred loading the events"})
    }
};

// getEventInfo("vvG1jZ9KbsbPCD")
//getEventInfo("vvG17Z9JEPDzpN")

//function to test populate events
async function testPopulateEvents() {
    const result = await populateEvents();
    if (result.error) {
      console.error(result.error);
      return;
    }
    const { processedEvents } = result;
    console.log('Number of events processed:', processedEvents.length);
    //printing out all processed events
    for (let i = 0; i < processedEvents.length; i++) {
        console.log(processedEvents[i])
    }
}

//   testPopulateEvents();

module.exports= {
    getEvent,
    addUserToEvent,
    searchEvent,
    populateEvents
}
