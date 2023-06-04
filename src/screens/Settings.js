import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    TouchableNativeFeedback,
} from "react-native";
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
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
  -- DOCUMENTATION --
*/
const SettingsPage = ({ props, navigation }) => {
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [instagram, setInstagram] = useState("");
    const [discord, setDiscrod] = useState("");
    const [twitter, setTwitter] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        location: undefined,
        bio: undefined,
        instagram: undefined,
        discord: undefined,
        twitter: undefined,
    });

    const imageUpload = async (uri) => {
        async function uriToBase64(uri) {
            let response = await fetch(uri);
            let blob = await response.blob();

            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;

                reader.readAsDataURL(blob);
            });
        }
        let base64String = await uriToBase64(uri);
        let imageByte = new Buffer(base64String, "base64");
        var image = {
            uri: uri,
            name: "image.jpg",
            buffer: imageByte,
        };
        let data = new FormData();
        data.append("File", {
            uri: image.uri,
            buffer: [image.buffer.data, image.buffer.type],
            name: image.name,
            mimetype: "image/jpeg",
        });
        await axios
            .post("http://localhost:4000/api/users/uploadImage", data, {
                "content-type": "multipart/form-data",
            })
            .then((response) => {
                setUrl(JSON.stringify(response.data).url);
                return response;
            })
            .catch(function (error) {
                console.log(error);
                console.log(error.data);
                return error;
            });
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: true,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        // console.log(result);
        if (!result.canceled) {
            let uri = result.assets[0].uri;
            setImage(uri);
            setUpload(true);
        }
    };

    const handleSave = () => {
        console.log("Saved!");
    };
    // const success = async () => {
    //     await AsyncStorage.setItem("@discord", discord);
    //     await AsyncStorage.setItem("@twitter", twitter);
    //     await AsyncStorage.setItem("@bio", bio);
    //     await AsyncStorage.setItem("@instagram", instagram);
    //     await AsyncStorage.setItem("@location", location);
    //     setLoading(false);
    //     navigation.navigate("NavbarStack");
    // };

    // const onPressRegister = async () => {
    //     const locationError =
    //         location.length > 0 ? undefined : "You must enter a location";
    //     const bioError =
    //         bio.length > 0 ? undefined : "Please enter a valid password.";
    //     const instagramError =
    //         instagram.length > 0 ? undefined : "Enter a valid Instagram handle";
    //     const discordError =
    //         discord.length > 0
    //             ? undefined
    //             : "You must enter valid Discord tag.";
    //     const twitterError =
    //         twitter.length > 0
    //             ? undefined
    //             : "You must enter valid Twitter handle.";

    //     if (
    //         locationError ||
    //         bioError ||
    //         instagramError ||
    //         discordError ||
    //         twitterError
    //     ) {
    //         setErrors({
    //             location: locationError,
    //             bio: bioError,
    //             instagram: instagramError,
    //             discord: discordError,
    //             twitter: twitterError,
    //         });
    //         return;
    //     }
    //     setLoading(true);
    //     let data = new FormData();

    //     data.append("discord", discord), data.append("instagram", instagram);
    //     data.append("bio", bio), data.append("twitter", twitter);
    //     data.append("location", location);
    //     await AsyncStorage.getItem("@uid").then((uid) => {
    //         data.append("uid", uid);
    //     });
    //     await axios
    //         .patch("http://localhost:4000/api/users/", data, {
    //             "content-type": "multipart/form-data",
    //         })
    //         .then((response) => {
    //             console.log("Patched Account");
    //             success();
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    // const sendProfile = async(location,bio,instagram,discord,twitter)

    return (
        <KeyboardAwareScrollView
            style={{
                backgroundColor: "white",
                flex: Platform.OS === "ios" ? 1 : null,
                paddingTop: 0,
            }}
            // contentContainerStyle={{
            //     alignItems: "center",
            //     justifyContent: "center",
            // }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            extraScrollHeight={25}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.topRow}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile Screen")}
                >
                    <Text style={styles.subheader}>
                        {" "}
                        <Text style={styles.arrow}>← </Text> Back
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "center",
                            paddingTop: 25,
                        }}
                    >
                        <Text style={styles.title}>Settings</Text>

                        {image ? (
                            <View>
                                {image && (
                                    <TouchableOpacity onPress={pickImage}>
                                        <Image
                                            source={{ uri: image }}
                                            style={{
                                                width: 104,
                                                height: 104,
                                                borderRadius: 1000,
                                                marginBottom: 20,
                                            }}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : (
                            <View>
                                <AddProfilePhoto
                                    style={{
                                        margin: 10,
                                        backgroundColor: Colors.primaryGreen,
                                    }}
                                    onPress={pickImage}
                                />
                            </View>
                        )}

                        <View>
                            <TextInput
                                setText={setLocation}
                                value={location}
                                placeholder={"First Name"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.location}
                                errorMessage={"Enter a valid first name."}
                            />

                            <TextInput
                                setText={setBio}
                                value={bio}
                                placeholder={"Last Name"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.bio}
                                errorMessage={"Enter a valid last name."}
                            />

                            <TextInput
                                setText={setBio}
                                value={bio}
                                placeholder={"Username"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.bio}
                                errorMessage={"Enter a valid last name."}
                            />

                            <Text style={styles.subtitle}>
                                Contact Information
                            </Text>

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
                                errorMessage={
                                    "Please enter a valid Discord tag."
                                }
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
                                    title="Save"
                                    //onPress={onPressRegister}
                                    onPress={() =>
                                        navigation.navigate("Profile Screen")
                                    }
                                    style={styles.button}
                                />
                            ) : (
                                <ActivityIndicator
                                    size="small"
                                    color={Colors.green.primary}
                                    style={{ marginTop: 20 }}
                                />
                            )}

                            <Button
                                title="Sign Out"
                                //onPress={onPressRegister}
                                onPress={() => navigation.navigate("Sign In")}
                                style={styles.button}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    topRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: Dim.height * 0.06,
        marginLeft: Dim.width * 0.05,
        marginBottom: Dim.height * 0.02,
    },
    subheader: {
        color: Colors.darkGray,
        fontSize: 16,
        fontWeight: "medium",
        color: "#6D6D6D",
    },
    arrow: {
        fontSize: 20,
        fontWeight: "bold",
    },
    icon: {
        size: 35,
    },
    header: {
        fontSize: 30,
        fontFamily: "WorkSans",
    },
    title: {
        fontSize: 24,
        color: Colors.darkGray,
        textAlign: "center",
        paddingTop: 10,
        paddingBottom: 30,
        paddingTop: Dim.height * 0,
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
        marginTop: Dim.height * 0.02,
        alignSelf: "center",
        backgroundColor: Colors.green.primary,
        marginBottom: Dim.height * 0.01,
    },
});

export default SettingsPage;
