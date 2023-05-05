import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../screens/SignInScreen.js";
import SignUp from "../screens/SignUpScreen.js";
import CreateProfileScreen from "../screens/CreateProfileScreen.js";
import { NavbarStack } from "./NavbarStack.js";
import * as ImagePicker from "expo-image-picker";

const Stack = createNativeStackNavigator();

export const SignInStack = (route) => {
    return (
        <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
            <Stack.Screen
                name="Sign In"
                component={SignIn}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Sign Up"
                component={SignUp}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Create Profile"
                component={CreateProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="NavbarStack"
                component={NavbarStack}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

