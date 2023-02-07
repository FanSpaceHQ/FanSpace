const admin = require('firebase-admin')
const database=require('../index.js')
const {FieldValue}=require('@google-cloud/firestore')

const createUser = async(req, res)=>{
    console.log("creating user")
    res.status(200).json({
        success:"yes"
    })
}

const readUser = async(req, res)=>{

}

const updateUser = async(req, res)=>{

}

const deleteUser = async(req, res)=>{

}

module.exports={
    createUser,
    readUser,
    updateUser,
    deleteUser
}