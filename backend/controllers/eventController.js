const admin = require('firebase-admin');
const {database}=require('../index.js');
const {FieldValue}=require('@google-cloud/firestore');
const axios = require('axios');
const {TICKETMASTERKEY} = require('../constants/ticketmasterConstants');

const addUserToEvent=async(req,res)=>{ //take in three params, the user we're changing, the event we're changing their relation to, and which field we're chaning (interested, selling, going)
    const uid=req.params.uid
    const event=req.params.event
    const field=req.params.field
    if(!event||!uid || field!='interested'||field!='going' || field != 'selling') //check for all parameters
      return res.status(400).json({
        error:"one or more parameters are missing from the request"
      }) 
    const[userdoc, eventdoc]=await promises.all(
       database.collection('users').doc(uid).get(),
      database.collection('events').doc(event).get()
    ) //query the user and the event
    if(!userdoc.exists)
      return res.status(400).json({
        error: "user not found"
      })
    else{
        let allUserData = userdoc.data()
        let allEventData = eventdoc.data()

        let userData = {
            firstName: allUserData.firstName,
            lastName: allUserData.lastName,
            image: allUserData.image,
        }

        let going={}
        let interested={}
        let selling={}
        let time = new Date(0)
    //call ticketmaster api
    const ticketMasterData = await getEventInfo(event)
    //then extract image, title, artist field and set userInterested,userGoing,userSelling respectively
    let eventData = {
        artist: ticketMasterData.artist,
        image: ticketMasterData.image

    }
        
      //construct json object to be added
      if(eventdoc.exists){ //if event doc doesn't exist, we create it with the name eventid 
       //TODO get time from tickemaster api
        let going={...event.going}||{}
        let interested={...event.interested}||{}
        let selling={...event.selling}||{}
        time = allEventData.dateTime
      } else{
      }
      

      database.collection('events').doc(event).set({
        following: following,
        going:going,
        interested:interested,
        selling:selling,
        time: time
    })
       //then add person to corresponding field
       switch (field){
        //add the user to the field they indicated
        case "interested":
            interested[uid]=userData;
            break;
        case "going":
            going[uid]=userData;
            break;
        case "selling":
            selling[uid]=userData;
            break;
       }

      //create copy of userdoc.data(), add the new concert to the appropriate field and then set it with .set()
      let userInterested = userData.interested || {};
      let userGoing = userData.going || {};
      let userSelling = userData.selling || {};
      
      switch (field) {
        case "interested":
          userInterested[event] = eventData;
          break;
        case "going":
          userGoing[event] = eventData;
          break;
        case "selling":
          userSelling[event] = eventData;
          break;
      }
      
      userData.interested = userInterested;
      userData.going = userGoing;
      userData.selling = userSelling;
      database.collection('users').doc(uid).set(userData,{merge: true});
    }
   
}

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
            dateTime: eData.dates.start.dateTime,
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

//if doc exists
//check if user is in the specified field
    //if not add the user
    //if they are, remove them

module.exports= {
    getEvent,
    addUserToEvent
}
