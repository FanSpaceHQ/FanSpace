import { createNativeStackNavigator } from "@react-navigation/native-stack"
import FriendScreen from "../screens/FriendScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ProfileScreenStack } from "./ProfileScreenStack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const FriendScreenStack = () => {
    return (
        <Stack.Navigator headerMode="false">
            <Tab.Screen
                name="Friend Screen"
                component={FriendScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="User Profile Screen"
                component={ProfileScreenStack}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}