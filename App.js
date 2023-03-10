import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";
import { Colors, Dim } from "./src/Constants";
import { DefaultTheme } from "@react-navigation/native";

// Import all screens here
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SearchScreen from "./src/screens/SearchScreen";
import SignInScreen from "./src/screens/SignInScreen";
import LandingScreen from "./src/screens/LandingScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import CreateProfileScreen from "./src/screens/CreateProfileScreen";
import ConcertScreen from "./src/screens/ConcertScreen";
//

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "red",
    },
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreenStack(route) {
    return (
        <Stack.Navigator headerMode="false">
            <Tab.Screen
                name="Home Screen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Concert Screen"
                component={ConcertScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

function NavBarVisible(route) {
    return (
        <Tab.Navigator
            headerMode="true"
            screenOptions={({ route }) => ({
                tabBarShowLabel: true,
                tabBarActiveTintColor: Colors.green.primary,
                tabBarStyle: {
                    padding: 10,
                    paddingTop: 10,
                    paddingBottom: 30,
                    height: 90,
                    // margin: 20,
                    // width: Dim.width - 40,
                    // borderRadius: 25,
                    // backgroundColor: "transparent",
                },
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case "Home":
                            iconName = "home";
                            break;
                        case "Friends":
                            iconName = "smile";
                            break;
                        case "Profile":
                            iconName = "user";
                            break;
                        default:
                            break;
                    }
                    return <Icon name={iconName} size={24} color={color} />;
                    f;
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreenStack}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Friends"
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
                component={SignInScreen}
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
        <NavigationContainer theme={MyTheme}>
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
