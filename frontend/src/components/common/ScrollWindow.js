import React, { useState, useEffect } from "react";
import { View, FlatList, Image, StyleSheet, Text } from "react-native";
import ConcertBlock from "./ConcertBlock";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { get, getDatabase, onValue, ref } from "firebase/database";
import moment from "moment";


const ScrollWindow = (props) => {
    const [concertData, setData] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const uid = props.id || getAuth().currentUser.uid;

        onValue(ref(getDatabase(), `users/${uid}/${props.type}`), snap => {
            if (snap.val()) {
                Promise.all(Object.keys(snap.val()).map(ev => {
                    return get(ref(getDatabase(), `eventsData/${ev}`))
                })).then(snaps => {
                    setData(snaps.map(snap => {
                        const event = snap.val();
                        event.id = snap.key;
                        event.date = moment(event.dateTime);
                        event.localTime = event.date.format("MMMM Do YYYY, h:mm a");
                        event.monthDay = event.date.format("MMM Do"); 
                        return event;
                    }));
                }).catch(err => console.log(err))
            }
        }, )
    }, []);

    return (
        <View style={{ alignSelf: "center", height: 150 }}>
            {concertData.length > 0 ? <FlatList
                data={concertData}
                horizontal={true}
                renderItem={({ item: concertData }) => {
                    return (
                        <View style={{ marginRight: 10 }}>
                            <ConcertBlock
                                image={concertData.image}
                                name={concertData.name}
                                title={concertData.title}
                                date={concertData.date}
                                location={concertData.venue}
                                monthDay={concertData.monthDay}
                                onPress={() =>
                                    navigation.navigate("Concert Screen", {
                                        image: concertData.image,
                                        name: concertData.name,
                                        date: concertData.localTime,
                                        location: `${concertData.venue} - ${concertData.city}, ${concertData.state}`,
                                        id: concertData.id
                                    })
                                }
                            />
                        </View>
                    );
                }}
            /> : <>
                <Text>Still browsing! Check back later.</Text>
            </>}
        </View>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     marginBottom: -30,
    //     marginLeft: 8,
    //     marginTop: -20,
    //     backgroundColor: "#f0f0f0",
    // },
    // concertBlock: {
    //     marginRight: 10,
    //     padding: 10,
    // },
});

export default ScrollWindow;
