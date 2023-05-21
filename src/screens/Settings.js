import React, { useState } from "react";
import { View, Switch, Text, StyleSheet } from "react-native";

const SettingsPage = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const handleNotificationsToggle = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Enable Notifications</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={handleNotificationsToggle}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
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
});

export default SettingsPage;
