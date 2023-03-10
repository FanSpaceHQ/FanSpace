const express=require('express')
const multer = require('multer');
const upload = multer();
const {createUser, readUser, updateUser, deleteUser, loginUser, objectTest
}= require('../controllers/userController')

const router = express.Router()

router.get('/login', loginUser)
router.post('/',createUser)
router.get('/',readUser)
router.patch('/',upload.single("File"), updateUser)
router.delete('/', deleteUser)

module.exports=router
