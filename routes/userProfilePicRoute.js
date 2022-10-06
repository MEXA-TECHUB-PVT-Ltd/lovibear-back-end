const express = require("express")
router=express.Router(),
controller = require("../controllers/userProfilePicBackupController")
const upload = require("../middlewares/userProfilePicMulter")

router.get("/getAllUsersProfilePics" , controller.getAllUserPics)
router.get("/getSpecificUserProfilePicByUserId/:userId", controller.getProfilePicOfUser)
router.post("/saveUserProfilePic" , upload.single("profilePic") , controller.postProfilePic)
router.delete("/deleteUserProfilePicById/:userProfilePicBackupId", controller.deleteProfilePic)
router.put("/updateUserProfilePicBackup", upload.single("profilePic"),controller.updateProfilePicBackup)
module.exports=router


