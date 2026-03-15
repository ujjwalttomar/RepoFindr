//                                           backend/authController.js


import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {User} from "./models.js";



export const registerUser = async (req, res) => {

    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(401).json({
                message : "enter required fields."
            });
        }

        const user = await User.findOne({
            $or : [{email:email}, {username:username}]
        }); // left ------- check both  email, username in db.
        if(user){
            return res.status(400).json({
                message : "user already exists"
        });}

        // left ------ hash the password before storing ,either in db or here. 
        await User.create({
            username : username,
            email : email,
            password : password
        })
        // return the response t0 the user back of successful creation of user object.
        return res.status(200).json({ message : "user created successfully !"});
        // should i create a token and return it to user also , or not . --- it is not good practice to give token before email verification.
        
    }catch(error){
        res.status(500).json({
            message : "some error occured at server side",
            error
        });
    }
};

export const loginUser = async (req, res) => {

    try{
        const {email, username, password} = req.body;

        if(!email && !username){
            return res.status(400).json({ message: "email or username required" });
        }
        if(!password){
            return res.status(400).json({ message: "password required" });
        }
        const user = await User.findOne({
            $or : [{email : email}, {username : username}]  // left ------- check both  email, username in db.
        });
          

        if(!user){
            return res.status(400).json({
                message : "invalid credentials."
        });}
        const isMatched =await bcrypt.compare(password, user.password);

        if(!isMatched)return res.status(401).json({
            message : "u are not authorized for login"
        });
        // left ------ user had been found , now create a token using its details (email, username)
        const token =  jwt.sign(
            {userId : user._id},
            process.env.JWT_SECRET,
            {expiresIn : '7d'}
        );
        return res.status(200).json({message : "user logged in successfully!", token});

    }catch(error){
        res.status(500).json({
            message : "some error occured at server side",
            error
        });
    }
};

export const logoutUser = async (req, res) => {
    try{
        return res.status(200).json({
            message: "logged out successfully"
        });
    }catch(error){
        res.status(500).json({
            message: "some error occured at server side",
            error
        });
    }
};

export const editProfile = async (req, res) => {

    try{

        const {email} = req.body;
        const {userId} = req.params;

        const user =await  User.findById(userId);


        // left ----- is the user requesting the operations is the same user , whose account is this . -------- either in middlewares
        if(!user){
            return res.status(404).json({
                message : "user does not exists , invalid operation."
            });
        }
        user.email = email || user.email;

        await user.save();

        //left ----- return user's updated profile
        return res.status(201).json({
            message : "profile updated successfully .",
            user:{
                email : email
            }
        });


    }catch(error){
        res.status(500).json({
            message : "some error occured at server side",
            error
        });
    }
};

export const changePassword = async (req, res) => {

    try{
        const {newPassword} = req.body;
        const userId = req.user._id;

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordSame = await bcrypt.compare(newPassword, user.password);
       
        if(isPasswordSame){
            return res.status(400).json({message : "new password should be different from previous passwords."});
        }
        user.password = newPassword ;
        await user.save();
        return res.status(200).json({message : "password updated"});
    }catch(error){
        res.status(500).json({
            message : "some error occured at server side",
            error
        });
    }
};