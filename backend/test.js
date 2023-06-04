const axios = require('axios');
const {TICKETMASTERKEY} = require('./constants/ticketmasterConstants');

const test = async() =>{
    const events = await axios.get('https://app.ticketmaster.com/discovery/v2/events',{
        params:{
            apikey: TICKETMASTERKEY,
            postalCode: 90024,
            radius: 50,
        }
    });
    const eData = events.data._embedded
    const eventArr = eData.events

    const weekdays = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    if (eventArr[0].dates.start){
        let dateString = '';
        const localDate = eventArr[0].dates.start.localDate;
        const date = new Date(localDate);
        const localTime = eventArr[0].dates.start.localTime;
        const dated = eventArr[0].dates.start.localDate.split('-');
        const month = months[date.getMonth()]
        const day = weekdays[date.getDay()];
        let time = 'TBD';
        const intTime = localTime.split(':');
        console.log(intTime);
        const hour = parseInt(intTime[0])
        if (hour >= 12){
            time = `${hour}:${intTime[1]}pm`
        } else{
            time = `${hour}:${intTime[1]}am`;
        }
        dateString = `${month} ${dated[2]}, ${dated[0]} - ${day}, ${time}`
        console.log(dateString);
    }



    // console.log(eventArr[0].dates.start)
}

test();