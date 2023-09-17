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
import { getDatabase, onValue, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";

const Bio = (props) => {
    const [bio, setBio] = useState("");
    const [isEditable, setIsEditable] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        getBio();
    }, []);

    const getBio = async () => {
        onValue(ref(getDatabase(), "users/" + (props.id || getAuth().currentUser.uid) + "/bio"), snap => {
            setBio(snap.val());
        })
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
        set(ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/bio"), bio);
    };

    const handleClick = () => {
        if (!props.id || props.id === getAuth().currentUser.uid) {
            setIsEditable(true);
            setIsFocused(true);
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
                <TouchableOpacity onPress={handleClick}>
                    <View
                        style={isFocused ? styles.inputFocused : styles.input}
                    >
                        {isEditable ? (
                            <TextInput
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
                </TouchableOpacity>
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
        marginLeft: 8,
        marginRight: 8,
        borderWidth: 0,
        borderRadius: 16,
        height: 100,
        padding: 5,
        fontSize: 18,
        backgroundColor: "rgba(51, 127, 100, 0.5)",
        textAlignVertical: "center",
        justifyContent: "center"
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
        textAlignVertical: "center",
        justifyContent: "center"
    },
    inputText: {
        color: "white",
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 18,
        textAlignVertical: 'center'
    },
    bioText: {
        color: "white",
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 18,
        textAlignVertical: 'center'
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
});

export default Bio;
