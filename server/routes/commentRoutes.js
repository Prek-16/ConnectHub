const express = require("express");
const router = express.Router();

const {
    addComment,
    getComments
} = require("../controllers/commentController");

router.post("/add", addComment);

router.get("/:postId", getComments);

module.exports = router;