const mongoose=require("mongoose");
const { aggregate } = require("../models/matchesModel");
const matchesModel = require("../models/matchesModel")

// exports.createPost=(req,res)=>{
    
//     const postImages=req.body.postImages;
//     const userId=req.body.userId;

//     if(postImages.length > 0 ){

//         const post= new postModel({
//             _id: mongoose.Types.ObjectId(),
//             postImages: postImages,
//             userId:userId
//         })

//         post.save((err,result)=>{
//             try{
//                 if(result){
//                     res.json({
//                         message:"post has been created",
//                         postData:result
//                     })
//                 }
//                 else
//                 {
//                     res.json("Post is empty")
//                 }
//             }catch(err)
//             {
//                 res.json({
//                     message:"error creating post",
//                     Error:err.message,
//                 })
//             }
            
//         })
//     }
//     else
//     {
//         res.json({
//             message:"Give at least one image to create post"
//         })
//     }
    
// }


exports.storeMatches = (req,res)=>{
    const matchStatus = req.body.matchStatus;
    matchesModel.findOneAndUpdate({users:{$all:[req.body.user1,req.body.user2]}},
        {
             matchStatus:matchStatus,
        },
        {
            upsert:true,
            new:true
        },
        function(err,result){
            if(!err){
                if(result){
                  res.status(200).json({
                    message:"messages has been stored successfully",
                    data:result
                  })
                }
                else{
                    res.status(400).json({
                        message:"messages could not stored",
                        data:result
                      })
                }
            }
        })  
}
exports.getAllMatches=(req,res)=>{
    
    matchesModel.find({}, function(err,foundResult){
            try{
                if(foundResult){
                    res.json({
                        message:"All matches between users",
                        result:foundResult
                    })
                }
                else{
                    res.json({
                        message:"No any match found",
                        result:foundResult
                    })
                }
            }
            catch(err){
                res.json({
                    message:"Error In finding matches",
                    Error:err.message,
                })
            }
    })

}
exports.findMatches = async (req,res)=>{
    try {
        const matches = await matchesModel.findOne({
          users: { $all: [req.params.user1, req.params.user2] },
        });
        res.status(200).json(matches)
      } catch (error) {
        res.status(500).json(error)
      }
}

// exports.getPostsOfUser = (req,res)=>{
//     const userId= req.params.userId;
//     postModel.find({userId:userId} , function(err , result){
//            try{
//             if (result){
//                  res.json({
//                     message:"All posts of this User fetched",
//                     result:result
//                  })   
//             }
//             else{
//                 res.json({
//                     message:"Posts not found for this user",
//                     result:result
//                 })
//             }
//            }
//            catch(err){
//             res.json({
//                 message:"Error in getting posts for this User",
//                 Error:err.message
//             })
//            }

//         })
// }

exports.deleteMatch = (req,res)=>{
    const matchId = req.params.matchId;

     matchesModel.deleteOne({_id:matchId} , function(err,result){
        try{
            if(result){
                if(result.deletedCount >0){
                    res.status(200).send({
                        message:"match has been deleted",
                        data:result
                    })
                }else{
                    res.json({
                        message:"Nothing to delete . Or match with this id may not exist",
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

// exports.updatePost = (req,res)=>{
//     const postId = req.body.postId;
//     const postImages= req.body.postImages;


//     postModel.findOneAndUpdate({_id:postId} ,{postImages:postImages},{new:true}, function(err,result){
//         try{
//                 if(result){
//                     res.status(200).send({
//                         message:"Updated Successfully",
//                         updatedResult:result
//                     })
//                 }else{
//                     res.json({
//                         message:"Nothing updated , post with this Id may not exist",
//                         data:result
//                     })
//                 }
            
//         }
//         catch(err){
//             res.status(404).json({
//                 message:"Error in deleting",
//                 Error: err.message
//             })
//         }
//     })
// }

exports.getUserMatches = async (req,res)=>{

    var ObjectId = require('mongodb').ObjectId
    let userId= req.params.userId;
    userId= new ObjectId(userId);
    const result = await matchesModel.aggregate([
        {
            "$match": {
              $expr: {
                "$in": [
                  userId,
                  {
                    "$ifNull": [
                      "$users",
                      []
                    ]
                  }
                ]
              }
            }
          }
          ,

        { $lookup: {
            from: 'users',
            let: { userId: '$users' },
            pipeline: [
              { $match: { $expr: { $in: ["$_id", "$$userId"] } } }
              // Add additional stages here 
            ],
            as:'userDetails'
        }
    }
    ])

    res.json(result);

    // const result= await matchesModel.find({users:{$in:[userId]}})
    // try{
    //     if(result){
    //         res.json({
    //             message:"All matches of this user is:",
    //             result:result,
    //             statusCode:200
    //         })
    //     }
    //     else{
    //         res.json({
    //             message:"could not find matches , result is null"
    //         })
    //     }
    // }
    // catch(err){
    //     res.json({
    //         message: "error occurred while fetching user matches",
    //         error:err,
    //         errorMessage:err.message
    //     })
    // }
}