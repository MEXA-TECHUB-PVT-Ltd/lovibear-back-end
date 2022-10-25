const  MessageModel=require("../models/messageModel.js");
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");

exports.addMessage =async (req, res) => {
  const { chatId, senderId, text , msg_type , public_id} = req.body;
  const message = new MessageModel({
    _id:mongoose.Types.ObjectId(),
    chatId:chatId,
    senderId:senderId,
    text: text,
    msg_type:msg_type,
    public_id:public_id
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



exports.deleteMessage=async(req,res)=>{
  
  const messageId = req.params.m_id;

    let errResponse= {
      message:"",
      message2:""
    };
    const findMessage = await MessageModel.findOne({_id: messageId})
    if(findMessage.msg_type && findMessage.public_id){
      try{
        await cloudinary.uploader.destroy(findMessage.public_id)
      }
      catch{
        errResponse.message2 ="Error occurred while deleting image from cloudinary"
      }
      
    }
    

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
      errResponse.message = "Error occurred while deleting message"
      res.json({
        errorMessages: errResponse,
        error:err.message
      })
    }
  })
}
