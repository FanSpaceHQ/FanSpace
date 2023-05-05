import React from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";
import ConcertBlock from "./ConcertBlock";

// const images = [
//     require("https://media.pitchfork.com/photos/61d740b79a8903a73574e2a5/1:1/w_600/FKA-twigs-Caprisongs.jpg"),
//     require("https://media.pitchfork.com/photos/625f0725a110f14cd837788b/master/w_1280%2Cc_limit/Bartees-Strange-2022.jpg"),
//     require("https://lahiphopevents.com/wp-content/uploads/2023/02/SZA-TOUR-2.jpg"),
// ];

// const IMAGE_WIDTH = 200;
// const IMAGE_HEIGHT = 200;

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
    return (
        <ScrollView horizontal={true} style={styles.container}>
            {concerts.map((concert, index) => (
                <ConcertBlock key={index} {...concert} />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: -30,
        marginLeft: 8,
        marginTop: -20,
        backgroundColor: "#f0f0f0",
    },
});

export default ScrollWindow;
