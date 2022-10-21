const mongoose=require("mongoose")
const Schema= mongoose.Schema

const userPhoneOTPVerificationSchema = new mongoose.Schema({
    userId:mongoose.Schema.Types.ObjectId,
    otp : String,
    phoneNumber : String,
})
const UserOTPVerificationModel= mongoose.model("userPhoneOTPVerification" , userPhoneOTPVerificationSchema )
module.exports=UserOTPVerificationModel;