

const express = require("express"),
router=express.Router();

const controller = require("../controllers/userLogsControllers")

// router.post ("/createNotification",controller.createHospitalType);
router.get ("/getAllUserLogs" , controller.getAllLogs);
router.delete("/deleteUserLog/:userLogId" , controller.deleteUserLog);
router.post("/createUserLog" ,controller.createUserLog);
router.get("/getUserLogsByUserId/:userId" , controller.getUserLogsByUserId);
router.put("/updateUserLog" , controller.updateUserLogs)

// router.delete("/deleteHospitalType/:hospitalTypeId", controller.deleteHospitalType);
// router.put ("/updateHospitalType" , controller.updateHospitalType);

module.exports = router;