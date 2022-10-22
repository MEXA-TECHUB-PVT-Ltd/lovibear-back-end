const  MessageModel=require("../models/messageModel.js");
const mongoose = require("mongoose");

exports.addMessage =async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    _id:mongoose.Types.ObjectId(),
    chatId:chatId,
    user: {
      _id:senderId
    },
    text: text,
  });
  try {
    const result = await message.save();
    res.status(200).json({
      message:"Message saved successfully",
      result:result
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};



exports.deleteMessage=(req,res)=>{
  const messageId = req.params.m_id;
  MessageModel.deleteOne({_id: messageId} , function(err,result){
    try{
      if(result.deletedCount >0){
        res.json({
          message:"Message deleted successfully",
          result: result,
          statusCode: 200
        })
      }else{
        res.json({
          message: "Could not delete message, or message with this id may not exist"
        })
      }
    }
    catch(err){
      res.json({
        message: "Error occurred",
        error:err.message
      })
    }
  })
}
