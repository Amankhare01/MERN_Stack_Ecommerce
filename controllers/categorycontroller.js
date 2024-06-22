import categorymodel from "../models/categorymodel.js";
import slugify from "slugify";
export const createcategorycontroller =async(req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(401).send({message:"Name is require"})
        }
        const existingcategory = await categorymodel.findOne({name})
        if(existingcategory){
            return res.status(200).send({
                success:true,
                message:"Category-already-Exisits"
            })
        }
        const category = await new categorymodel({name, slug: slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:"new-category-created",
            category,
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"error-in-category",
        });
    }
};

export const updatecategorycontrller =async(req,res)=>{
    try{
        const {name} = req.body;
        const {id} = req.params;
        const category = await categorymodel.findByIdAndUpdate(
            id,
            {name,slug:slugify(name)},
            {new:true}
        );
        res.status(200).send({
            success:true,
            message:"Category Updated Successfuly",
            category,
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
        })
    }
};

export const categorycontroller=async(req,res)=>{
    try{
        const category = await categorymodel.find({});
        res.status(200).send({
            success:true,
            message:"All Category List",
            category,
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting category"
        });
    }
};

export const singlecategorycontroller=async(req,res)=>{
    try{
        const category = await categorymodel.findOne({slug: req.params.slug});
        res.status(200).send({
            success:true,
            message:"get single category successful",
            category,
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"error while getting single"
        });
    }
};

export const deletecategory =async(req,res)=>{
    try{
        const {id} = req.params;
        await categorymodel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Category Deleted Successfully",
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while deleteing Category"
        })
    }
}