import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config();
const private_key = process.env.JWT_SECRET


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

})


export const sendVerificationEmail = async (toEmail, token) => {
    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify/${token}`

    const mailOptions = {
    from: `"Chat App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify Your Email for Chat App",
    html: `
      <h1>Welcome to Chat App!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a 
        href="${verificationLink}" 
        style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;"
      >
        Verify My Email
      </a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
}

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