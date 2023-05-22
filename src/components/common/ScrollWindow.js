import React from "react";
import { View, FlatList, Image, StyleSheet } from "react-native";
import ConcertBlock from "./ConcertBlock";

const concerts = [
    {
        image: "https://media.pitchfork.com/photos/61d740b79a8903a73574e2a5/1:1/w_600/FKA-twigs-Caprisongs.jpg",
        name: "FKA twigs",
        title: "CAPRISONGS WORLD TOUR",
        date: "March 11, 2023",
        location: "Crypto.com Arena",
    },
    {
        image: "https://media.pitchfork.com/photos/625f0725a110f14cd837788b/master/w_1280%2Cc_limit/Bartees-Strange-2022.jpg",
        name: "Bartees Strange",
        title: "Acoustic Tour",
        date: "March 27, 2023",
        location: "The Fonda",
    },
    {
        image: "https://lahiphopevents.com/wp-content/uploads/2023/02/SZA-TOUR-2.jpg",
        name: "SZA",
        title: "SOS Tour",
        date: "March 11, 2023",
        location: "Kia Forum",
    },
];

const ScrollWindow = () => {
    const concertBlockStyles = StyleSheet.create({
        concertBlock: {
            width: 150,
            height: 200,
            margin: 100,
            borderRadius: 10,
            overflow: "hidden",
        },
    });

    return (
        <View style={{ alignSelf: "center" }}>
            <FlatList
                data={concerts}
                horizontal={true}
                renderItem={({ item: concerts }) => {
                    return (
                        <ConcertBlock
                            image={concerts.image}
                            name={concerts.name}
                            title={concerts.title}
                            date={concerts.date}
                            location={concerts.location}
                            onPress={() => console.log("Click")}
                        />
                    );
                }}
            />
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
