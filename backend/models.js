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

userSchema.prehook('save', async function(next){
    if(!this.isModified())return next();
    
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        this.password = hashedPassword ;
        next();
    }catch(error){
        next(error);
    }
    // check whether this is right or not . i just coded it randomly
});

const savedRepoSchema = new mongoose.Schema({

    repoId : {
        type : String,
        required : true
    },
    githubLink : {
        type : String,
        required : true
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
    // repo owner details 

    // repo organisation detaila;

    // repo topic details

    // repo languages , etc , how to fetch details of repo like its tech stack , stars and forks counts, full name of repo details.
},{timestamps : true});

export const User = mongoose.model("User", userSchema);
export const SavedRepo = mongoose.model("SavedRepo", savedRepoSchema);
