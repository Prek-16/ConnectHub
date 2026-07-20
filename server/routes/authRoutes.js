const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
    registerUser,
    loginUser,
    updateProfile
} = require("../controllers/authController");

// Register
router.post(
    "/register",
    upload.single("profile_image"),
    registerUser
);

// Login
router.post("/login", loginUser);

// Update Profile
router.put(
    "/update/:id",
    upload.single("profile_image"),
    updateProfile
);

module.exports = router;