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
    const [searchBarClicked, setClicked] = useState(false);
    const [queryData, setQueryData] = useState([]);
    const [debounce, setDebounce] = useState(false);
    const [reload, setLoad] = useState(true);
    const [uid, setId] = useState(null);

    const querySearch = async() =>{
        if (!debounce){
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await delay(2000);
            setDebounce(true);
        }
    }


    useEffect(() => {
        if (reload){
            if (!uid){
                AsyncStorage.getItem("@uid").then((uid) => {
                    setId(uid);
                        axios
                        .get(`http://localhost:4000/api/users/friends/${uid}`)
                        .then((res) => {
                            setFriends(res.data.friends);
                            setSize(res.data.friends.length);
                            setLoad(false);
                        })
                        .catch((err) => {
                            console.log(err);
                            setLoad(false);
                            setLoad(true);
                        });
                });
            } else{
                axios
                    .get(`http://localhost:4000/api/users/friends/${uid}`)
                    .then((res) => {
                        setFriends(res.data.friends);
                        setSize(res.data.friends.length);
                        setLoad(false);
                    })
                    .catch((err) => {
                        console.log(err);
                        setLoad(false);
                        setLoad(true);
                    });
            }
        }
    }, [reload]);

    useEffect(()=>{
        if (debounce){
            axios // TODO Fix the Request Path
                .get(`http://localhost:4000/api/users/search/friends/${uid}/${search}`)
                .then((res)=> {
                    // console.log(res.data);
                    setQueryData(res.data)
                    setDebounce(false);
                })
                .catch((err)=>{
                    console.log(err);
                    setDebounce(false);
                })
        }
    }, [debounce])

    useEffect(()=>{
        console.log(search);
    },[search])

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss()
            setClicked(false);
            setQueryData([]);
            setSearch(() => {
                setSearch("");
                console.log(search);
            });
        }}>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: "white",
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
                        value={search}
                        placeholder="Search for friends"
                        containerStyle={styles.containerStyle}
                        inputContainerStyle={styles.inputContainerStyle}
                        onChangeText={(text)=>{
                            setSearch(text);
                            querySearch();
                        }}
                        onFocus={() => {
                            setClicked(true);
                        }}
                        onClear={()=>{
                            setSearch("")
                            setQueryData([]);
                        }}
                    />
                </View>

                {/* Friend Number and bar */}
                {searchBarClicked ? (
                    <View
                        style={{ marginTop: Dim.height * 0.05 }}
                    >
                        {/* <View>
                            <Text> Hello World </Text>
                        </View> */}
                        <View style={{ alignSelf: "left", marginTop: 0 }}>
                        <FlatList
                            data={queryData}
                            horizontal={false}
                            renderItem={({ item: friends }) => {
                                return (
                                    <FriendBox
                                        image={
                                            friends.imageUrl
                                        }
                                        name={`${friends.firstName} ${friends.lastName}`}
                                        userName={friends.username}
                                        onPress={() =>
                                            navigation.navigate("Profile")
                                        }
                                    />
                                );
                            }}
                        />
                    </View>
                    </View>
                ) : (
                    <View>
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
                    {friendSize == 0 ? (
                        <View>
                            <Text style={{fontWeight: "bold", fontSize: 20, marginTop: -(Dim.height * .01), marginLeft: Dim.width * 0.1}}>
                                No friends yet
                            </Text>
                            <Text style={{
                                fontSize: 16,
                                color: "#6D6D6D",
                                textAlign: "left",
                                marginLeft: Dim.width * 0.1,
                                marginTop: Dim.height * 0.01,
                                fontWeight: "300",
                            }}>
                                Find people interested in going to the same concerts.
                            </Text>
                        </View>
                    ) : (
                    <View style={{ alignSelf: "left", marginTop: 0 }}>
                        <FlatList
                            data={friends}
                            horizontal={false}
                            renderItem={({ item: friends }) => {
                                return (
                                    <FriendBox
                                        image={
                                            friends._fieldsProto.image.stringValue
                                        }
                                        name={`${friends._fieldsProto.firstName.stringValue} ${friends._fieldsProto.lastName.stringValue}`}
                                        userName={`${friends._fieldsProto.username.stringValue}`}
                                        onPress={() =>
                                            navigation.navigate("Profile")
                                        }
                                    />
                                );
                            }}
                        />
                    </View>)}
                </View>
                )}
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
        marginLeft: Dim.width * 0.1,
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
