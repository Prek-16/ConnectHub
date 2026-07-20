const db = require("../config/db");

// ===============================
// Create New Post
// ===============================
const createPost = (req, res) => {
    try {
        const { user_id, caption } = req.body;

        if (!user_id || !caption) {
            return res.status(400).json({
                success: false,
                message: "User ID and Caption are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Post image is required"
            });
        }

        const image = req.file.filename;

        const sql = `
            INSERT INTO posts (user_id, image, caption)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [user_id, image, caption], (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            return res.status(201).json({
                success: true,
                message: "Post Created Successfully",
                postId: result.insertId
            });

        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===============================
// Get All Posts
// ===============================
const getAllPosts = (req, res) => {

    const currentUser = req.query.user_id || 0;

    const sql = `
        SELECT
        posts.id,
        posts.user_id,
        posts.caption,
        posts.image,
        posts.created_at,

        users.full_name,
        users.username,
        users.profile_image,

        COUNT(DISTINCT likes.id) AS like_count,
        COUNT(DISTINCT comments.id) AS comment_count,

        IF(f.following_id IS NULL,0,1) AS is_following

        FROM posts

        INNER JOIN users
        ON posts.user_id = users.id

        LEFT JOIN likes
        ON posts.id = likes.post_id

        LEFT JOIN comments
        ON posts.id = comments.post_id

        LEFT JOIN followers f
        ON f.following_id = users.id
        AND f.follower_id = ?

        GROUP BY posts.id

        ORDER BY posts.created_at DESC
    `;

    db.query(sql, [currentUser], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        return res.status(200).json({
            success: true,
            totalPosts: result.length,
            posts: result
        });

    });

};

// ===============================
// Get Single Post
// ===============================
const getPostById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM posts
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            success: true,
            post: result[0]
        });

    });

};

// ===============================
// Delete Post
// ===============================
const deletePost = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM posts WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Post Deleted Successfully"
            });

        }
    );

};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    deletePost
};