import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

/*
  -- DOCUMENTATION --
*/
const LandingScreen = (props) => {
    return (
        <View style={{ paddingTop: 90 }}>
            <Image
                source={{
                    uri: "https://files.worldwildlife.org/wwfcmsprod/images/HERO_Red_Panda_279141/hero_small/4ocbtgyvq7_XL_279141.jpg",
                }}
                style={{ maxHeight: 170, maxWidth: 170, marginTop: 50 }}
            />
            <Text>YOU'RE IN LANDING SCREEN</Text>
        </View>
    );
};

const styles = StyleSheet.create({});

export default LandingScreen;
