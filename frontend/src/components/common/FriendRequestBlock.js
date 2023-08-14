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
                <View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start"}}>
            <Text style={styles.header}>{props.name}
            <Text style={styles.subheader}>{"\n @"}{props.username} </Text></Text>
            </View>
            <View style={styles.ButtonView}>
            <TouchableOpacity style={styles.roundedButton}><Text style={styles.buttonText}>Accept</Text></TouchableOpacity>
                <TouchableOpacity ><Text style={{fontSize: 20}}><Image style={{ width: 15, height: 15,}} source={{
                    uri: "https://cdn.icon-icons.com/icons2/1863/PNG/512/close_119285.png",
                }}></Image></Text></TouchableOpacity>
                </View>
        </View>
    );
};

const styles = StyleSheet.create({ 
    container: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width:  Dim.width * 0.95,
        marginTop: 15,
        backgroundColor: "#f0f0f0",
},
ButtonView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
    marginRight: 30,
    alignItems: "center",
    },

    header: {
        fontSize: 20,
    },
    buttonText: {
        color: "white",
    },
    roundedButton: {   
        width: 100,
        height: 35,
        backgroundColor: "#0DAD81",
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        
    },
subheader: {    
    color: Colors.darkGray,
    fontSize: 16,
    fontWeight: "medium",
    color:'#6D6D6D',
    
},
});

export default FriendRequestBlock;
