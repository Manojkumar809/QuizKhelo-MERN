const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next)=>{
    const authHeader = req.header("Authorization");
    if(!authHeader){
        return res.status(401).json({message:"Access Denied. No token provided."});
    }
    try {
        const token = authHeader.split(" ")[1];
        const authorizedUser = jwt.verify(token, process.env.JWT_SECRET);
        if(authorizedUser.username.toLowerCase() !== req.headers.username.toLowerCase()){
            return res.status(403).json({ message:"Unauthorized: Username mismatch."});
        }
        next();
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({message:"Token has expired",expiredAt:error.expiredAt});
        }
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware