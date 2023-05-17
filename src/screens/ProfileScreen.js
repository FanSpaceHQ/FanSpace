import React from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Alex from "../assets/Alex.png";
//import Button from "../components/common/Button";
//import ProfileImage from "./ProfileImage";
import { Button } from "react-native-elements";
import ScrollWindow from "../components/common/ScrollWindow";
import Bio from "../components/common/Bio";
import { height } from "@mui/system";

/*
  -- DOCUMENTATION --
*/
const ProfileScreen = () => {
    const [firstName, setFirstName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        retrieveName();
        //retrieveImageUrl();
    }, []);

    const retrieveName = async () => {
        try {
            const value = await AsyncStorage.getItem("@firstName");
            if (value !== null) {
                setFirstName(value);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const retrieveImageUrl = async () => {
        try {
            const value = await AsyncStorage.getItem("@imageUrl");
            if (value !== null) {
                setImageUrl(value);
                console.log("yay");
            }
        } catch (error) {
            console.log(error);
            console.log("nay");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "left",
                        paddingTop: 25,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 8,
                        }}
                    >
                        <Image
                            style={{
                                width: 130,
                                height: 130,
                                borderRadius: 1000,
                            }}
                            source={Alex}
                        />
                        <View style={{ alignItems: "center", height: 120 }}>
                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontSize: 30,
                                    fontWeight: "bold",
                                    //height: 100,
                                }}
                            >
                                {firstName}
                            </Text>
                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontSize: 14,

                                    color: "grey",
                                }}
                            >
                                @username
                            </Text>
                        </View>
                    </View>
                </View>

                <Bio />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Attending</Text>
                        <ScrollWindow />
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Upcoming</Text>
                        <ScrollWindow />
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Selling</Text>
                        <ScrollWindow />
                    </View>
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // h1: {color}
    // input: {
    //     marginTop: 5,
    //     borderWidth: 1,
    //     borderColor: "black",
    //     borderRadius: 20,
    //     height: 100, // set the height you need
    //     padding: 5,
    //     fontSize: 18,
    //     textAlignVertical: "top",
    // },
    // text: {
    //     color: "black",
    //     fontSize: 16,
    //     fontWeight: "bold",
    //     textAlign: "center",
    // },
    scrollContainer: {
        paddingBottom: 20,
    },
    sectionContainer: {
        marginBottom: 20,
        padding: 10,
        height: 200,
    },
    sectionTitle: {
        padding: 2,
        fontSize: 30,
        fontWeight: "bold",
    },
});

export default ProfileScreen;
