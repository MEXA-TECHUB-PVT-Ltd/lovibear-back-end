
const NotificationModel= require("../models/NotificationsModel")
const mongoose  = require("mongoose");
const userModel = require("../models/userModel");




exports.getNotificationsByType = (req,res) =>{
    const type= req.body.type;
    const userId= req.body.userId;
    NotificationModel.find({receiverType:type , receiverId:userId},(function(err,result){
        try{
            res.json({
                message: "All fetched "+ type + " are :",
                data: result
            })
        }
        catch(err){
            res.json({
                message: "Error in fetched "+ type ,
                Error: err.message,
                error: err
            })
        }
    })
    )}

    exports.deleteNotification = (req,res)=>{
        const notificationId= req.params.notificationId

        NotificationModel.deleteOne({_id:notificationId}, function(err,result){
            if(err){
                res.json(err)
            }else{
                res.json({
                    message:"Deleted successfully",
                    result:result
                })
            }
        })
    }

    exports.createNotification = async (req,res)=>{
     
        const senderId = req.body.senderId;
        const receiverId = req.body.receiverId;
        const body = req.body.body
        const name = req.body.name
        const image = req.body.image;
        const senderType = req.body.senderType;
        const receiverType = req.body.receiverType;

        

        if(senderId!==null && senderType=="user"){
            const userResult= await userModel.findOne({_id:senderId})
            if(userResult){
                console.log("user found")
                console.log(userResult)
            }
            var userName = userResult.userName;
            var profileImage = userResult.profileImage;
        }
        

        const newNotification = new NotificationModel({
            _id: mongoose.Types.ObjectId(),
            senderId: senderId,
            receiverId: receiverId,
            senderType: senderType,
            receiverType: receiverType,
            name:userName,
            body: body,
            image:profileImage.userPicUrl,
          });

          newNotification.save(function (err, result) {
            if(!err){
                res.json({
                    message:"notification Saved successfully",
                    data:result

                })
            }
            else{
                res.json({
                    message:"notification Failed to save",
                    Error:err.message
                })
            }
          })
    }

// exports.getDepartmentsByHospitalId = (req,res) =>{
//     departmentModel.find({hospitalId:req.params.hospitalId}).populate("hospitalId").exec(function(err,result){
//         try{
//             res.json({
//                 message: "All Departments Related to This hospital ID are",
//                 data: result
//             })
//         }
//         catch(err){
//             res.json({
//                 message: "Error in fetching Departments Related to This hospital ID",
//                 Error: err.message,
//                 error: err
//             })
//         }
//     })
// }


// exports.createDepartment= (req,res) => {

//     const hospitalId = req.body.hospitalId;
//     const departmentName = req.body.departmentName;
//     const startingTime = req.body.startingTime;
//     const closingTime = req.body.closingTime;
//     const departmentDetail = req.body.departmentDetail;
//     const departmentPics = req.body.departmentPics;

//     if(hospitalId!== null && typeof hospitalId !== "undefined"){
//         const newDepartment= new departmentModel({
//             _id:mongoose.Types.ObjectId(),
//             hospitalId:hospitalId,
//             departmentName:departmentName,
//             startingTime:startingTime,
//             closingTime:closingTime,
//             departmentDetail: departmentDetail,
//             departmentPics:departmentPics
    
//         })

//         newDepartment.save(function(err, result){
//             try{
//                 res.json({
//                     message:"Department successfully saved",
//                     data: result,
//                 })
//             }
//             catch(err){
//                 res.json({
//                     message:"Error in saving Department",
//                     Error: err.message,
//                     error: err
//                 })
//             }
//         })
//     }
//     else{
//         res.json({
//             message: "hospitalTypeId may be null or undefined",
//         })
//     }

    
// }

// exports.deleteDepartment= ( req,res) =>{

//     const departmentId = req.params.departmentId ;
    
//     if(departmentId !==null && typeof departmentId !=="undefined"){
//     departmentModel.deleteOne({_id:departmentId} , function(err , result){
//        try{
//         if(result){
//             if(result.deletedCount > 0){
//                 res.json({
//                     message:"Department Deleted",
//                     Result: result
//                 })
//             }else{
//                 res.json({
//                     message:"NO Department Deleted , department with this departmentId may not exist",
//                     Result: result
//                 })
//             }
//         }
//        }
//        catch(err){
//         res.json({
//             message:"Error in deleting department",
//             Error: err.message
//         })
//        }
//     })
// }
//     else{
//     res.json("departmentId may be null or undefined")
//    }
// }


// exports.updateDepartment = (req,res)=>{

//     const departmentId = req.body.departmentId;
//     const hospitalId = req.body.hospitalId;
//     const departmentName = req.body.departmentName;
//     const startingTime = req.body.startingTime;
//     const closingTime = req.body.closingTime;
//     const departmentDetail = req.body.departmentDetail;
//     const departmentPics = req.body.departmentPics;

//     if(departmentId !==null && typeof departmentId !=="undefined"){
        
//         departmentModel.findOneAndUpdate ({_id: departmentId}, 
//             {
//                 hospitalId:hospitalId,
//                 departmentName:departmentName,
//                 startingTime:startingTime,
//                 closingTime:closingTime,
//                 departmentDetail: departmentDetail,
//                 departmentPics:departmentPics
//             },
//             {
//                 new: true,
//             }, function(err, result) {
//                 res.json({
//                     message: "Updated successfully",
//                     updatedResult: result
//                 })
//             })
//     }
//         else{
//         res.json("departmentId may be null or undefined")
//        }
// }
