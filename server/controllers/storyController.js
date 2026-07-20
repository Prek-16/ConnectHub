const db = require("../config/db");

// ===============================
// Upload Story
// ===============================
const uploadStory = (req, res) => {

    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({
            success: false,
            message: "User ID Required"
        });
    }

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Story Image Required"
        });
    }

    const image = req.file.filename;

    const sql = `
        INSERT INTO stories(user_id,image)
        VALUES(?,?)
    `;

    db.query(sql,[user_id,image],(err)=>{

        if(err){
            return res.status(500).json({
                success:false,
                message:err.message
            });
        }

        return res.json({
            success:true,
            message:"Story Uploaded Successfully"
        });

    });

};

// ===============================
// Get All Stories
// ===============================
const getStories = (req,res)=>{

    const sql=`
    SELECT
        stories.id,
        stories.image,
        stories.created_at,
        users.full_name,
        users.username,
        users.profile_image

    FROM stories

    INNER JOIN users
    ON stories.user_id=users.id

    ORDER BY stories.created_at DESC
    `;

    db.query(sql,(err,result)=>{

        if(err){
            return res.status(500).json({
                success:false,
                message:err.message
            });
        }

        res.json({
            success:true,
            stories:result
        });

    });

};

module.exports={
    uploadStory,
    getStories
};