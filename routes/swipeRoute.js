
const router = require("express").Router();
const controller = require("../controllers/swipeController");

router.put("/rightSwipeUser" ,controller.rightSwipeUser);
router.get("/getUserRightSwipes/:userId" ,controller.getUserRightSwipes);
router.get("/getUserLeftSwipes/:userId" ,controller.getUserLeftSwipes);
router.put("/leftSwipeUser" ,controller.leftSwipeUser);
router.delete("/deleteUserSwipe/:userId" ,controller.deleteUserSwipe);
router.delete("/deleteUserSwipe/:userId" ,controller.deleteUserSwipe);
router.get("/match/:user1/:user2" ,controller.getMatch);
router.delete("/deleteSwipeByUsers_id" ,controller.deleteUserSwipeByUsers_id);

// router.get("/getPostsOfUser/:userId" ,controller.getPostsOfUser);
// router.delete("/deletePost/:postId" ,controller.deletePost);
// router.put("/updatePost/" ,controller.updatePost);


module.exports = router;