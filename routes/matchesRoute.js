
const router = require("express").Router();
const controller = require("../controllers/matchesController");


router.get("/getAllMatches" ,controller.getAllMatches);
router.put("/storeMatches",controller.storeMatches)
router.get("/findMatch/:user1/:user2",controller.findMatches);
router.delete("/deleteMatch/:matchId" ,controller.deleteMatch);
router.get("/getUserMatches/:userId" ,controller.getUserMatches);
// router.put("/updatePost/" ,controller.updatePost);


module.exports = router;