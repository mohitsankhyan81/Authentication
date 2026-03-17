import mongoose, { mongo } from "mongoose";

const authSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isLogedin:{
        type:Boolean,
        default:false
    },
    token:{
        type:String,
        default:null
    },
    otp:{
        type:String,
        default:null
    },
    otpExpire:{
        type:Date,
        default:null
    }
},{timestamps:true})

export const auth=mongoose.model("auth",authSchema);