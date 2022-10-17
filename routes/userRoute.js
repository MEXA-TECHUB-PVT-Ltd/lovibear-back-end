

const router = require("express").Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinary")
const upload = require("../middlewares/multer")


const Joi = require("joi");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");


const controller = require("../controllers/userController");
const userLogsModel= require("../models/userLogsModels")

router.get("/allUsers", controller.getAllUsers);
router.get("/specificUser/:userId", controller.getSpecificUser);
router.delete("/deleteUser/:userId", controller.deleteUser);
router.put("/updateUserPassword", controller.updatePassword);
router.put("/changeUserBlockStatus", controller.blockStatusChange);
router.put("/updateUserProfile", upload.single("profileImage"), controller.updateUserProfile);
router.post("/phOTP", controller.postEnterNumber);
router.post("/verifyOTP", controller.verifyOTP);
router.post("/usersInRadius", controller.getUsersWithinRadius);
router.put("/updateUserLocation", controller.updateLocation);
router.post("/getUserByName", controller.getUserByName);

router.post("/register", upload.single("profileImage"),async (req, res) => {
  console.log("in post");
  const { error } = registerSchema.validate(req.body);
  console.log(req.body)
  if (error) return res.status(400).send(error.details[0].message);
  //Check if the user is already in the db
  const email = await userModel.findOne({ email: req.body.email });
  const phoneNumber = await userModel.findOne({ phoneNumber: req.body.phoneNumber,});
  console.log("email" + email);
  console.log("phone nUmber" + phoneNumber);

  //hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  console.log(hashPassword)


  var userPic;
        try{
            if(req.file){
                console.log(req.file)
                const c_result = await cloudinary.uploader.upload(req.file.path)
               console.log(c_result.secure_url)
               userPic= {
                userPicUrl:c_result.secure_url,
                public_id:c_result.public_id
               };
            }
            else{
                userPic= {}
            }
            
        }catch(err)
        {console.log(err)}

  if (req.body.phoneNumber) {
    
   const phoneNumber = await userModel.findOne({ phoneNumber: req.body.phoneNumber,});
   if (phoneNumber){
    res.send({message:"this phone Number already exists"})
   }
   else
      {
        const user = new userModel({
          _id: mongoose.Types.ObjectId(),
          password: hashPassword,
          gender: req.body.gender,
          dateOfBirth: req.body.dateOfBirth,
          profileImage: userPic,
          profession: req.body.profession,
          location: JSON.parse(req.body.location),
          fcmToken: req.body.fcmToken,
          phoneNumber: req.body.phoneNumber,
          signupType: req.body.signupType,
          userName: req.body.userName,
          userEmailAddress: req.body.userEmailAddress,
          
        });
    
        try {
          const savedUser = await user.save();
          const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN);
    
          res.json({
            result: savedUser,
            token: token,
          });
        } catch (err) {
          res.status(400).send(err);
        }
      }
    
  } else if (req.body.email) {

    const email = await userModel.findOne({ email: req.body.email,});
    if (email){
     res.send({message:"email already in exists"})
    }
    else{
      const user = new userModel({
        _id: mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hashPassword,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        profileImage: userPic,
        profession: req.body.profession,
        location:JSON.parse(req.body.location),
        fcmToken: req.body.fcmToken,
        signupType: req.body.signupType,
        userName: req.body.userName,
        userEmailAddress: req.body.userEmailAddress,
      });
  
      try {
        const savedUser = await user.save();
        const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN);
  
        res.json({
          result: savedUser,
          token: token,
        });
      } catch (err) {
        res.status(400).send(err);
      }
    }
    //create new user
    
  }
  else {
        res.send("email or phoneNumber must be provided for signup")
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log(req.body.email);
  console.log(req.body.phoneNumber);

  if (req.body.email) {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email or password is wrong");
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Email or password is wrong");

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
    const result = await userModel.aggregate([

      { $match: { _id: user._id } },
      {
        $lookup:
        {
            from: "posts",
            localField: "_id",
            foreignField: "userId",
            as: "userPosts"
        }
    },
      //
    ]);
    console.log(result)
    res.json({
      message: "Logged in successfully",
      Data: user,
      token: token,
      userDetails: result,
    });
   

    //saving user logs
    const userLog= new userLogsModel({
      _id:mongoose.Types.ObjectId(),
      user_id:user._id,
      ip:req.body.ip,
      country:req.body.country,
      logType:"login"
    })

    userLog.save(function(err,result){
      if(result){
        console.log("logs maintained")
      }
      else{
        console.log("Error in saving logs")
      }
    })

  } else if (req.body.phoneNumber) {
    const user = await userModel.findOne({ phoneNumber: req.body.phoneNumber });
    if (!user) return res.status(400).send("phoneNumber or password is wrong");
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res.status(400).send("phoneNumber or password is wrong");

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
    const result = await userModel.aggregate([
      { $match: { _id: user._id } },
      {
        $lookup:
        {
            from: "posts",
            localField: "_id",
            foreignField: "userId",
            as: "userPosts"
        }
    },
      //
    ]);
    res.json({
      message: "Logged in successfully",
      Data: user,
      token: token,
      userDetails: result,
    });

    const userLog= new userLogsModel({
      _id:mongoose.Types.ObjectId(),
      user_id:user._id,
      ip:req.body.ip,
      country:req.body.country,
      logType:"login"
    })


    //saving user Logs
    userLog.save(function(err,result){
      if(result){
        console.log("logs maintained")
      }
      else{
        console.log("Error in saving logs")
      }
    })

  } else {
    res.json("Only email or password can be use for login along with password");
  }
});

router.post("/checkLogin", auth, (req, res) => {});


const registerSchema = Joi.object({
  email: Joi.string().min(6).email(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string(),
  signupType: Joi.string(),
  gender: Joi.string(),
  dateOfBirth: Joi.string(),
  profession: Joi.string(),
  location: Joi.string(),
  userName: Joi.string(),
  fcmToken: Joi.string(),
  userEmailAddress: Joi.string()
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).email(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string(),
  ip:Joi.string(),
  country: Joi.string(),
  logType: Joi.string()
});

module.exports = router;
