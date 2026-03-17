import mongoose from "mongoose";

const sessionSchema=new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"auth"
    }
})

export const session=mongoose.model("session",sessionSchema);