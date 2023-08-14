import React, { useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, Alert, TouchableOpacity, 
        TouchableWithoutFeedback, Keyboard, ActivityIndicator} from "react-native";
import { useState } from "react";
import TextInput from "../components/common/TextInput";
import {
    Colors,
    RegexDiscord,
    RegexInstagram,
    RegexTwitter,
    RegexUsername,
    Dim,
} from "../Constants";
import Button from "../components/common/Button";
import { RegexPassword, RegexName } from "../Constants";
import AddProfilePhoto from "../components/common/AddProfilePhoto";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
  -- DOCUMENTATION --
*/
const CreateProfileScreen = ({ props, navigation }) => {
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [instagram, setInstagram] = useState("");
    const [discord, setDiscrod] = useState("");
    const [twitter, setTwitter] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        location: undefined,
        bio: undefined,
        instagram: undefined,
        discord: undefined,
        twitter: undefined,
    });

    const success = async () => {
        await AsyncStorage.setItem("@discord", discord);
        await AsyncStorage.setItem("@twitter", twitter);
        await AsyncStorage.setItem("@bio", bio);
        await AsyncStorage.setItem("@instagram", instagram);
        await AsyncStorage.setItem("@location", location);
        setLoading(false);
        navigation.navigate("NavbarStack")
    }

    const onPressRegister = async () => {
        const locationError =
            location.length > 0 ? undefined : "You must enter a location";
        const bioError =
            bio.length > 0 ? undefined : "Please enter a valid password.";
        const instagramError =
            instagram.length > 0 ? undefined : "Enter a valid Instagram handle";
        const discordError =
            discord.length > 0
                ? undefined
                : "You must enter valid Discord tag.";
        const twitterError =
            twitter.length > 0
                ? undefined
                : "You must enter valid Twitter handle.";

        if (
            locationError ||
            bioError ||
            instagramError ||
            discordError ||
            twitterError
        ) {
            setErrors({
                location: locationError,
                bio: bioError,
                instagram: instagramError,
                discord: discordError,
                twitter: twitterError,
            });
            return;
        }
        setLoading(true);
        let data = new FormData();

        data.append("discord", discord), data.append("instagram", instagram);
        data.append("bio", bio), data.append("twitter", twitter);
        data.append("location", location);
        await AsyncStorage.getItem("@uid").then((uid) => {
            data.append("uid", uid)
        });
        await axios
            .patch("http://localhost:4000/api/users/", data, {
                "content-type": "multipart/form-data"
            })
            .then((response) => {
                console.log("Patched Account");
                success();
            })
            .catch((err)=>{
                console.log(err);
            })
    };

    // const sendProfile = async(location,bio,instagram,discord,twitter)

    return (
        <KeyboardAwareScrollView
            style={{
                backgroundColor: "white",
                flex: Platform.OS === "ios" ? 1 : null,
                paddingTop: 0,
            }}
            contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
            }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            extraScrollHeight={25}
            keyboardShouldPersistTaps="handled"
        >
            <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <TouchableWithoutFeedback
                onPress={() => Keyboard.dismiss()}
            >
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        paddingTop: 25,
                    }}
                >
                    {/* <TouchableOpacity
                        onPress={() => navigation.navigate("Sign In")}
                    >
                        <Icon
                            name={"arrow-left"}
                            size={24}
                            color={Colors.darkGray}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.subtitle}>Profile</Text> */}
                    <Text style={styles.title}>Create your account</Text>

                    <View>
                        <TextInput
                            setText={setLocation}
                            value={location}
                            placeholder={"Where are you located?"}
                            isPassword={false}
                            autoCorrect={false}
                            error={errors.location}
                            errorMessage={"Enter a valid location."}
                        />

                        <TextInput
                            setText={setBio}
                            value={bio}
                            placeholder={"Tell us about yourself (optional)"}
                            isPassword={false}
                            autoCorrect={false}
                            error={errors.bio}
                            errorMessage={"Enter a valid bio."}
                        />

                        <Text style={styles.subtitle}>Contact Information</Text>

                        <TextInput
                            setText={setInstagram}
                            value={instagram}
                            placeholder={"@instagram_handle"}
                            isPassword={false}
                            autoCorrect={false}
                            error={errors.instagram}
                            errorMessage={"Enter a valid Instagram handle"}
                            onEndEditing={() => {
                                if (!RegexInstagram.test(instagram)) {
                                    setErrors({
                                        ...errors,
                                        instagram:
                                            "Please enter a valid instagram handle.",
                                    });
                                } else {
                                    setErrors({
                                        ...errors,
                                        instagram: undefined,
                                    });
                                }
                            }}
                        />
                        <TextInput
                            setText={setDiscrod}
                            value={discord}
                            placeholder={"#discord_tag"}
                            isPassword={false}
                            autoCorrect={false}
                            error={errors.discord}
                            errorMessage={"Please enter a valid Discord tag."}
                            onEndEditing={() => {
                                if (!RegexDiscord.test(discord)) {
                                    setErrors({
                                        ...errors,
                                        discord:
                                            "Please enter a valid Discord tag.",
                                    });
                                } else {
                                    setErrors({
                                        ...errors,
                                        discord: undefined,
                                    });
                                }
                            }}
                        />
                        <TextInput
                            setText={setTwitter}
                            value={twitter}
                            placeholder={"@twitter_user"}
                            isPassword={false}
                            autoCorrect={false}
                            error={errors.twitter}
                            errorMessage={"Enter a valid Twitter handle."}
                            onEndEditing={() => {
                                if (!RegexTwitter.test(twitter)) {
                                    setErrors({
                                        ...errors,
                                        twitter:
                                            "Please enter a valid Twitter handle.",
                                    });
                                } else {
                                    setErrors({
                                        ...errors,
                                        twitter: undefined,
                                    });
                                }
                            }}
                        />

                            {!loading ? (
                                <Button
                                    title="Continue"
                                    onPress={onPressRegister}
                                    style={styles.button}
                                />
                            ) : (
                                <ActivityIndicator
                                    size="small"
                                    color={Colors.green.primary}
                                    style={{marginTop: 20}}
                                />
                            )}
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: Colors.darkGray,
        textAlign: "center",
        paddingTop: 20,
        paddingBottom: 30,
        paddingTop: Dim.height * 0.075,
    },
    subtitle: {
        paddingLeft: 20,
        marginTop: 30,
        fontSize: 17,
        color: Colors.darkGray,
        textAlign: "left",
        paddingBottom: 10,
    },
    button: {
        marginTop: 30,
        alignSelf: "center",
        backgroundColor: Colors.green.primary,
        marginBottom: 30,
    },
});

export default CreateProfileScreen;
