const admin = require('firebase-admin')
const {adminAuth, database}=require('../index.js')
const {FieldValue}=require('@google-cloud/firestore')
const required_fields=require('./../constants/userConstants')
const { getAuth, signInWithEmailAndPassword }=require ("firebase/auth")
const createUser = async(req, res)=>{
    let missing=[] //check for empty fields
    form=Object.keys(req.body)
    console.log(typeof(required_fields))
    console.log(required_fields)
    missing=required_fields.filter(field=>!form.includes(field))
    if(missing.length>0){
        await res.status(400).json({
            error: "following fields are missing",
            missing: missing
        })
    }
    else{
  let userCreated=true
   const user=await adminAuth.createUser({
    email: req.body.email,
    password: req.body.password
   }).catch((error)=>{
    res.status(400).json({
      error: error.code
    })
    userCreated=false
   })
   if(userCreated){
    delete req.body.password
   await database.collection('users').doc(user.uid).set({
    ...req.body,
    "tickets_owned":[],
    "tickets_selling":[],
    "tickets_interested":[],
    "friends":[],
    "pendingIncoming":[],
    "pendingOutgoing":[]
   }).then(()=>{
    res.status(200).json({
      uid: user.uid
    })
   }
   )
  }
}
}

const readUser = async (req, res) => {
    const uid = req.body.uid;
    admin.firestore().collection('users').doc(uid).get().then((userDoc)=>{
    if (!userDoc.exists) {
    throw new Error('User not found');
    }
    // Return the user data as JSON
    //res.json(userDoc.data()).json
    res.status(200).json({
        data: userDoc.data()
    })
    }).catch((error)=>{
        res.status(404).json({
        error: error
        })
    })
};


const updateUser = async(req, res)=>{
    const uid = req.body.uid;
    const newData = req.body.data;
    admin.firestore().collection('users').doc(uid).update(newData).then(()=>{
    res.status(200).json({
        message: "User updated succesfully!"
    })
    }).catch((error)=>{
    res.status(404).json({
        error: error
    })
    })
    
}

const deleteUser = async(req, res)=>{
    const uid = req.body.uid;
    await admin.firestore().collection('users').doc(uid).delete().then(()=>{
    res.status(200).json({
        message: "User deleted successfully!"
    })
    }).catch((error)=>{
    res.status(404).json({
        error: error
    })
    })
}

const friendReq = async(req,res)=>{
    try {
        const { requester, friend } = req.body;
    
        // Check if both requester and friend documents exist
        const [requesterDoc, friendDoc] = await Promise.all([
          firestore.collection('users').doc(requester).get(),
          firestore.collection('users').doc(friend).get()
        ]);
    
        if (!requesterDoc.exists || !friendDoc.exists) {
          throw new Error('One or more users do not exist');
        }
    
        // Check if they are already friends
        if (requesterDoc.data().friends.includes(friend) || friendDoc.data().friends.includes(requester)) {
          throw new Error('Users are already friends');
        }
    
        // Check if friend request is already pending
        if (requesterDoc.data().pendingOutgoing.includes(friend) || friendDoc.data().pendingIncoming.includes(requester)) {
          throw new Error('Friend request is already pending');
        }
    
        // Add requester uid to friend's pending incoming
        // and add friend uid to requester's pending outgoing
        await Promise.all([
          friendDoc.ref.update({
            pendingIncoming: admin.firestore.FieldValue.arrayUnion(requester)
          }),
          requesterDoc.ref.update({
            pendingOutgoing: admin.firestore.FieldValue.arrayUnion(friend)
          })
        ]);
    
        res.status(200).send('Friend request sent');
      } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(400).send(error.message);
      }
}

const acceptFriend= async(req,res)=>{
    try {
        const { requester, friend } = req.body;
    
        // Check if both requester and friend documents exist
        const [requesterDoc, friendDoc] = await Promise.all([
          firestore.collection('users').doc(requester).get(),
          firestore.collection('users').doc(friend).get()
        ]);
    
        if (!requesterDoc.exists || !friendDoc.exists) {
          throw new Error('One or more users do not exist');
        }
    
        // Check if they are already friends
        if (requesterDoc.data().friends.includes(friend) || friendDoc.data().friends.includes(requester)) {
          throw new Error('Users are already friends');
        }
    
        // Check if friend request is pending
        if (!friendDoc.data().pendingIncoming.includes(requester) || !requesterDoc.data().pendingOutgoing.includes(friend)) {
          throw new Error('Friend request not found');
        }
    
        // Remove both from pending and add each other's uid's to each other's friend array
        await Promise.all([
          friendDoc.ref.update({
            friends: admin.firestore.FieldValue.arrayUnion(requester),
            pendingIncoming: admin.firestore.FieldValue.arrayRemove(requester)
          }),
          requesterDoc.ref.update({
            friends: admin.firestore.FieldValue.arrayUnion(friend),
            pendingOutgoing: admin.firestore.FieldValue.arrayRemove(friend)
          })
        ]);
    
        res.status(200).send('Friend request accepted');
      } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(400).send(error.message);
      }
}

const loginUser = async(req, res)=>{
//  auth=getAuth()
//  await signInWithEmailAndPassword(auth, req.body.email, req.body.password).then(()=>{
//   res.status(200)}
//  )
}

module.exports={
    createUser,
    readUser,
    updateUser,
    deleteUser,
    loginUser,
}