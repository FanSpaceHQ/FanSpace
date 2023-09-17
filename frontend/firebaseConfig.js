import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; 
import { getFunctions } from "firebase/functions";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyAU5DjER2f0ljEc5cZpq-9iO0XAOx8E7GI",
    authDomain: "concert-connect-4fcf2.firebaseapp.com",
    databaseURL: "https://concert-connect-4fcf2-default-rtdb.firebaseio.com",
    projectId: "concert-connect-4fcf2",
    storageBucket: "concert-connect-4fcf2.appspot.com",
    messagingSenderId: "54800951577",
    appId: "1:54800951577:web:08190e5708811b9bfefd88",
    measurementId: "G-7RX5DLBTNW"
};

const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
getDatabase(app);
getStorage(app);
getFunctions(app);