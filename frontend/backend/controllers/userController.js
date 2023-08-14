const admin = require("firebase-admin");
const firebase = require("firebase/app");
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

const uploadImage = async(req, res) => {
  const bucket = storage.bucket();
  const fullPath = `UserImages/${v4()}`;
  const bucketFile = bucket.file(fullPath);

  // console.log(req.file);
  await bucketFile.save(req.file.buffer, {
      contentType: req.file.mimetype,
      gzip: true,
  });
  const [url] = await bucketFile.getSignedUrl({
      action: "read",
      expires: "01-01-2030",
  });

  // console.log(url);
  res.status(200).json({
    url: url,
  })

}

const createUser = async (req, res) => {
    console.log(req.body);
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
            await database
                .collection("users")
                .doc(user.uid)
                .set({
                    ...req.body,
                    going: [],
                    selling: [],
                    interested: [],
                    friends: [],                    
                    pendingIncoming: [],
                    pendingOutgoing: [],
                })
                .then(async () => {
                    res.status(200).json({
                        uid: user.uid
                    });
                });
        }
    }
  }

const readUser = async (req, res) => {
    const uid = req.params.uid;
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
    if(req.file)
    {
      const bucket = storage.bucket();
      const fullPath = `UserImages/${v4()}`;
      const bucketFile = bucket.file(fullPath);
   
      console.log(req.file)
      await bucketFile.save(req.file.buffer, {
        contentType: req.file.mimetype,
        gzip: true
      });
      const [url] = await bucketFile.getSignedUrl({
        action: 'read',
        expires: '01-01-2030'
      });
      newData['image']=url
    }
    if(newData)
    admin.firestore().collection('users').doc(uid).update(newData).then(()=>{
    res.status(200).json({
        message: "User updated succesfully!"
    })
    }).catch((error)=>{
    sent=true
    res.status(404).json({
        error: error
    })
    })
  }

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
        const { uid, fid } = req.body;
    
        // Check if both requester and friend documents exist
        const [userDoc, friendDoc] = await Promise.all([
          database.collection('users').doc(uid).get(),
          database.collection('users').doc(fid).get()
        ]);
    
        if (!userDoc.exists || !friendDoc.exists) {
          throw new Error('One or more users do not exist');
        }
        
        const user=userDoc.data()
        const friend=friendDoc.data()
        if(!friend.friends)
        {
          console.log("changing")
          friend.friends={}
        }
        if(!friend.pendingIncoming)
        {
          friend.pendingIncoming={}
        }
        if(!user.friends)
        {
          user.friends={}
        }
        if(!user.pendingOutgoing)
        {
          user.pendingOutgoing={}
        }
        console.log(friend.friends)
        // Check if they are already friends
        if ((Object.keys(friend.friends).length != 0&&uid in friend.friends) || (Object.keys(user.friends).length != 0&&fid in user.friends)) {
          throw new Error('Users are already friends');
        }

        // Check if friend request is already pending
        if ((Object.keys(friend.pendingIncoming).length !=0&&uid in friend.pendingIncoming)|| (Object.keys(user.pendingOutgoing).length != 0&&fid in user.pendingOutgoing)) {
          throw new Error('Friend request is already pending');
        }

        // Add requester uid to friend's pending incoming
        // and add friend uid to requester's pending outgoing
        let incoming=friend.pendingIncoming
        incoming[uid]={
          firstName:user.firstName,
          lastName:user.lastName,
          image:user.image
        }
        let outgoing=user.pendingOutgoing
        outgoing[fid]={
          firstName: friend.firstName,
          lastName:friend.lastName,
          image:friend.image
        }
        console.log(outgoing)
        console.log(incoming)
        await Promise.all([
          database.collection('users').doc(fid).set({
            pendingIncoming: incoming
          },{merge:true}),
          database.collection('users').doc(uid).set({
            pendingOutgoing: outgoing
          },{merge:true})
        ]);
      }catch (error) {
          console.error("Error accepting friend request:", error);
          res.status(400).send(error.message);
      }
    }

