const express = require("express");
const router = express.Router();

const { toggleLike } = require("../controllers/likeController");

router.post("/toggle", toggleLike);

module.exports = router;