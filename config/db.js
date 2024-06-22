import mongoose from "mongoose"
import colors from "colors"
const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_USR);
        console.log(`Connected to Mongodb Database ${conn.connection.host}`.bgGreen.black);
    } catch(error){
        console.log(`Error in Mongodb ${error}`.bgRed.black);
    }
};

export default connectDB;