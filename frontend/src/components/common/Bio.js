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
import { Dim } from "../../Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Bio = () => {
    const [bio, setBio] = useState("");
    const [isEditable, setIsEditable] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const bioInputRef = useRef(null);

    useEffect(() => {
        getBio();
    });

    const getBio = async () => {
        try {
            const value = await AsyncStorage.getItem("@bio");
            if (value !== null) {
                setBio(value);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBlur = () => {
        if (isEditable) {
            setIsEditable(false);
            setIsFocused(false);
            Keyboard.dismiss();
            saveBio();
        }
    };

    const saveBio = () => {
        console.log("Saving bio:", bio);
        // Implement the logic to save the bio to your desired storage or API
    };

    const handleClick = () => {
        setIsEditable(true);
        setIsFocused(true);
        if (bioInputRef.current) {
            bioInputRef.current.focus();
        }
    };

    const handleSaveClick = () => {
        handleBlur();
        // Implement any additional logic you need when saving the bio
        // This function will be triggered when another button is clicked
    };

    return (
        <TouchableWithoutFeedback onPress={handleBlur}>
            <View>
                {/* <TouchableOpacity onPress={handleClick}> */}
                    <View
                        style={isFocused ? styles.inputFocused : styles.input}
                    >
                        <View style={styles.about}>
                            <Text style={{color:"#FFFFFF",  fontSize: 8, textAlign: "center"}}>About</Text>
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
                            />
                        ) : (
                            <Text style={styles.bioText}>{bio}</Text>
                        )}
                    </View>
                {/* </TouchableOpacity> */}
                {isEditable && (
                    <Button
                        title="Save"
                        onPress={handleSaveClick}
                        buttonStyle={styles.saveButton}
                        titleStyle={styles.saveButtonTitle}
                    />
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    saveButtonTitle: {
        marginTop: Dim.height * -0.003,
        color: "green",
        fontSize: 14,
    },
    input: {
        marginTop: 20,
        borderWidth: 1,
        marginLeft: 25,
        marginRight: 25,
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
        marginLeft: 25,
        marginRight: 25,
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
    bioText: {
        color: "white",
        marginLeft: 20,
        fontSize: 18,
    },
    saveButton: {
        marginLeft: 8,
        marginRight: 8,
        marginTop: 8,
        borderColor: "#0DAD81",
        width: 100,
        backgroundColor: "white",
        alignSelf: "center",
        borderWidth: 1,
        borderRadius: 16,
        height: 32,
    },
    about: {
        height: 16,
        width: 48,
        backgroundColor: "#0DAD81",
        borderRadius: 3,
        justifyContent: 'center', 
        alignItems: 'center',
        marginLeft: 15,
        marginTop: 12
    }
});

export default Bio;
