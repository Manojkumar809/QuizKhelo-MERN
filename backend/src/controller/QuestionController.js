const Question = require("../model/question");

// Method to get the quiz question based on request query parameters
const getQuizQuestions = async(query)=>{
    try {
        const category = query.query.topic;
        const count = parseInt(query.query.count);
        const quizQuestions = await Question.aggregate([
            {$match: {category:category}},
            {$sample: {size:count}},
            {$project: { questionId: 1 }}
        ]);
        return Array.isArray(quizQuestions)? quizQuestions : [];
    } catch (error) {
        console.log(error);
        return error;
    }
};

// Method to get the questions from given question ids.
const getQuestionsFromIds = async (questionIds) => {
    try {
        let quizQuestionsFromIds = [];
        for (let qid of questionIds) {
            const currQuestion = await Question.findOne({questionId:qid});
            let questionWrapper = {
                questionId:qid,
                difficultyLevel: currQuestion.difficultyLevel,
                questionTitle: currQuestion.questionTitle,
                option1: currQuestion.option1,
                option2: currQuestion.option2,
                option3: currQuestion.option3,
                option4: currQuestion.option4,
                correctAnswer: currQuestion.correctAnswer
            };
            quizQuestionsFromIds.push(questionWrapper);
        }
        return quizQuestionsFromIds;
    } catch (error) {
        console.log(error);
        return error.message;
    }
};

// Method to get all the distinct topics from the db.
// question/getTopics
const getTopics = async (req, res) => {
    try {
        const distinctCategories = await Question.distinct("category");
        return res.status(200).json(distinctCategories);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error:error.message });
    }
};

// Method to calculate the score based on the quiz responses.
const getScore = async (quizResponses) => {
    try {
        let score = 0;
        for(let quizResponse of quizResponses){
            const {questionId, response} = quizResponse;
            if (!questionId || !response) {
                throw new Error("Missing questionId or response");
            }
            const question = await Question.findOne({questionId:questionId});
            if(!question){
                return res.status(404).json({message:"No question found with the mentioned id"})
            }
            const correctAnswer = question.rightAnswer;
            if(response.toLowerCase() === correctAnswer.toLowerCase()){
                score += 1;
            }
        }
        return score;
    } catch (error) {
        console.log(error);
        return error.message;
    }
};

module.exports = {getQuizQuestions, getQuestionsFromIds, getTopics, getScore};