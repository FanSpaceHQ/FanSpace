import * as React from "react";
import { StyleSheet, LogBox } from "react-native";
import { useState, useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import Screens
import LandingScreen from "./src/screens/LandingScreen";

// Import Stacks
import { NavbarStack } from "./src/navigation/NavbarStack";
import { SignInStack } from "./src/navigation/SignInStack";
import AsyncStorage from "@react-native-async-storage/async-storage";


const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "red",
    },
};

const Stack = createNativeStackNavigator();

const App = () => {
    const [userID, setUserID] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("@uid").then((userId) => {
            console.log(userId);
            if (userId !== null) {
                setUser(true);
                setLoading(false);
            } else {
                setUser(false);
                setLoading(false);
            }
        });
    }, []);

    return(
        <NavigationContainer theme={MyTheme}>
            {loading ? (
                <LandingScreen />
            ) : userID ? (
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="App" component={NavbarStack} />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen
                        name="Sign In Flow"
                        component={SignInStack}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    )
}

export default App;