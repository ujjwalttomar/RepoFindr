//                                                           backend/index.js


import express from "express";
import {registerUser, loginUser, changePassword, logoutUser, editProfile} from "./authController.js";
import {searchRepos, fetchTrendingRepos, saveRepo, fetchAllSavedRepos, unsaveRepo} from "./repoController.js";
import {authenticate, isOwner} from "./authMiddleware.js";
import connectToDB from "./db.js";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();


const app = express();
app.use(express.json());


app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))


//  auth routes

app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/user/:userId/change-password", authenticate, changePassword);
app.post("/user/:userId/logout", authenticate, logoutUser);
app.put("/user/:userId/edit-profile", authenticate, editProfile);


// repo routes

app.get("/search-repo", authenticate, searchRepos);
app.get("/fetch-trending-repos", fetchTrendingRepos);
app.post("/repo/:repoId/save", authenticate, saveRepo); /// i have to check whether the routes are correct or not.
app.get("/savedRepos", authenticate, isOwner, fetchAllSavedRepos);
app.delete("/savedRepos/:repoId", authenticate, isOwner, unsaveRepo);

const PORT = process.env.PORT || 3000;

connectToDB()
   
    .then(()=>{
        console.log("Database connected");
         // app .listen code  is still remaining
        app.listen(PORT,() => {
            console.log(`server is running at https://localhost:${PORT}`)
        });
        }       
    )
    .catch(error => {
        console.error("Database connection failed:", error);
});








