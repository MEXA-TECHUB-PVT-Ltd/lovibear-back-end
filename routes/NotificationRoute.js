

const express = require("express"),
router=express.Router();

const controller = require("../controllers/NotificationController")

// router.post ("/createNotification",controller.createHospitalType);
router.get ("/getNotificationsByType" , controller.getNotificationsByType);
router.delete("/deleteNotification/:notificationId" , controller.deleteNotification);
router.post("/createNotification" ,controller.createNotification);
// router.delete("/deleteHospitalType/:hospitalTypeId", controller.deleteHospitalType);
// router.put ("/updateHospitalType" , controller.updateHospitalType);

module.exports = router;