import React from "react";
import { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    Image,
    Alert,
    Dimensions,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import { Colors } from "../Constants";
import { auth } from "../../backend/firebase.js";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/*
  -- DOCUMENTATION --
*/

// Size of the screen
const { width, height } = Dimensions.get("window");

const SignInScreen = ({ props, navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [errors, setError] = useState(false);

    useEffect(() => {
        null;
    });

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
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        paddingTop: 25,
                    }}
                >
                    <Image
                        source={require("../assets/FanspaceLogo.png")}
                        style={{ maxHeight: 170, maxWidth: 170, marginTop: 50 }}
                    />
                    <Text
                        style={{
                            marginTop: 10,
                            fontSize: 50,
                            fontWeight: "bold",
                        }}
                    >
                        FanSpace
                    </Text>
                    <Text style={styles.subtitle}>Expand your orbit</Text>

                    <TextInput
                        onChangeText={setEmail}
                        value={email}
                        title={null}
                        placeholder={"Email"}
                        isPassword={false}
                        autoCorrect={false}
                        error={errors}
                        errorMessage={"Email or password is invalid"}
                    />

                    <TextInput
                        onChangeText={setPassword}
                        value={password}
                        title={null}
                        placeholder={"Password"}
                        isPassword={true}
                        autoCorrect={false}
                        error={errors}
                        errorMessage={"Email or password is invalid"}
                    />

                    <View>
                        {loading ? (
                            // TODO Layer over the button
                            <ActivityIndicator
                                size="large"
                                color={Colors.primary}
                                style={styles.activity}
                            />
                        ) : (
                            <Button
                                title="Log In"
                                onPress={() => {
                                    setLoading(true);
                                    signInWithEmailAndPassword(
                                        auth,
                                        email,
                                        password
                                    )
                                        .then((userCred) => {
                                            // const uid = userCred.user.uid;
                                            //TODO set local state to userid
                                            AsyncStorage.setItem[
                                                ("@uid", userCred.user.uid)
                                            ];
                                            Alert.alert(
                                                "signed in successfully!"
                                            );
                                            navigation.navigate("Home");
                                        })
                                        .catch((error) => {
                                            // Alert.alert(error.code);
                                            setLoading(false);
                                            setError(true);
                                        });
                                }}
                                style={styles.button}
                            />
                        )}
                    </View>

                    <View>
                        <Text
                            onPress={() => navigation.navigate("Sign Up")}
                            style={styles.signUp}
                        >
                            Don't have an account?
                            <Text style={{ fontWeight: "bold" }}> Sign Up</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    subtitle: {
        marginTop: 4,
        fontSize: 20,
        color: "#9B9BA5",
        textAlign: "center",
        paddingBottom: 50,
    },
    button: {
        marginTop: height * 0.0175,
        alignSelf: "center",
        backgroundColor: Colors.green.primary,
    },
    signUp: {
        fontSize: 16,
        marginTop: 20,
    },
});

export default SignInScreen;

/*
  -- DOCUMENTATION --
*/
// const LoginScreen = (props) => {
//     const [text, onChangeText] = useState("Placeholder text");

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//             <ScrollView>
//                 <View
//                     style={{
//                         flexDirection: "column",
//                         alignItems: "center",
//                         paddingTop: 25,
//                     }}
//                 >
//                     <Image
//                         source={require("../assets/FanspaceLogo.png")}
//                         style={{ maxHeight: 170, maxWidth: 170, marginTop: 50 }}
//                     />
//                     <Text style={{ marginTop: 10, fontSize: 40 }}>
//                         FanSpace
//                     </Text>
//                     <Text
//                         style={{ marginTop: 4, fontSize: 15, color: "#9B9BA5" }}
//                     >
//                         Expand your Orbit
//                     </Text>

//                     <TextInput
//                         onChangeText={onChangeText}
//                         value={text}
//                         style={{
//                             height: 40,
//                             width: Dim.width * 0.8,
//                             margin: 12,
//                             borderWidth: 1,
//                             padding: 10,
//                         }}
//                     />
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({});

// export default LoginScreen;
