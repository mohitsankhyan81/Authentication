import { verifyEmail } from "../emailverify/verifymail.js";
import { auth } from "../model/auth_model.js";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { session } from "../model/sessionmodel.js";
import { sendotpMail } from "../emailverify/sendotpmail.js";
dotenv.config()
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({success:false,message:"Fill all the require Fields"})
        }
        console.log(req.body)

        const user=await auth.findOne({email});
        if(user){
            return res.status(400).json({success:false,message:"user already register"})
        }
        const hashpassword=await bcrypt.hash(password,10);

        const newUser=await auth.create({username,email,password:hashpassword});
        const token=jwt.sign({id:newUser._id},process.env.SECRET_KEY,{expiresIn:'7d'})
        await verifyEmail(token,email)
        newUser.token=token
        await newUser.save();
        return res.status(200).json({success:true,message:"User Register Sucessfully",newUser:newUser})
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success:false,error: "Server error" })
    }
}

export const verification=async(req,res)=>{
    try{
        const authorization=req.headers.authorization;

        if(!authorization || !authorization.startsWith("Bearer ")){
            return res.status(400).json({success:false,message:"Authentication token is missing or error"})
        }
        console.log(authorization);
        const token=authorization.split(" ")[1];
        console.log(token)
        let decode;
        try{
            decode=jwt.verify(token,process.env.SECRET_KEY);

        }
        catch(error){
            if(error.name=="TokenExpiredError"){
                return res.status(400).json({success:false,message:"The register token has expired"})
            }
            return res.status(400).json({success:false,message:"token verification fail"})
        }
        const user=await auth.findById(decode.id);
        if(!user){
            return res.status(400).json({success:false,message:"user not found"});
        }

        user.token=null
        user.isVerified=true
        await user.save();

        return res.status(200).json({success:true,message:"Email verify sucessfully"})
    }catch(error){
        return res.status(500).json({success:false,error:error.message})
    }
}

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body

        if(!email ||!password){
            return res.status(400).json({success:false,message:"Fill all the required fields"})
        }

        const user=await auth.findOne({email})

        if(!user){
            return res.status(400).json({success:false,message:"Unauthorized acesss"})
        }

        const passwordcheck=await bcrypt.compare(password,user.password)
        if(!passwordcheck){
            return res.status(400).json({success:false,message:"Incorrect Password"})
        }
        if(!user.isVerified){
            return res.status(400).json({success:false,message:"verify your account and then log in"})
        }
        //cheack for exesting session
        const existingsession=await session.findOne({userid:user._id})
        if(existingsession){
            await session.deleteOne({userid:user._id});
        }

        //create a new session
        await session.create({userid:user._id})

        //access token
        const acesstoken=jwt.sign({id:user._id},process.env.SECRET_KEY,{
            expiresIn:"10d"
        })

        //referesh token
        const refereshtoken=jwt.sign({id:user._id},process.env.SECRET_KEY,{
            expiresIn:"30d"
        })

        user.isLogedin=true
        await user.save();
        return res.status(200).json({success:true, message:"user login sucessfully",acesstoken,refereshtoken,user:user})
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        const userId = req.userid;

        await session.deleteMany({ userid: userId });

        await auth.findByIdAndUpdate(userId, { isLogedin: false });

        return res.status(200).json({
            success: true,
            message: "user logout successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const forgetpassword=async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await auth.findOne({email})
        if(!user){
            return res.status(404).json({success:false,message:"user not found"});
        }

        const otp=Math.floor(100000+Math.random()*900000).toString()
        const otpExpire=new Date(Date.now() +10 *60 *1000)
        user.otp=otp,
        user.otpExpire=otpExpire
        await user.save();

        await sendotpMail(email,otp);
        return res.status(200).json({success:true,message:"otp send sucessfully"})
    }
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }
}

export const verifyotp=async(req,res)=>{
    const {otp}=req.body
    const email=req.params.email;
    if(!otp){
        return res.status(400).json({
            success:false,
            message:"otp is required"
        })
    }

    try{
        const user=await auth.findOne({email})
        if(!user){
            return res.status(404).json({success:false,message:"user not found"});
        }

        if(!user.otp || !user.otpExpire){
            return res.status(400).json({success:false,message:"otp not generated or allready verified"})
        }

        if(user.otpExpire < new Date()){
            return res.status(400).json({success:false,message:"otp is exipired req for new one"})
        }

        if(otp !== user.otp){
            return res.status(400).json({success:false,message:"Invalid otp incrocet otp"})
        }

        user.otp=null
        user.otpExpire=null
        await user.save();
        return res.status(200).json({
            success:true,
            message:"OTP verified succesfylly"
        })
    }
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }
}

export const changepassword=async(req,res)=>{
    const {newpassword,confirmpassword}=req.body;
    const email=req.params.email;
    if(!newpassword||!confirmpassword){
        return res.status(400).json({success:false,message:"ALL fields are requierd"})
    }

    if(newpassword !== confirmpassword){
        return res.status(400).json({success:false,message:"Password not match"})
    }

    try{
        const user=await auth.findOne({email})
        if(!user){
            return res.status(400).json({success:false , message:"user not found"})
        }

        const hashedpassword=await bcrypt.hash(newpassword,10)
        user.password=hashedpassword
        await user.save();
        return res.status(200).json({success:true, message:"Password change sucessfully"})
    }
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }

}