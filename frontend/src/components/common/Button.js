import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors, Dim } from "../../Constants";

/*
  -- DOCUMENTATION --
*/
const Button = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.button}>
                <Text style={styles.text}>
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        borderColor: Colors.green.primary,
        borderWidth: 1,
        width: 170,
        marginTop: 5
    },
    text: {
        color: Colors.green.primary,
        textAlign: "center", 
        marginHorizontal: 12,
        marginVertical: 10

    }
});

export default Button;
