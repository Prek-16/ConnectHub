const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
    createPost,
    getAllPosts,
    getPostById,
    deletePost
} = require("../controllers/postController");

// Create Post
router.post("/create", upload.single("image"), createPost);

// Get All Posts
router.get("/", getAllPosts);

// Get Single Post
router.get("/:id", getPostById);

// Delete Post
router.delete("/:id", deletePost);

module.exports = router;