const express = require("express");

const router = express.Router();

const {

    followUser,
    unfollowUser,
    getFollowersCount,
    getFollowingCount

} = require("../controllers/followController");

router.post("/follow", followUser);

router.delete("/unfollow", unfollowUser);

router.get("/followers/:id", getFollowersCount);

router.get("/following/:id", getFollowingCount);

module.exports = router;