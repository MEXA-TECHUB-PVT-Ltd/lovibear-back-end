const mongoose=require("mongoose")
const swipeModel = require("../models/swipesModel")
const matchesModel= require("../models/matchesModel");
const swipesModel = require("../models/swipesModel");
const { ExportCustomJobInstance } = require("twilio/lib/rest/bulkexports/v1/export/exportCustomJob");


exports.rightSwipeUser=async (req,res)=>{
    
    const swipedBy = req.body.swipedBy;
    const swipedUser = req.body.swipedUser;

    const response= {}

      const matchResult= await checkMatch(swipedBy,swipedUser);
      console.log(matchResult);
      if(matchResult==true){
        console.log("match found");
        response.matchFound = true;
      }

      swipeModel.findOneAndUpdate({swipedBy:swipedBy , swipedUser:swipedUser} ,
        {
             swipedBy:swipedBy,
             swipedUser:swipedUser,
             swipedStatus:"right",
        },
        {
            upsert:true,
            new:true
        },
        function(err,result){
            if(!err){
                if(result){
                    response.result = result;
                    res.status(200).json({
                        message:"user has successfully right swiped",
                        result:response
                    })
                }
                else{
                    res.status(404).json("result is empty")
                }
            }
            else{
                res.status(404).json(err.message)
            }
        })

        

    
}

exports.getUserRightSwipes= (req,res)=>{
    const userId = req.params.userId;

    swipeModel.find({swipedBy:userId, swipedStatus:"right"}).populate("swipedBy").populate("swipedUser").exec(function(err,result){
        try{
            if(result){
                res.status(200).json({
                    message:"All right swipes of a user is:",
                    result:result
                })
            }
            else{
                res.json({
                    message:"could not find result with this user id"
                })
            }
           
        }
        catch(err){
                res.json({
                    Error:err.message
                })
        }
    })
    

}


exports.getUserLeftSwipes= (req,res)=>{
    const userId = req.params.userId;

    swipeModel.find({swipedBy:userId, swipedStatus:"left"}).populate("swipedBy").populate("swipedUser").exec(function(err,result){
        try{
            if(result){
                res.status(200).json({
                    message:"All left swipes of a user is:",
                    result:result
                })
            }
            else{
                res.json({
                    message:"could not find result with this user id"
                })
            }
           
        }
        catch(err){
                res.json({
                    Error:err.message
                })
        }
    })
}

exports.leftSwipeUser=async (req,res)=>{
    
    const swipedBy = req.body.swipedBy;
    const swipedUser = req.body.swipedUser;


    //  const result= await checkMatch(swipedBy,swipedUser)
    //  if(result==true){
    //     console.log("match found");
    //  }
    //  else{
    //     console.log("match still not found");
    //  }


      swipeModel.findOneAndUpdate({swipedBy:swipedBy , swipedUser:swipedUser} ,
        {
             swipedBy:swipedBy,
             swipedUser:swipedUser,
             swipedStatus:"left",
        },
        {
            upsert:true,
            new:true
        },
        function(err,result){
            if(!err){
                if(result){
                    res.status(200).json({
                        message:"user has successfully left swiped",
                        data:result
                    })
                }
                else{
                    res.status(400).json("result is empty")
                }
            }
        })   
}


exports.deleteUserSwipe= (req,res)=>{

    const swipeId= req.params.swipeId;

    swipeModel.deleteOne({swipeId}, function(err,result){
        try{
            console.log(result);
            if(result){
                if(result.deletedCount>0){
                    res.status(200).json({
                        message:"user Swipe deleted , change has been undone",
                        data:result
                    })
                }
                else{
                    res.status(400).json({
                        message:"nothing to delete, swipe with this swipe Id may not exist",
                        data:result
                    })
                }
            }
            else{
                res.json({
                    message:"Result not found"
                })
            }
        }catch(err){
            res.status(404).send({
                message:"Error occurred while deleting user Swipe"
            })
        }
      
    }

    )
}

exports.deleteUserSwipeByUsers_id = async (req,res)=>{

    const swipedBy = req.query.swipedBy;
    const swipedUser = req.query.swipedUser;



    swipesModel.deleteOne({swipedBy:swipedBy, swipedUser:swipedUser} , async function(err,result){
          try{
            console.log(result)
            if(result){

                const matchFind = await matchesModel.findOneAndDelete({users:{ $all: [ swipedBy , swipedUser ] }})
                if(matchFind){
                    console.log("match deleted between these users")
                }
                
                res.json({
                    message:"deleted successfully",
                    result:result,
                    statusCode:200
                })
            }
            else{
                res.json({message: "could not delete swipe "})
            }
          }
          catch(err){
            res.json({
                message: "Error occurred while deleting swipe",
                Error:err,
                errorMessage:err.message
            })
          }
    })
}


exports.getMatch= async (req,res)=>{

    const user1= req.params.user1;
    const user2= req.params.user2;

    const result1= await swipeModel.findOne({swipedBy:user1, swipedUser:user2 , swipedStatus:"right"});
    const result2 = await swipeModel.findOne({swipedBy:user2, swipedUser:user1 , swipedStatus:"right"});

    console.log(result1)
    console.log(result2);

    if(result1 && result2){
        res.status(200).json({
            message:"Match found between users",
            matchStatus:true,
        })
    }
    else{
        res.status(404).json({
            message:"Match does not found between users",
            matchStatus:false,
        })
    }
}


// exports.getAllPosts=(req,res)=>{
    
//     postModel.find({}, function(err,foundResult){
//             try{
//                 if(foundResult){
//                     res.json({
//                         message:"All posts of Users found",
//                         result:foundResult
//                     })
//                 }
//                 else{
//                     res.json({
//                         message:"No any Posts found",
//                         result:foundResult
//                     })
//                 }
//             }
//             catch(err){
//                 res.json({
//                     message:"Error In founding posts",
//                     Error:err.message,
//                 })
//             }
//     })

// }

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

// exports.deletePost = (req,res)=>{
//     const postId = req.params.postId;

//     postModel.deleteOne({_id:postId} , function(err,result){
//         try{
//             if(result){
//                 if(result.deletedCount >0){
//                     res.status(200).send({
//                         message:"post has been deleted",
//                         data:result
//                     })
//                 }else{
//                     res.json({
//                         message:"Nothing to delete . Or post with this id may not exist",
//                         data:result
//                     })
//                 }
//             }else{
//                 res.json({
//                     message:"Result is empty",
//                 })
//             }
//         }
//         catch(err){
//             res.status(404).json({
//                 message:"Error in deleting",
//                 Error: err.message
//             })
//         }
//     })
// }

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

async function checkMatch (swipedBy , swipedUser){
    
    const result= await swipeModel.findOne({swipedBy:swipedUser , swipedUser:swipedBy , matchStatus:"right"})
    console.log(result);
    if(result){
        
        // to do : send notification here to the user who get right swiped 

        matchesModel.findOneAndUpdate({users:[swipedBy,swipedUser]},
            {
                 matchStatus:true,
            },
            {
                upsert:true,
                new:true
            },
            function(err,result){
                if(!err){
                    if(result){
                      console.log("matches has been stored")
                    }
                    else{
                        console.log("matches has not been stored")
                    }
                }
            })   
            return true;

    }
    else {
        return false
    }
   
}