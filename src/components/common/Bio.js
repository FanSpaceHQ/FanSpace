import { green } from "@mui/material/colors";
import { color } from "@rneui/base";
import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, TextInput, View } from "react-native";
import { Button, Text } from "react-native-elements";

const Bio = () => {
    const [bio, setBio] = useState("Default Bio");
    const [isEditable, setIsEditable] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const handleSaveBio = () => {
        // Save the bio
        console.log("Saving bio:", bio);
        setIsEditable(false);
    };

    const handleClick = () => {
        if (!isEditable) {
            setIsFocused(true);
            setIsEditable(true);
        }
    };

    return (
        <View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button]}
                    onPress={handleSaveBio}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleClick}>
                <View style={isFocused ? styles.inputFocused : styles.input}>
                    <View style={styles.aboutBox}>
                        <Text style={styles.aboutText}>About</Text>
                    </View>
                    {isEditable ? (
                        <TextInput
                            style={styles.inputText}
                            multiline={true}
                            onChangeText={(text) => setBio(text)}
                            value={bio}
                            placeholder="Create a bio"
                            editable={isEditable}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    ) : (
                        <Text style={styles.bioText}>{bio}</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
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
    buttonContainer: {
        marginTop: -50,
        alignSelf: "center",
        height: 50,
    },
    buttonText: {
        color: "#0DAD81",
        textAlign: "center",
        paddingTop: 5,
    },
    button: {
        marginLeft: 8,
        marginRight: 8,
        borderColor: "#0DAD81",
        width: 100,
        backgroundColor: "white",
        alignSelf: "center",
        borderWidth: 1,
        borderRadius: 16,
        height: 32,
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
