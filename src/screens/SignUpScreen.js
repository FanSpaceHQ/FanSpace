import React from "react";
import { View, StyleSheet, Text, ScrollView, Image } from "react-native";
import { useState } from "react";
import TextInput from "../components/common/TextInput";
import { Colors, RegexUsername } from "../Constants";
import Button from "../components/common/Button";
import { RegexPassword, RegexName } from "../Constants";
import AddProfilePhoto from "../components/common/AddProfilePhoto";
import * as ImagePicker from "expo-image-picker";

/*
  -- DOCUMENTATION --
*/
const SignUpScreen = ({ props, navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [create, setCreate] = useState(true);

    const [errors, setErrors] = useState({
        firstName: undefined,
        lastName: undefined,
        password: undefined,
        confirm: undefined,
        username: undefined,
    });

    const [image, setImage] = useState(null);
    const [imagePicked, setImagePicked] = useState(false);

    console.log(imagePicked);
    console.log(image);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setImagePicked(true);
        }
    };

    function success(navigation) {
        {
            navigation.navigate("Create Profile");
        }
    }

    const onPressRegister = async () => {
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
        const usernameError =
            username.length > 0 && RegexUsername.test(username)
                ? undefined
                : "You must enter a username.";

        if (
            firstNameError ||
            lastNameError ||
            passwordError ||
            confirmError ||
            usernameError
        ) {
            setErrors({
                firstName: firstNameError,
                lastName: lastNameError,
                password: passwordError,
                confirm: confirmError,
                username: usernameError,
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

                {image ? (
                    <View>
                        {image && (
                            <Image
                                source={{ uri: image }}
                                style={{
                                    width: 104,
                                    height: 104,
                                    borderRadius: 1000,
                                    marginBottom: 20,
                                }}
                            />
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
                                    lastName: "Please enter a valid last name.",
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
                        setText={setUsername}
                        value={username}
                        placeholder={"Username"}
                        isPassword={false}
                        autoCorrect={false}
                        error={errors.username}
                        errorMessage={"Enter a valid username"}
                        onEndEditing={() => {
                            if (!RegexUsername.test(username)) {
                                setErrors({
                                    ...errors,
                                    username: "Please enter a valid username.",
                                });
                            } else {
                                setErrors({
                                    ...errors,
                                    username: undefined,
                                });
                            }
                        }}
                    />
                    <TextInput
                        setText={setPassword}
                        value={password}
                        placeholder={"Password"}
                        isPassword={false}
                        autoCorrect={false}
                        error={errors.password}
                        errorMessage={
                            "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and a special character."
                        }
                        onEndEditing={() => {
                            if (!RegexPassword.test(password)) {
                                setErrors({
                                    ...errors,
                                    password: "Please enter a valid password.",
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
                        isPassword={false}
                        autoCorrect={false}
                        error={errors.confirm}
                        errorMessage={"Your password does not match."}
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
        marginTop: 20,
        fontSize: 17,
        color: Colors.darkGray,
        textAlign: "left",
        fontWeight: "bold",
        paddingBottom: 30,
    },
    button: {
        marginTop: 30,
        alignSelf: "center",
        backgroundColor: Colors.primaryGreen,
    },
});

export default SignUpScreen;
