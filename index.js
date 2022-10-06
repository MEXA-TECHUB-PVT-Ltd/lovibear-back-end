const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app= express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
require('dotenv').config()

const cors = require('cors')
app.use(cors())


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

app.get("/user/logout",(req,res)=>
{
  res.json("Delete jwt token you stored in your cookie/session/async etc")
})

const server=app.listen(PORT, () => console.log(`Running server on port: ${PORT}`));

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// let activeUsers = [];

// io.on("connection", (socket) => {
//   // add new User
//   socket.on("new-user-add", (newUserId) => {
//     // if user is not added previously
//     if (!activeUsers.some((user) => user.userId === newUserId)) {
//       activeUsers.push({ userId: newUserId, socketId: socket.id });
//       console.log("New User Connected", activeUsers);
//     }
//     // send all active users to new user
//     io.emit("get-users", activeUsers);
//   });

  


//   socket.on("disconnect", () => {
//     // remove user from active users
//     activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
//     console.log("User Disconnected", activeUsers);
//     // send all active users to all users
//     io.emit("get-users", activeUsers);
//   });
// })