const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const userPhoneOTPVerificationModel = require("../models/userPhoneOtpVerificationModel");
const mongoose = require("mongoose");
const UserOTPVerificationModel = require("../models/userOTPVerificationModel");
const cloudinary = require("../utils/cloudinary")



const client = require("twilio")(process.env.AccountID, process.env.AuthTokken);

exports.getAllUsers = (req, res) => {
  userModel.find({}, function (err, foundResult) {
    try {
      res.json(foundResult);
    } catch (err) {
      n;
      res.json(err);
    }
  });
};

exports.getSpecificUser = (req, res) => {
  const userId = req.params.userId;
  userModel.find({ _id: userId }, function (err, foundResult) {
    try {
      res.json(foundResult);
    } catch (err) {
      res.json(err);
    }
  });
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try{
    const result= await userModel.findOne({_id: userId});
    if(result){
        await cloudinary.uploader.destroy(result.profileImage.public_id)
    }else{
        console.log("not found this user ")
    }
  }
  catch(err){console.log(err)}



  userModel.deleteOne({ _id: userId }, function (err, foundResult) {
    try {
      res.json(foundResult);
    } catch (err) {
      res.json(err);
    }
  });
};

exports.updatePassword = async (req, res) => {
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;

  if (
    email &&
    newPassword &&
    userId !== null &&
    typeof email &&
    typeof newPassword &&
    typeof userId !== "undefined"
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    userModel.findOneAndUpdate(
      {
        email: email,
        _id: userId,
      },
      {
        password: hashPassword,
      },
      {
        new: true,
      },
      function (err, result) {
        if (result) {
          console.log("password updated successfully");
          res.json({
            message: "password updated successfully",
            success: true,
            result: result,
          });
        } else {
          res.json({
            message: "could'nt update user password",
            success: false,
            error: err,
            data: result,
          });
        }
      }
    );
  } else if (phoneNumber && newPassword && userId) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    userModel.findOneAndUpdate(
      {
        phoneNumber: phoneNumber,
        _id: userId,
      },
      {
        password: hashPassword,
      },
      {
        new: true,
      },
      function (err, result) {
        if (result) {
          console.log("password updated successfully");
          res.json({
            message: "password updated successfully",
            success: true,
            result: result,
          });
        } else {
          res.json({
            message: "could'nt update user password",
            success: false,
            error: err,
            data: result,
          });
        }
      }
    );
  }
};

exports.blockStatusChange = (req, res) => {
  const status = req.body.status;
  const userId = req.body.userId;
  userModel.findOneAndUpdate(
    { _id: userId },
    { blockStatus: status },
    { new: true },
    function (err, result) {
      if (result) {
        if (!err) {
          res.json({
            message: "Block status changed to " + status,
            updatedResult: result,
          });
        } else {
          res.json({
            message: "Error occurred while changing status",
            Error: err.message,
          });
        }
      } else {
        res.send("result found null");
      }
    }
  );
};

exports.updateUserProfile =  async (req, res) => {
  const userId = req.body.userId;
  

  try{
    const result= await userModel.findOne({_id: userId});
    if(result){
      console.log(result.profileImage.public_id)
        await cloudinary.uploader.destroy(result.profileImage.public_id)
    }else{
        console.log("not found this user ")
    }
}
catch(err){console.log(err)}
//----------------------------------------------

// uploading new picture in to cloudinary
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


       // if image is reveived
       if (userId !== null && typeof userId !== "undefined") {
        userModel.findByIdAndUpdate(
          userId,
          {
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            profileImage: userPic,
            profession: req.body.profession,
            fcmToken: req.body.fcmToken,
            userName: req.body.userName,
            userEmailAddress: req.body.userEmailAddress,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            signupType: req.body.signupType,
            $set: {
              "location.coordinates": [req.body.long, req.body.lat],
            },
          },
          {
            new: true,
          },
          function (err, result) {
            if (!err) {
              if (result !== null && typeof result !== "undefined") {
                res.json({
                  message: "Updated successfully",
                  updatedResult: result,
                });
              } else {
                res.json({
                  message:
                    "couldn't update , Record with this userId  may be not found",
                });
              }
            } else {
              res.json({
                message: "Error updating",
                Error: err.message,
              });
            }
          }
        );
      } else {
        res.json("userId be null or undefined");
      }
        }
    else{
      userModel.findByIdAndUpdate(
        userId,
        {
          gender: req.body.gender,
          dateOfBirth: req.body.dateOfBirth,
          profession: req.body.profession,
          fcmToken: req.body.fcmToken,
          userName: req.body.userName,
          userEmailAddress: req.body.userEmailAddress,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          signupType: req.body.signupType,
          $set: {
            "location.coordinates": [req.body.long, req.body.lat],
          },
        },
        {
          new: true,
        },
        function (err, result) {
          if (!err) {
            if (result !== null && typeof result !== "undefined") {
              res.json({
                message: "Updated successfully",
                updatedResult: result,
              });
            } else {
              res.json({
                message:
                  "couldn't update , Record with this userId  may be not found",
              });
            }
          } else {
            res.json({
              message: "Error updating",
              Error: err.message,
            });
          }
        }
      );
    }
    
}catch(err)
{console.log(err)}

 
};

