import React from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//import Button from "../components/common/Button";

import { Button } from "react-native-elements";
import ScrollWindow from "../components/common/ScrollWindow";
import Bio from "../components/common/Bio";

/*
  -- DOCUMENTATION --
*/
const ProfileScreen = (props) => {
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        retrieveName();
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
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                height: 130,
                                width: 130,
                                borderRadius: 1000,
                                backgroundColor: "black",
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    flexWrap: true,
                                    flexDirection: "column",
                                }}
                            >
                                Profile photo
                            </Text>
                        </View>
                        <Text
                            style={{
                                marginLeft: 10,
                                fontSize: 30,
                                fontWeight: "bold",
                                height: 100,
                            }}
                        >
                            {firstName}
                        </Text>
                    </View>

                    {/* <View
                        style={{
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 20,
                            padding: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                            }}
                        >
                            Hi! I am a 2nd year UCLA student. 🐻🌟
                        </Text>
                    </View> */}
                </View>

                <Bio />
                {/* <View style={styles.input}>
                    <TextInput
                        multiline={true}
                        onChangeText={(text) => setBio(text)}
                        value={bio}
                        placeholder="Create a bio"
                    />
                </View> */}

                {/* <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>Save</Text>
                </TouchableOpacity> */}

                <View style={{ flex: 1 }}>
                    <View style={{ marginBottom: 10 }}>
                        <Text
                            style={{
                                padding: 20,
                                fontSize: 30,
                                fontWeight: "bold",
                            }}
                        >
                            Attending
                        </Text>
                        <ScrollWindow />
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text
                            style={{
                                padding: 20,
                                fontSize: 30,
                                fontWeight: "bold",
                            }}
                        >
                            Upcoming
                        </Text>
                        <ScrollWindow />
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text
                            style={{
                                padding: 20,
                                fontSize: 30,
                                fontWeight: "bold",
                            }}
                        >
                            Selling
                        </Text>
                        <ScrollWindow />
                    </View>
                </View>
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
});

export default ProfileScreen;
