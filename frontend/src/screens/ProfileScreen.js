import React from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Image,
} from "react-native";
import { useState, useEffect } from "react";
import Discord from "../assets/Discord.png";
import Twitter from "../assets/Twitter.png";
import Instagram from "../assets/Instagram.png";
import Setting from "../assets/Setting.png";

import { Dim, Colors } from "../Constants.js";
import ScrollWindow from "../components/common/ScrollWindow";
import Bio from "../components/common/Bio";
import Button from "../components/common/Button";

import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { getDownloadURL, getStorage, ref as storRef } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

/*
  -- DOCUMENTATION --
*/
const ProfileScreen = ({ navigation, route }) => {
    const { id } = route.params || {};
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [discord, setDiscord] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [username, setUsername] = useState("");
    const [friendText, setFriendText] = useState(null);

    const currId = getAuth().currentUser.uid;

    useEffect(() => {
        const uid = id || currId;

        getDownloadURL(
            storRef(getStorage(), "/images/" + uid + "/profile")
        ).then(setImageUrl);

        onValue(ref(getDatabase(), "users/" + uid + "/firstName"), (snap) => {
            setFirstName(snap.val());
        });

        onValue(ref(getDatabase(), "users/" + uid + "/lastName"), (snap) => {
            setLastName(snap.val());
        });

        onValue(ref(getDatabase(), "users/" + uid + "/instagram"), (snap) => {
            setInstagram(snap.val());
        });

        onValue(ref(getDatabase(), "users/" + uid + "/twitter"), (snap) => {
            setTwitter(snap.val());
        });

        onValue(ref(getDatabase(), "users/" + uid + "/discord"), (snap) => {
            setDiscord(snap.val());
        });

        onValue(ref(getDatabase(), "users/" + uid + "/username"), (snap) => {
            setUsername(snap.val());
        });

        if (uid !== currId) {
            setFriendText("Add Friend");
            onValue(ref(getDatabase(), "users/" + currId + "/friends/" + id), (snap) => {
                if (snap.val()) setFriendText("Unfriend");
                else if (!friendText || friendText === 'Unfriend') setFriendText("Add Friend");
            });

            onValue(ref(getDatabase(), "users/" + currId + "/pendingOutgoing/" + id), (snap) => {
                if (snap.val()) setFriendText("Unrequest");
                else if (!friendText || friendText === 'Unrequest') setFriendText("Add Friend");
            });

            onValue(ref(getDatabase(), "users/" + currId + "/pendingIncoming/" + id), (snap) => {
                if (snap.val()) setFriendText("Accept Request");
                else if (!friendText || friendText === 'Accept Request') setFriendText("Add Friend");
            });
        }
    });

    const friendClick = () => {
        const makeFriendRequest = httpsCallable(getFunctions(), 'makeFriendRequest');
        makeFriendRequest({fuid: id});
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            {id ? (
                <View style={styles.topRow2}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.subheader2}>
                            {" "}
                            <Text style={styles.arrow2}>← </Text> Back
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}
            <ScrollView style={{ paddingLeft: 30, paddingRight: 30 }}>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "left",
                        paddingTop: 25,
                    }}
                >
                    {!id || id === currId ? (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Settings")}
                        >
                            <Image
                                source={Setting}
                                style={{
                                    marginLeft: Dim.width * 0.8,
                                    height: 30,
                                    width: 30,
                                }}
                            ></Image>
                        </TouchableOpacity>
                    ) : null}

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: Dim.width * 0.05,
                            //marginRight: Dim.width * 0.8,
                        }}
                    >
                        {imageUrl ? (
                            <Image
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 1000,
                                    marginRight: 10,
                                }}
                                source={{ uri: imageUrl }}
                            />
                        ) : null}
                        <View
                            style={{
                                alignItems: "left",
                            }}
                        >
                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontSize: 25,
                                    fontWeight: "600",
                                    width: 200,
                                    //height: 100,
                                }}
                            >
                                {firstName + " " + lastName}
                            </Text>

                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontSize: 14,

                                    color: "grey",
                                }}
                            >
                                @{username}
                            </Text>
                            {friendText ? <Button title={friendText} onPress={() => friendClick()} /> : null}
                        </View>
                    </View>
                </View>

                <Bio id={id} />

                <View
                    style={{
                        width: Dim.width * 0.9,
                        borderColor: Colors.gray,
                        borderWidth: 1,
                        alignSelf: "center",
                        marginTop: Dim.height * 0.02,
                        marginBottom: Dim.height * 0.02,
                    }}
                />

                <View>
                    <Text style={{ marginBottom: 10, ...styles.sectionTitle }}>
                        Contact Information
                    </Text>

                    <View style={styles.rowContainer}>
                        <Image source={Instagram} style={styles.image} />
                        <Text style={{ marginLeft: 10, color: "gray" }}>
                            {instagram}
                        </Text>
                    </View>
                    <View style={styles.grayBar} />

                    <View style={styles.rowContainer}>
                        <Image source={Twitter} style={styles.image} />

                        <Text style={{ marginLeft: 10, color: "gray" }}>
                            {twitter}
                        </Text>
                    </View>
                    <View style={styles.grayBar} />

                    <View style={styles.rowContainer}>
                        <Image source={Discord} style={styles.image} />
                        <Text style={{ marginLeft: 10, color: "gray" }}>
                            {discord}
                        </Text>
                    </View>
                    <View style={styles.grayBar} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.sectionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.sectionTitle}>Attending</Text>
                            {/* <TouchableOpacity
                                style={styles.viewAllButton}
                                onPress={() => navigation.navigate("Saved")}
                            >
                                <Text
                                    style={{
                                        marginLeft: Dim.width * 0.5,
                                        marginTop: Dim.height * 0.01,
                                        color: "#0DAD81",
                                    }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity> */}
                        </View>
                        <Text
                            style={{
                                marginBottom: Dim.height * 0.02,
                                color: "#B4B3B3",
                            }}
                        >
                            See what {!id || id === currId ? "I'm" : firstName + " is"} going to
                        </Text>

                        <ScrollWindow id={id} type="going" />
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.sectionTitle}>Interested</Text>
                            {/* <TouchableOpacity
                                style={styles.viewAllButton}
                                onPress={() => navigation.navigate("Saved")}
                            >
                                <Text
                                    style={{
                                        marginLeft: Dim.width * 0.49,
                                        marginTop: Dim.height * 0.01,
                                        color: "#0DAD81",
                                    }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity> */}
                        </View>
                        <Text
                            style={{
                                marginBottom: Dim.height * 0.02,
                                color: "#B4B3B3",
                            }}
                        >
                            {!id || id === currId ? "I'm" : firstName + " is"} interested in...
                        </Text>
                        <ScrollWindow id={id} type="interested" />
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.sectionTitle}>Selling</Text>
                            {/* <TouchableOpacity
                                style={styles.viewAllButton}
                                onPress={() => navigation.navigate("Saved")}
                            >
                                <Text
                                    style={{
                                        marginLeft: Dim.width * 0.57,
                                        marginTop: Dim.height * 0.01,
                                        color: "#0DAD81",
                                    }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity> */}
                        </View>
                        <Text
                            style={{
                                marginBottom: Dim.height * 0.02,
                                color: "#B4B3B3",
                            }}
                        >
                            Selling tickets for:{" "}
                        </Text>
                        <ScrollWindow id={id} type="selling" />
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
        marginBottom: Dim.height * -0.035,
        marginRight: Dim.width * 0.3,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-between",
        marginRight: Dim.width * 0.5,
    },
    image: {
        marginLeft: Dim.width * 0.03,
        marginRight: Dim.width * 0.0,
        width: 20,
        height: 20,
    },
    grayBar: {
        width: Dim.width * 0.67,
        borderColor: Colors.gray,
        borderWidth: 1,
        alignSelf: "center",
        marginTop: Dim.height * 0.04,
        marginBottom: Dim.height * 0.02,
        marginLeft: 20,
    },
    scrollContainer: {
        paddingTop: 50,
        paddingBottom: 20,
    },
    sectionContainer: {
        marginBottom: 20,
        // padding: 10,
        height: 200,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    topRow2: {
        flexDirection: "row",
        justifyContent: "flex-start",
        // paddingTop: 40,
        paddingBottom: 10,
        marginLeft: 20,
    },
    subheader2: {
        color: Colors.darkGray,
        fontSize: 16,
        fontWeight: "medium",
        color: "black",
    },
    arrow2: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default ProfileScreen;
