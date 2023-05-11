import React from "react";
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
} from "react-native";
import { Colors, Dim } from "../Constants";
import Icon from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

/*
  -- DOCUMENTATION --
*/

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: "yellow" }}>
        <Text>GOING</Text>
    </View>
);

const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: "orange" }}>
        <Text>INTERESTED</Text>
    </View>
);

const ThirdRoute = () => (
    <View style={{ flex: 1, backgroundColor: "red" }}>
        <Text>SELLING</Text>
    </View>
);
const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
});

const ConcertScreen = (props) => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "first", title: "Going" },
        { key: "second", title: "Interested" },
        { key: "third", title: "Selling", color: Colors.darkGray },
    ]);

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: Colors.green.primary,
                color: Colors.darkGray,
            }}
            style={{ backgroundColor: Colors.gray }}
            renderLabel={({ route, focused, color }) =>
                focused ? (
                    <Text
                        style={{
                            color: Colors.green.primary,
                            margin: 8,
                        }}
                    >
                        {route.title}
                    </Text>
                ) : (
                    <Text
                        style={{
                            color: Colors.darkGray,
                            margin: 8,
                        }}
                    >
                        {route.title}
                    </Text>
                )
            }
        />
    );

    return (
        <ScrollView bounces={false}>
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={{
                        uri: "https://lahiphopevents.com/wp-content/uploads/2023/02/SZA-TOUR-2.jpg",
                    }}
                    style={{
                        width: Dim.width,
                        height: 300,
                        justifyContent: "flex-start",
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            paddingTop: 230,
                            paddingLeft: 30,
                            zIndex: 1,
                            fontSize: 35,
                            fontWeight: "bold",
                        }}
                    >
                        {"SZA" + " . " + "SOS TOUR"}
                    </Text>
                    <LinearGradient
                        colors={["rgba(0,0,0,0.8)", "transparent"]}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: 0.5, y: 0 }}
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: 0,
                            height: "100%",
                        }}
                    ></LinearGradient>
                </ImageBackground>
            </View>
            <View style={{ height: 450 }}>
                <ScrollView style={{ backgroundColor: "white" }}>
                    <View style={styles.topRow}>
                        <View style={{ flexDirection: "row" }}>
                            <Icon
                                name={"clock"}
                                size={20}
                                color={Colors.darkGray}
                                style={styles.icon}
                            />
                            <Text style={styles.subheader}>
                                March 11, 2023, - Wed, 8:00PM
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <Icon
                                name={"map-pin"}
                                size={20}
                                color={Colors.darkGray}
                                style={styles.icon}
                            />
                            <Text style={styles.subheader}>
                                Kia Forum - Los Angeles, CA
                            </Text>
                        </View>
                    </View>
                    <View style={styles.actionRow}>
                        <Icon
                            name={"heart"}
                            size={30}
                            color={Colors.darkGray}
                            style={styles.action}
                        />

                        <Icon
                            name={"star"}
                            size={30}
                            color={Colors.darkGray}
                            style={styles.action}
                        />
                        <Icon
                            name={"shopping-cart"}
                            size={30}
                            color={Colors.darkGray}
                            style={styles.action}
                        />
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
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "white", flex: 1 },
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
    header: { fontSize: 30, fontWeight: "bold" },
    subheader: { fontSize: 15, marginTop: 11, marginLeft: 10 },

    icon: { paddingTop: 10 },
    action: { paddingTop: 10, marginRight: 20 },

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
});

export default ConcertScreen;
