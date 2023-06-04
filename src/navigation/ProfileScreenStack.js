import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsPage from "../screens/Settings";
import SignIn from "../screens/SignInScreen.js";
import HomeScreen from "../screens/HomeScreen";
import ConcertScreen from "../screens/ConcertScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const ProfileScreenStack = (route) => {
    return (
        <Stack.Navigator headerMode="false">
            <Tab.Screen
                name="Profile Screen"
                component={ProfileScreen}
                options={{ headerShown: false }}
                //navigation={navigation} // Pass the navigation prop here
            />
            <Stack.Screen
                name="Settings"
                component={SettingsPage}
                options={{ headerShown: false }}
                //navigation={navigation} // Pass the navigation prop here
            />
            <Stack.Screen
                name="Sign In"
                component={SignIn}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Concert Screen"
                component={ConcertScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};
