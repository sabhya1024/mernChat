import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'


import connectDB from "./lib/db.js"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

dotenv.config()

const PORT = process.env.PORT


const app = express();
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, // This allows cookies to be sent from the frontend
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

connectDB().then(
    app.listen(PORT, () => {
        console.log(`Server started on ${PORT} `);
    })
)