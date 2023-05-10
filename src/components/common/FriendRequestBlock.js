import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { Colors, Dim } from "../../Constants";
//
/*
  -- DOCUMENTATION --
*/
const FriendRequestBlock = (props) => {
    return (
        <View style={styles.container}>   
            <Image style={{ width: 50, height: 50, borderRadius: 50, marginLeft: 10, marginTop: 10, marginBottom: 10,marginRight: 20,}}
                source={{
                    uri: props.image,
                }}
                />
            <Text style={styles.header}>{props.name}
            <Text style={styles.subheader}>{"\n @"}{props.username} </Text></Text>
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

    header: {
        fontSize: 20,
    },
subheader: {    
    color: Colors.darkGray,
    fontSize: 16,
    fontWeight: "medium",
    color:'#6D6D6D',
},});

export default FriendRequestBlock;
