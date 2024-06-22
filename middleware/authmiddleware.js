import JWT from "jsonwebtoken";
import usermodel from "../models/usermodel.js";
export const requiresign = async(req,res,next)=>{
    try{
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SEC
        );
        req.user = decode;
        next();
    }catch (error){
        console.log(error);
    }
};

export const isadmin = async(req,res,next)=>{
    try{
        const users = await usermodel.findById(req.user._id)
        if(users.role !== 1){
            return res.status(401).send({
                success:false,
                message:"Unauthorized User"
            })
        }
        else{
            next();
        }
    }
    catch(error){
        console.log(error);
        res.status(401).send({
            success:false,
            error,
            message:"Error in Admin Middleware"
        })
    }
}