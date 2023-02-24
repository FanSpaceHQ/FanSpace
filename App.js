import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";

// Import all screens here
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SearchScreen from "./src/screens/SearchScreen";
import SingInScreen from "./src/screens/SignInScreen";
import LandingScreen from "./src/screens/LandingScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import CreateProfileScreen from "./src/screens/CreateProfileScreen";
//

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NavBarVisible(route) {
    return (
        <Tab.Navigator
            headerMode="false"
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                style: {
                    height: 90,
                },
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case "Home":
                            iconName = "home";
                            break;
                        case "Search":
                            iconName = "search";
                            break;
                        case "Profile":
                            iconName = "user";
                            break;
                        default:
                            break;
                    }
                    return <Icon name={iconName} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
}

function SignInFlow(route) {
    return (
        <Stack.Navigator headerMode="false">
            <Stack.Screen
                name="Sign In"
                component={SingInScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Sign Up"
                component={SignUpScreen}
                options={{ headerShown: true, title: "Profile" }}
            />
            <Stack.Screen
                name="Create Profile"
                component={CreateProfileScreen}
                options={{ headerShown: true, title: "Profile" }}
            />
        </Stack.Navigator>
    );
}

const App = () => {
    const [userID, setUserID] = useState(false);
    const [loading, setLoading] = useState(false);

    // if loading go to LandingScreen
    // if not loading, then check userID
    // if userID, then go to app
    // if not userID, then go to Login stack

    return (
        <NavigationContainer>
            {loading ? (
                <LandingScreen />
            ) : userID ? (
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="App" component={NavBarVisible} />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen
                        name="Sign In Flow"
                        component={SignInFlow}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            )}
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
