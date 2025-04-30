const mongoose = require("mongoose");
const Counter = require("./counter");

const quizSchema = new mongoose.Schema({
    quizId:{type:Number},
    title:{type:String, required:true},
    topic:{type:String, required:true},
    username:{type:String, required:true},
    questionsCount:{type:Number, required:true},
    score:{type:Number, required:true},
    questionsIds:{type:[Number], required:true}
});

quizSchema.pre("save", async function (next) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "quizId" },  // We use 'questionId' as the unique identifier
      { $inc: { count: 1 } },  // Increment the counter by 1
      { new: true, upsert: true }  // 'new: true' returns the updated counter
    );
    this.quizId = parseInt(counter.count);
    next();
});


module.exports = new mongoose.model("Quiz", quizSchema)