import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Alert, TouchableOpacity, 
	TouchableWithoutFeedback, Keyboard, ActivityIndicator, Image, FlatList, SafeAreaView,} from "react-native";
import { Dim, Colors } from "../Constants.js"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SearchBar } from "react-native-elements";

const axios = require("axios").default;

`import Galaxy from "../assets/galaxy.png"
import Alex from "../assets/Alex.png"`
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
  -- DOCUMENTATION --
*/

const FriendBox = (props) => {
    return(
        <TouchableOpacity onPress={props.onPress}>
        <View style={boxStyles.container}>
            <View style={{flexDirection: "row", paddingBottom: 20,}}>
                <Image source={{uri: props.image}} style={boxStyles.image}/>
                <View style={{justifyContent:"center"}}>
                    <Text style={boxStyles.name}>{props.name}</Text>
                    <Text style={boxStyles.username}> {props.userName}</Text>
                </View>
            </View>
        </View>
        </TouchableOpacity>
    )
};

const boxStyles = StyleSheet.create({
    container:{
        justifyContent: "center",
        alignItems: "left",
        alignContent: "left",
        marginBottom: 10,
        width: Dim.width * 0.9,
        marginLeft: Dim.width * 0.08,
    },
    image:{
        marginLeft: Dim.width * 0.025,
        height: 50,
        width: 50,
        borderRadius: 1000,
    },
    name:{
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 20,
        flexWrap: "wrap",
    },
    username:{
        color: "#B4B3B3",
        marginLeft: 15,
    },
})

const FriendScreen = ({props, navigation}) => {
    const [friends, setFriends] = useState([]);
    const [friendSize, setSize] = useState(friends.length);
    const [search, setSearch] = useState("");
    const [uid, setId] = useState();

    useEffect(() => {
        AsyncStorage.getItem("@uid").then((uid)=>{
            axios
                .get(`http://localhost:4000/api/users/friends/${uid}`)
                .then((res)=>{
                    setFriends(res.data.friends);
                    setSize(res.data.friends.length)
                })
                .catch((err)=>{
                    console.log(err);
                })
        })
    }, []);

    useEffect(()=>{
        console.log(search);
    }, [search])

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "white", flexDirection: "column", 
            alignItems: "center", paddingTop: Dim.height * 0.015 }}>    
            {/* <View
                style={{
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: Dim.height * 0.015,
                }}
            > */}
                {/* Orbit At the Top */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text style={styles.title}> Your Orbit </Text>
                    <Image
                        source={require("../assets/galaxy.png")}
                        style={styles.orbit}
                    />
                </View>

                {/* Search Container */}
                <View style={styles.searchContainer}>
                    <SearchBar
                        placeholder="Search for friends"
                        containerStyle={styles.containerStyle}
                        inputContainerStyle={styles.inputContainerStyle}
                        onChangeText={setSearch}
                        value={search}
                    />
                </View>

                {/* Friend Number and bar */}
                <View style={{ alignItems: "left", alignContent: "left" }}>
                    <Text style={styles.subtitle}>
                        Friends ({friendSize})
                    </Text>
                    <View
                        style={{
                            width: Dim.width * 0.8,
                            borderColor: Colors.gray,
                            borderWidth: 1,
                            alignSelf: "center",
                            marginTop: Dim.height * 0.01,
                            marginBottom: 20,
                        }}
                    />
                </View>

                {/* Friends List */}
                <View style={{ alignSelf: "left", marginTop: 0}}>
                    <FlatList
                        data={friends}
                        horizontal={false}
                        renderItem={({ item: friends }) => {
                            return (
                                <FriendBox
                                    image={friends._fieldsProto.image.stringValue}
                                    name={`${friends._fieldsProto.firstName.stringValue} ${friends._fieldsProto.lastName.stringValue}`}
                                    userName={"@lawrencetlee"}
                                    onPress={() =>
                                        navigation.navigate("Profile")
                                    }
                                />
                            );
                        }}
                    />
                </View>
            {/* </View> */}
            </SafeAreaView>
        </TouchableWithoutFeedback> 
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: Colors.darkGray,
        textAlign: "left",
        paddingTop: Dim.height * 0.025,
        paddingBottom: 30,
        marginRight: Dim.width * 0.185,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        color: "#6D6D6D",
        textAlign: "left",
        // marginLeft: Dim.width * 0.025,
        marginTop: Dim.height * 0.05,
    },
    button: {
        marginTop: Dim.height * 0.0175,
        alignSelf: "center",
        backgroundColor: Colors.green.primary,
    },
    signUp: {
        fontSize: 16,
        marginTop: 20,
    },
    orbit: {
        marginTop: Dim.height * 0.025 - 20,
        marginLeft: Dim.width * 0.185,
        // alignSelf: "flex-start",
    },
    containerStyle: {
        flex: 1,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
        marginTop: -20,
    },
    searchContainer: {
        borderColor: "transparent",
        width: Dim.width * 0.85,
        alignSelf: "center",
        marginVertical: 20,
        marginTop: -5,
    },
    inputContainerStyle: {
        borderRadius: 10,
        padding: 2.5,
        backgroundColor: Colors.gray,
    },
});

export default FriendScreen;
