import mongoose from "mongoose";

// Function to Connect to the MOngoDb database

export const connectDB = async()=>{

    try{
        mongoose.connection.on('connected',()=> console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/Chat_Application`)
    }
    catch(error){
        console.log(error)
    }
}