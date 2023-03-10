import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "../../Constants";
import Icon from "react-native-vector-icons/Feather";

/*
  -- DOCUMENTATION --
*/
const AddProfilePhoto = (props) => {
    return props.imagePicked ? (
        <Image
            source={{
                uri: props.Image,
            }}
            style={{
                height: 104,
                width: 104,
                alignSelf: "center",
                borderRadius: 1000,
            }}
        />
    ) : (
        <TouchableOpacity onPress={props.onPress}>
            <View
                style={{
                    ...props.style,
                    backgroundColor: Colors.green.primary,
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
