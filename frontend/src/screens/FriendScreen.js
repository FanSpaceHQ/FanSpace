import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    FlatList,
    SafeAreaView,
} from "react-native";
import { Dim, Colors } from "../Constants.js";
import { SearchBar } from "react-native-elements";

import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDatabase, onValue, ref, get } from "firebase/database";
import { getDownloadURL, ref as storRef, getStorage } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { Close } from "@mui/icons-material";

/*
  -- DOCUMENTATION --
*/

export const FriendBox = (props) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("User Profile Screen", {
                    screen: "Profile Screen",
                    params: { id: props.id },
                })
            }
        >
            <View style={boxStyles.container}>
                <View style={{ flexDirection: "row", paddingBottom: 20 }}>
                    <Image
                        source={{ uri: props.image }}
                        style={boxStyles.image}
                    />
                    <View style={{ justifyContent: "center" }}>
                        <Text style={boxStyles.name}>{props.name}</Text>
                        <Text style={boxStyles.username}>
                            @{props.userName}
                        </Text>
                    </View>
                    {props.closeButton ? <View
                        style={{
                            flexGrow: 1,
                            alignItems: "flex-end",
                            paddingRight: 30,
                            justifyContent: "center",
                        }}
                    >
                        <TouchableOpacity
                            onPress={props.closeButton}
                        >
                            <Image
                                source={require("../assets/close.png")}
                                style={{ width: 20, height: 20 }}
                            ></Image>
                        </TouchableOpacity>
                    </View> : null}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const boxStyles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "left",
        alignContent: "left",
        marginBottom: 10,
        width: Dim.width * 0.9,
        marginLeft: Dim.width * 0.08,
    },
    image: {
        marginLeft: Dim.width * 0.025,
        height: 50,
        width: 50,
        borderRadius: 1000,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 20,
        flexWrap: "wrap",
    },
    username: {
        color: "#B4B3B3",
        marginLeft: 20,
    },
});

const FriendScreen = ({ props, navigation }) => {
    const [friends, setFriends] = useState([]);
    const [friendSize, setSize] = useState(friends.length);
    const [search, setSearch] = useState("");
    const [searchBarClicked, setClicked] = useState(false);
    const [queryData, setQueryData] = useState([]);

    const querySearch = async (text) => {
        setQueryData([]);
        const searchForUser = httpsCallable(getFunctions(), "searchForUser");
        const uid = await searchForUser({ query: text.toLowerCase() });
        if (uid.data) {
            Promise.all([
                get(ref(getDatabase(), `users/${uid.data}/firstName`)),
                get(ref(getDatabase(), `users/${uid.data}/lastName`)),
                get(ref(getDatabase(), `users/${uid.data}/username`)),
            ]).then(async (res) => {
                setQueryData([
                    {
                        name: res[0].val() + " " + res[1].val(),
                        userName: res[2].val(),
                        image: await getDownloadURL(
                            storRef(getStorage(), `images/${uid.data}/profile`)
                        ),
                        id: uid.data,
                    },
                ]);
            });
        }
    };

    useEffect(() => {
        onValue(
            ref(getDatabase(), `users/${getAuth().currentUser.uid}/friends`),
            (snap) => {
                if (snap.val()) {
                    Promise.all(
                        Object.keys(snap.val()).map((friend) => {
                            return Promise.all([
                                get(
                                    ref(
                                        getDatabase(),
                                        `users/${friend}/firstName`
                                    )
                                ),
                                get(
                                    ref(
                                        getDatabase(),
                                        `users/${friend}/lastName`
                                    )
                                ),
                                get(
                                    ref(
                                        getDatabase(),
                                        `users/${friend}/username`
                                    )
                                ),
                                getDownloadURL(
                                    storRef(
                                        getStorage(),
                                        `images/${friend}/profile`
                                    )
                                ),
                                friend,
                            ]);
                        })
                    )
                        .then((ress) => {
                            const friendsArr = ress.map((res) => {
                                return {
                                    name: res[0].val() + " " + res[1].val(),
                                    userName: res[2].val(),
                                    image: res[3],
                                    id: res[4],
                                };
                            });
                            setSize(friendsArr.length);
                            setFriends(friendsArr);
                        })
                        .catch((err) => console.log(err));
                }
            }
        );
    }, []);

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
                setClicked(false);
                setQueryData([]);
                setSearch("");
            }}
        >
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
                        onChangeText={(text) => {
                            querySearch(text);
                            setSearch(text);
                        }}
                        onFocus={() => {
                            setClicked(true);
                        }}
                        onClear={() => {
                            setSearch("");
                            setQueryData([]);
                        }}
                    />
                </View>

                {/* Friend Number and bar */}
                {searchBarClicked ? (
                    <View style={{ marginTop: Dim.height * 0.05 }}>
                        <View style={{ alignSelf: "left", marginTop: 0 }}>
                            <FlatList
                                data={queryData}
                                horizontal={false}
                                renderItem={({ item: friends }) => {
                                    return (
                                        <FriendBox
                                            id={friends.id}
                                            key={friends.id}
                                            image={friends.image}
                                            name={friends.name}
                                            userName={friends.userName}
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
                        <View
                            style={{ alignItems: "left", alignContent: "left" }}
                        >
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
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        marginTop: -(Dim.height * 0.01),
                                        marginLeft: Dim.width * 0.1,
                                    }}
                                >
                                    No friends yet
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: "#6D6D6D",
                                        textAlign: "left",
                                        marginLeft: Dim.width * 0.1,
                                        marginTop: Dim.height * 0.01,
                                        fontWeight: "300",
                                        paddingRight: 30
                                    }}
                                >
                                    Find people interested in going to the same
                                    concerts.
                                </Text>
                            </View>
                        ) : (
                            <View
                                style={{
                                    alignSelf: "left",
                                    marginTop: 0,
                                    height: "80%",
                                }}
                            >
                                <FlatList
                                    data={friends}
                                    horizontal={false}
                                    renderItem={({ item: friends }) => {
                                        return (
                                            <FriendBox
                                                id={friends.id}
                                                key={friends.id}
                                                image={friends.image}
                                                name={friends.name}
                                                userName={friends.userName}
                                                onPress={() =>
                                                    navigation.navigate(
                                                        "Profile"
                                                    )
                                                }
                                            />
                                        );
                                    }}
                                />
                            </View>
                        )}
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
        // marginTop: Dim.height * 0.025 - 20,
        marginLeft: Dim.width * 0.185,
        // alignSelf: "flex-start",
        width: 50,
        height: 50,
        objectFit: "contain",
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
