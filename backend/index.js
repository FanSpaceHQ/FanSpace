
const admin = require("firebase-admin");

const serviceAccount = require("./.firebase/service_account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://concert-connect-4fcf2.firebaseio.com",
    storageBucket:"concert-connect-4fcf2.appspot.com"
});

const adminAuth=admin.auth()
const database=admin.firestore()
const storage=admin.storage()

module.exports={
adminAuth,
database,
storage
}