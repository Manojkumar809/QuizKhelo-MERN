const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionId:{type:Number, default:0},
    category:{type:String, required:true},
    difficultyLevel:{type:String, required:true},
    questionTitle:{type:String, required:true},
    option1:{type:String, required:true},
    option2:{type:String, required:true},
    option3:{type:String, required:true},
    option4:{type:String, required:true},
    rightAnswer:{type:String, required:true}
})

module.exports = new mongoose.model("Question", questionSchema);