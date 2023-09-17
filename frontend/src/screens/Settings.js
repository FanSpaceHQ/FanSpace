import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Alert
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
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref as dbRef, set } from "firebase/database";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

/*
  -- DOCUMENTATION --
*/
const SettingsPage = ({ props, navigation }) => {
    const [instagram, setInstagram] = useState("");
    const [discord, setDiscord] = useState("");
    const [twitter, setTwitter] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [image, setImage] = useState("");
    const [newImage, setNewImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        firstName: undefined,
        lastName: undefined,
        username: undefined,
        instagram: undefined,
        discord: undefined,
        twitter: undefined,
    });

    useEffect(() => {
        Promise.all([
            getDownloadURL(
                ref(
                    getStorage(),
                    "/images/" + getAuth().currentUser.uid + "/profile"
                )
            ),
            onValue(dbRef(getDatabase(), "users/" + getAuth().currentUser.uid), (snap) => {
                setFirstName(snap.val().firstName);
                setLastName(snap.val().lastName);
                setInstagram(snap.val().instagram);
                setTwitter(snap.val().twitter);
                setDiscord(snap.val().discord);
                setUsername(snap.val().username);
                setOriginalUsername(snap.val().username);
            })
        ]).then(res => {
            setImage(res[0]);
        })
        
    }, []);

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
            if (result.assets[0].fileSize > 5 * 1024 * 1024) {
                Alert.alert(
                    "Your image is too large!",
                    "Maximum image size is 5 MB"
                );
                return;
            }
            setImage(uri);
            setNewImage(true);
        }
    };

    const onPressRegister = async () => {
        const firstNameError =
            firstName.length > 0 ? undefined : "Enter a valid first name.";
        const lastNameError =
            lastName.length > 0 ? undefined : "Enter a valid last name.";
        let usernameError =
            username.length > 4 ? undefined : "Enter a valid username.";
        if (!usernameError && username !== originalUsername) {
            const usernameAvailable = httpsCallable(getFunctions(), 'usernameAvailable');
        
            let available = false;
            try {
                const res = await usernameAvailable({username: username});
                available = res.data;
            } catch (err) {
                console.error(err);
            }

            if (!available) {
                usernameError = "Username not available."
            }
        }
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
            firstNameError ||
            lastNameError ||
            usernameError ||
            instagramError ||
            discordError ||
            twitterError
        ) {
            setErrors({
                firstName: firstNameError,
                lastName: lastNameError,
                username: usernameError,
                instagram: instagramError,
                discord: discordError,
                twitter: twitterError,
            });
            return;
        }
        setLoading(true);

        try {
            if (newImage) {
                const imgResp = await fetch(image);
                const blb = await imgResp.blob();

                const sref = ref(getStorage(), '/images/' + getAuth().currentUser.uid + "/profile")
                await uploadBytesResumable(sref, blb);
            }

            const db = getDatabase();
            const uid = getAuth().currentUser.uid;
            await set(dbRef(db, "users/" + uid + "/username"), username.toLowerCase());
            await set(dbRef(db, "users/" + uid + "/firstName"), firstName);
            await set(dbRef(db, "users/" + uid + "/lastName"), lastName);
            await set(dbRef(db, "users/" + uid + "/instagram"), instagram);
            await set(dbRef(db, "users/" + uid + "/twitter"), twitter);
            await set(dbRef(db, "users/" + uid + "/discord"), discord);

            navigation.goBack();
        } catch (err) {
            console.log(err)
            if (err.message)
                Alert.alert(err.message, err.details);
            else 
                Alert.alert(err);
        }
        
    };

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
                    onPress={() => navigation.goBack()}
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
                                setText={setFirstName}
                                value={firstName}
                                placeholder={"First Name"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.firstName}
                                errorMessage={"Enter a valid first name."}
                            />

                            <TextInput
                                setText={setLastName}
                                value={lastName}
                                placeholder={"Last Name"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.lastName}
                                errorMessage={"Enter a valid last name."}
                            />

                            <TextInput
                                setText={setUsername}
                                value={username}
                                placeholder={"Username"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.username}
                                errorMessage={"Enter a valid username."}
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
                                setText={setDiscord}
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
                                    onPress={onPressRegister}
                                    style={{width: Dim.width * 0.9, marginBottom: 10, marginTop: 20}}
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
                                onPress={() => {
                                    getAuth().signOut();
                                }}
                                style={{width: Dim.width * 0.9, marginBottom: 30}}
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
        fontFamily: "Work Sans",
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
});

export default SettingsPage;
