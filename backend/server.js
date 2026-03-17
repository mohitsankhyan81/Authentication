import express from "express"
import dotenv from "dotenv"
import mongoose, { mongo } from "mongoose";
import userrouter from "./router/user_router.js";
dotenv.config();
const app=express();
app.use(express.json())


const MONGO_URI=process.env.MONGO_URI;
try{
    mongoose.connect(MONGO_URI)
    console.log("Connect Sucessfully");
}catch(error){
    console.log("Error in the mongodb",error);
}

app.use("/api/user",userrouter)
const port=process.env.PORT ||3455

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})