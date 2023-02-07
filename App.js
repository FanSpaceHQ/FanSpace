import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens here
import Home from "./src/screens/Home";
import Profile from "./src/screens/Profile";
//
const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <View style={styles.container}>
                <Home />
                {/* <Profile /> */}
                {/* <Stack.Navigator initialRouteName="Profile">
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ title: "Welcome" }}
                    />
                    <Stack.Screen
                        name="Profile"
                        component={Profile}
                        options={{ title: "Profile" }}
                    />
                </Stack.Navigator> */}
            </View>
        </NavigationContainer>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
