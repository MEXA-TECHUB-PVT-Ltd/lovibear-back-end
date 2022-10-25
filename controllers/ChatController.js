const ChatModel = require("../models/chatModel.js");
const mongoose = require("mongoose");
const messageModel = require("../models/messageModel");
const { AddOnResultContext } = require("twilio/lib/rest/api/v2010/account/recording/addOnResult.js");

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
  var ObjectId = require('mongodb').ObjectId
  let userId= req.params.userId;
    userId= new ObjectId(userId);
  try {
    const result = await ChatModel.aggregate([
      {
          "$match": {
            $expr: {
              "$in": [
                userId,
                {
                  "$ifNull": [
                    "$members",
                    []
                  ]
                }
              ]
            }
          }
        }
        ,

      { $lookup: {
        from: 'users',
        let: { userId: '$members' },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$userId"] } } }
          // Add additional stages here 
        ],
        as:'userDetails'
    }
    }
  ])
  


  if(result.length>0){
  
    res.json({
      message: "chats of this user",
      result:result,

    })
  }
  else{
    res.json({
      message:"could not found chats of this user",
      result:result
    })
  }

}
catch(err){
  res.json({
    message:"Error Occurred",
    errorMessage:err.message
  })
}
}


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