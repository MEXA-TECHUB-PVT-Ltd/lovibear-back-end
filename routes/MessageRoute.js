
const express=require("express")
const { addMessage, getMessages , deleteMessage } = require('../controllers/messageController');

const router = express.Router();

router.post('/', addMessage);
router.get('/:chatId', getMessages);
router.delete("/:m_id", deleteMessage)

module.exports=router;