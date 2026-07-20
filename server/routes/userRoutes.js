const express = require("express");

const router = express.Router();

const {

    searchUsers,
    getUserProfile,
    getExploreUsers,
    getTrendingUsers,
    getAllUsers

} = require("../controllers/userController");

// ===============================
// Explore Users
// ===============================
router.get("/explore", getExploreUsers);

// ===============================
// Trending Users
// ===============================
router.get("/trending", getTrendingUsers);

// ===============================
// Search Users
// ===============================
router.get("/search", searchUsers);

// Get All Users
router.get("/", getAllUsers);

// ===============================
// Get Single User
// ===============================
router.get("/:id", getUserProfile);

module.exports = router;