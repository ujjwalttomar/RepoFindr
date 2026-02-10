import express from "express";
import {registerUser, loginUser, changePassword, logoutUser, editProfile} from "./authController.js";
import {searchRepos, fetchTrendingRepos, saveRepo, fetchAllSavedRepos, unsaveRepo} from "./repoController.js";
import {authenticate, isOwner} from "./authMiddleware.js";
import {connectToDB} from "./db.js";
import dotenv from "dotenv";





const app = express.app();
//  auth routes

app.post("/register/", registerUser);
app.get("/login/", loginUser);
app.get("/user/:userId/change-password/", isLoggedIn, changePassword);
app.get("/user/:userId/logout/", isLoggedIn, logoutUser);
app.get("/user/:userId/edit-profile/", isLoggedIn, editProfile);


// repo routes

app.get("/search-repo/", isLoggedIn, searchRepos);
app.get("/fetch-trending-repos/", fetchTrendingRepos);
app.get("/repo/save/", isLoggedIn, saveRepo); /// i have to check whether the routes are correct or not.
app.get("/savedRepos/", isLoggedIn, fetchAllSavedRepos);
app.get("/savedRepos/:repoId/", isLoggedIn, unsaveRepo);

connectToDb();
//  i forgot how to connect to db 

// app .listen code  is still remaining
app.listen(process.env.PORT,() => {
    console.log(`server is running at ${process.env.PORT}`)
});


