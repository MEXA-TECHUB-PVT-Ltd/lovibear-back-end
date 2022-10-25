const express = require("express")




const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app= express();
const PORT = 3000;
const socket = require("socket.io");

const MessageModel = require("./models/messageModel")
const ChatModel= require("./models/chatModel")


const cors = require('cors');
const { ActivityInstance } = require("twilio/lib/rest/taskrouter/v1/workspace/activity");
const { ConferenceInstance } = require("twilio/lib/rest/api/v2010/account/conference");


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
app.use("/chat", require("./routes/ChatRoute"));
app.use("/message", require("./routes/MessageRoute"));




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

const cloudinary = require("./utils/cloudinary")
const upload = require("./middlewares/multer");
const { AuthorizedConnectAppContext } = require("twilio/lib/rest/api/v2010/account/authorizedConnectApp");









const server= app.listen(3000, function () {
    console.log("server started on port 3000")
})


const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});




let activeUsers = [];





app.post("/api/sendFile" , upload.single("file"),async (req,res)=>{
  try{
    console.log(req.file)
    if(req.file){
      const result = await cloudinary.uploader.upload(req.file.path , {resource_type:"auto"})
      if(result){
        console.log(result)
        res.json({
          message: "uploaded to cloudinary",
          fileUrl : result.secure_url,
          public_id : result.public_id
        })
      }
    }
  }
  catch(error){
    console.log(error)
    res.json({
      message : "Error occurred while sending image",
      error:error
    })
  }
})



io.on("connection", (socket) => {

  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user






  socket.on("chat-start" ,async(data)=>{
    var {senderId ,receiverId} = data;

    const checkResult =await ChatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if(!checkResult){
      const newChat = new ChatModel({
        members: [senderId,receiverId],
      });
      var savedChat=newChat.save();
    }
    else{
      var savedChat= await ChatModel.findOneAndUpdate({_id:checkResult._id},
        {
          members: [senderId,receiverId],
        },
        {
          new:true,
        },
        )
    }
    
     try{
      if(savedChat){
          console.log("successfully stored")

            ChatModel.findOne({
            members: { $all: [senderId, receiverId]},
          } ,(err,foundResult)=>{
            if(foundResult){
              console.log("This is chatId:" + foundResult._id)
              let chatId= foundResult._id;
              socket.emit("chatId-receive" , chatId)
            }else{
              console.log("error in getting")
            }
          });
          
        }
      }
      catch(err){
        console.log(err);
        console.log("error in saving chat");
      }
    })

 

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("receiver found from active users : " + user.socketId)
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
     

    const { chatId, senderId , msg_type } = data;
    const text=data.text
    const message = new MessageModel({
      _id:mongoose.Types.ObjectId(),
      chatId:chatId,
      user:{
        _id: senderId
       },
      text:text,
      msg_type:msg_type
    });
      message.save(function(err){
        if(!err){
          console.log("Message has been stored in message database")
        }else{
          console.log("Error in storing messages");
        }
      })
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
  

})



