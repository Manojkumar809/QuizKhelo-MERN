const Quiz = require("../model/quiz");
const questionController = require("../controller/QuestionController");
const Question = require("../model/question");

// Method to create quiz from the request.
// quiz/create
const createQuiz = async(req, res)=>{
    try {
        const{ title, topic, username, questionsCount } = req.body;
        // Prepare the query parameters to pass to getQuizQuestions
        const query = {
            query: {
            topic: topic,
            count: questionsCount
            }
        };
        // Need to change the getQuizQuestions method .
        const quizQuestions = await questionController.getQuizQuestions(query);
        let questionIds = quizQuestions.map((it)=>it.questionId);
        const newQuiz = new Quiz({
            title: title,
            topic: topic,
            username: username,
            questionsCount: parseInt(questionsCount),
            score: 0,
            questionsIds: questionIds
        });
        const createdQuiz = await newQuiz.save();
        const createdQuizId = createdQuiz.quizId;
        return res.status(201).json(createdQuizId);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", error:error.message});
    }
};

// Method for getting the quiz question wrappers.
const getQuiz = async(req, res)=>{
    try {
        const quizId = req.query.quizId;
        const quiz = await Quiz.findOne({ quizId: quizId });
        if(!quiz){
            return res.status(400).json("No Quiz Found with the mentioned quiz id.");
        }
        const questionIds = await quiz.questionsIds;
        const questions = await questionController.getQuestionsFromIds(questionIds);
        return res.status(200).json(questions);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", error:error.message});
    }
}

// Method to calculate the score based on quiz response.
// quiz/score
const calculateScore = async(req, res)=>{
    try {
        const quizResponses = req.body;
        const quizId = req.query.quizId;
        const score = await questionController.getScore(quizResponses);
        if(typeof(score) == "number"){
            const currQuiz = await Quiz.updateOne(
                { quizId: quizId },{ $set: { score: score } } );
            return res.status(200).json(score);
        }else {
            return res.status(400).json(score);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", error:error.message});
    }
}

// Method to get the user performance based on previous quizzes.
const calculatePerformance = async(req, res)=>{
    try {
        const username = req.headers.username;
        const quizzes = await Quiz.find({username:username}, 
                {_id:0, topic:1, questionsCount:1, score:1});
        const quizzesCount = quizzes.length;
        if (quizzesCount === 0) {
            return res.status(200).json({ quizzes, averageScore: 0, quizzesCount: 0});
        }
        let percentageSum = 0;
        for (const quiz of quizzes) {
            percentageSum += (quiz.score/ quiz.questionsCount) * 100;
        }
        const averageScore = (percentageSum/quizzesCount);
        return res.status(200).json({quizzes, averageScore, quizzesCount});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", error:error.message});
    }
}

module.exports = { createQuiz, getQuiz, calculateScore, calculatePerformance };