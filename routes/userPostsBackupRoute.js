
const router = require("express").Router();
const controller = require("../controllers/userPostsBackupController");
const upload= require("../middlewares/postBackupMulter")

router.post("/createPost" , upload.array("postImages"),controller.createPost);
router.get("/getAllPosts" ,controller.getAllPosts);
router.get("/getPostsOfUser/:userId" ,controller.getPostsOfUser);
router.delete("/deletePost/:postId" ,controller.deletePost);
router.put("/updatePost/", upload.array("postImages") , controller.updatePost);


module.exports = router;