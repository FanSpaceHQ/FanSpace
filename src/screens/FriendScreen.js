import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Alert, TouchableOpacity, 
	TouchableWithoutFeedback, Keyboard, ActivityIndicator, Image, FlatList, SafeAreaView,} from "react-native";
import { Dim, Colors } from "../Constants.js"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SearchBar } from "react-native-elements";

import Galaxy from "../assets/galaxy.png"
import Alex from "../assets/Alex.png"

/*
  -- DOCUMENTATION --
*/

const friends = [
    {
        id: 1,
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        id: 2,
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        id: 3,
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        id: 4,
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        id: 5,
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        id: 6,
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        id: 7,
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        id: 8,
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        id: 9,
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        id: 10,
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
]

const FriendBox = (props) => {
    return(
        <TouchableOpacity onPress={props.onPress}>
        <View style={boxStyles.container}>
            <View style={{flexDirection: "row", paddingBottom: 20,}}>
                <Image source={props.image} style={boxStyles.image}/>
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
        // width: Dim.width * 0.8,
        marginLeft: Dim.width * 0.08,
    },
    image:{
        marginLeft: Dim.width * 0.025,
        height: 50,
        width: 50,
    },
    name:{
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 20,
    },
    username:{
        color: "#B4B3B3",
        marginLeft: 20,
    },
})

const FriendScreen = ({props, navigation}) => {
    const [friendSize, setSize] = useState(friends.length);
    const [search, setSearch] = useState("");

    useEffect(() => {}, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
                style={{
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: Dim.height * 0.015,
                }}
            >
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
                        value={search}
                        onChangeText={setSearch}
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
                        }}
                    />
                </View>

                {/* Friends List */}
                <View style={{ alignSelf: "left", marginTop: 20 }}>
                    <ScrollView bounces={true}>
                        {friends.map((friend) => (
                        <FriendBox
                            key={friend.id}
                            image={friend.image}
                            name={friend.name}
                            userName={friend.userName}
                            onPress={() => {
                            navigation.navigate("Profile");
                            }}
                        />
                        ))}
                    </ScrollView>
                </View>
            </View>
            </TouchableWithoutFeedback>
            {/* </View> */}
            </ScrollView>
        </SafeAreaView>
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
        marginTop: Dim.height * 0.025,
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
    },
    inputContainerStyle: {
        borderRadius: 10,
        padding: 2.5,
        backgroundColor: Colors.gray,
    },
});

export default FriendScreen;