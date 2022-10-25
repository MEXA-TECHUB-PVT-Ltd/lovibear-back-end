const mongoose=require("mongoose")
const postModel = require("../models/userPostsBackupModel")

exports.createPost=(req,res)=>{
    const userId=req.body.userId;
    console.log(req.files)
    var array = []
   
    req.files.forEach(element => {
        array.push(element.path)
    });

    if(req.files){
        const post= new postModel({
            _id: mongoose.Types.ObjectId(),
            userId: userId,
            postImages: array
        })

        post.save((err,result)=>{
            try{
                if(result){
                    res.json({
                        message:"post has been created",
                        postData:result
                    })
                }
                else
                {
                    res.json("Post is empty")
                }
            }catch(err)
            {
                res.json({
                    message:"error creating post",
                    Error:err.message,
                })
            }
            
        })
    }
    else
    {
        res.json({
            message:"Give at least one image to create post"
        })
    }
    
}

exports.getAllPosts=(req,res)=>{
    
    postModel.find({}, function(err,foundResult){
            try{
                if(foundResult){
                    res.json({
                        message:"All posts of Users found",
                        result:foundResult
                    })
                }
                else{
                    res.json({
                        message:"No any Posts found",
                        result:foundResult
                    })
                }
            }
            catch(err){
                res.json({
                    message:"Error In founding posts",
                    Error:err.message,
                })
            }
    })

}

exports.getPostsOfUser = (req,res)=>{
    const userId= req.params.userId;
    postModel.find({userId:userId} , function(err , result){
           try{
            if (result){
                 res.json({
                    message:"All posts of this User fetched",
                    result:result
                 })   
            }
            else{
                res.json({
                    message:"Posts not found for this user",
                    result:result
                })
            }
           }
           catch(err){
            res.json({
                message:"Error in getting posts for this User",
                Error:err.message
            })
           }

        })
}

exports.deletePost = (req,res)=>{
    const postId = req.params.postId;

    postModel.deleteOne({_id:postId} , function(err,result){
        try{
            if(result){
                if(result.deletedCount >0){
                    res.status(200).send({
                        message:"post has been deleted",
                        data:result
                    })
                }else{
                    res.json({
                        message:"Nothing to delete . Or post with this id may not exist",
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

exports.updatePost = (req,res)=>{
    const postId = req.body.postId;

    console.log(req.files)
    var array = []
   
    req.files.forEach(element => {
        array.push(element.path)
    });

    postModel.findOneAndUpdate({_id:postId} ,{ postImages: array},{new:true}, function(err,result){
        try{
                if(result){
                    res.status(200).send({
                        message:"Updated Successfully",
                        updatedResult:result
                    })
                }else{
                    res.json({
                        message:"Nothing updated , post with this Id may not exist",
                        data:result
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