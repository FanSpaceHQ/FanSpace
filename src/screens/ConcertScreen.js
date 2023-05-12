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
import Icon from "react-native-vector-icons/Feather";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"
import { LinearGradient } from "expo-linear-gradient";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import Alex from "../assets/Alex.png";

/*
  -- DOCUMENTATION --
*/

const friends = [
    {
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
    {
        name: "Alex Smith",
        userName: "@username",
        image: Alex,
    },
]

const addToProfile = async() => {

};

const getList = async() => {

};

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
    image:{
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

const FirstRoute = () => {

    return (
        <View style={{ alignSelf: "left", marginTop: 20 }}>
            <FlatList
                data={friends}
                horizontal={false}
                renderItem={({ item: friends }) => {
                    return (
                        <FriendBox
                            image={friends.image}
                            name={friends.name}
                            userName={friends.userName}
                            onPress={() => {
                                // navigation.navigate("Profile");
                            }}
                        />
                    );
                }}
            />
        </View>
    );
};

const SecondRoute = () => {

    return(
        <ScrollView style={{ flex: 1, backgroundColor: "white", flexDirection: "row" }}>
            <Text>Interested</Text>
        </ScrollView>
    );
};

const ThirdRoute = () => {

    return(
        <View style={{ flex: 1, backgroundColor: "white", flexDirection: "row" }}>
            <Text>Selling</Text>
        </View>
    );
};
const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
});

const ConcertScreen = ({route}) => {
    const {name, location, date, title, image} = route.params;
    const [font_Size, setSize] = useState((name.length + 3 + title.length) <= 21);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
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
        // <ScrollView bounces={false}>
        <>
            <View
                style={{
                    flex: 1,
                    flexShrink: 1,
                    // flexDirection: "column",
                    // justifyContent: "left",
                }}
            >
                <ImageBackground
                    source={{
                        uri: image,
                    }}
                    style={{
                        width: Dim.width,
                        height: 300,
                        alignItems: "left",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            textAlignVertical: "center",
                            alignSelf: "left",
                            textAlign: "left",
                            color: "white",
                            marginTop: font_Size ? 200 : 180,
                            marginBottom: 20,
                            marginLeft: 10,
                            zIndex: 1,
                            fontSize: font_Size ? 40 : 30,
                            // fontSize: 40,
                            fontWeight: "bold",
                        }}
                    >
                        {name} . {title}
                        {/* hello */}
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
            <View style={{ height: 450, backgroundColor: "white" }}>
                <View style={styles.topRow}>
                    <View style={{ flexDirection: "row" }}>
                        <Icon
                            name={"clock"}
                            size={20}
                            color={Colors.darkGray}
                            style={styles.icon}
                        />
                        <Text style={styles.subheader}>
                            {date}
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
                            {location}
                        </Text>
                    </View>
                </View>
                <View style={styles.actionRow}>
                    <TouchableOpacity>
                        <Icon
                            name={"heart"}
                            size={30}
                            color={Colors.darkGray}
                            style={styles.action}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Icon
                            name={"star"}
                            size={30}
                            color={Colors.darkGray}
                            style={styles.action}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Icon
                            name={"shopping-cart"}
                            size={30}
                            color={Colors.darkGray}
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
