import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    SafeAreaView,
    FlatList,
    Alert,
    TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import FriendRequestBlock from "../components/common/FriendRequestBlock";
import { Colors, Dim } from "../Constants";

/*
  -- DOCUMENTATION --
*/
const FriendRequestData = [
    {
        image: "data:image/jpeg;base64,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",
        name: "Brennan Mulligan",
        username: "Dimension20DM",
        
    },
    {
        image: "data:image/jpeg;base64,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",
        name: "Nick Joseph",
        username: "KingNick",

    },
    {
        image: "data:image/jpeg;base64,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",
        name: "Paul Eggert ",
        username: "Time",

    },
];
const InboxScreen = ({navigation ,props}) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity onPress={() =>navigation.navigate("Home Screen")}><Text style={styles.subheader}> <Text style={styles.arrow}>←  </Text> Home</Text></TouchableOpacity>
            </View>
            <View style={styles.topRow}>
                    <Icon
                        name={"bell"}
                        size={35}
                        color={Colors.darkGray}
                        style={styles.icon}
                    />
            <Text style={styles.header}> Inbox</Text>       
            </View>
            <View style={styles.topRow}>
            <Text style={styles.subheader}> Friend Requests {"("+FriendRequestData.length+")"}</Text>      
            </View>
            <View
  style={{
    marginTop: Dim.height * 0.02,
    marginLeft: Dim.width * 0.09263959391,
    width: Dim.width * .81472081218,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  }}
    />
     <View style={{ alignSelf: "center" }}>
                <FlatList
                data={FriendRequestData}
                horizontal={false}
                    renderItem={({ item: data }) => {
                        return (
                            <FriendRequestBlock
                                image={data.image}
                                name={data.name}
                                username={data.username}
                                date={data.date}
                                location={data.location}
                                onPress={() =>
                                    alert("Friend Request Pressed")
                                }
                            />
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    topRow: {
        flexDirection: "row",
        justifyContent:"flex-start",
        paddingTop: 20,
        marginLeft: 20,
    },
    subheader: {
        color: Colors.darkGray,
        fontSize: 16,
        fontWeight: "medium",
        color:'#6D6D6D',
    },
    arrow: {
        fontSize: 20,
        fontWeight: "bold"
    },
    icon: {
        size: 35,
    },
    header: {
        fontSize: 30,
    },
});

export default InboxScreen;
