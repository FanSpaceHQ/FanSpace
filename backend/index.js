
const admin = require("firebase-admin");

const serviceAccount = require("./.firebase/service_account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth=admin.auth()
const database=admin.firestore()

module.exports={
auth,
database
}