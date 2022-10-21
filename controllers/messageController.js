const  MessageModel=require("../models/messageModel.js");

exports.addMessage =(req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId:chatId,
    user: {
      _id:senderId
    },
    text: text,
  });
  try {
    const result = message.save();
    res.status(200).json(message);
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



exports.delete=(req,res)=>{

  MessageModel.deleteMany({}, function (err, foundResult) {
          try {
              res.json(foundResult);
          } catch (err) {
              res.json(err)
          }

      })
}
