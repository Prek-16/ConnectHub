const express = require("express");

const router = express.Router();

const {

    toggleSavePost,
    getSavedPosts

} = require("../controllers/savePostController");

// Save / Unsave
router.post(
    "/toggle",
    toggleSavePost
);

// Get Saved Posts
router.get(
    "/:user_id",
    getSavedPosts
);

module.exports = router;