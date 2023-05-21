import { green } from "@mui/material/colors";
import { color } from "@rneui/base";
import React, { useState, useRef, useEffect } from "react";
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    TextInput,
    View,
    Keyboard,
} from "react-native";
import { Button, Text } from "react-native-elements";

const Bio = () => {
    const [bio, setBio] = useState("Default Bio");
    const [isEditable, setIsEditable] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const bioInputRef = useRef(null);

    const handleBlur = () => {
        if (isEditable) {
            setIsEditable(false);
            setIsFocused(false);
            Keyboard.dismiss();
            saveBio();
        }
    };

    const handleKeyPress = ({ nativeEvent }) => {
        if (nativeEvent.key === "Enter") {
            handleBlur();
        }
    };

    const saveBio = () => {
        console.log("Saving bio:", bio);
        // Here you can implement the logic to save the bio to your desired storage or API
    };

    const handleClick = () => {
        if (!isEditable) {
            setIsFocused(true);
            setIsEditable(true);
            bioInputRef.current.focus();
        }
    };

    useEffect(() => {
        if (isEditable) {
            Keyboard.addListener("keyboardDidHide", handleBlur);
            return () => {
                Keyboard.removeListener("keyboardDidHide", handleBlur);
            };
        }
    }, [isEditable]);

    return (
        <TouchableWithoutFeedback onPress={handleBlur}>
            <View>
                <TouchableOpacity onPress={handleClick}>
                    <View
                        style={isFocused ? styles.inputFocused : styles.input}
                    >
                        <View style={styles.aboutBox}>
                            <Text style={styles.aboutText}>About</Text>
                        </View>
                        {isEditable ? (
                            <TextInput
                                ref={bioInputRef}
                                style={styles.inputText}
                                multiline={true}
                                onChangeText={(text) => setBio(text)}
                                value={bio}
                                placeholder="Create a bio"
                                editable={isEditable}
                                onFocus={() => setIsFocused(true)}
                                onBlur={handleBlur}
                                onKeyPress={handleKeyPress}
                            />
                        ) : (
                            <Text style={styles.bioText}>{bio}</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    aboutBox: {
        backgroundColor: "#0DAD81",
        width: 73,
        marginLeft: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    aboutText: {
        color: "white",
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 20,
    },
    bioText: {
        color: "white",
        marginLeft: 20,
        fontSize: 18,
    },
    input: {
        marginTop: 20,
        borderWidth: 1,
        marginLeft: 8,
        marginRight: 8,
        borderWidth: 0,
        borderRadius: 16,
        height: 100,
        padding: 5,
        fontSize: 18,
        backgroundColor: "rgba(51, 127, 100, 0.5)",
        textAlignVertical: "top",
    },
    inputFocused: {
        marginTop: 20,
        borderWidth: 1,
        marginLeft: 8,
        marginRight: 8,
        borderWidth: 0,
        borderRadius: 16,
        height: 100,
        padding: 5,
        fontSize: 18,
        backgroundColor: "rgba(51, 127, 100, 0.5)",
        textAlignVertical: "top",
    },
    inputText: {
        color: "white",
        marginLeft: 20,
        fontSize: 18,
    },
});

export default Bio;
