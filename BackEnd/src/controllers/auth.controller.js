import argon2 from "argon2";

import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

import { fileTypeFromBuffer } from "file-type";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required. " });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters. " });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists. " });
    }

    //   hash passwrod
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 12288,
      timeCost: 3,
      parallelism: 1,
    });

    const newUser = new User({
      fullname: fullname,
      email: email,
      password: hashedPassword,
    });

    //generating jwt token
    const token = generateToken(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log(`Error is signup controller . try again. ${error}`);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in login controller ", error.message);
    return res.status(500).json({ message: "Internal Server Error. " });
  }
};

export const logout = async (req, res) => {
  try {
    await res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    return res.status(200).json({ messaage: "Logged out successfully" });
  } catch (error) {
    console.log("error in logout controller ", error.message);
    return res.status(500).json({ message: "Internal Server Error. " });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    //from multer
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. " });
    }

    //   magic number validation
    const fileType = await fileTypeFromBuffer(req.file.buffer);
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
      return res.status(400).json({
        message: "Invalid file type. Only JPEG, PNG, or GIF are allowed.",
      });
      }
      
      //buffer to base64
      const base64fomattedfile = Buffer.from(req.file.buffer).toString("base64");
      
    let dataURI = "data:" + fileType.mime + ";base64," + base64fomattedfile;


    const uploadResponse = await cloudinary.uploader.upload(dataURI);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in updateProfile controller ", error.message);
    return res.status(500).json({ message: "Internal Server Error. " });
  }
};


export const checkAuth = async (req, res) => {
    try {
        await res.status(200).json(req.user)
    } catch (error) {
        console.log("error in check Auth controller ", error.messaage);
        res.status(500).json({messaage:"Internal server error. "})
    }
}