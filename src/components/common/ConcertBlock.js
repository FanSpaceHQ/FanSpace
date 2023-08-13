import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, ImageBackground } from "react-native";
import { Colors, Dim } from "../../Constants";
import { Icon } from "react-native-elements";
import { LinearGradient } from 'expo-linear-gradient';

//
/*
  -- DOCUMENTATION --
*/
const ConcertBlock = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View>
                    <ImageBackground
                        source={{
                            uri: props.image,
                        }}
                        style={{
                            height: 140,
                            width: Dim.width * 0.85,
                            marginBottom: 20,
                            position:"relative",
                            flexDirection: "column",
                            justifyContent:"flex-end",
                        }}
                        imageStyle={{ 
                            borderRadius: 8,
                            
                        }}
                    >
                    <Text style={styles.header}>{props.name}</Text>  
                    <Text style={styles.date}>{props.location} • {props.monthDay}</Text>
                    </ImageBackground>
                    <View
                        style={{
                            flexDirection: "column",
                            marginLeft: 20,
                            paddingTop: 5,
                        }}
                    >
                    </View>
                </View>
            {/* </View> */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    header: { 
        fontSize:20, 
        fontWeight: "bold", 
        color:'white', 
        marginLeft:10, 
        numberOfLines:"1",
        ellipsizeMode:'tail',
        width:Dim.width*0.7,
        flexWrap:"nowrap",
        marginBottom:5
    },
    subheader: { 
        fontSize: 15,
        color:'white', 
        flexWrap: "wrap", 
        width: 130, 
    },
    date: { 
        fontSize: 11, 
        color:'white',
        width: 200, 
        marginLeft:10,
        marginBottom:5
    },
    location: {
        fontSize: 11,
        flexWrap: "wrap",
        width: 130,
        marginLeft:10,
        fontWeight: "bold",
        color:'white',
    },
});

export default ConcertBlock;
