const admin = require('firebase-admin')
const {adminAuth, database}=require('../index.js')
const {FieldValue}=require('@google-cloud/firestore')
const required_fields=require('./../constants/userConstants')
const { getAuth, signInWithEmailAndPassword }=require ("firebase/auth")
const axios=require('axios')
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
    "pending_outgoing":[],
    "pending_inncoming":[]
   }).then(()=>{
    res.status(200).json({
      uid: user.uid
    })
   }
   )
  }
}
}

const readUser = async(req, res)=>{
  await something.then(()=>{

  }).catch(()=>{
    
  })
}

const updateUser = async(req, res)=>{

}

const deleteUser = async(req, res)=>{

}

const loginUser = async(req, res)=>{
//  auth=getAuth()
//  await signInWithEmailAndPassword(auth, req.body.email, req.body.password).then(()=>{
//   res.status(200)}
//  )
}

const loadFriends =async(req,res)=>{
  const uid=req.body.uid
  database.collection('users').doc(uid).get().then(async (userDoc)=>{ //get userdoc
    if(!userDoc.exists){
      res.status(404).json({
        error: "user not found"
      })
    }
    else{
      const friendsRef=userDoc.data().friends.map((friendID)=>database.collection('users').doc(friendID))
      const friends=await database.getAll(...friendsRef) //query all friends
      let friendData=[]
      let missingFriends=[]
      friends.forEach((friend)=>friend.exists ?friendData.append(friend): missingFriends.append(friend)) //get all the friends that exist
      res.status(200).json({
        friends:friendData
      })
      if (missingFriends.length>0){ //delete all friends that dont
        database.collection('users').doc(uid).update({
          friends: FieldValue.arrayRemove(missingFriends)
        })
      }
    }
  })
}

module.exports={
    createUser,
    readUser,
    updateUser,
    deleteUser,
    loginUser,
    loadFriends
}

