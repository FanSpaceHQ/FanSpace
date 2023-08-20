import React from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pencil from "../assets/Pencil.png";
import Alex from "../assets/Alex.png";
import Discord from "../assets/Discord.png";
import Twitter from "../assets/Twitter.png";
import Instagram1 from "../assets/Instagram1.png";
import Instagram2 from "../assets/Instagram2.png";
import Instagram3 from "../assets/Instagram3.png";
import Instagram from "../assets/Instagram.png";
import Facebook1 from "../assets/Facebook1.png";
import Facebook2 from "../assets/Facebook2.png";
import Heart from "../assets/Heart.png";
import Star from "../assets/Star.png";
import Buy from "../assets/Buy.png";


import Setting from "../assets/Setting.png";
import SettingsPage from "./Settings";
//import Button from "../components/common/Button";
//import ProfileImage from "./ProfileImage";
import { Dim, Colors } from "../Constants.js";
import { Button } from "react-native-elements";
import ScrollWindow from "../components/common/ScrollWindow";
import Bio from "../components/common/Bio";
import { height } from "@mui/system";
import { color } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";

/*
  -- DOCUMENTATION --
*/
const ProfileScreen = ({ navigation, props }) => {
    const [firstName, setFirstName] = useState("");
    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [discord, setDiscord] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    //const navigation = useNavigation();

    useEffect(() => {
        // AsyncStorage.getItem("@firstName").then((item)=>setFirstName(item));
        // AsyncStorage.getItem("@imageUrl").then((item)=>{setImageUrl(item)});
        // AsyncStorage.getItem("@discord").then((item)=>setDiscord(item));
        // AsyncStorage.getItem("@instagram").then((item)=>setInstagram(item));
        // AsyncStorage.getItem("@twitter").then((item)=>setTwitter(item));

        // To Florence: Set each variable to a dummy variable then adjust UI as
        // necessary. Review Figma docs. 
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "left",
                        paddingTop: 25,
                    }}
                >
                   
                    <View style={{
                         flexDirection: "row",
                         alignItems: "center",
                         justifyContent: "center",
                         paddingHorizontal: 16,
                         marginBottom: 25,
                    }}> 
                        {/* <View style={{ width: Dim.width * 0.5 - 165 }} /> */}
                        {/* <View style={{ flex: 1, alignItems: "center" }}> */}
                            <Text style={{ 
                                 fontSize: 20,
                                 fontWeight: "600",
                                 color: "#000000",
                                 textAlign: "center",
                                 flex: 1,
                                 
                            }}>
                                Profile
                            </Text>
                        {/* </View> */}
                        
                        <View style={{ position: "absolute",
        right: 30,}}>
                        <TouchableOpacity
                                onPress={() => navigation.navigate("Settings")}
                            >
                                <Image
                                    source={Setting}
                                    style={{ width: 26, height: 26
                                }}
                                ></Image>
                            </TouchableOpacity>
                        
                        </View>
                          
                    </View>
                    
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingLeft: Dim.width * 0.05,
                            //marginRight: Dim.width * 0.8,
                        }}
                    >
                       
                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "center",
                                marginRight: 10, // Add this property
                                marginLeft: 15
                            }}
                        >
                             <Image
                            style={{
                                width: 110,
                                height: 110,
                                borderRadius: 1000,
                                marginRight: 10,
                                // alignItems: "flex-start"
                            }}
                            source={Alex}
                            />
                        </View>

                        <View>
                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontSize: 18,
                                    fontWeight: 500,
                                    //height: 100,
                                }}
                            >
                                {/* {firstName} */}
                                Alex Smith
                            </Text>

                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontSize: 10,
                                    color: "grey",
                                }}
                            >
                                @username
                            </Text>

                            <TouchableOpacity 
                                style={{ 
                                backgroundColor: "#0B8F6B",height: 32,
                                width: 133,
                                borderRadius: 16,
                                flexDirection: "row", 
                                justifyContent: "center", 
                                alignItems: "center", 
                                marginTop: 12,
                             }}
                            >
                                <Image source={Pencil} style={{marginRight: 12}} />
                                <Text style={{color: "#FFFFFF", fontSize: 12}}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Bio />

                <View
                    style={{
                        width: Dim.width * 0.8,
                        borderColor: Colors.gray,
                        borderWidth: 1,
                        alignSelf: "center",
                        marginTop: Dim.height * 0.02,
                    }}
                />

                <View>
                    <Text
                        style={{
                            marginLeft: 26,
                            marginTop: 12,
                            marginBottom: 20,
                            fontWeight: 500,
                            fontSize: 16,
                        }}
                    >
                        Contact Information
                    </Text>
                    <View>
                        
                    <View style={styles.rowContainer}>
                        <Image source={Instagram} style={styles.image} />

                        <Text style={{ marginLeft: 10, color: "gray" }}>
                            {instagram}
                        </Text>
                    </View>
                    <View style={styles.grayBar} />

                    <View style={styles.rowContainer}>
                        <Image source={Twitter} style={styles.image} />

                        <Text style={{ marginLeft: 10, color: "gray" }}>
                            {twitter}
                        </Text>
                    </View>
                    <View style={styles.grayBar} />

                    <View style={styles.rowContainer}>
                        <Image source={Discord} style={styles.image} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginLeft: 10, color: "gray" }}>{discord}</Text>
                        </View>
                    </View>
                    <View style={styles.grayBar} />

                    <View style={styles.rowContainer}>
                        <Image source={Facebook1} style={styles.image} />

                        <Text style={{ marginLeft: 10, color: "gray" }}>
                            {/* {facebook} */}
                        </Text>
                    </View>
                    <View style={styles.grayBar} />
                    </View>
                    
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.sectionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.sectionTitle}>Going</Text>
                            <Image style={styles.sectionIcon} src={Heart}/>
                            <TouchableOpacity 
                                style={styles.viewAllButton}
                                onPress={() => navigation.navigate("Saved")}
                            >
                                <Text
                                    style={{
                                        marginLeft: Dim.width * 0.5,
                                        marginTop: Dim.height * 0.01,
                                        color: "#0DAD81",
                                    }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                marginLeft: Dim.width * 0.01,
                                marginBottom: Dim.height * 0.02,
                                color: "#B4B3B3",
                            }}
                        >
                            See what I'm going to
                        </Text>

                        <ScrollWindow />
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.sectionTitle}>Interested</Text>
                            <Image style={styles.sectionIcon} src={Star}/>
                            <TouchableOpacity 
                                style={styles.viewAllButton}
                                onPress={() => navigation.navigate("Saved")}
                            >
                                <Text
                                    style={{
                                        marginLeft: Dim.width * 0.5,
                                        marginTop: Dim.height * 0.01,
                                        color: "#0DAD81",
                                    }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                marginLeft: Dim.width * 0.01,
                                marginBottom: Dim.height * 0.02,
                                color: "#B4B3B3",
                            }}
                        >
                            I'm interested in...
                        </Text>
                        <ScrollWindow />
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.sectionTitle}>Selling</Text>
                            <Image style={styles.sectionIcon} src={Buy}/>
                            <TouchableOpacity 
                                style={styles.viewAllButton}
                                onPress={() => navigation.navigate("Saved")}
                            >
                                <Text
                                    style={{
                                        marginLeft: Dim.width * 0.6,
                                        marginTop: Dim.height * 0.01,
                                        color: "#0DAD81",
                                    }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                marginLeft: Dim.width * 0.01,
                                marginBottom: Dim.height * 0.02,
                                color: "#B4B3B3",
                            }}
                        >
                            Selling tickets for:{" "}
                        </Text>
                        <ScrollWindow />
                    </View>
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        //marginBottom: -30,
        marginBottom: Dim.height * -0.035,
        marginRight: Dim.width * 0.5,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-between",
        marginRight: Dim.width * 0.5,
    },
    image: {
        marginLeft: Dim.width * 0.12,
        marginRight: Dim.width * 0.0,
        width: 24,
        height: 24,
    },
    grayBar: {
        width: Dim.width * 0.7,
        borderColor: Colors.gray,
        borderWidth: 1,
        alignSelf: "center",
        marginTop: Dim.height * 0.04,
        marginBottom: Dim.height * 0.02,
        marginLeft: Dim.width * 0.2,
        marginRight: Dim.width * 0.1, // Adjust this value for the desired spacing
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    sectionContainer: {
        marginBottom: 20,
        padding: 10,
        height: 200,
    },
    sectionTitle: {
        padding: 2,
        fontSize: 16,
        fontWeight: "500",
    },
    sectionIcon: {
        height: 16,
        width: 16
    }
});

export default ProfileScreen;
