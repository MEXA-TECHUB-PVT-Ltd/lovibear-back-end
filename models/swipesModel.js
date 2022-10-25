const mongoose = require("mongoose");

const swipesSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
  swipedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  swipedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  swipedStatus:{
    type:String,
    enum: ["pending", "right" ,"left"],
    default: "pending",
  }
} 

);


module.exports = mongoose.model("swipe", swipesSchema);