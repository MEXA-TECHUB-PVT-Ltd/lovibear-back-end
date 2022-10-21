const router = require("express").Router();
const adminModel= require("../models/adminModel");
const bcrypt = require("bcryptjs");

const Joi = require("joi");
const jwt = require("jsonwebtoken");
const auth= require("../middlewares/auth")
const mongoose=require("mongoose")
const controller= require("../controllers/adminController")

router.get("/allAdmins" ,controller.getAllAdmins)
router.get("/specificAdmin/:adminId" , controller.getSpecificAdmin)
router.delete("/deleteAdmin/:adminId" , controller.deleteAdmin);
router.put("/updateAdminPassword", controller.updatePassword)

 

router.post("/register",  async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //Check if the user is already in the db
    const emailExists = await adminModel.findOne({ email: req.body.email });
  
    if (emailExists) return res.status(400).send("Email already exists");
  
    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
  
    //create new user
    const admin = new adminModel({
      _id:mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hashPassword,
     
     
    });
  
    try {
      const savedAdmin= await admin.save();
      
      res.json({
        _id:savedAdmin._id,
        email:savedAdmin.email,
        password:savedAdmin.password,


      })
    } catch (err) {
      res.status(400).send(err);
    }
  });

router.post("/login",async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
  
    const admin = await adminModel.findOne({ email: req.body.email });
   
  
    if (!admin) return res.status(400).send("Email or password is wrong");
  
    const validPass = await bcrypt.compare(req.body.password, admin.password);
    if (!validPass) return res.status(400).send("Email or password is wrong");
  
    //Create and assign a token
    const token = jwt.sign({ _id: admin._id }, process.env.TOKEN);
    res.json({
      message:"Logged in successfully",
      token: token,
      _id:admin._id,
      email:admin.email,
      password:admin.password,

    })
  });


  router.post("/checkLogin" ,auth , (req,res)=>{
    
  })
const registerSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  
  const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });


  router.get("/logout",(req,res)=>
  {
    res.cookie('jwt' ,'',{maxAge:1} )
    res.json("Cookie deleted, logout successfully")
    
    
  })

module.exports = router;

