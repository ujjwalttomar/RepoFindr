//                                                           backend/index.js


import express from "express";
import {registerUser, loginUser, changePassword, logoutUser, editProfile, getMe} from "./authController.js";
import {searchRepos, fetchTrendingRepos, saveRepo, fetchAllSavedRepos, unsaveRepo} from "./repoController.js";
import {authenticate, isOwner} from "./authMiddleware.js";
import connectToDB from "./db.js";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();


const app = express();
app.use(express.json());


app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}))


//  auth routes

app.get("/user/me",authenticate, getMe);
app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/user/:userId/change-password", authenticate, changePassword);
app.post("/user/:userId/logout", authenticate, logoutUser);
app.put("/user/:userId/edit-profile", authenticate, editProfile);


// repo routes

app.get("/search-repo", searchRepos);
app.get("/fetch-trending-repos", fetchTrendingRepos);
app.post("/repo/save", authenticate, saveRepo); /// i have to check whether the routes are correct or not.
app.get("/savedRepos", authenticate, fetchAllSavedRepos);
app.delete("/savedRepos/:repoId", authenticate, unsaveRepo);

const PORT = process.env.PORT || 3000;

connectToDB()
   
    .then(()=>{
        console.log("Database connected");
         // app .listen code  is still remaining
        app.listen(PORT,() => {
            console.log(`server is running at http://localhost:${PORT}`)
        });
        }       
    )
    .catch(error => {
        console.error("Database connection failed:", error);
});








