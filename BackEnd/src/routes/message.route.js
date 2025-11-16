import express from 'express'


import {upload} from '../lib/multer.js'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';



const router = express.Router();


router.get('/users', protectRoute, getUsersForSidebar)
router.get('/:id', protectRoute, getMessages)

router.post('/send/:id', protectRoute, upload.single('image') , sendMessage)


export default router