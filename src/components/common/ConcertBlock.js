import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { Colors, Dim } from "../../Constants";
//
/*
  -- DOCUMENTATION --
*/
const ConcertBlock = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View>
                <View
                    style={{
                        marginBottom: 20,
                        alignSelf: "center",
                        flexDirection: "row",
                        height: 150,
                        width: Dim.width * 0.84,
                        backgroundColor: "white",
                        borderRadius: 30,
                        borderColor: Colors.darkGray,
                        borderWidth: 1,
                        padding: 20,
                        paddingVertical: 20,
                        shadowColor: Colors.lightGray,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 2,
                    }}
                >
                    <Image
                        source={{
                            uri: props.image,
                        }}
                        style={{
                            height: 110,
                            width: 110,
                            borderRadius: 20,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "column",
                            marginLeft: 20,
                            paddingTop: 5,
                        }}
                    >
                        <Text style={styles.header}>{props.name}</Text>
                        <Text style={styles.subheader}>{props.title}</Text>
                        <Text style={styles.date}>{props.date}</Text>
                        <Text style={styles.location}>{props.location}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    header: { fontSize: 20, fontWeight: "bold", flexWrap: "wrap", width: 130 },
    subheader: { fontSize: 15, flexWrap: "wrap", width: 130, marginTop: 5 },
    date: { fontSize: 11, flexWrap: "wrap", width: 130, marginTop: 5 },
    location: {
        fontSize: 11,
        flexWrap: "wrap",
        width: 130,
        marginTop: 5,
        fontWeight: "bold",
    },
});

export default ConcertBlock;
