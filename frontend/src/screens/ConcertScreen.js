import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    Alert,
    TouchableOpacity,
    ScrollView,
    Image,
    ImageBackground,
    SafeAreaView,
    FlatList,
} from "react-native";
import { Colors, Dim } from "../Constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Alex from "../assets/Alex.png";
import { getDatabase, onValue, ref } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDownloadURL, getStorage, ref as storRef } from "firebase/storage";

/*
  -- DOCUMENTATION --
*/

export const FriendBox = (props) => {
    const [image, setImage] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const db = getDatabase();

        onValue(ref(db, `users/${props.id}/firstName`), (snap) => {
            setFirstName(snap.val());
        });

        onValue(ref(db, `users/${props.id}/lastName`), (snap) => {
            setLastName(snap.val());
        });

        onValue(ref(db, `users/${props.id}/username`), (snap) => {
            setUsername(snap.val());
        });

        getDownloadURL(
            storRef(getStorage(), `/images/${props.id}/profile`)
        ).then(setImage);
    }, []);

    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={boxStyles.container}>
                <View style={{ flexDirection: "row", paddingBottom: 20 }}>
                    <Image source={{ uri: image }} style={boxStyles.image} />
                    <View style={{ justifyContent: "center" }}>
                        <Text style={boxStyles.name}>
                            {firstName + " " + lastName}
                        </Text>
                        <Text style={boxStyles.username}>@{username}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const boxStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "left",
        // alignContent: "center",
        marginBottom: 10,
        width: Dim.width * 0.8,
        marginLeft: Dim.width * 0.06,
        // borderWidth: 2
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 50,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 20,
    },
    username: {
        color: "#B4B3B3",
        marginLeft: 20,
    },
});

