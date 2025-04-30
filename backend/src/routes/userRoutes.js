const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");

router.get("/", (req, res)=>{
    res.send("hello welcome to users page");
})

router.post("/register", userController.createUser);

router.post("/login", userController.verifyUser);

module.exports = router