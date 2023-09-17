import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { Colors, Dim } from "../Constants";
import Icon from "react-native-vector-icons/Feather";
import { SearchBar } from "react-native-elements";
import ConcertBlock from "../components/common/ConcertBlock";
import { onValue, ref, getDatabase } from "firebase/database";
import moment from "moment/moment";

/*
  -- DOCUMENTATION --
*/

const HomeScreen = ({ navigation, props }) => {
    const [concertData, setConcertData] = useState([]);
    const [search, updateSearch] = useState("");
    const [searchBarClicked, setClicked] = useState(false);
    const [queryData, setQueryData] = useState([]);

    const querySearch = async () => {
        if (search.length < 3) { setQueryData([]); return; }
        setQueryData(concertData.filter(ev => ev.artist.toLowerCase().indexOf(search.toLowerCase()) >= 0));
    };

    useEffect(() => {
        onValue(ref(getDatabase(), "eventsData"), snap => {
            const events = snap.val();
            const sortedEvents = Object.entries(events).map(ev => {
                ev[1].id = ev[0];
                ev[1].date = moment(ev[1].dateTime);
                ev[1].localTime = ev[1].date.format("MMMM Do YYYY, h:mm a");
                ev[1].monthDay = ev[1].date.format("MMM Do");
                return ev[1];
            }).sort((a, b) => a.date - b.date);
            setConcertData(sortedEvents);
        });
    }, []);


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                {searchBarClicked == 0 ? (
                    <View style={styles.topRow}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text style={styles.header}>Home</Text>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("Inbox Screen")
                                }
                            >
                                <Icon
                                    name={"bell"}
                                    size={33}
                                    color={Colors.darkGray}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View
                        style={{
                            flexDirection: "column",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setClicked(false);
                                setQueryData([]);
                            }}
                        >
                            <View
                                style={{
                                    marginLeft: 15,
                                    marginTop: Dim.height * 0.01,
                                }}
                            >
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                    {" "}
                                    ←{" "}
                                    <Text style={{ fontWeight: "normal" }}>
                                        {" "}
                                        Home{" "}
                                    </Text>{" "}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 30,
                                fontWeight: "bold",
                                marginTop: 10,
                                marginBottom: -10,
                                marginLeft: 25,
                            }}
                        >
                            {" "}
                            Search
                        </Text>
                    </View>
                )}
                <View style={styles.searchContainer}>
                    <SearchBar
                        placeholder="Search for artists..."
                        containerStyle={styles.containerStyle}
                        inputContainerStyle={
                            searchBarClicked
                                ? styles.inputSmallStyle
                                : styles.inputContainerStyle
                        }
                        onChangeText={(text) => {
                            updateSearch(text);
                            querySearch();
                        }}
                        value={search}
                        onFocus={() => {
                            setClicked(true);
                        }}
                    />
                </View>
                {searchBarClicked == 0 ? (
                    <View style={{ alignSelf: "center", height: "78%" }}>
                        <FlatList
                            data={concertData}
                            horizontal={false}
                            renderItem={({ item: concertData }) => {
                                return (
                                    <ConcertBlock
                                        image={concertData.image}
                                        name={concertData.name}
                                        title={concertData.title}
                                        date={concertData.date}
                                        location={concertData.venue}
                                        monthDay={concertData.monthDay}
                                        onPress={() =>
                                            navigation.navigate(
                                                "Concert Screen",
                                                {
                                                    image: concertData.image,
                                                    name: concertData.name,
                                                    date: concertData.localTime,
                                                    location: `${concertData.venue} - ${concertData.city}, ${concertData.state}`,
                                                    id: concertData.id
                                                }
                                            )
                                        }
                                    />
                                );
                            }}
                        />
                    </View>
                ) : (
                    <View style={{ alignSelf: "center", height: "78%" }}>
                        <FlatList
                            data={queryData}
                            horizontal={false}
                            renderItem={({ item: concertData }) => {
                                return (
                                    <ConcertBlock
                                        image={concertData.image}
                                        name={concertData.name}
                                        title={concertData.title}
                                        date={concertData.date}
                                        location={concertData.venue}
                                        monthDay={concertData.monthDay}
                                        onPress={() =>
                                            navigation.navigate(
                                                "Concert Screen",
                                                {
                                                    image: concertData.image,
                                                    name: concertData.name,
                                                    date: concertData.localTime,
                                                    location: `${concertData.venue} - ${concertData.city}, ${concertData.state}`,
                                                    id: concertData.id
                                                }
                                            )
                                        }
                                    />
                                );
                            }}
                        />
                    </View>
                )}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "white", flex: 1 },
    topRow: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 20,
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
        marginRight: Dim.width * 0.5,
    },
    subheader: {
        fontSize: 17,
        color: Colors.darkGray,
        fontWeight: "medium",
        color: "#6D6D6D",
    },
    icon: { paddingTop: 10 },
    searchContainer: {
        borderColor: "transparent",
        width: Dim.width * 0.9,
        alignSelf: "center",
        marginBottom: 20,
        marginTop: 5,
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
    inputSmallStyle: {
        borderRadius: 10,
        padding: 2.5,
        backgroundColor: Colors.gray,
    },
    searchResults: {
        alignSelf: "center",
        width: Dim.width * 0.9,
        // marginLeft: 10,
        height: 200,
        backgroundColor: Colors.gray,
        borderRadius: 10,
    },
});

export default HomeScreen;
