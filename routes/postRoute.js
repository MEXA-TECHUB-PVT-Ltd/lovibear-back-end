
const router = require("express").Router();
const controller = require("../controllers/postController");

router.post("/createPost" ,controller.createPost);
router.get("/getAllPosts" ,controller.getAllPosts);
router.get("/getPostsOfUser/:userId" ,controller.getPostsOfUser);
router.delete("/deletePost/:postId" ,controller.deletePost);
router.put("/updatePost/" ,controller.updatePost);


module.exports = router;