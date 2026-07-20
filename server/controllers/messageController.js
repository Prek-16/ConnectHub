const db = require("../config/db");

// ===============================
// Send Message
// ===============================
const sendMessage = (req, res) => {

    const { sender_id, receiver_id, message } = req.body;

    if (!sender_id || !receiver_id || !message) {

        return res.status(400).json({

            success: false,
            message: "All fields are required"

        });

    }

    const sql = `
        INSERT INTO messages
        (sender_id, receiver_id, message, is_read)
        VALUES (?, ?, ?, 0)
    `;

    db.query(
    sql,
    [sender_id, receiver_id, message],
    (err, result) => {

        if(err){

            return res.status(500).json({
                success:false,
                message:err.message
            });

        }

        return res.status(201).json({
            success:true,
            message:"Message Sent Successfully"
        });

    }
);

};

// ===============================
// Get Conversation
// ===============================
const getMessages = (req, res) => {

    const { sender_id, receiver_id } = req.query;

    const sql = `
        SELECT
            messages.*,
            users.full_name,
            users.profile_image
        FROM messages

        INNER JOIN users
        ON users.id = messages.sender_id

        WHERE

        (sender_id=? AND receiver_id=?)

        OR

        (sender_id=? AND receiver_id=?)

        ORDER BY created_at ASC
    `;

    db.query(

        sql,

        [
            sender_id,
            receiver_id,
            receiver_id,
            sender_id
        ],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    success: false,
                    message: err.message

                });

            }

            db.query(

                `
                UPDATE messages
                SET is_read = 1
                WHERE sender_id = ?
                AND receiver_id = ?
                `,

                [receiver_id, sender_id]

            );

            return res.status(200).json({

                success: true,
                messages: result

            });

        }

    );

};
// ===============================
// Get Unread Message Count
// ===============================
const getUnreadCount = (req, res) => {

    const { user_id } = req.params;

    const sql = `
        SELECT COUNT(*) AS total
        FROM messages
        WHERE receiver_id = ?
        AND is_read = 0
    `;

    db.query(sql, [user_id], (err, result) => {

        if(err){

            return res.status(500).json({

                success:false,
                message:err.message

            });

        }

        return res.status(200).json({

            success:true,
            total:result[0].total

        });

    });

};

module.exports = {

    sendMessage,
    getMessages,
    getUnreadCount

};