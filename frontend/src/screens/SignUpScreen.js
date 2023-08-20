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
import { Colors, RegexEmail } from "../Constants";
import Button from "../components/common/Button";
import { RegexPassword, RegexName } from "../Constants";
import AddProfilePhoto from "../components/common/AddProfilePhoto";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";

const { width, height } = Dimensions.get("window");

const axios = require("axios").default;
const FormData = require("form-data");

/*
  -- DOCUMENTATION --
*/
const SignUpScreen = ({ props, navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [imagePicked, setUpload] = useState(false);
    const [pfpUrl, setUrl] = useState("");
    const [image, setImage] = useState("");
    const [userName, setUser] = useState("");
    const [profileCreated, setCreate] = useState(false); // Check back and look for the purpose of this
    const [errors, setErrors] = useState({
        firstName: undefined,
        lastName: undefined,
        password: undefined,
        confirm: undefined,
        email: undefined,
        username: undefined,
    });

    const imageUpload = async (uri) => {
        AsyncStorage.setItem("@imageUrl", uri);
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
        let imageUrl;
        await axios
            .post("http://localhost:4000/api/users/uploadImage", data, {
                "content-type": "multipart/form-data",
            })
            .then((response) => {
                // console.log(response.data.url);
                setUrl(response.data.url);
                imageUrl = response.data.url;
                return response.data.url;
            })
            .catch(function (error) {
                console.log(error);
                console.log(error.data);
                return error;
            });
        return imageUrl;
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

    const checkUsername = async () => {
        let response; 
        await axios
            .get(`http://localhost:4000/api/users/username/${userName}`)
            .then((res)=>{
                response = res.data;
                AsyncStorage.setItem("@username", userName);
            })
            .catch((err)=>{
                console.log(err);
                const usernameError = "Username already exists";
                setErrors({
                    username: usernameError,
                });
                setLoading(false);
                return;
            })
        if (response.Status){
            const usernameError = undefined
            setErrors({username: usernameError});
            let imageUrl; 
            imageUrl = await imageUpload(image);
            // console.log(imageUrl);
            await signUp(firstName, lastName, email, password, imageUrl, userName);
        }
    }

    const onPressRegister = async () => {
        if (!imagePicked)
            return;
        const firstNameError =
            firstName.length > 0 ? undefined : "You must enter a first name.";
        const lastNameError =
            lastName.length > 0 ? undefined : "You must enter a last name.";
        const passwordError =
            password.length > 0 && RegexPassword.test(password)
                ? undefined
                : "Please enter a valid password.";
        const confirmError =
            password !== confirm && password.length > 0
                ? "Passwords don't match"
                : undefined;
        const emailError =
            email.length > 0 && RegexEmail.test(email)
                ? undefined
                : "You must enter a valid email.";

        if (
            firstNameError ||
            lastNameError ||
            passwordError ||
            confirmError ||
            emailError
        ) {
            setErrors({
                firstName: firstNameError,
                lastName: lastNameError,
                password: passwordError,
                confirm: confirmError,
                email: emailError,
            });
        } else {
            setLoading(true);
            await checkUsername();
            setLoading(false);
        }
    };

    const signUp = async (fname, lname, email, password, imageUrl, username) => {
        let data = new FormData();
        data.append("email", email), data.append("username", username);
        data.append("password", password), data.append("firstName", fname);
        data.append("lastName", lname), data.append("imageUrl", imageUrl);
        try {
            let uid;
            await axios
                .post("http://localhost:4000/api/users/", data, {
                    "content-type": "multipart/form-data",
                })
                .then((response) => {
                    const uid = JSON.stringify(response.data.uid);
                    const firstName = response.data.firstName;
                    // console.log(JSON.stringify(response.data.uid));
                    AsyncStorage.setItem("@uid", response.data.uid);
                    AsyncStorage.setItem("@firstName", fname);
                    // AsyncStorage.setItem("@imageUrl", imageUrl);
                    setLoading(false);
                    navigation.navigate("Create Profile");
                })
                .catch(function (error) {
                    console.log(error);
                    console.log(error.data);
                });
            return uid;
        } catch (error) {
            console.log(error);
            console.log(error.data);
            return error;
        }
    };

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
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "center",
                            paddingTop: 25,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Sign In")}
                        >
                            <Icon
                                name={"arrow-left"}
                                size={24}
                                color={Colors.darkGray}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.subtitle}>Profile</Text>
                        <Text style={styles.title}>Create your account</Text>

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
                                placeholder={"First name"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.firstName}
                                errorMessage={"Enter a valid first name."}
                                onEndEditing={() => {
                                    if (!RegexName.test(firstName)) {
                                        setErrors({
                                            ...errors,
                                            firstName:
                                                "Please enter a valid first name.",
                                        });
                                    } else {
                                        setErrors({
                                            ...errors,
                                            firstName: undefined,
                                        });
                                    }
                                }}
                            />

                            <TextInput
                                setText={setLastName}
                                value={lastName}
                                placeholder={"Last name"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.lastName}
                                errorMessage={"Enter a valid last name."}
                                onEndEditing={() => {
                                    if (!RegexName.test(lastName)) {
                                        setErrors({
                                            ...errors,
                                            lastName:
                                                "Please enter a valid last name.",
                                        });
                                    } else {
                                        setErrors({
                                            ...errors,
                                            lastName: undefined,
                                        });
                                    }
                                }}
                            />

                            <TextInput
                                setText={setUser}
                                value={userName}
                                placeholder={"Username"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.username}
                                errorMessage={"Username already exists"}
                            />

                            <TextInput
                                setText={setEmail}
                                value={email}
                                placeholder={"Email"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.email}
                                errorMessage={"Enter a valid email"}
                                onEndEditing={() => {
                                    if (!RegexEmail.test(email)) {
                                        setErrors({
                                            ...errors,
                                            email: "Please enter a valid email.",
                                        });
                                    } else {
                                        setErrors({
                                            ...errors,
                                            email: undefined,
                                        });
                                    }
                                }}
                            />
                            <TextInput
                                setText={setPassword}
                                value={password}
                                placeholder={"Password"}
                                isPassword={true}
                                autoCorrect={false}
                                error={errors.password}
                                errorMessage={
                                    "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and a special character."
                                }
                                onEndEditing={() => {
                                    if (!RegexPassword.test(password)) {
                                        setErrors({
                                            ...errors,
                                            password:
                                                "Please enter a valid password.",
                                        });
                                    } else {
                                        setErrors({
                                            ...errors,
                                            password: undefined,
                                        });
                                    }
                                }}
                            />
                            <TextInput
                                setText={setConfirm}
                                value={confirm}
                                placeholder={"Confirm password again"}
                                isPassword={true}
                                autoCorrect={false}
                                error={errors.confirm}
                                errorMessage={"Your password does not match."}
                            />

                            {!loading ? (
                                <Button
                                    title="Continue"
                                    onPress={onPressRegister}
                                    style={{
                                        marginTop: height * 0.0175,
                                        alignSelf: "center",
                                        backgroundColor: Colors.green.primary,
                                        marginBottom: 30,
                                    }}
                                />
                            ) : (
                                <ActivityIndicator
                                    size="small"
                                    color={Colors.green.primary}
                                    style={{  marginTop: 20  }}
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
        fontSize: 25,
        color: Colors.darkGray,
        textAlign: "center",
        // paddingTop: height * 0.075,
        paddingBottom: 30,
    },
    subtitle: {
        // paddingLeft: -20,
        // marginTop: 100,
        paddingTop: height * 0.055,
        fontSize: 17,
        color: Colors.darkGray,
        textAlign: "center",
        // fontWeight: "bold",
        paddingBottom: 30,
        // position: "absolute",
    },
    button: {
        marginTop: height * 0.0175,
        alignSelf: "center",
        backgroundColor: Colors.green.primary,
        marginBottom: 30,
    },
    icon: {
        paddingTop: height * 0.055,
        alignSelf: "flex-start",
        position: "absolute",
        // top: 5,
        left: -150,
    },
});

export default SignUpScreen;