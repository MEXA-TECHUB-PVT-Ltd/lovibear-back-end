const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema(
  {
    _id:mongoose.Schema.Types.ObjectId,
    chatId: {
      type: String,
    },
    senderId:{
      type:String,
    },
    text: {
      type: String,
    },
    msg_type:{
      type: String,
      enum:["text" , "image" , "video"]
    },
    public_id:String,
  },
   
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel
