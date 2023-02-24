import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../Constants";
import Icon from "react-native-vector-icons/Feather";

/*
  -- DOCUMENTATION --
*/
const AddProfilePhoto = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View
                style={{
                    ...props.style,
                    backgroundColor: Colors.primaryGreen,
                    height: 104,
                    width: 104,
                    borderRadius: 1000,
                }}
            >
                <Icon
                    style={{
                        position: "absolute",
                        top: 40,
                        left: 40,
                        right: 0,
                        bottom: 0,
                    }}
                    name={"plus"}
                    size={24}
                    color={"white"}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({});

export default AddProfilePhoto;
