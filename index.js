const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app= express();
const PORT = 3000;
const socket = require("socket.io");

const MessageModel = require("./models/messageModel")

const cors = require('cors');
const { ActivityInstance } = require("twilio/lib/rest/taskrouter/v1/workspace/activity");


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

require('dotenv').config()


//connect to db
mongoose.connect(
    process.env.DB_CONNECTION, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log("Connected to DB")
);

//middleware
app.use(express.json());



//Routes

app.use("/api/user" , require("./routes/userRoute"))
app.use("/api/posts" , require("./routes/postRoute"))
app.use("/api/forgetPassword" , require("./routes/userForgetRoute"))
app.use("/api/swipe" , require("./routes/swipeRoute"))
app.use("/api/matches" , require("./routes/matchesRoute"))
app.use("/api/notification" , require("./routes/NotificationRoute"))
app.use("/api/admin" , require("./routes/adminRoute"))
app.use("/api/userProfilePicBackup" , require("./routes/userProfilePicRoute"))
app.use("/api/postsBackup" , require("./routes/userPostsBackupRoute"))
app.use("/api/userLogs" , require("./routes/userLogsRoutes"))


 app.post('/add-msg-socket', async(req, res,next) => {
    try {
        const { from, to, message } = req.body;
        const data =  new MessageModel({
          message: { text: message },
          users: [from, to],
          sender: from,
        });
        
       const saveData= await data.save()
    
        if (saveData) return res.json({ msg: "Message added successfully." , result:saveData  , statusCode:201});
        else return res.json({ msg: "Failed to add message to the database" });
      } catch (ex) {
        next(ex);
      }
})

app.post('/get-msg-socket', (req, res, next) => {

    try {
        const { from, to } = req.body;
        const messages = MessageModel.find({ users: {
                    $all: [from, to],
                }
            }, (error, result) => {
            if (error) {
                res.send(error)
            } else {
                const projectedMessages = result.map((msg) => {
                        return {
                            fromSelf: msg.sender.toString() === from,
                            message: msg.message.text,
                        };
                    });
                    res.json(projectedMessages);
            }
        })
     
    } catch (ex) {
        next(ex);
    }
})

app.delete('/deleteMessage' ,async (req,res , next)=>{
    try{
        const messageId= req.params.messageId;
        const result=MessageModel.deleteOne({_id:messageId})
        if(result.deletedCount >0){
            res.json({
                message: "Message deleted successfully",
                result:result
            })
        }
    }
    catch(err){
        res.json({
            message: "Error occurred while deleting message",
            Error:err.message
        })
    }
})

app.post("/user/logout",(req,res)=>
{
  const userId= req.body.userId;
  
  const userLog= new userLogsModel({
    _id:mongoose.Types.ObjectId(),
    user_id:userId,
    ip:req.body.ip,
    country:req.body.country,
    logType:"logout"
  })

  userLog.save(function(err,result){
    if(result){
      res.json({
        message: "user Logout record maintained",
        result:result,
        message: "after calling this api delete user jwt token stored in cookies ,local storage from front end"
      })
    }
    else{
      console.log("Error in saving logs")
    }
  })

 
})

const server=app.listen(PORT, () => console.log(`Running server on port: ${PORT}`));


const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });