import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors, Dim } from "../../Constants";

/*
  -- DOCUMENTATION --
*/
const Button = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View
                style={{
                    ...props.style,
                    width: Dim.width * 0.5,
                    borderRadius: 30,
                }}
            >
                <Text
                    style={{
                        padding: 15,
                        fontSize: 16,
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({});

export default Button;
