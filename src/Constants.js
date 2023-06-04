import { Dimensions } from "react-native";

export const Dim = {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
};

export const BorderRadius = 10;

export const Colors = {
    green: {
        primary: "#0DAD81",
        secondary: "#009989",
        tertiary: "#008588",
    },
    blue: {
        primary: "#00707F",
        secondary: "#205C6E",
        tertialy: "#2F4858",
    },
    darkGray: "#61646B",
    lightGray: "#CDCFD0",
    gray: "#E3E5E5",
    white: '#FFFFFF',
    error: "red",
};

export const RegexPassword =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
export const RegexUsername = /((?=[a-z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.])/;
export const RegexUsername2 = /(.*[A-Z].*)/;
export const RegexEmail = /\w{1,}@\w{1,}.edu/;
export const RegexName = /^[a-zA-Z]+$/;
export const RegexInstagram =
    /^(?![_\.])(?!.*[\._]$)(?!.*[\._]{2})[a-zA-Z0-9._]{2,30}$/;
export const RegexDiscord = /^[a-zA-Z0-9_ ]{2,32}#\d{4}$/;
export const RegexTwitter =
    /^[a-zA-Z](?!.*[_]{2})[a-zA-Z0-9_]{0,13}[a-zA-Z0-9]$/;