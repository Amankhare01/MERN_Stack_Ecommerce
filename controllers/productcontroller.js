import slugify from "slugify";
import productmodel from "../models/productmodel.js";
import categorymodel from "../models/categorymodel.js"
import ordermodel from "../models/ordermodel.js";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv"
dotenv.config();
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createproductcontroller = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is require" });
      case !description:
        return res.status(500).send({ error: "description is require" });
      case !price:
        return res.status(500).send({ error: "price is require" });
      case !category:
        return res.status(500).send({ error: "category is require" });
      case !quantity:
        return res.status(500).send({ error: "quantity is require" });
      case !photo && size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is require and less than 1mb" });
    }
    const products = new productmodel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "product has been created",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

export const getproductcontroller = async (req, res) => {
  try {
    const products = await productmodel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      Totalproduct: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error while getting product",
      error,
    });
  }
};

export const getsingleproductcontroller = async (req, res) => {
  try {
    const product = await productmodel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single data fetching successful",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error while getting single product",
      error,
    });
  }
};

export const productphotocontroller = async (req, res) => {
  try {
    const product = await productmodel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res
        .status(200)
        .contentType(product.photo.contentType)
        .send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

export const productdeletecontroler = async (req, res) => {
  try {
    await productmodel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error while deleting product",
      error,
    });
  }
};

export const updateproductcontroller = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is require" });
      case !description:
        return res.status(500).send({ error: "description is require" });
      case !price:
        return res.status(500).send({ error: "price is require" });
      case !category:
        return res.status(500).send({ error: "category is require" });
      case !quantity:
        return res.status(500).send({ error: "quantity is require" });
      // case!photo || photo.size>1000000:
      // return res.status(500).send({error:'photo is require and less than 1mb'})
    }
    const products = await productmodel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "upadated",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updating product",
    });
  }
};

export const controlproductfilter = async (req, res) => {
  try {
    const { chacked, radio } = req.body;
    let args = {};
    if (chacked.length > 0) args.category = chacked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productmodel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while geting product filter",
      error,
    });
  }
};

// Product Count Controller

export const productcountcontroller = async (req, res) => {
  try {
    const total = await productmodel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while counting product",
      error,
    });
  }
};

export const productlistcontroller = async (req, res) => {
  try {
    const perpage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await productmodel
      .find({})
      .select("-photo")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting product list",
      error,
    });
  }
};

export const searchproductcontroller = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productmodel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: "false",
      message: "Error while searching product",
      error,
    });
  }
};

export const productcategorycontroller=async(req,res)=>{
  try {
    const category = await categorymodel.findOne({slug: req.params.slug});
    const products = await productmodel.find({category}).populate("category");
    res.status(200).send({
      success:true,
      category,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:"Error in product category",
      error,
    })
  }
};

export const braintreetokencontroll=async(req,res)=>{
  try {
    gateway.clientToken.generate({}, function (err,response){
      if (err) {
        res.status(500).send(err)
      }else{
        res.send(response)
      }
    });
  } catch (error) {
    console.log(error)
  }
}

export const paymentcontroller=async(req,res)=>{
  try{
    const {cart,nonce} = req.body;
    let total = 0;
    cart.map((i)=>{
      total = total + i.price;
    });
    let newTransaction = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options:{
        submitForSettlement:true
      }
    },
    function(error,result){
      if(result){
        const order = new ordermodel({
          products:cart,
          payments:result,
          buyer:req.user._id,
        }).save()
        res.json({ok:true})
      }else{
        res.status(500).send(error)
      }
    })
  }catch(error){
    console.log(error)
  }
}