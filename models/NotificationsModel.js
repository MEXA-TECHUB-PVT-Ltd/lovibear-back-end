const mongoose = require("mongoose");

const NotificationSchema= new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
senderId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
},
receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "user"
},
senderType:{
    type:String,
    enum:["admin", "user"],
    required:true
},
receiverType:{
    type:String,
    enum:["admin", "user"],
    required:true
},
name:{
    type:String,
},
body:{
    type:String,
},
image:String,
readStatus:{
    type:Boolean,
    default:false,
}
})
module.exports = mongoose.model("Notification", NotificationSchema);