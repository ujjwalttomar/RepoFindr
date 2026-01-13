import express from "express";
import mongoose from "mongoose";
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

        const user = await User.find({email}); // left ------- check both  email, username in db.
        if(user){
            return res.status(400).json({
                message : "user already exists"
        });

        // left ------ hash the password before storing ,either in db or here. 
        await User.create({
            username : username,
            email : email,
            password : password
        })
        // return the response tthe user back of successful creation of user object.
        }
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

        if((!email || !username) && !password){
            return res.status(400).json({
                message : "necessary credentials are required."
            });
        }
        const user = await User.find({email}); // left ------- check both  email, username in db.

        if(!user){
            return res.status(400).json({
                message : "invalid credentials."
        });
        // left ------ user had been found , now create a token using its details (email, username)
        return res.status(200).json({message : "just for fun"});}

    }catch(error){
        res.status(500).json({
            message : "some error occured at server side",
            error
        });
    }
};

export const logoutUser = async (req, res) => {
    
    
    try{

        const {userId} = req.params;
        // left ------ is the user requesting the operations is the same user , whose account is this . -------- either in middlewares
        const user = User.findById(userId);
        if(!user){
            return res.status(404).json({
                message : "umessage : "just for fun"ser does not exists , invalid operation."
            });
        }

        // left ----- now check his token , delete it , and end his session , also may or may not delete its cookies .

    }catch(error){
        res.status(500).json({
            message : "some error occured at server side",
            error
        });
    }
};

export const editProfile = async (req, res) => {

    try{

        const {email} = req.body;
        const {userId} = req.params;

        const user = User.findById(userId);


        // left ----- is the user requesting the operations is the same user , whose account is this . -------- either in middlewares
        if(!user){
            return res.status(404).json({
                message : "user does not exists , invalid operation."
            });
        }
        user.email = email || user.email;

        await User.save();

        //left ----- return user's updated profile
        return res.status(201).json({
            message : "profile udpate successfully .",
            user:{
                email : email,
                username : username
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

        // left ------ is the user requesting the operations is the same user , whose account is this . -------- either in middlewares

        const {newPassword} = req.body;
        const {userId} = req.params;

        //left ---- check is the password is same as the one saved in memory
        //left ---- then save the new pass in db after hasing and return the success response to user.
    }catch(error){
        res.status(500).json({
            message : "some error occured at server side",
            error
        });
    }
};