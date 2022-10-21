const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
 users:[mongoose.Schema.Types.ObjectId],
 matchStatus:Boolean
} 

);


module.exports = mongoose.model("match", matchSchema);