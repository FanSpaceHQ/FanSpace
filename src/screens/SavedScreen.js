import React from "react";
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

/* need to be able to store the number of going/interested/selling events with user data
    + pass it in here so that it will be able to display the number and know when to display
    an empty page */
const concertData = [
    {
        image: "https://media.pitchfork.com/photos/61d740b79a8903a73574e2a5/1:1/w_600/FKA-twigs-Caprisongs.jpg",
        name: "FKA twigs",
        title: "CAPRISONGS WORLD TOUR",
        date: "March 11, 2023",
        location: "Crypto.com Arena",
    },
    {
        image: "https://media.pitchfork.com/photos/625f0725a110f14cd837788b/master/w_1280%2Cc_limit/Bartees-Strange-2022.jpg",
        name: "Bartees Strange",
        title: "Acoustic Tour",
        date: "March 27, 2023",
        location: "The Fonda",
    },
    {
        image: "https://lahiphopevents.com/wp-content/uploads/2023/02/SZA-TOUR-2.jpg",
        name: "SZA",
        title: "SOS Tour",
        date: "March 11, 2023",
        location: "Kia Forum",
    },
];

/* change this to 0 to see the empty screen version */
const eventNumber = 3;

/* in my humble opinion, i do not think the going (heart) title is necessary, 
    since it's already under the tab that says going (heart) and it makes the flat list 
    look weird */

const FirstRoute = () => (
    (eventNumber != 0) ? (
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
                                navigation.navigate("Concert Screen")
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
    (eventNumber != 0) ? (
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
                                navigation.navigate("Concert Screen")
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
    (eventNumber != 0) ? (
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
                                navigation.navigate("Concert Screen")
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

const SavedScreen = (props) => {
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
            style={{ backgroundColor: Colors.white,}}
            renderLabel={({ route, focused, color }) =>
                focused ? (
                    <Text
                        style={{
                            color: Colors.green.primary,
                            fontWeight: "bold",
                            marigin: 8
                        }}
                    >
                        {route.title}
                    </Text>
                ) : (
                    <Text
                        style={{
                            color: Colors.darkGray,
                            margin: 8,
                            fontWeight: "bold",
                        }}
                    >
                        {route.title}
                    </Text>
                )
            }
            renderIcon={ ({ route, focused, color }) => (
                <Icon
                    name={route.icon}
                    color={focused ? Colors.green.primary : Colors.darkGray}
                    size={20}
                />
            )}
        />
    );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
            <View style={styles.headerContainer}>
                <Icon
                    name={"arrow-left"}
                    size={20}
                />
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