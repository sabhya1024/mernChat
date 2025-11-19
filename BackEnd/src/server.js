import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from "url"; 
import connectDB from "./lib/db.js"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

import {app, server} from './lib/socket.js'
dotenv.config()

const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

if (process.env.NODE_ENV === 'production') {
   const distPath = path.join(__dirname, "..", "..", "FrontEnd", "dist");

   app.use(express.static(distPath));

   app.get(/.*/, (req, res) => {
     res.sendFile(path.join(distPath, "index.html"));
   });
}

const startSever = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    })
  }
  catch (error) {
    console.log('Failed to connect to DB. serverr not started ', error)
    process.exit(1);
  }
}

startSever();