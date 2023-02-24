const express=require('express')

const {createUser, readUser, updateUser, deleteUser, loginUser
}= require('../controllers/userController')

const router = express.Router()

router.get('/login', loginUser)
router.post('/',createUser)
router.get('/',readUser)
router.patch('/', updateUser)
router.delete('/', deleteUser)

module.exports=router
