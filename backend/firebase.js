const {initializeApp} = require('firebase/app')
const {getAuth} = require('firebase/auth');
const {getStorage} = require('firebase/storage');
const {getRemoteConfig, getRemoteConfig} = require('firebase/remote-config')

const firebaseConfig={
    apiKey: "AIzaSyAU5DjER2f0ljEc5cZpq-9iO0XAOx8E7GI",
    authDomain: "concert-connect-4fcf2.firebaseapp.com",
    projectId: "concert-connect-4fcf2",
    storageBucket: "concert-connect-4fcf2.appspot.com",
    messagingSenderId: "54800951577",
    appId: "1:54800951577:web:08190e5708811b9bfefd88",
    measurementId: "G-7RX5DLBTNW"
}
const app= initializeApp(firebaseConfig)

const getRemoteConfig=getRemoteConfig(app)
remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
const auth = getAuth(app);
const storage = getStorage(app);

module.exports = {
  auth,
  storage,
}