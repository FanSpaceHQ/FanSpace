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
} = require("../controllers/userController");

const router = express.Router();

router.get("/login", loginUser);
router.post("/", upload.single("File"), createUser);
router.get("/:uid", readUser);
router.patch("/", upload.single("File"), updateUser);
router.delete("/", deleteUser);
router.post("/uploadImage", upload.single("File"), uploadImage);

module.exports = router;
