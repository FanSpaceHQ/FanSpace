import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    FlatList,
    Alert,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Colors, Dim } from "../Constants";
import ConcertBlock from "../components/common/ConcertBlock";
import Button from "../components/common/Button";
import Icon from "react-native-vector-icons/Feather";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const axios = require("axios").default;

/* change this to 0 to see the empty screen version */
const eventNumber = 3;

/* in my humble opinion, i do not think the going (heart) title is necessary, 
    since it's already under the tab that says going (heart) and it makes the flat list 
    look weird */

const SavedScreen = ({ navigation, props }) => {
    /* call to fetch the saved events from the server */
    const [concertData, setData] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:4000/api/events/`)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const FirstRoute = () => (
        (concertData.length != 0) ? (
            <View style={ styles.sectionContainer }>
                <View style={ styles.sectionHeaderContainer }> 
                    <Text style ={ styles.sectionHeaderText }> Going </Text>
                    <Icon
                        name={"heart"}
                        color={Colors.green.primary}
                        size={20}
                    />
                </View>
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
                                location={concertData.location}
                                onPress={() =>
                                    navigation.navigate("Concert Screen", {
                                        image: concertData.image,
                                        name: concertData.name,
                                        date: concertData.localTime,
                                        location: `${concertData.venue} - ${concertData.city}, ${concertData.state}`,
                                    })
                                }
                            />
                        );
                    }}
                />
            </View>
        ) : (
            <View style={styles.emptySectionContainer}>
                <Text style={styles.sectionHeaderText}>No concerts yet</Text>
                <Text style={styles.sectionText}>Like an event and let other people know where you're going!</Text>
                <Text style={styles.sectionHeaderText}>Find a concert?</Text>
                <Button
                    color={Colors.green.primary}
                    title="Search for an event"
                />
            </View>
        )
    );

    const SecondRoute = () => (
        (concertData.length != 0) ? (
            <View style={ styles.sectionContainer }>
                <View style={ styles.sectionHeaderContainer }> 
                    <Text style ={ styles.sectionHeaderText }> Interested </Text>
                    <Icon
                        name={"star"}
                        color={Colors.green.primary}
                        size={20}
                    />
                </View>
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
                                location={concertData.location}
                                onPress={() =>
                                    navigation.navigate("Concert Screen", {
                                        image: concertData.image,
                                        name: concertData.name,
                                        date: concertData.localTime,
                                        location: `${concertData.venue} - ${concertData.city}, ${concertData.state}`,
                                    })
                                }
                            />
                        );
                    }}
                />
            </View>
        ) : (
            <View style={styles.emptySectionContainer}>
                <Text style={styles.sectionHeaderText}>No concerts yet</Text>
                <Text style={styles.sectionText}>Like an event and let other people know what you're selling!</Text>
                <Text style={styles.sectionHeaderText}>Find a concert?</Text>
                <Button
                    color={Colors.green.primary}
                    title="Search for an event"
                />
            </View>
        )
    );

    const ThirdRoute = () => (
        (concertData.length != 0) ? (
            <View style={ styles.sectionContainer }>
                <View style={ styles.sectionHeaderContainer }> 
                    <Text style ={ styles.sectionHeaderText }> Selling </Text>
                    <Icon
                        name={"shopping-cart"}
                        color={Colors.green.primary}
                        size={20}
                    />
                </View>
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
                                location={concertData.location}
                                onPress={() =>
                                    navigation.navigate("Concert Screen", {
                                        image: concertData.image,
                                        name: concertData.name,
                                        date: concertData.localTime,
                                        location: `${concertData.venue} - ${concertData.city}, ${concertData.state}`,
                                    })
                                }
                            />
                        );
                    }}
                />
            </View>
        ) : (
            <View style={styles.emptySectionContainer}>
                <Text style={styles.sectionHeaderText}>No concerts yet</Text>
                <Text style={styles.sectionText}>Like an event and let other people know where you're going!</Text>
                <Text style={styles.sectionHeaderText}>Find a concert?</Text>
                <Button
                    color={Colors.green.primary}
                    title="Search for an event"
                />
            </View>
        )
    );
    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
    });
    /* indexes for the nav bar */
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "first", title: "Going", icon: "heart" },
        { key: "second", title: "Interested", icon: "star" },
        { key: "third", title: "Selling", icon: "shopping-cart" },
    ]);

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: Colors.green.primary,
            }}
            style={{ backgroundColor: Colors.white, }}
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
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack() }>
                    <Icon
                        name={"arrow-left"}
                        size={20}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}> Profile </Text>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}> Saved </Text>
            </View>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dim.width }}
            />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingLeft: 24,
        paddingTop: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        fontSize: 15,
        paddingLeft: 5,
    },
    titleContainer: {
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 10
    }, 
    titleText: {
        fontWeight: "bold",
        fontSize: 25,
    },
    sectionContainer: {
        backgroundColor: Colors.white,
        flex: 1,
        alignSelf: "center",
        paddingTop: 20,
    },
    emptySectionContainer: {
        margin: 35,
    },
    sectionHeaderContainer: {
        flexDirection: "row",
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: "center",
    },
    sectionHeaderText: {
        fontWeight: "bold",
        fontSize: 20,
        paddingRight: 10, 
        marginBottom: 5
    },
    sectionText: {
        color: Colors.lightGray,
        size: 8,
        paddingBottom: 40,
    }
});


export default SavedScreen;