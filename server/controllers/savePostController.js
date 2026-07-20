const db = require("../config/db");

// ===============================
// Save / Unsave Post
// ===============================
const toggleSavePost = (req, res) => {

    const { user_id, post_id } = req.body;

    if (!user_id || !post_id) {

        return res.status(400).json({
            success: false,
            message: "User ID and Post ID are required"
        });

    }

    const checkQuery = `
        SELECT *
        FROM saved_posts
        WHERE user_id = ?
        AND post_id = ?
    `;

    db.query(checkQuery, [user_id, post_id], (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        // Already Saved → Unsave
        if (result.length > 0) {

            const deleteQuery = `
                DELETE FROM saved_posts
                WHERE user_id = ?
                AND post_id = ?
            `;

            db.query(deleteQuery, [user_id, post_id], (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                return res.json({
                    success: true,
                    saved: false,
                    message: "Post Removed From Saved"
                });

            });

        }

        // Save Post
        else {

            const insertQuery = `
                INSERT INTO saved_posts(user_id, post_id)
                VALUES(?, ?)
            `;

            db.query(insertQuery, [user_id, post_id], (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                return res.json({
                    success: true,
                    saved: true,
                    message: "Post Saved Successfully"
                });

            });

        }

    });

};

// ===============================
// Get Saved Posts
// ===============================
const getSavedPosts = (req, res) => {

    const { user_id } = req.params;

    const sql = `

        SELECT

        posts.*,
        users.full_name,
        users.username,
        users.profile_image

        FROM saved_posts

        INNER JOIN posts
        ON saved_posts.post_id = posts.id

        INNER JOIN users
        ON posts.user_id = users.id

        WHERE saved_posts.user_id = ?

        ORDER BY saved_posts.created_at DESC

    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        return res.json({
            success: true,
            posts: result
        });

    });

};

module.exports = {

    toggleSavePost,
    getSavedPosts

};