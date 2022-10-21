const express = require("express"),
router=express.Router(),
controller=require("../controllers/chatImageController")


router.get("/:chatId", controller.getChatImages)
router.post("/",controller.addChatImage)


module.exports=router