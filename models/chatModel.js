const mongoose = require("mongoose")

const ChatSchema = new mongoose.Schema(
  {
    members:[mongoose.Schema.Types.ObjectId]
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("Chat", ChatSchema);
module.exports=ChatModel
