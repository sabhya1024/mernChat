import User from "../models/User.js";
import Message from "../models/Message.js"

import { JSDOM } from 'jsdom'
import createDOMPurify from 'dompurify'
import cloudinary from "../lib/cloudinary.js";
import { fileTypeFromBuffer } from "file-type";
import { getReceiverSocketId, io } from "../lib/socket.js";

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window)


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: {
            $ne:loggedInUserId
            }
        }).select('-password')
        

        res.status(200).json(filteredUsers)

    } catch (error) {
        console.error('Error in getUsersForSidebar: ', error.message);
        res.status(500).json({error: "Internal server error. "})
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatID } = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatID },
                {senderId:userToChatID, receiverId:myId}
            ]
        })
        return res.status(200).json(messages)
        
    } catch (error) {
        console.log(`Error in getMessages controller ${error}`)
         return res.status(500).json({error: "Internal server error. "});
    }
}

export const sendMessage = async (req, res) => {
    try {
      const { text } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;

      let imageUrl;

      let cleanText = text;
      if (text) {
        cleanText = DOMPurify.sanitize(text.trim());
      }

      if (req.file) {
        const fileType = await fileTypeFromBuffer(req.file.buffer);
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

        if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
          return res.status(400).json({
            message: "Invalid file type. Only JPEG, PNG or GIF is allowed",
          });
        }

        const base64Image = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + fileType.mime + ";base64," + base64Image;

        const uploadResponse = await cloudinary.uploader.upload(dataURI);
        imageUrl = uploadResponse.secure_url;
      }

      if (!cleanText && !imageUrl) {
        return res
          .status(400)
          .json({ error: "Message must contain text or an image." });
      }
      

      const newMessage = new Message({
        senderId,
        receiverId,
        text:cleanText,
        image: imageUrl,
      });

      await newMessage.save();

      // realtime functionality ---- socket.io
      const receiverSocketId = getReceiverSocketId(receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("New Message", newMessage)
      }


      res.status(201).json(newMessage);
    }
        
    
    catch (error) {
        console.log(`Error in sendMessage controller : ${error}`)
        if (error.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "File is too large (Max 5MB)." });
        }
        return res.status(500).json({error : `Internal server error.`})
    }
}