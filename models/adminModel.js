const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

  password: {
    type: String,
    required: true,
    max: 2048,
    min: 6,
  },
} 
);
module.exports = mongoose.model("admin", adminSchema);