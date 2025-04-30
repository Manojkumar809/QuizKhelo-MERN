const express = require("express");
const router = express.Router();
const quizController = require("../controller/QuizController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, quizController.createQuiz);

router.get("/getQuiz", authMiddleware, quizController.getQuiz);

router.post("/score", authMiddleware, quizController.calculateScore);

router.get("/performance", authMiddleware, quizController.calculatePerformance);

module.exports = router