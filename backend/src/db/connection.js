const mongoose = require("mongoose");
const dotEnv = require("dotenv");

dotEnv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Successfully established connection with database");
})
.catch((e)=>{
    console.log("Error while connecting with db",e);
})

module.exports = mongoose;