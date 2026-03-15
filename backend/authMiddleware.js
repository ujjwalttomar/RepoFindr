//                                      backend/authMiddleware.js

import jwt from "jsonwebtoken";
import {SavedRepo} from "./models.js";

export const authenticate = async (req, res, next) => {
    try{

        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({message : "no token provided"});
        }

        // take the user's token form url ,
        const token = authHeader.split(' ')[1];
        // then decode the token and verify it , is it active
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // is it contains the same userId , of the user whose account it is trying to access.
        next();
        // if not return error of unauthorized access with suitable error code
        // if yes , give it entry and pass the control to the next function/controller
    }catch(error){
        return res.status(401).json({message : "invalid token"});
        }
};

export const isOwner = async (req, res, next) => {

    try{
    const userId = req.user.userId;
    const repoId = req.params.repoId;

    const repo = await SavedRepo.findById(repoId);

    if(!repo){
        return res.status(404).json({
            message : "repo not found, invalid request",
            error
        })
    }

    const ownerId = repo.savedBy;

    if(userId.toString() != ownerId.toString()){
        return res.status(401).json({
            message : "unauthorized request",
            error
        })
    }

    next();
    }
    catch(error){
        return res.status(500).json({
            message : "server side error",
            error 
        })
    }
    // check whether the user requestingthe resource is the same as one owner of the resource.
    
}

