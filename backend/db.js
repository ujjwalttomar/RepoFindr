import mongoose from "mongoose";

const connectToDB = async(req, res)=> {
    try{
        await mongoose.connect(process.env.MONGO_DB);
        console.log("successfully connected to database at" `${process.env.PORT}`);
    }catch(error){
        console.log("some error occured while connecting to mongo DB", error);
    }
} 

export default connectToDB;