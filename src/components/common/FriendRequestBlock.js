import React from "react";
import { View, StyleSheet, Text, Image,TouchableOpacity } from "react-native";
import { Colors, Dim } from "../../Constants";
import { Button } from "@react-native-material/core";
import { color } from "@rneui/base";
//
/*
  -- DOCUMENTATION --
*/
const FriendRequestBlock = (props) => {
    return (
        <View style={styles.container}>   
            <Image style={{ width: 50, height: 50, borderRadius: 50, marginLeft: 10, marginTop: 10, marginBottom: 10,marginRight: 10,}}
                source={{
                    uri: props.image,
                }}
                />
            <Text style={styles.header}>{props.name}
            <Text style={styles.subheader}>{"\n @"}{props.username} </Text></Text>
            <View style={styles.ButtonView}>
            <TouchableOpacity style={styles.roundedButton}><Text style={styles.buttonText}>Accept</Text></TouchableOpacity>
                <TouchableOpacity ><Text style={{fontSize: 20}}>X</Text></TouchableOpacity>
                </View>
        </View>
    );
};

const styles = StyleSheet.create({ 
    container: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width:Dim.width,
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: "#f0f0f0",
},
ButtonView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width:Dim.width*0.5,
    },

    header: {
        fontSize: 20,
    },
    buttonText: {
        color: "white",
    },
    roundedButton: {   
        width: 100,
        height: 30,
        backgroundColor: "#0DAD81",
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
subheader: {    
    color: Colors.darkGray,
    fontSize: 16,
    fontWeight: "medium",
    color:'#6D6D6D',
},});

export default FriendRequestBlock;
