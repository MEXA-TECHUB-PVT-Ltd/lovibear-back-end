const mongoose = require("mongoose");

const swipesSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
  swipedBy: mongoose.Schema.Types.ObjectId,
  swipedUser: mongoose.Schema.Types.ObjectId,
  swipedStatus:{
    type:String,
    enum: ["pending", "right" ,"left"],
    default: "pending",
  }
} 

);


module.exports = mongoose.model("swipe", swipesSchema);