const acceptFriend= async(req,res)=>{ //user sends request to friend. friend is accepting it
    try
     {
        const { uid, fid } = req.body;
        if(!uid||!fid){
          throw new Error('One of more fields missing')
        }
        // Check if both requester and friend documents exist
        const [userDoc, friendDoc] = await Promise.all([
          database.collection('users').doc(uid).get(),
          database.collection('users').doc(fid).get()
        ]);
    
        if (!userDoc.exists || !friendDoc.exists) {
          throw new Error('One or more users do not exist');
        }
        const user=userDoc.data()
        const friend=friendDoc.data()
        if(!friend.friends)
        {
          friend.friends={}
        }
        if(!friend.pendingIncoming)
        {
          friend.pendingIncoming={}
        }
        if(!user.friends)
        {
          user.friends={}
        }
        if(!user.pendingOutgoing)
        {
          user.pendingOutgoing={}
        }

        // Check if they are already friends
        if ((Object.keys(friend.friends).length != 0&&uid in friend.friends) || (Object.keys(user.friends).length != 0&&fid in user.friends)) {
          throw new Error('Users are already friends');
        }

        // Check if friend request is pending
        // if (!friendDoc.data().pendingIncoming.includes(requester) || !requesterDoc.data().pendingOutgoing.includes(friend)) {
        //   throw new Error('Friend request not found');
        // }
        if(!(Object.keys(friend.pendingIncoming).length != 0&&uid in friend.pendingIncoming)||!(Object.keys(user.pendingOutgoing).length != 0&&fid in user.pendingOutgoing)){
          throw new Error('Friend request not found');
        }
        if(!(user.firstName||user.lastName||user.image||friend.firstName||friend.lastName||friend.image))
          throw new Error('Error reading friend')
        
        let userFriends=user.friends
        userFriends[fid]={
          firstName: friend.firstName,
          lastName: friend.lastName,
          image: friend.image,
        }
        let friendFriends=friend.friends
        friendFriends[uid]={
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
        }
        
        let outgoing=user.pendingOutgoing
        delete outgoing[fid]
        let incoming=friend.pendingIncoming
        delete incoming[uid]
        // Remove both from pending and add each other's uid's to each other's friend array
        await Promise.all([
          database.collection('users').doc(fid).set({
            friends: friendFriends,
            pendingIncoming: incoming
          }, {merge: true}),
          database.collection('users').doc(uid).set({
            friends: userFriends,
            pendingOutgoing: outgoing
          },{merge:true})
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
    const uid = req.params.uid;
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
                        ? friendData.push(friend)
                        : missingFriends.push(friend)
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

const searchUser = async (req, res) => {
  try {
    // console.log(req.params)
        // const searchQuery = req.body.thing.trim();
        const userId = req.params.uid;
        const fullSearch = req.params.username;
        const searchQuery = req.params.username.trim();
        const searchWords = searchQuery.split(' ');
        let result = [];
        for (const word of searchWords) {
        const firstNameQuery = database.collection('users').where('firstName', "==", word);
        const lastNameQuery = database.collection('users').where('lastName', "==", word);
        const discordQuery = database.collection('users').where('discord', "==", word);
        const instaQuery = database.collection('users').where('insta', "==", word);
        const twitterQuery = database.collection('users').where('twitter', "==", word);
        const [firstNameSnapshot, lastNameSnapshot, discordSnapshot, instaSnapshot, twitterSnapshot] = await Promise.all([
            firstNameQuery.get(),
            lastNameQuery.get(),
            discordQuery.get(),
            instaQuery.get(),
            twitterQuery.get()
        ]);
        firstNameSnapshot.forEach(doc => {
            const uid = doc.id;
            if (uid != userId) {
                const { firstName, lastName, imageUrl, username } = doc.data();
                const userInfo = {
                    uid,
                    firstName,
                    lastName,
                    imageUrl,
                    username,
                };
                if (!result.some((user) => user.uid == uid)) {
                    result.push(userInfo);
                }
            }
        });
        lastNameSnapshot.forEach(doc => {
            const uid = doc.id;
            if (uid != userId){
              const { firstName, lastName, imageUrl, username } = doc.data();
              const userInfo = {
                  uid,
                  firstName,
                  lastName,
                  imageUrl,
                  username,
              };
              if (!result.some(user => user.uid == uid)) {
                result.push(userInfo);
            }}
        });
        discordSnapshot.forEach(doc => {
            const uid = doc.id;
            if (uid != userId){
              const { firstName, lastName, imageUrl, username } = doc.data();
              const userInfo = {
                uid,
                firstName,
                lastName,
                imageUrl,
                username,
              };
              if (!result.some(user => user.uid == uid)) {
                result.push(userInfo);
            }}
        });
        instaSnapshot.forEach(doc => {
            const uid = doc.id;
            if (uid != userId){
              const { firstName, lastName, imageUrl, username } = doc.data();
              const userInfo = {
                uid,
                firstName,
                lastName,
                imageUrl,
                username,
              };
              if (!result.some(user => user.uid == uid)) {
                result.push(userInfo);
            }}
        });
        twitterSnapshot.forEach(doc => {
            const uid = doc.id;
            if (uid != userId){
              const { firstName, lastName, imageUrl, username } = doc.data();
              const userInfo = {
                uid,
                firstName,
                lastName,
                imageUrl,
                username,
              };
              if (!result.some(user => user.uid == uid)) {
                result.push(userInfo);
            }}
        });
        }
        // console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error',
    error: error });
    }
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

const checkUser = async (req, res) => {
  const username = req.params.username;
  const userNameQuery = database.collection("users").where("username", '==', username);
  const userNameSnapshot = await userNameQuery.get();
  if (userNameSnapshot.empty){
    res.status(200).json({Status: "Username does not exist"});
  } else{
    res.status(400).json({error: "Username already exists"})
  }
}

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
    acceptFriend,
    uploadImage,
    checkUser,
}
