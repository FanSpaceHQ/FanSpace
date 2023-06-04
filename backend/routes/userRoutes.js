const express = require("express");
const multer = require("multer");
const upload = multer();
const {
    createUser,
    readUser,
    updateUser,
    deleteUser,
    loginUser,
    objectTest,
    uploadImage,
    loadFriends,
    searchUser,
    checkUser
} = require("../controllers/userController");

const router = express.Router();

router.get("/login", loginUser);
router.post("/", upload.single("File"), createUser);
router.get("/:uid", readUser);
router.patch("/", upload.single("File"), updateUser);
router.delete("/", deleteUser);
router.post("/uploadImage", upload.single("File"), uploadImage);
router.get("/friends/:uid", loadFriends);
router.get("/username/:username", checkUser)
router.get("/search/friends/:uid/:username", searchUser)

module.exports = router;
