const db = require("../config/db");

// ===============================
// Follow User
// ===============================
const followUser = (req, res) => {

    const { follower_id, following_id } = req.body;

    if (!follower_id || !following_id) {
        return res.status(400).json({
            success: false,
            message: "Both IDs are required"
        });
    }

    if (follower_id == following_id) {
        return res.status(400).json({
            success: false,
            message: "You cannot follow yourself"
        });
    }

    const checkQuery = `
        SELECT *
        FROM followers
        WHERE follower_id = ?
        AND following_id = ?
    `;

    db.query(
        checkQuery,
        [follower_id, following_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Already Following"
                });
            }

            const insertQuery = `
                INSERT INTO followers
                (follower_id, following_id)
                VALUES (?, ?)
            `;

            db.query(
                insertQuery,
                [follower_id, following_id],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Followed Successfully"
                    });

                }
            );

        }
    );

};

// ===============================
// Unfollow User
// ===============================
const unfollowUser = (req, res) => {

    const { follower_id, following_id } = req.body;

    const sql = `
        DELETE FROM followers
        WHERE follower_id = ?
        AND following_id = ?
    `;

    db.query(
        sql,
        [follower_id, following_id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            return res.status(200).json({
                success: true,
                message: "Unfollowed Successfully"
            });

        }
    );

};

// ===============================
// Followers Count
// ===============================
const getFollowersCount = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT COUNT(*) AS totalFollowers
        FROM followers
        WHERE following_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        return res.status(200).json({
            success: true,
            totalFollowers: result[0].totalFollowers
        });

    });

};

// ===============================
// Following Count
// ===============================
const getFollowingCount = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT COUNT(*) AS totalFollowing
        FROM followers
        WHERE follower_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        return res.status(200).json({
            success: true,
            totalFollowing: result[0].totalFollowing
        });

    });

};

module.exports = {

    followUser,
    unfollowUser,
    getFollowersCount,
    getFollowingCount

};