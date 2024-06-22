import express from "express";
import {isadmin,requiresign} from "./../middleware/authmiddleware.js";
import { categorycontroller, createcategorycontroller, deletecategory, singlecategorycontroller, updatecategorycontrller } from "../controllers/categorycontroller.js";

const router = express.Router();

router.post('/create-category', requiresign, isadmin,createcategorycontroller);

router.put('/update-category/:id',requiresign,isadmin,updatecategorycontrller);

router.get('/get-category',categorycontroller);

router.get('/single-category/:slug',singlecategorycontroller);

router.delete('/delete-category/:id',requiresign,isadmin,deletecategory);
export default router;