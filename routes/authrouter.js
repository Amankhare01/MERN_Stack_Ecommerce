import express from "express";
import { registercontroller, logincontroller , testcontroller, orderscontroller, Allorderscontroller, orderstatuscontroller} from "../controllers/authcontroller.js";
import { isadmin, requiresign } from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/register", registercontroller);
router.post("/login" , logincontroller);
router.get('/test',requiresign,isadmin,testcontroller)
router.get("/user-auth",requiresign, (req,res)=>{
    res.status(200).send({ok:true});
});
router.get("/admin-auth",requiresign,isadmin, (req,res)=>{
    res.status(200).send({ok:true});
});

router.get('/orders',requiresign, orderscontroller);
router.get('/all-orders',requiresign,isadmin, Allorderscontroller);

router.put('/order-status/:orderId',requiresign,isadmin,orderstatuscontroller)

export default router;