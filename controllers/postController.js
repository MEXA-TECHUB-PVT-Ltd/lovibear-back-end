const mongoose=require("mongoose")
const postModel = require("../models/postModel")
const cloudinary = require("../utils/cloudinary")

exports.createPost= async(req,res)=>{
    
    const postImages=req.body.postImages;
    const userId=req.body.userId;

    var pathsArray = [];
    
    for (const file of req.files){
        const {path}= file
        const c_result = await cloudinary.uploader.upload(path)
         pathsArray.push({
           image_url: c_result.secure_url,
            public_id:c_result.public_id
         })

    }
    console.log(pathsArray)

        const post= new postModel({
            _id: mongoose.Types.ObjectId(),
            postImages: pathsArray,
            userId:userId
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

exports.deletePost =async (req,res)=>{
    const postId = req.params.postId;

    try{
        const result= await postModel.findOne({_id:postId});
     if(result){
        let imagesArray = result.postImages;
        imagesArray.forEach(element => {
            cloudinary.uploader.destroy(element.public_id)
        });
   }
   else{
    console.log("post with this id not found")
   }
    }
    catch(err){
        console.log(err)
    }

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

exports.updatePost = async (req,res)=>{
    const postId = req.body.postId;
    
    if(req.files){
        try{
        const result= await postModel.findOne({_id:postId});
         if(result){
            let imagesArray = result.postImages;
            imagesArray.forEach(element => {
                cloudinary.uploader.destroy(element.public_id)
            });
       }
       else{
        console.log("post with this id not found")
       }
        }
        catch(err){
            console.log(err)
        }
       
    }
    

    var pathsArray = [];
    for (const file of req.files){
        const {path}= file
        const c_result = await cloudinary.uploader.upload(path)
         pathsArray.push({
           image_url: c_result.secure_url,
            public_id:c_result.public_id
         })

    }
    console.log(pathsArray)


    postModel.findOneAndUpdate({_id:postId} ,{postImages:pathsArray},{new:true}, function(err,result){
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