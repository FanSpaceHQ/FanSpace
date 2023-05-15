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
            {isEditable ? (
                <View style={styles.input}>
                    <TextInput
                        multiline={true}
                        onChangeText={(text) => setBio(text)}
                        value={bio}
                        placeholder="Create a bio"
                        isEditable={isEditable}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                </View>
            ) : (
                <TouchableOpacity onPress={handleClick}>
                    <View
                        style={isFocused ? styles.inputFocused : styles.input}
                    >
                        <Text>{bio}</Text>
                    </View>
                </TouchableOpacity>
            )}

            <Button
                style={styles.button}
                title="Save"
                onPress={handleSaveBio}
            ></Button>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginLeft: 8,
        marginRight: 8,
        marginTop: 8,
        width: 100,
        alignSelf: "center",
    },
    input: {
        marginTop: 20,
        borderWidth: 1,
        marginLeft: 8,
        marginRight: 8,
        borderColor: "black",
        borderRadius: 16,
        height: 100,
        padding: 5,
        fontSize: 18,
        backgroundColor: "rgba(51, 127, 100, 0.5);",
        textAlignVertical: "top",
    },
    inputFocused: {
        marginTop: 20,
        borderWidth: 1,
        marginLeft: 8,
        marginRight: 8,
        borderColor: "black",
        borderRadius: 16,
        height: 100,
        padding: 5,
        fontSize: 18,
        backgroundColor: "rgba(51, 127, 100, 0.5);",
        textAlignVertical: "top",
    },
});

export default Bio;
