const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema(
  {
    _id:mongoose.Schema.Types.ObjectId,
    chatId: {
      type: String,
    },
    user:{
      _id:String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel
