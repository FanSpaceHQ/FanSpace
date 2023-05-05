import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../screens/ProfileScreen.js";
import { HomeScreenStack } from "./HomeScreenStack.js";
import SearchScreen from "../screens/SearchScreen.js";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../Constants.js";

const Tab = createBottomTabNavigator();

export const NavbarStack = (route) => {
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