exports.postEnterNumber = (req, res) => {

  const phoneNumber = req.body.phoneNumber;

  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

  var obj = {};

  userModel.findOne({ phoneNumber: phoneNumber }, async (err, data) => {
    console.log(data)
    if (!data) {
      obj.status = "user with this phone Number not exist";
      res.json(obj);
    } else {
      const result = await userPhoneOTPVerificationModel.findOne({
        phoneNumber: phoneNumber,
      });
      if (!result) {
        const newOtp = new userPhoneOTPVerificationModel({
          _id: mongoose.Types.ObjectId(),
          phoneNumber: phoneNumber,
          otp: otp,
        });
        newOtp.save();
      } else {
        userPhoneOTPVerificationModel.findOneAndUpdate(
          { phoneNumber: phoneNumber },
          { otp: otp },
          { new: true },
          function (err, result) {
            if (result) {
              console.log("otp saved , updated previous record");
            } else if (err) {
              console.log(err);
            }
          }
        );
      }
    }

    client.messages
      .create({
        body: "your lovibear verification code is " + otp,
        to: phoneNumber,
        from: process.env.phoneNumber,
      })
      .then((message) => {
        res.json(message);
      })
      // here you can implement your fallback code
      .catch((error) => {
        res.json(error);
      });
  });
};

exports.verifyOTP = (req, res) => {
  const { userEnteredOtp, phoneNumber } = req.body;

  userPhoneOTPVerificationModel.findOne(
    { phoneNumber: phoneNumber, otp: userEnteredOtp },
    (err, foundResult) => {
      if (foundResult) {
        console.log("record found for password updation");
        console.log(foundResult);
        res.json({
          message: "user found , OTP successfully matched",
          status: true,
          data: foundResult,
        });
      } else {
        res.json({
          message:
            "no such record found with the following OTP =" + userEnteredOtp,
          status: false,
        });
      }
    }
  );
};

