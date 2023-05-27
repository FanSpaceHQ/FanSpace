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
import Discord from "../assets/Discord.png";
import Twitter from "../assets/Twitter.png";
import Instagram1 from "../assets/Instagram1.png";
import Instagram2 from "../assets/Instagram2.png";
import Instagram3 from "../assets/Instagram3.png";
import Facebook1 from "../assets/Facebook1.png";
import Facebook2 from "../assets/Facebook2.png";

import Settings1 from "../assets/Settings1.png";
import SettingsPage from "./Settings";
//import Button from "../components/common/Button";
//import ProfileImage from "./ProfileImage";
import { Dim, Colors } from "../Constants.js";
import { Button } from "react-native-elements";
import ScrollWindow from "../components/common/ScrollWindow";
import Bio from "../components/common/Bio";
import { height } from "@mui/system";
import { color } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";

/*
  -- DOCUMENTATION --
*/
const ProfileScreen = ({ navigation, props }) => {
    const [firstName, setFirstName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    //const navigation = useNavigation();

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
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Settings")}
                    >
                        <Image
                            source={Settings1}
                            style={{ marginLeft: Dim.width * 0.85 }}
                        ></Image>
                    </TouchableOpacity>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: Dim.width * 0.05,
                            //marginRight: Dim.width * 0.8,
                        }}
                    >
                        <Image
                            style={{
                                width: 130,
                                height: 130,
                                borderRadius: 1000,
                                marginRight: 10,
                            }}
                            source={Alex}
                        />
                        <View
                            style={{
                                alignItems: "center",
                                marginBottom: Dim.height * 0.1,
                                height: Dim.height * 0.04,
                            }}
                        >
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

                <View
                    style={{
                        width: Dim.width * 0.8,
                        borderColor: Colors.gray,
                        borderWidth: 1,
                        alignSelf: "center",
                        marginTop: Dim.height * 0.02,
                    }}
                />

                <View>
                    <Text
                        style={{
                            marginLeft: 8,
                            marginTop: 8,
                            marginBottom: 8,
                            fontSize: 18,
                        }}
                    >
                        Contact Information
                    </Text>

                    <View style={styles.rowContainer}>
                        <Image source={Instagram1} style={styles.image} />
                        <Image
                            source={Instagram2}
                            style={{
                                width: Dim.width * 0.03,
                                marginLeft: Dim.width * -0.04,
                            }}
                        />
                        <Text style={{ marginLeft: 10, color: "gray" }}>
                            @username
                        </Text>
                    </View>
                    <View style={styles.grayBar} />

                    <View style={styles.rowContainer}>
                        <Image source={Twitter} style={styles.image} />

                        <Text style={{ marginLeft: 10, color: "gray" }}>
                            @username
                        </Text>
                    </View>
                    <View style={styles.grayBar} />

                    <View style={styles.rowContainer}>
                        <Image source={Discord} style={styles.image} />
                        <Text style={{ marginLeft: 10, color: "gray" }}>
                            @username
                        </Text>
                    </View>
                    <View style={styles.grayBar} />

                    <View style={styles.rowContainer}>
                        <Image source={Facebook1} style={styles.image} />

                        <Text style={{ marginLeft: 10, color: "gray" }}>
                            @username
                        </Text>
                    </View>
                    <View style={styles.grayBar} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.sectionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.sectionTitle}>Attending</Text>
                            <TouchableOpacity style={styles.viewAllButton}>
                                <Text
                                    style={{
                                        marginLeft: Dim.width * 0.5,
                                        marginTop: Dim.height * 0.01,
                                        color: "#0DAD81",
                                    }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                marginLeft: Dim.width * 0.01,
                                marginBottom: Dim.height * 0.02,
                                color: "#B4B3B3",
                            }}
                        >
                            See what I'm going to
                        </Text>

                        <ScrollWindow />
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.sectionTitle}>Interested</Text>
                            <TouchableOpacity style={styles.viewAllButton}>
                                <Text
                                    style={{
                                        marginLeft: Dim.width * 0.5,
                                        marginTop: Dim.height * 0.01,
                                        color: "#0DAD81",
                                    }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                marginLeft: Dim.width * 0.01,
                                marginBottom: Dim.height * 0.02,
                                color: "#B4B3B3",
                            }}
                        >
                            I'm interested in...
                        </Text>
                        <ScrollWindow />
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.sectionTitle}>Selling</Text>
                            <TouchableOpacity style={styles.viewAllButton}>
                                <Text
                                    style={{
                                        marginLeft: Dim.width * 0.6,
                                        marginTop: Dim.height * 0.01,
                                        color: "#0DAD81",
                                    }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                marginLeft: Dim.width * 0.01,
                                marginBottom: Dim.height * 0.02,
                                color: "#B4B3B3",
                            }}
                        >
                            Selling tickerts for:{" "}
                        </Text>
                        <ScrollWindow />
                    </View>
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        //marginBottom: -30,
        marginBottom: Dim.height * -0.035,
        marginRight: Dim.width * 0.5,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-between",
        marginRight: Dim.width * 0.5,
    },
    image: {
        marginLeft: Dim.width * 0.12,
        marginRight: Dim.width * 0.0,
        width: 20,
        height: 20,
    },
    grayBar: {
        width: Dim.width * 0.7,
        borderColor: Colors.gray,
        borderWidth: 1,
        alignSelf: "center",
        marginTop: Dim.height * 0.04,
        marginBottom: Dim.height * 0.02,
        marginLeft: Dim.width * 0.2,
        marginRight: Dim.width * 0.1, // Adjust this value for the desired spacing
    },
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
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default ProfileScreen;
