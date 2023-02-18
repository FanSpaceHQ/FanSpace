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
    "friends":[]
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

module.exports={
    createUser,
    readUser,
    updateUser,
    deleteUser,
    loginUser,
}