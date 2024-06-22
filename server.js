import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB  from "./config/db.js";
import authrouter from "./routes/authrouter.js";
import productroute from "./routes/productroute.js"
import categoryroute from "./routes/categoryroute.js"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))
app.use("/api/v1/auth",authrouter);
app.use("/api/v1/category", categoryroute);
app.use("/api/v1/product", productroute)
app.use(express.static(path.join(__dirname,"./client/build")));

app.use("*",function (req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"))
});

const PORT = process.env.PORT || 8080 ;

app.listen(PORT, () =>{
    console.log(`Your server is running on ${PORT}`.bgBlue.white);
});