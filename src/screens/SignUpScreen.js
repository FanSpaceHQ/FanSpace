import React from "react";
import { View, StyleSheet, Text, ScrollView, Alert } from "react-native";
import { useState } from "react";
import TextInput from "../components/common/TextInput";
import { Colors, RegexEmail} from "../Constants";
import Button from "../components/common/Button";
import { RegexPassword, RegexName } from "../Constants";
import AddProfilePhoto from "../components/common/AddProfilePhoto";
const axios=require('axios').default
//const got=require('got')
const FormData = require('form-data');
//const request=require('http')
//const fetch=require('node-fetch')
//const needle=require('needle')
/*
  -- DOCUMENTATION --
*/
const SignUpScreen = ({ props, navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [create, setCreate] = useState(true);

    const [errors, setErrors] = useState({
        firstName: undefined,
        lastName: undefined,
        password: undefined,
        confirm: undefined,
        email: undefined,
    });

    // console.log(errors);
    // console.log(lastName);

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
            setCreate(true);
        }
    };

    const signUp=async(fname,lname,email,password)=>{
          //console.log(data)
        let data = new FormData();
        data.append('email',email );
        data.append('password', password), 
        data.append('firstName', fname);
        data.append('lastName', lname);
        await axios.post('http://localhost:4000/api/users/', data, {
            'content-type': 'multipart/form-data'
          }).then((response)=>{
            console.log(JSON.stringify(response.data));
             console.log(response)
             return response
    }).catch(function (error) {
        console.log(error);
        console.log(error.data)
        return error
        })
    }

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
                    <AddProfilePhoto
                        style={{ margin: 10 }}
                        onPress={() =>
                            Alert.alert("Add Profile Photo logic later")
                        }
                    />
                </View>
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
                        onPress={async() => {
                            const userToken=await signUp(firstName,lastName,email,password)
                            if (userToken)
                                navigation.navigate("Create Profile")
                        }
                    }
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
