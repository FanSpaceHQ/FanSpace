import React from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from "react-native";

/*
  -- DOCUMENTATION --
*/
const Profile = (props) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                    {/* Placeholder until stack navigator works */}
                    <Text
                        style={{
                            padding: 20,
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                    >
                        My Profile
                    </Text>

                    <View
                        style={{
                            alignItems: "center",
                            paddingTop: 60,
                            height: 150,
                            width: 150,
                            borderRadius: 1000,
                            backgroundColor: "black",
                        }}
                    >
                        <Text style={{ color: "white", flexWrap: true }}>
                            Profile photo
                        </Text>
                    </View>

                    <Text
                        style={{
                            padding: 20,
                            fontSize: 30,
                            fontWeight: "bold",
                        }}
                    >
                        Izak Bunda
                    </Text>

                    <View
                        style={{
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 20,
                            padding: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                            }}
                        >
                            Hi! I am a 2nd year UCLA student. 🐻🌟
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // h1: {color}
});

export default Profile;
