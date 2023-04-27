const admin = require("firebase-admin");
const { adminAuth, database, storage } = require("../index.js");
const { FieldValue } = require("@google-cloud/firestore");
const {
    update_fields,
    required_fields,
} = require("./../constants/userConstants");
const {
    getAuth,
    signInWithEmailAndPassword,
    getIdToken,
} = require("firebase/auth");
const { v4 } = require("uuid");
const axios = require("axios");
const createUser = async (req, res) => {
    let missing = []; //check for empty fields
    form = Object.keys(req.body);
    missing = required_fields.filter((field) => !form.includes(field));
    if (missing.length > 0) {
        await res.status(400).json({
            error: "following fields are missing",
            missing: missing,
        });
    } else {
        let userCreated = true;
        if (!req.file) {
            res.status(404).json({
                error: "file missing",
            });
            return;
        }
        const user = await adminAuth
            .createUser({
                email: req.body.email,
                password: req.body.password,
            })
            .catch((error) => {
                res.status(400).json({
                    error: error.code,
                });
                userCreated = false;
            });
        if (userCreated) {
            delete req.body.password;
            const bucket = storage.bucket();
            const fullPath = `UserImages/${v4()}`;
            const bucketFile = bucket.file(fullPath);

            console.log(req.file);
            await bucketFile.save(req.file.buffer, {
                contentType: req.file.mimetype,
                gzip: true,
            });
            const [url] = await bucketFile.getSignedUrl({
                action: "read",
                expires: "01-01-2030",
            });
            await database
                .collection("users")
                .doc(user.uid)
                .set({
                    ...req.body,
                    tickets_owned: [],
                    tickets_selling: [],
                    tickets_interested: [],
                    friends: [],
                    pendingIncoming: [],
                    pendingOutgoing: [],
                    image: url,
                })
                .then(async () => {
                    const token = await getIdToken(user.uid);
                    res.status(200).json({
                        uid: user.uid,
                        token: token,
                    });
                });
        }
    }
};