exports.getUsersWithinRadius = async (req, res) => {
  const long = req.body.long;
  const lat = req.body.lat;
  const radiusInKm = req.body.radiusInKm;
  const page = req.query.page - 1;
  const limit = req.query.limit;
  const byPosts = req.query.byPosts;
  const gender = req.query.gender;
  console.log(byPosts)
  const min_age=req.query.min_age;
  const max_age=req.query.max_age;

  // var query = {'location' : {$geoWithin: { $centerSphere:  [getUserLocation(long,lat), kmToRadian(radiusInKm)]}}}


  const aggregate = [];

  if(long,lat,radiusInKm) {
    aggregate.push(
      {
    $geoNear: {
       near: { type: "Point", coordinates: [ long , lat ] },
       distanceField: "dist.distance_km",
        maxDistance:radiusInKm*1000 ,
        includeLocs: "dist.location",
        spherical: true
    }
  },
  { $skip: page * parseInt(limit)},
  { $limit: parseInt(limit)}
  )
  }

  
  if (Boolean(byPosts)===true){
    aggregate.push(
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          pipeline: [
            {
              $project: {
                _id: 0,
              },
            },
          ],
          as: "posts",
        },
      },
      {
        $set: {
          postCount: { $size: "$posts" },
        },
      },
      {
        $unset: "posts",
      },
      {
        $sort: { postCount: -1 },
      }
    );
  }

  if (gender) {
    aggregate.push({
      $match: {
        gender: gender,
      },
    });
  }

  if (min_age && !max_age) {

    aggregate.push({
        $set: {
          age: { $subtract: [new Date(), "$dateOfBirth"]}
          },
      },
      {
        $project: {
          date: "$dateOfBirth",
          Age: {
            $divide: [
              "$age",
              365 * 24 * 60 * 60 * 1000,
            ],
          },
          document: "$$ROOT"
        },
      },
      {
        $match:{
          Age:{
            $gte:parseInt(min_age)
          }
        }
      }
      );
  }
  else if (max_age && !min_age) {
    aggregate.push({
        $set: {
          age: { $subtract: [new Date(), "$dateOfBirth"]}
          },
      },
      {
        $project: {
          date: "$dateOfBirth",
          Age: {
            $divide: [
              "$age",
              365 * 24 * 60 * 60 * 1000,
            ],
          },
          document: "$$ROOT"
        },
      },
      {
        $match:{
          Age:{
            $lte:parseInt(max_age)
          }
        }
      }
      );
  }
  else if(max_age && min_age){
    aggregate.push({
      $set: {
        age: { $subtract: [new Date(), "$dateOfBirth"]}
        },
    },
    {
      $project: {
        date: "$dateOfBirth",
        Age: {
          $divide: [
            "$age",
            365 * 24 * 60 * 60 * 1000,
          ],
        },
        document: "$$ROOT"
      },
    },
    {
      $match:{
        Age:{
          $lte:parseInt(max_age) , $gte:parseInt(min_age),
        }
      }
    }
    );

  }

  console.log(aggregate)
  const result = await userModel.aggregate(aggregate);

  // const result= await userModel.find(query);
  if (result.length > 0) {
    res.status(200).json({
      message: "Users fetched with the passed query",
      users: result,
    });
  } else {
    res.status(404).json({
      message: "No user found with this query",
      users: result,
    });
  }
};

// let kmToRadian = function (miles) {
//   var earthRadiusInMiles = 6378;
//   return miles / earthRadiusInMiles;
// };

// const result= await userModel.aggregate([
//   {
//     $geoNear: {
//        near: { type: "Point", coordinates: [ long , lat ] },
//        distanceField: "dist.distance_km",
//         maxDistance:radiusInKm*1000 ,
//         includeLocs: "dist.location",
//         spherical: true
//     }
//   },
//   { $skip: page * 2},
//   { $limit: parseInt}

// ])

exports.updateLocation =async  (req,res)=>{
  
  const userId= req.body.userId; 
  const long=req.body.long;
  const lat= req.body.lat;

  try{
     userModel.findOneAndUpdate({_id:userId}
      ,
      {
        $set: {
          "location.coordinates": [req.body.long, req.body.lat],
        },
      },
      {
        new:true,
      },
      function(err,result){
        if(result){
          res.json({
            message:"location has updated successfully",
            result: result,
            statusCode:201

          })
        }
        else{
          res.json({
            message:"location could not be updated , May be this user Id not exist",
            statusCode:404
          })
        }
      }
      )
 
}
catch(error){
  res.json({
    message:"Error occurred while updating location",
    Error:error,
    errorMessage:error.message
    
  })
}
}

exports.getUserByName = async (req,res)=>{
  const name = req.query.name;
  const radiusInKm= req.query.radiusInKm
  const long= req.body.long;
  const lat= req.body.lat;

  


  
  try{


    const result = await userModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [ long, lat ] },
          distanceField: "dist.distance_km",
           maxDistance:radiusInKm*1000 ,
           includeLocs: "dist.location",
           spherical: true
       }
      },
      {
        $match: {
          userName: { $regex: name, $options: "i" }
        },
      },
     
    ])

    res.json(result)
  //   const result = await  userModel.find( { userName: { $regex: name, $options: "i" } })
  //   if(result){
  //     res.json({
  //       message: "Result fetched",
  //       result: result,
  //       statusCode: 200
  //     })
  //   }
  //   else{
  //     res.json({
  //       message:"Result is null",
  //     })
  //   }
  }
  catch(err){
    res.json({
      message:"Error occurred while fetching result",
      statusCode:404,
      Error:err.message
    })
  }
 

}

