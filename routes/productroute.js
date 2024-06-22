import Express  from "express";
import {isadmin,requiresign} from "../middleware/authmiddleware.js"
import { controlproductfilter, createproductcontroller,getsingleproductcontroller, getproductcontroller, productcountcontroller, productdeletecontroler, productlistcontroller, productphotocontroller, searchproductcontroller, updateproductcontroller, productcategorycontroller, braintreetokencontroll, paymentcontroller } from "../controllers/productcontroller.js";
import formidable from "express-formidable";
const router = Express.Router()

router.post('/create-product',requiresign,isadmin,formidable(),createproductcontroller)
router.put('/update-product/:pid',requiresign,isadmin,formidable(),updateproductcontroller)

router.get('/get-product', getproductcontroller);

router.get('/get-product/:slug', getsingleproductcontroller);

router.get('/photo-category/:pid', productphotocontroller);

router.delete('/del-product/:pid', productdeletecontroler);

router.post('/product-filter', controlproductfilter);

router.get('/product-count', productcountcontroller);

router.get('/product-list/:page', productlistcontroller);

router.get('/search/:keyword', searchproductcontroller);

router.get('/product-category/:slug', productcategorycontroller);

router.get('/braintree/token', braintreetokencontroll);

router.post('/braintree/payments',requiresign, paymentcontroller)
export default router