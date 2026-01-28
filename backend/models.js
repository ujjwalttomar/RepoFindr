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

userSchema.prehook('save', (password) => {
    if(!isModified(this.password))return;
    let salt = 10;
    bcrypt.hash(password, 10);
    // check whether this is right or not . i just coded it randomly
})

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

export const User = mongoose.model("User", userSchema);
export const SavedRepo = mongoose.model("SavedRepo", savedRepoSchema);
