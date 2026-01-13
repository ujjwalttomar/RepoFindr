import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true
    }

},{timestamps : true});

const savedRepoSchema = new mongoose.Schema({

    repoId : {
        type : string,
        required : true
    },
    // repo owner details 

    // repo organisation detaila

    // repo topic details

    // repo languages , etc , how to fetch details of repo like its tech stack , stars and forks counts, full name of repo details.
});

export User = mongoose.model("User", userSchema);
export SavedRepo = mongoose.model("SavedRepo", savedRepoSchema);
