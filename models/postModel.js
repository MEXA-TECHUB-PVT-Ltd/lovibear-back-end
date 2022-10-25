const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
  userId:mongoose.Schema.Types.ObjectId,
  postImages:{
    type:[Object],
  }
} 

);


module.exports = mongoose.model("post", postSchema);