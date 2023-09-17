import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import FriendRequestBlock from "../components/common/FriendRequestBlock";
import { Colors, Dim } from "../Constants";
import { FriendBox } from "./FriendScreen";
import { getAuth } from "firebase/auth";
import { ref, getDatabase, onValue, get } from "firebase/database";
import { getDownloadURL, getStorage, ref as storRef } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

/*
  -- DOCUMENTATION --
*/
const InboxScreen = ({ navigation, props }) => {
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        onValue(
            ref(
                getDatabase(),
                `users/${getAuth().currentUser.uid}/pendingIncoming`
            ),
            async (snap) => {
                if (snap.val()) {
                    const requestsArr = [];
                    for (let request of Object.keys(snap.val())) {
                        const firstName = await get(
                            ref(getDatabase(), `users/${request}/firstName`)
                        );
                        const lastName = await get(
                            ref(getDatabase(), `users/${request}/lastName`)
                        );
                        const username = await get(
                            ref(getDatabase(), `users/${request}/username`)
                        );
                        const url = await getDownloadURL(
                            storRef(getStorage(), `images/${request}/profile`)
                        );
                        requestsArr.push({
                            name: firstName.val() + " " + lastName.val(),
                            userName: username.val(),
                            image: url,
                            id: request,
                        });
                    }
                    setRequests(requestsArr);
                }
            }
        );
    }, []);

    const closeButton = (id) => {
        const removeFriendRequest = httpsCallable(getFunctions(), 'removeFriendRequest');
        removeFriendRequest({ fuid: id });
        const requestsClone = requests.filter((req) => req.id !== id);
        setRequests(requestsClone);
    };

    return (
        <SafeAreaView style={{ backgroundColor: "white" }}>
            <View style={styles.topRow2}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.subheader2}>
                        {" "}
                        <Text style={styles.arrow2}>← </Text> Back
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.header}>Inbox</Text>
            {requests.length < 1 ? (
                <View style={{ marginTop: 30 }}>
                    <Text style={styles.name}>It's looking empty here</Text>
                    <Text style={styles.username}>
                        Friends will come soon, don't worry!
                    </Text>
                </View>
            ) : null}
            <FlatList
                style={{ height: "100%", marginTop: 30, paddingBottom: "30%" }}
                data={requests}
                horizontal={false}
                renderItem={({ item: request }) => {
                    return (
                        <FriendBox
                            id={request.id}
                            key={request.id}
                            image={request.image}
                            name={request.name}
                            userName={request.userName}
                            closeButton={() => closeButton(request.id)}
                        />
                    );
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    topRow2: {
        flexDirection: "row",
        justifyContent: "flex-start",
        // paddingTop: 40,
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
    header: {
        fontSize: 30,
        fontWeight: "bold",
        marginRight: Dim.width * 0.5,
        marginLeft: 30,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 30,
        flexWrap: "wrap",
    },
    username: {
        color: "#B4B3B3",
        marginLeft: 30,
    },
});

export default InboxScreen;
