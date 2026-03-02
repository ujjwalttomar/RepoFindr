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

userSchema.pre('save', async function(next){
    if(!this.isModified())return next();
    
    try{
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword ;
        next();
    }catch(error){
        next(error);
    }
    // check whether this is right or not . i just coded it randomly
});

const savedRepoSchema = new mongoose.Schema({

    repoUrl : {
        type : String,
        required : true
    },
    githubLink : {
        type : String,
        required : true
    },
    name : {
        type : String, 
        required : true
    },
    fullName : {
        type : String,
        required : true
    },
    Owner : {
        login : {
            type : String,
            required : true
        },
        id : {
            type : String,
            required : true
        },
        avatarUrl : {
            type : String,
            default : xyss.img //   i  have to provide a default img link as an avatar for the owners who doesnot have an avatar
        },
        profileUrl : {
            type : String,
            required : true
        }
    },
    
    savedBy : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    forksCount : {
        type : Number,
        required : true
    },
    stargazersCount : {
        type : Numner ,
        required : true
    }


    // repo owner details 

    // repo organisation detaila;

    // repo topic details

    // repo languages , etc , how to fetch details of repo like its tech stack , stars and forks counts, full name of repo details.
},{timestamps : true});

export const User = mongoose.model("User", userSchema);
export const SavedRepo = mongoose.model("SavedRepo", savedRepoSchema);
