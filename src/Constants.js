import { Dimensions } from "react-native";

export const Dim = {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
};

export const BorderRadius = 10;

export const Colors = {
    primary: "#6B4EFF",
    primaryGreen: "#0DAD81",
    secondary: "#5538EE",
    light: "#C6C4FF",
    lighter: "#E7E7FF",
    darkGray: "#303437",
    lightGray: "#CDCFD0",
    gray: "#E3E5E5",
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
