import express from "express"
import { changepassword, forgetpassword, login, logout, register, verification, verifyotp } from "../controller/user_controller.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { verifyEmail } from "../emailverify/verifymail.js";
const userrouter=express.Router()

userrouter.post("/register",register);
userrouter.get("/verification",verification)
userrouter.post("/login",login);
userrouter.get("/logout",isAuthenticated,logout)
userrouter.post("/forgetpassword",forgetpassword)
userrouter.post("/verifyOtp/:email",verifyotp)
userrouter.post("/changepassword/:email",changepassword);
export default userrouter