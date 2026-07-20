const db = require("../config/db");

// ==========================
// Add Comment
// ==========================
const addComment = (req, res) => {

    const { post_id, user_id, comment } = req.body;

    if (!post_id || !user_id || !comment) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO comments(post_id,user_id,comment)
        VALUES(?,?,?)
    `;

    db.query(sql, [post_id, user_id, comment], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        return res.json({
            success: true,
            message: "Comment Added Successfully"
        });

    });

};

// ==========================
// Get Comments
// ==========================

const getComments = (req, res) => {

    const { postId } = req.params;

    const sql = `
    SELECT
        comments.id,
        comments.comment,
        comments.created_at,
        users.full_name,
        users.username
    FROM comments
    INNER JOIN users
    ON comments.user_id = users.id
    WHERE comments.post_id=?
    ORDER BY comments.created_at DESC
    `;

    db.query(sql, [postId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        return res.json({
            success: true,
            comments: result
        });

    });

};

module.exports = {
    addComment,
    getComments
};