
const mongoose = require("mongoose");

const profilePicsSchema = new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
   userId: mongoose.Schema.Types.ObjectId,
   profilePic: {
    data:String,
    contentType:String
}
} 

);


module.exports = mongoose.model("profilePic", profilePicsSchema);