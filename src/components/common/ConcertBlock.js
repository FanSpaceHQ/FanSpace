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
               {/*  <View
                    style={{
                        marginBottom: 20,
                        alignSelf: "center",
                        flexDirection: "row",
                        height: 130,
                        width: Dim.width * 0.84,
                        backgroundColor: "white",
                        borderColor: Colors.darkGray,
                        borderWidth: 1,
                        shadowColor: Colors.lightGray,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 2,
                        borderRadius: 30,
                    }}
                > */}
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
                        <LinearGradient colors={['transparent','black']}>
                    <Text style={styles.header}>{props.name} <Icon name="fiber_manual_record"></Icon>  {props.title}</Text>  
                     <Text style={styles.date}>{props.date} <View style={styles.dot}></View>  {props.time}
                    <Text style={styles.location}>{props.location}</Text>   </Text>
                    </LinearGradient>
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
    header: { fontSize:22 , fontWeight: "bold", color:'white', marginLeft:10, numberOfLines:"1",ellipsizeMode:'tail',width:Dim.width*0.7,flexWrap:"nowrap",marginBottom:5},
    subheader: { fontSize: 20,color:'white', flexWrap: "wrap", width: 130, },
    date: { fontSize: 15, color:'white',flexWrap: "wrap", marginLeft:10,marginBottom:5
},
    location: {
        fontSize: 11,
        flexWrap: "wrap",
        width: 130,
        marginLeft:10,
        fontWeight: "bold",
        color:'white',
    },
    dot: {
            height: 5,
            width: 5,
            borderRadius: 30,
            backgroundColor: "white",
            
    },
});

export default ConcertBlock;
