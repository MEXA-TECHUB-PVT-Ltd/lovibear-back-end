const mongoose=require("mongoose")
const profilePicModel = require("../models/userProfilePicBackup")

exports.postProfilePic=(req,res)=>{
    
    
    const userId=req.body.userId;

    if(req.file ){
        const profilePic= new profilePicModel({
            _id: mongoose.Types.ObjectId(),
            profilePic:{
                data:req.file.path,
                contentType: "imag.png"
            },
            userId:userId
        })

        profilePic.save((err,result)=>{
            try{
                if(result){
                    res.json({
                        message:"user Profile has been saved",
                        Data:result
                    })
                }
                else
                {
                    res.json("result is empty")
                }
            }catch(err)
            {
                res.json({
                    message:"error saving profile pic",
                    Error:err.message,
                })
            }
            
        })
    }
    else
    {
        res.json({
            message:"please provide profile image in body"
        })
    }
    
}

exports.getAllUserPics=(req,res)=>{
    
    profilePicModel.find({}, function(err,foundResult){
            try{
                if(foundResult){
                    res.json({
                        message:"All profile Pics of Users found",
                        result:foundResult
                    })
                }
                else{
                    res.json({
                        message:"No any ProfilePic  found",
                        result:foundResult
                    })
                }
            }
            catch(err){
                res.json({
                    message:"Error In founding users with profie Pics",
                    Error:err.message,
                })
            }
    })

}

exports.getProfilePicOfUser = (req,res)=>{
    const userId= req.params.userId;
    profilePicModel.find({userId:userId} , function(err , result){
           try{
            if (result){
                 res.json({
                    message:"profilePic of this User fetched",
                    result:result
                 })   
            }
            else{
                res.json({
                    message:"profilePic not found for this user",
                    result:result
                })
            }
           }
           catch(err){
            res.json({
                message:"Error in getting profilePic for this User",
                Error:err.message
            })
           }

        })
}

exports.deleteProfilePic = (req,res)=>{
    const userProfilePicBackupId = req.params.userProfilePicBackupId;

    profilePicModel.deleteOne({_id:userProfilePicBackupId} , function(err,result){
        try{
            if(result){
                if(result.deletedCount >0){
                    res.status(200).send({
                        message:"profilePic backup has been deleted",
                        data:result
                    })
                }else{
                    res.json({
                        message:"Nothing to delete . Or profilePic backup with this id may not exist",
                        data:result
                    })
                }
            }else{
                res.json({
                    message:"Result is empty",
                })
            }
        }
        catch(err){
            res.status(404).json({
                message:"Error in deleting",
                Error: err.message
            })
        }
    })
}

exports.updateProfilePicBackup = (req,res)=>{
    const userProfilePicBackupId = req.body.userProfilePicBackupId;

   if(req.file){
    profilePicModel.findOneAndUpdate({_id:userProfilePicBackupId} ,
        {
            profilePic:{
            data:req.file.path,
            contentType: "imag.png"
    },
     },{new:true},
      function(err,result){
        try{
                if(result){
                    res.status(200).send({
                        message:"Updated Successfully",
                        updatedResult:result
                    })
                }else{
                    res.json({
                        message:"Nothing updated , profilePicBackup with this Id may not exist",
                        data:result
                    })
                }
            
        }
        catch(err){
            res.status(404).json({
                message:"Error in updating",
                Error: err.message
            })
        }
    })
   }    
    
}