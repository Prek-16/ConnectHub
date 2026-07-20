const db = require("../config/db");

// ===============================
// Search Users
// ===============================
const searchUsers = (req, res) => {

    const keyword = req.query.keyword;

    if (!keyword) {
        return res.status(200).json({
            success: true,
            users: []
        });
    }

    const sql = `
        SELECT
            id,
            full_name,
            username,
            profile_image
        FROM users
        WHERE
            full_name LIKE ?
            OR username LIKE ?
        ORDER BY full_name ASC
    `;

    const search = `%${keyword}%`;

    db.query(sql, [search, search], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        return res.status(200).json({
            success: true,
            users: result
        });

    });

};

// ===============================
// Get User Profile
// ===============================
const getUserProfile = (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            id,
            full_name,
            username,
            email,
            bio,
            profile_image
        FROM users
        WHERE id=?
    `;

    db.query(sql,[id],(err,result)=>{

        if(err){

            return res.status(500).json({

                success:false,
                message:err.message

            });

        }

        if(result.length===0){

            return res.status(404).json({

                success:false,
                message:"User not found"

            });

        }

        return res.status(200).json({

            success:true,
            user:result[0]

        });

    });

};

// ===============================
// Explore Users
// ===============================
const getExploreUsers = (req, res) => {

    const currentUser = req.query.user_id;

    const sql = `

        SELECT

            users.id,
            users.full_name,
            users.username,
            users.profile_image,

            COUNT(messages.id) AS unread

        FROM users

        LEFT JOIN messages

        ON messages.sender_id = users.id

        AND messages.receiver_id = ?

        AND messages.is_read = 0

        WHERE users.id != ?

        GROUP BY users.id

        ORDER BY users.full_name ASC

    `;

    db.query(

        sql,

        [currentUser, currentUser],

        (err, result) => {

            if(err){

                return res.status(500).json({

                    success:false,
                    message:err.message

                });

            }

            return res.status(200).json({

                success:true,
                users:result

            });

        }

    );

};

// ===============================
// Get All Users
// ===============================
const getAllUsers = (req, res) => {

    const sql = `
        SELECT
            id,
            full_name,
            username,
            profile_image
        FROM users
        ORDER BY full_name ASC
    `;

    db.query(sql, (err, result) => {

        if(err){

            return res.status(500).json({
                success:false,
                message:err.message
            });

        }

        return res.status(200).json({
            success:true,
            users:result
        });

    });

};

// ===============================
// Trending Users
// ===============================
// ===============================
// Trending Users
// ===============================
const getTrendingUsers = (req, res) => {

    const sql = `

        SELECT

            users.id,
            users.full_name,
            users.username,
            users.profile_image,

            COUNT(DISTINCT followers.follower_id) AS followers,

            COUNT(DISTINCT posts.id) AS posts

        FROM users

        LEFT JOIN followers

        ON users.id = followers.following_id

        LEFT JOIN posts

        ON users.id = posts.user_id

        GROUP BY users.id

        ORDER BY followers DESC, posts DESC

        LIMIT 10

    `;

    db.query(sql, (err, result) => {

        if(err){

            return res.status(500).json({

                success:false,
                message:err.message

            });

        }

        return res.status(200).json({

            success:true,
            users:result

        });

    });

};

module.exports = {

    searchUsers,
    getUserProfile,
    getExploreUsers,
    getTrendingUsers,
    getAllUsers

};