const readUser = async (req, res) => {
    const uid = req.body.uid;

    admin
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((userDoc) => {
            if (!userDoc.exists) {
                throw new Error("User not found");
            }
            // Return the user data as JSON
            //res.json(userDoc.data()).json
            res.status(200).json({
                data: userDoc.data(),
            });
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

const updateUser = async (req, res) => {
    const data = req.body;
    const uid = data.uid;
    let newData = {};
    for (const [key, value] of Object.entries(data)) {
        if (update_fields.includes(key)) newData[key] = value;
    }
    if (req.body.file) {
        const bucket = storage.bucket();
        const fullPath = `UserImages/${v4()}`;
        const bucketFile = bucket.file(fullPath);

        console.log(req.file);
        await bucketFile.save(req.file.buffer, {
            contentType: req.file.mimetype,
            gzip: true,
        });
        const [url] = await bucketFile.getSignedUrl({
            action: "read",
            expires: "01-01-2030",
        });
        newData[pfp] = url;
    }
    admin
        .firestore()
        .collection("users")
        .doc(uid)
        .update(newData)
        .then(() => {
            res.status(200).json({
                message: "User updated succesfully!",
            });
        })
        .catch((error) => {
            sent = true;
            res.status(404).json({
                error: error,
            });
        });
};

const deleteUser = async (req, res) => {
    const uid = req.body.uid;
    await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .delete()
        .then(() => {
            res.status(200).json({
                message: "User deleted successfully!",
            });
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

const friendReq = async (req, res) => {
    try {
        const { requester, friend } = req.body;

        // Check if both requester and friend documents exist
        const [requesterDoc, friendDoc] = await Promise.all([
            firestore.collection("users").doc(requester).get(),
            firestore.collection("users").doc(friend).get(),
        ]);

        if (!requesterDoc.exists || !friendDoc.exists) {
            throw new Error("One or more users do not exist");
        }

        // Check if they are already friends
        if (
            requesterDoc.data().friends.includes(friend) ||
            friendDoc.data().friends.includes(requester)
        ) {
            throw new Error("Users are already friends");
        }

        // Check if friend request is already pending
        if (
            requesterDoc.data().pendingOutgoing.includes(friend) ||
            friendDoc.data().pendingIncoming.includes(requester)
        ) {
            throw new Error("Friend request is already pending");
        }

        // Add requester uid to friend's pending incoming
        // and add friend uid to requester's pending outgoing
        await Promise.all([
            friendDoc.ref.update({
                pendingIncoming:
                    admin.firestore.FieldValue.arrayUnion(requester),
            }),
            requesterDoc.ref.update({
                pendingOutgoing: admin.firestore.FieldValue.arrayUnion(friend),
            }),
        ]);

        res.status(200).send("Friend request sent");
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(400).send(error.message);
    }
};

const acceptFriend = async (req, res) => {
    try {
        const { requester, friend } = req.body;

        // Check if both requester and friend documents exist
        const [requesterDoc, friendDoc] = await Promise.all([
            firestore.collection("users").doc(requester).get(),
            firestore.collection("users").doc(friend).get(),
        ]);

        if (!requesterDoc.exists || !friendDoc.exists) {
            throw new Error("One or more users do not exist");
        }

        // Check if they are already friends
        if (
            requesterDoc.data().friends.includes(friend) ||
            friendDoc.data().friends.includes(requester)
        ) {
            throw new Error("Users are already friends");
        }

        // Check if friend request is pending
        if (
            !friendDoc.data().pendingIncoming.includes(requester) ||
            !requesterDoc.data().pendingOutgoing.includes(friend)
        ) {
            throw new Error("Friend request not found");
        }

        // Remove both from pending and add each other's uid's to each other's friend array
        await Promise.all([
            friendDoc.ref.update({
                friends: admin.firestore.FieldValue.arrayUnion(requester),
                pendingIncoming:
                    admin.firestore.FieldValue.arrayRemove(requester),
            }),
            requesterDoc.ref.update({
                friends: admin.firestore.FieldValue.arrayUnion(friend),
                pendingOutgoing: admin.firestore.FieldValue.arrayRemove(friend),
            }),
        ]);

        res.status(200).send("Friend request accepted");
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(400).send(error.message);
    }
};

const loginUser = async (req, res) => {
    //  auth=getAuth()
    //  await signInWithEmailAndPassword(auth, req.body.email, req.body.password).then(()=>{
    //   res.status(200)}
    //  )
};

const loadFriends = async (req, res) => {
    const uid = req.body.uid;
    database
        .collection("users")
        .doc(uid)
        .get()
        .then(async (userDoc) => {
            //get userdoc
            if (!userDoc.exists) {
                res.status(404).json({
                    error: "user not found",
                });
            } else {
                const friendsRef = userDoc
                    .data()
                    .friends.map((friendID) =>
                        database.collection("users").doc(friendID)
                    );
                const friends = await database.getAll(...friendsRef); //query all friends
                let friendData = [];
                let missingFriends = [];
                friends.forEach((friend) =>
                    friend.exists
                        ? friendData.append(friend)
                        : missingFriends.append(friend)
                ); //get all the friends that exist
                res.status(200).json({
                    friends: friendData,
                });
                if (missingFriends.length > 0) {
                    //delete all friends that dont
                    database
                        .collection("users")
                        .doc(uid)
                        .update({
                            friends: FieldValue.arrayRemove(missingFriends),
                        });
                }
            }
        });
};

//TODO
const searchUser = async (req, res) => {
    //query all documents in fb where matches, fname, lname, insta, discord, etc
    //look into here https://firebase.google.com/docs/firestore/solutions/search?provider=algolia
};

const addUserToEvent = async (req, res) => {
    //take in three params, the user we're changing, the event we're changing their relation to, and which field we're chaning (interested, selling, going)
    const uid = req.params.uid;
    const event = req.params.event;
    const field = req.params.field;
    if (
        !event ||
        !uid ||
        field != "following" ||
        field != "interested" ||
        field != "going"
    )
        //check for all parameters
        return res.status(400).json({
            error: "one or more parameters are missing from the request",
        });
    const [userdoc, eventdoc] = await promises.all(
        database.collection("users").doc(uid).get(),
        database.collection("events").doc(event).get()
    ); //query the user and the event
    if (!userdoc.exists)
        return res.status(400).json({
            error: "user not found",
        });
    else {
        //construct json object to be added
        if (!eventdoc.exists) {
            //if event doc doesn't exist, we create it with the name uid

            database.collection("events").doc(event).set();
        }
        //then add person to corresponding field
        //create copy of userdoc.data(), add the new concert to the appropriate field and then set it with .set()
    }
};

const objectTest = async (req, res) => {
    const uid = req.body.uid;
    const events = req.body.eventArray;
    console.log(events);
    database
        .collection("users")
        .doc(uid)
        .set(events)
        .then(() => {
            res.status(200);
        });
};
module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser,
    loginUser,
    loadFriends,
    searchUser,
    friendReq,
    addUserToEvent,
    objectTest,
};
