const dotEnv = require("dotenv");
dotEnv.config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("./db/connection");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const quizRoutes = require("./routes/quizRoutes");
const cors = require("cors");

const corsOptions = {
    origin:"http://localhost:5173",
    methods:"GET, POST, PUT, DELETE, OPTIONS, HEAD",
    allowedHeaders:"Content-Type, Authorization, username"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/user", userRoutes);
app.use("/question", questionRoutes);
app.use("/quiz", quizRoutes);

app.get("/", (req, res)=>{
    res.status(200).send("Hello welcome to home page of quiz mern backend");
});

app.listen(port, ()=>{
    console.log(`Server started and running on http://localhost:${port}`)
})