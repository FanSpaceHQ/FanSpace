import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

/*
  -- DOCUMENTATION --
*/
const LandingScreen = (props) => {
    return (
        <View
            style={{
                paddingTop: 0,
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-around",
                alignContent: "center",
                alignItems: "center",
            }}
        >
            <Image source={require("../assets/FanspaceLogo.png")} style={{ height: 134, width: 109, marginTop: 175, marginBottom: 20}} />
            <Text style={{
                fontSize: 16,
                marginTop: 125,
            }}> 
                Connect with others on <Text
                    style={{color: "#0DAD81", fontWeight: "bold"}}
                > 
                    FanSpace
                </Text> 
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({});

export default LandingScreen;
