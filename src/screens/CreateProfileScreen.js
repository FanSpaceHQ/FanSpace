import React from "react";
import { View, StyleSheet, Text, ScrollView, Alert } from "react-native";
import { useState } from "react";
import TextInput from "../components/common/TextInput";
import {
    Colors,
    RegexDiscord,
    RegexInstagram,
    RegexTwitter,
    RegexUsername,
} from "../Constants";
import Button from "../components/common/Button";
import { RegexPassword, RegexName } from "../Constants";
import AddProfilePhoto from "../components/common/AddProfilePhoto";

/*
  -- DOCUMENTATION --
*/
const CreateProfileScreen = ({ props, navigation }) => {
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [instagram, setInstagram] = useState("");
    const [discord, setDiscrod] = useState("");
    const [twitter, setTwitter] = useState(true);

    const [errors, setErrors] = useState({
        location: undefined,
        bio: undefined,
        instagram: undefined,
        discord: undefined,
        twitter: undefined,
    });

    // console.log(errors);
    // console.log(lastName);

    function success(navigation) {
        {
            navigation.navigate("Create Profile");
        }
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
        } else {
            setCreate(true);
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View
                style={{
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Text style={styles.title}>Create your account.</Text>

                <View>
                    <TextInput
                        setText={setLocation}
                        value={location}
                        placeholder={"Where are you located?"}
                        isPassword={false}
                        autoCorrect={false}
                        error={errors.location}
                        errorMessage={"Enter a valid location."}
                        // onEndEditing={() => {
                        //     if (!RegexName.test(firstName)) {
                        //         setErrors({
                        //             ...errors,
                        //             firstName:
                        //                 "Please enter a valid first name.",
                        //         });
                        //     } else {
                        //         setErrors({
                        //             ...errors,
                        //             firstName: undefined,
                        //         });
                        //     }
                        // }}
                    />

                    <TextInput
                        setText={setBio}
                        value={bio}
                        placeholder={"Tell us about yourself (optional)"}
                        isPassword={false}
                        autoCorrect={false}
                        error={errors.bio}
                        errorMessage={"Enter a valid bio."}
                        // onEndEditing={() => {
                        //     if (!RegexName.test(bio)) {
                        //         setErrors({
                        //             ...errors,
                        //             lastName: "Please enter a valid last name.",
                        //         });
                        //     } else {
                        //         setErrors({
                        //             ...errors,
                        //             lastName: undefined,
                        //         });
                        //     }
                        // }}
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

                    <Button
                        title="Continue"
                        // onPress={onPressRegister}
                        onPress={() => navigation.navigate("Create Profile")}
                        style={styles.button}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: Colors.darkGray,
        textAlign: "center",
        paddingTop: 20,
        paddingBottom: 30,
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
        backgroundColor: Colors.primaryGreen,
    },
});

export default CreateProfileScreen;
