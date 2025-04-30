const express = require("express");
const router = express.Router();
const questionController = require("../controller/QuestionController")

router.get("/getTopics", questionController.getTopics);

module.exports = router;