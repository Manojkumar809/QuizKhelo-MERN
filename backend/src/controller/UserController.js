const User = require("../model/user");
const BCrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const createUser = async(req, res)=>{
    try {
        const {username, password} = req.body;
        const existingUser = await User.findOne({username:username});
        if(existingUser){
            return res.status(400).send("username already exists");
        }
        const hashedPassword = await BCrypt.hash(password, 10);
        const newUser = new User({
            username:username,
            password:hashedPassword
        })
        await newUser.save();
        return res.status(201).json({message:"success"});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

const verifyUser = async(req, res)=>{
    try {
        const {username, password} = req.body;
        const existingUser = await User.findOne({username:username});
        if(existingUser && await BCrypt.compare(password, existingUser.password)){
            const token = jwt.sign({username:existingUser.username}, jwtSecret, {expiresIn:"1h"});
            return res.status(200).json(token);
        }
        return res.status(400).json({message:"Check credentials"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
};

module.exports = {createUser, verifyUser};