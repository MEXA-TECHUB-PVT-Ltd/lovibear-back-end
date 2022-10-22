const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
  userName: String,
  signupType:{
    type:String,
    enum:['google', 'facebook', 'email' ,'phoneNumber'],
  },
  email: {
    type: String,
    min: 6,
    max: 255,
  },
  phoneNumber:{
    type:String,
   
  },
  gender:{
    type: String,
    enum: ['male', 'female' , 'preferNotToSay' , "transMen" , "transWomen"],
  },

  dateOfBirth:{
    type:Date
  },

  profileImage:{
    type:Object,
  },

  profession:{
    type:String,
  },

  location: {
    type: { 
     type: String,
     default: "Point"
   },
    coordinates: {
      type: [Number], 
     required: [true, "Coordinates are required"] 
   } 
 },
 
  password: {
    type: String,
    required: true,
    max: 2048,
    min: 6,
  },
  blockStatus:{
    type:Boolean,
    default: false,
  },
  fcmToken:{
    type:String,
    required:false,
 },
 userEmailAddress:{
  type:String,
 }
} 



);
userSchema.index( { location : "2dsphere" } );
module.exports = mongoose.model("user", userSchema);