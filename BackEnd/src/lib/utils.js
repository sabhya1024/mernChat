import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const private_key = process.env.JWT_SECRET


export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, private_key, {
        expiresIn: '7d'
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure:process.env.NODE_ENV !== 'development'
    })
    
    return token;
    
}