import * as React from "react";
import { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {} from "./firebaseConfig";

// Import Screens
import LandingScreen from "./src/screens/LandingScreen";

// Import Stacks
import { NavbarStack } from "./src/navigation/NavbarStack";
import { SignInStack } from "./src/navigation/SignInStack";
import { registerRootComponent } from "expo";

import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { setCustomText } from "react-native-global-props";

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "red",
    },
};

const Stack = createNativeStackNavigator();

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fontsLoaded] = useFonts({
        "Work Sans": require("./src/assets/WorkSans-VariableFont_wght.ttf"),
    });

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if ((await AsyncStorage.getItem("middleOfSignUp")) === "true")
                return;
            if (user) {
                setIsLoading(false);
                setIsSignedIn(true);
            } else {
                setIsLoading(false);
                setIsSignedIn(false);
            }
        });
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <NavigationContainer theme={MyTheme}>
            {isLoading ? (
                <LandingScreen />
            ) : isSignedIn ? (
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
    );
};

registerRootComponent(App);

export default App;
