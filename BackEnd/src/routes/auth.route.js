import express from 'express'

import {upload} from '../lib/multer.js'
// import {u}
import { protectRoute } from '../middleware/auth.middleware.js';
import { checkAuth, logout, signin, signup, updateProfile } from '../controllers/auth.controller.js';



const router = express.Router();

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/logout", logout)

router.patch('/update-profile', protectRoute,
    upload.single('profilePic') //multer middleware
    , updateProfile)


router.get('/check', protectRoute, checkAuth)
export default router