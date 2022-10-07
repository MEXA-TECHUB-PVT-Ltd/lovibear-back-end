const mongoose = require("mongoose");

const  userLogsSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
 user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
 },
 ip:String,
 country:String,
 logType:{
    type:String,
    enum:["login" , "logout"]
}
} ,
{
    timestamps:true,
}
);


module.exports = mongoose.model("user-logs", userLogsSchema);