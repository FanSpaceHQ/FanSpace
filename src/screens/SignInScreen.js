import React from "react";
import { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    Image,
    Alert,
} from "react-native";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import { Colors } from "../Constants";
import {auth} from '../../backend/firebase.js'
// import axios from "axios";

/*
  -- DOCUMENTATION --
*/
const SingInScreen = ({ props, navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        null;
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
                    setText={setEmail}
                    value={email}
                    title={null}
                    placeholder={"Email"}
                    isPassword={false}
                    autoCorrect={false}
                />

                <TextInput
                    setText={setPassword}
                    value={password}
                    title={null}
                    placeholder={"Password"}
                    isPassword={true}
                    autoCorrect={false}
                />

                <Button
                    title="Log In"
                    onPress={() =>{
                    Alert.alert("Login")
                    navigation.navigate("Home")
                }}
                    style={styles.button}
                />

                <View>
                    <Text
                        // onPress={() => Alert.alert("Sign Up")}

                        onPress={() => navigation.navigate("Sign Up")}
                        style={styles.signUp}
                    >
                        Don't have an account?
                        <Text style={{ fontWeight: "bold" }}> Sign Up</Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
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
        marginTop: 20,
        backgroundColor: Colors.primary,
    },
    signUp: {
        fontSize: 16,
        marginTop: 20,
    },
});

export default SingInScreen;

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
