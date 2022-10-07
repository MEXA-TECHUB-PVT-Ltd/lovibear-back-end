const mongoose = require('mongoose');
const userLogsModels = require('../models/userLogsModels');
const userLogs = require("../models/userLogsModels")


exports.createUserLog=(req,res)=>{
    const ip=req.body.ip
    const user_id = req.body.user_id
    const country = req.body.country
    const logType=req.body.logType

    const userLog =  new userLogsModels({
        _id:mongoose.Types.ObjectId(),
        ip:ip,
        country:country,
        user_id:user_id,
        logType: logType,
    })
    userLog.save(function(err,result){
        try{
            if(result){
                res.json({
                    message:"user log created",
                    result:result,
                    statusCode:201
                })
            }
            else{
                res.json({
                    message:"could not created"
                })
            }
        }
        catch(err){
            res.json({
                message:"Error occurred while creating user log"
            })
        }
    })

}


exports.getAllLogs = (req,res)=>{
    
    userLogs.find({} , function (err ,result){
        try{
            if(result){
                res.json({
                    message : "All users logs fetched",
                    statusCode:200,
                    result:result
                })
            }
            else{
                res.json({
                    message: "No records fetched , result is null due to some reason",
                    statusCode:500
                })
            }
        }
        catch(error){
            res.json({
                message:"Error occurred while fetching records",
                Error: error,
                errorMessage:error.message

            })
        }
    })

}

exports. getUserLogsByUserId = (req,res)=>{
    const userId = req.params.userId;

    userLogsModels.find({user_id : userId}  , function(err,result){
        try{
            if(result){
                res.json({
                    message : "All user logs fetched",
                    statusCode:200,
                    result:result
                })
            }
            else{
                res.json({
                    message: "No records fetched , result with this id may be  null due to some reason",
                    statusCode:500
                })
            }
        }
        catch(error){
            res.json({
                message:"Error occurred while fetching records",
                Error: error,
                errorMessage:error.message

            })
        }
    })

}

exports.deleteUserLog = (req,res)=>{
    const userId = req.body.userId;

    userLogsModels.deleteOne({
        userId:userId,
    } 
    , function(err,result){
        try{
            if(result.deletedCount >0){
                res.json({
                    message: "deleted successfully",
                    result: result,
                    statusCode:200
                })
            }
            else{
                res.json({
                    message: "Record could not be deleted , result with this id may not exist",
                    result: result,
                    statusCode:404

                })
            }
        }
        catch(err){
            res.json({
                message:"Error occurred while deleting record",
                Error:err,
                errorMessage:err.message
            })
        }
    }
    
    )
}

exports.updateUserLogs = (req,res)=>{

    const userLogId = req.body.userLogId; 
    
    userLogsModels.findOneAndUpdate({_id:userLogId}
        ,
        {
            ip:req.body.ip,
            country:req.body.country,
            user_id:req.body.userId,

        } ,
        {
            new:true,
        },
        function(err,result){
            try{
                if(result){
                    res.json({
                        message:"successfully updated ",
                        result:result,
                        statusCode:201

                    })
                }
                else{
                    res.json({
                        message:"not updated successfully , record with this id may not exist",
                        result:result,
                        statusCode:200 
                    })
                }
            }
            catch(err){
                res.json({
                    message:"Error occurred while updating record",
                    Error : err,
                    errorMessages:err.message
                })
            }
        }
        )
}