import mongoose from "mongoose";

const orderschema = new mongoose.Schema(
    {
        products:[
            {
                type: mongoose.ObjectId,
                ref:"products",
            },
        ],
        payments:{},
        buyer:
            {
                type: mongoose.ObjectId,
                ref:"users", 
            },
        status:{
            type:String,
            default: "Not Process",
            enum: ["Not Process","Processing","Shipped","Deliverd","Cancel"],
        },
    },
    {timestamps:true}
);
export default mongoose.model("orders", orderschema);