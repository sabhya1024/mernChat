import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


import User from '../models/User.js'

dotenv.config();

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ message: "unauthorised." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: "unauthorised." });
        }

        const user = await User.findById(decoded.userId).select("-password")
        
        if (!user) {
             return res.status(404).json({ message: "User not found." });
        }

        req.user = user
        
        next();
    }
    catch (error) {
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    console.log('Error in protected Route ', error.message);
    return res.status(401).json({ message: "unauthorised." });
}
}