import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen.js";
import ConcertScreen from "../screens/ConcertScreen.js";
import InboxScreen from "../screens/InboxScreen.js";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const InboxScreenStack = (route) => {
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
           <Stack.Screen
                name="Inbox Screen"
                component={InboxScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}