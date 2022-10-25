const express = require("express")
const mongoose = require("mongoose")
const ssModel= require("../models/chatImageModel")

exports.addChatImage = (req, res) => {
    var obj={
        chatId: req.body.chatId,
        senderId: req.body.senderId,
        image:{
            data:req.file.path,
            contentType:"imag/png"
        },
        timestamps:true
    }
    ssModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            console.log("hello")
            res.send(obj);
        }
    });
  
  };
  
  exports.getChatImages = async (req, res) => {
    const { chatId } = req.params;
    try {
      const result = await ssModel.find({ chatId });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  