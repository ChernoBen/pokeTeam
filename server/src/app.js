const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const TeamController = require("./controllers/TeamController");
const PokeToolController = require("./controllers/Populate");
router.use((req,res,next)=>{
    next();
});

router.post("/user",UserController.create);
router.post("/auth",UserController.auth);
//team
router.post("/team",TeamController.create);
router.put("/team",TeamController.update);
//populate script
router.get("/populate",PokeToolController.populate);

module.exports = router;
