const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
    uploadStory,
    getStories
} = require("../controllers/storyController");

// Upload Story
router.post(
    "/upload",
    upload.single("image"),
    uploadStory
);

// Get All Stories
router.get(
    "/",
    getStories
);

module.exports = router;