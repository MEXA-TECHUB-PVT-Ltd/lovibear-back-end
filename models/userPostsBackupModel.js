const mongoose = require("mongoose");

const postBackupSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
  userId:mongoose.Schema.Types.ObjectId,
  postImages:{
   type:[String],
   contentType:String, 
  }
} 

);


module.exports = mongoose.model("postBackup", postBackupSchema);