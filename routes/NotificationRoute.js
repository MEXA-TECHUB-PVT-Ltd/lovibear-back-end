

const express = require("express"),
router=express.Router();

const controller = require("../controllers/NotificationController")

router.get("/getAllNotifications", controller.getAllNotifications)
router.post("/getNotificationsByType" , controller.getNotificationsByType);
router.delete("/deleteNotification/:notificationId" , controller.deleteNotification);
router.post("/createNotification" ,controller.createNotification);
router.post("/getUserNotificationByReadStatus", controller.getUserNotificationsByReadStatus);
router.put("/changeNotificationReadStatus", controller.changeNotificationStatus);

module.exports = router;