const ConcertScreen = ({ navigation, route }) => {
    const { name, location, date, image, id } = route.params;
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "going", title: "Going" },
        { key: "interested", title: "Interested" },
        { key: "selling", title: "Selling", color: Colors.darkGray },
    ]);
    const [favorite, setFavorite] = useState(false);
    const [interested, setInterest] = useState(false);
    const [selling, setSell] = useState(false);
    const [eventData, setEventData] = useState({});

    useEffect(() => {
        const db = getDatabase();
        const uid = getAuth().currentUser.uid;
        onValue(ref(db, `users/${uid}/going/${id}`), (snap) => {
            setFavorite(snap.val() ? true : false);
        });

        onValue(ref(db, `users/${uid}/interested/${id}`), (snap) => {
            setInterest(snap.val() ? true : false);
        });

        onValue(ref(db, `users/${uid}/selling/${id}`), (snap) => {
            setSell(snap.val() ? true : false);
        });

        onValue(ref(db, `events/${id}`), (snap) => {
            setEventData(snap.val());
        });
    }, []);

    const favoriteClick = async () => {
        setFavorite(!favorite);

        const addToEvent = httpsCallable(getFunctions(), "addToEvent");
        addToEvent({ evid: id, type: "going" });
    };

    const interestClick = async () => {
        setInterest(!interested);

        const addToEvent = httpsCallable(getFunctions(), "addToEvent");
        addToEvent({ evid: id, type: "interested" });
    };

    const sellClick = async () => {
        setSell(!selling);

        const addToEvent = httpsCallable(getFunctions(), "addToEvent");
        addToEvent({ evid: id, type: "selling" });
    };

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: Colors.green.primary,
                color: Colors.darkGray,
            }}
            style={{ backgroundColor: Colors.white }}
            renderLabel={({ route, focused }) =>
                focused ? (
                    <Text
                        style={{
                            color: Colors.green.primary,
                            fontWeight: "bold",
                        }}
                    >
                        {route.title}
                    </Text>
                ) : (
                    <Text
                        style={{
                            color: Colors.darkGray,
                            fontWeight: "bold",
                        }}
                    >
                        {route.title}
                    </Text>
                )
            }
        />
    );

    const renderScene = ({ route }) => {
        return (
            <View
                style={{
                    alignSelf: "left",
                    marginTop: 20,
                    height: "30%",
                    width: "100%",
                }}
            >
                {eventData && eventData[route.key] ? (
                    <FlatList
                        data={Object.keys(eventData[route.key])}
                        horizontal={false}
                        renderItem={({ item: friend }) => {
                            return (
                                <FriendBox
                                    key={friend}
                                    id={friend}
                                    onPress={() =>
                                        navigation.navigate(
                                            "User Profile Screen",
                                            {
                                                screen: "Profile Screen",
                                                params: { id: friend },
                                            }
                                        )
                                    }
                                />
                            );
                        }}
                    />
                ) : (
                    <>
                        <Text style={boxStyles.name}>You're early!</Text>
                        <Text style={boxStyles.username}>
                            Be the first to get here.
                        </Text>
                    </>
                )}
            </View>
        );
    };

    return (
        // <ScrollView bounces={false}>
        <>
            <View style={styles.topBanner}>
                <View style={styles.topRow2}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.subheader2}>
                            {" "}
                            <Text style={styles.arrow2}>← </Text> Home
                        </Text>
                    </TouchableOpacity>
                </View>
                <ImageBackground source={{ uri: image }} style={styles.image}>
                    <Text style={styles.title}>{name}</Text>
                    <LinearGradient
                        colors={["rgba(0,0,0,0.8)", "transparent"]}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: 0.5, y: 0 }}
                        style={styles.linearGradient}
                    ></LinearGradient>
                </ImageBackground>
            </View>
            <View style={{ height: 450, backgroundColor: "white" }}>
                <View style={styles.topRow}>
                    <View style={{ flexDirection: "row" }}>
                        <Icon
                            name={"schedule"}
                            size={20}
                            color={Colors.darkGray}
                            style={styles.icon}
                        />
                        <Text style={styles.subheader}>{date}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Icon
                            name={"place"}
                            size={20}
                            color={Colors.darkGray}
                            style={styles.icon}
                        />
                        <Text style={styles.subheader}>{location}</Text>
                    </View>
                </View>
                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={favoriteClick}>
                        <Icon
                            name={favorite ? "favorite" : "favorite-border"}
                            size={30}
                            color={favorite ? "#0DAD81" : Colors.darkGray}
                            style={styles.action}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={interestClick}>
                        <Icon
                            name={interested ? "star" : "star-outline"}
                            size={30}
                            color={interested ? "#0DAD81" : Colors.darkGray}
                            style={styles.action}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={sellClick}>
                        <Icon
                            name={"add-shopping-cart"}
                            size={30}
                            color={selling ? "#0DAD81" : Colors.darkGray}
                            style={styles.action}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 20, height: "200%" }}>
                    <TabView
                        renderTabBar={renderTabBar}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: Dim.width }}
                    />
                </View>
            </View>
        </>
        // </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    topRow: {
        flexDirection: "column",
        // justifyContent: "space-around",
        paddingTop: 15,
        paddingLeft: 25,
    },
    actionRow: {
        flexDirection: "row",
        // justifyContent: "space-around",
        paddingTop: 10,
        paddingLeft: 25,
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
    },
    subheader: {
        fontSize: 15,
        marginTop: 11,
        marginLeft: 10,
    },
    title: {
        alignSelf: "flex-start",
        textAlign: "left",
        color: "white",
        // marginTop: font_Size ? 200 : 180,
        marginBottom: 10,
        marginLeft: 25,
        zIndex: 1,
        // fontSize: font_Size ? 40 : 30,
        fontSize: 30,
        fontWeight: "bold",
    },
    image: {
        width: Dim.width,
        height: 300,
        alignItems: "self-end",
        justifyContent: "center",
    },
    icon: {
        paddingTop: 10,
    },
    action: {
        paddingTop: 10,
        marginRight: 20,
    },
    linearGradient: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
    },
    topBanner: {
        flex: 1,
        flexGrow: 1,
        alignSelf: "flex-end",
        // flexDirection: "column",
        // justifyContent: "left",
    },
    searchContainer: {
        borderColor: "transparent",
        width: Dim.width * 0.9,
        alignSelf: "center",
        marginVertical: 20,
    },
    containerStyle: {
        backgroundColor: "transparent",
        borderWidth: 0,
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
    },
    inputContainerStyle: {
        borderRadius: 10,
        padding: 10,
        backgroundColor: Colors.gray,
    },
    topRow2: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingTop: 40,
        paddingBottom: 10,
        marginLeft: 20,
    },
    subheader2: {
        color: Colors.darkGray,
        fontSize: 16,
        fontWeight: "medium",
        color: "black",
    },
    arrow2: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default ConcertScreen;
