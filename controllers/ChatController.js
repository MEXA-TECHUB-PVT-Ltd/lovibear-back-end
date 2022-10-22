const ChatModel = require("../models/chatModel.js");
const mongoose = require("mongoose");

exports.createChat = async (req, res) => {

  const senderId= req.body.senderId;
  const receiverId= req.body.receiverId;

  const checkResult =await ChatModel.findOne({
    members: { $all: [senderId, receiverId] },
  });

  if(!checkResult){
    const newChat = new ChatModel({
      _id: mongoose.Types.ObjectId(),
      members: [senderId,receiverId],
    });
    var savedChat=await newChat.save();
  }
  else{
    var savedChat= await ChatModel.findOneAndUpdate({_id:checkResult._id},
      {
        members: [req.body.senderId, req.body.receiverId],
      },
      {
        new:true,
      },
      )
  }

  try{
     if(savedChat){
      res.json({
        message:"chat has stored",
        result:savedChat
      })
     }
  }catch(err){
    res.json(err)
  }
};

exports.userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};