const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ===========================
// Register User
// ===========================

const registerUser = async (req, res) => {

    try{

        const {
            full_name,
            username,
            email,
            password
        } = req.body;

        const profile_image =
            req.file ? req.file.filename : null;

        if(
            !full_name ||
            !username ||
            !email ||
            !password
        ){

            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

        }

        const checkUser =
        "SELECT * FROM users WHERE email=? OR username=?";

        db.query(
            checkUser,
            [email,username],
            async(err,result)=>{

                if(err){

                    return res.status(500).json({
                        success:false,
                        message:err.message
                    });

                }

                if(result.length>0){

                    return res.status(400).json({
                        success:false,
                        message:"User already exists"
                    });

                }

                const hashedPassword =
                await bcrypt.hash(password,10);

                const sql=`
                INSERT INTO users
                (
                    full_name,
                    username,
                    email,
                    password,
                    profile_image
                )
                VALUES(?,?,?,?,?)
                `;

                db.query(

                    sql,

                    [
                        full_name,
                        username,
                        email,
                        hashedPassword,
                        profile_image
                    ],

                    (err)=>{

                        if(err){

                            return res.status(500).json({
                                success:false,
                                message:err.message
                            });

                        }

                        return res.status(201).json({

                            success:true,
                            message:"User Registered Successfully"

                        });

                    }

                );

            }

        );

    }

    catch(error){

        return res.status(500).json({

            success:false,
            message:error.message

        });

    }

};

// ===========================
// Login User
// ===========================

const loginUser=(req,res)=>{

    const {email,password}=req.body;

    if(!email || !password){

        return res.status(400).json({

            success:false,
            message:"Email and Password are required"

        });

    }

    db.query(

        "SELECT * FROM users WHERE email=?",

        [email],

        async(err,result)=>{

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

            const user=result[0];

            const match=
            await bcrypt.compare(
                password,
                user.password
            );

            if(!match){

                return res.status(401).json({

                    success:false,
                    message:"Invalid Password"

                });

            }

            const token=jwt.sign(

                {

                    id:user.id,
                    email:user.email

                },

                process.env.JWT_SECRET,

                {

                    expiresIn:"7d"

                }

            );

            return res.status(200).json({

                success:true,
                message:"Login Successful",

                token,

                user:{

                    id:user.id,
                    full_name:user.full_name,
                    username:user.username,
                    email:user.email,
                    bio:user.bio,
                    profile_image:user.profile_image

                }

            });

        }

    );

};

// ===========================
// Update Profile
// ===========================

const updateProfile=(req,res)=>{

    const {id}=req.params;

    const {

        full_name,
        bio

    }=req.body;

    const profile_image=
    req.file ? req.file.filename : null;

    let sql;
    let values;

    if(profile_image){

        sql=`
        UPDATE users
        SET
        full_name=?,
        bio=?,
        profile_image=?
        WHERE id=?
        `;

        values=[
            full_name,
            bio,
            profile_image,
            id
        ];

    }

    else{

        sql=`
        UPDATE users
        SET
        full_name=?,
        bio=?
        WHERE id=?
        `;

        values=[
            full_name,
            bio,
            id
        ];

    }

    db.query(

        sql,

        values,

        (err)=>{

            if(err){

                return res.status(500).json({

                    success:false,
                    message:err.message

                });

            }

            db.query(

                "SELECT * FROM users WHERE id=?",

                [id],

                (err,result)=>{

                    if(err){

                        return res.status(500).json({

                            success:false,
                            message:err.message

                        });

                    }

                    return res.status(200).json({

                        success:true,

                        message:"Profile Updated Successfully",

                        user:{

                            id:result[0].id,
                            full_name:result[0].full_name,
                            username:result[0].username,
                            email:result[0].email,
                            bio:result[0].bio,
                            profile_image:result[0].profile_image

                        }

                    });

                }

            );

        }

    );

};

module.exports={

    registerUser,
    loginUser,
    updateProfile

};