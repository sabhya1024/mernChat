import { Server } from "socket.io"
import http from 'http';
import express from 'express'
// import { emit } from "process";
// import { Socket } from "dgram";
// import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials:true,
    }
})

export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}


// storing online users userid:socketid
const userSocketMap = {}


io.on(`connection`, (socket) => {
    const userId = socket.handshake.query.userId;


   if (userId && userId !== "undefined") {
     console.log(`User connected: ${userId}`); 
     userSocketMap[userId] = socket.id;

     // Moved emit inside the if block (more efficient)
     io.emit("getOnlineusers", Object.keys(userSocketMap));
   }

    socket.on("disconnect", () => {
    
      if (userId && userId !== "undefined") {
        console.log(`User disconnected: ${userId}`); 
        delete userSocketMap[userId];
        io.emit("getOnlineusers", Object.keys(userSocketMap));
      } 
    });
})

export {io, app, server}