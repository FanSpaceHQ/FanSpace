const express=require('express')

const {createUser, readUser, updateUser, deleteUser, loginUser
}= require('../controllers/userController')

const router = express.Router()

router.get('/login', loginUser)
router.post('/',createUser)

module.exports=router
