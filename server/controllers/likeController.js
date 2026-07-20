const db = require("../config/db");

// ===============================
// Toggle Like
// ===============================
const toggleLike = (req, res) => {

    const { user_id, post_id } = req.body;

    if (!user_id || !post_id) {
        return res.status(400).json({
            success: false,
            message: "User ID and Post ID are required"
        });
    }

    const checkSql = `
        SELECT * FROM likes
        WHERE user_id=? AND post_id=?
    `;

    db.query(checkSql, [user_id, post_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success:false,
                message:err.message
            });
        }

        if(result.length > 0){

            db.query(
                "DELETE FROM likes WHERE user_id=? AND post_id=?",
                [user_id, post_id],
                (err)=>{

                    if(err){
                        return res.status(500).json({
                            success:false,
                            message:err.message
                        });
                    }

                    return res.json({
                        success:true,
                        liked:false,
                        message:"Post Unliked"
                    });

                }
            );

        }

        else{

            db.query(
                "INSERT INTO likes(user_id,post_id) VALUES(?,?)",
                [user_id, post_id],
                (err)=>{

                    if(err){
                        return res.status(500).json({
                            success:false,
                            message:err.message
                        });
                    }

                    return res.json({
                        success:true,
                        liked:true,
                        message:"Post Liked"
                    });

                }
            );

        }

    });

};

module.exports = {
    toggleLike
};