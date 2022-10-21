const express=require("express")
const { addMessage, getMessages  } = require('../controllers/messageController');
const controller=require("../controllers/messageController")

const router = express.Router();

router.post('/', addMessage);

router.get('/:chatId', getMessages);
 router.delete("/" ,controller.delete)

module.exports=router;