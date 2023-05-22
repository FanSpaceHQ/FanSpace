import React, { useState } from "react";
import {
    View,
    Switch,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import { Colors, Dim } from "../Constants";

const SettingsPage = ({ navigation, props }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const handleNotificationsToggle = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile Screen")}
                >
                    <Text style={styles.subheader}>
                        <Text style={styles.arrow}>← </Text>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Enable Notifications</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={handleNotificationsToggle}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Dim.height * 0.03,
        marginLeft: Dim.width * 0.09263959391,
        width: Dim.width * 0.81472081218,
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 16,
    },
    section: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    label: {
        fontSize: 18,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingTop: 20,
    },
    subheader: {
        color: Colors.darkGray,
        fontSize: 16,
        fontWeight: "medium",
        color: "#6D6D6D",
    },
    arrow: {
        fontSize: 20,
        fontWeight: "bold",
    },
    icon: {
        size: 35,
    },
    header: {
        fontSize: 30,
        fontFamily: "WorkSans",
    },
});

export default SettingsPage;
