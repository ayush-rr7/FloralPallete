import User from '../models/User.js';
// import Profile from '../models/Profile.js';
import  { body, validationResult, check } from  "express-validator"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import Otp from "../models/Otp.js";
import { sendEmail } from '../config/sendEmail.js';

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await Otp.deleteMany({ email });

    // save new OTP
    const newOtp = new Otp({
      email,
      otp,
      expiresAt,
    }); 
    
    await newOtp.save();
console.log("processing otp send");
    //  EMAIL TEMPLATE
    const subject = "Your OTP for FloralPallete";
    const html = `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `;
    let emailSent = true;

  try {
  await sendEmail({ to: email, subject, html });
  } catch (emailErr) {
  console.log("Email failed:", emailErr.message);
  emailSent = false;
  }
    console.log("otp sent"); 
   
    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
    

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
console.log( email, otp);
    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }
    // delete OTP after success
    await Otp.deleteMany({ email });

    // create verification token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      success: true,
      token,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};


//SIGNUP
const signup = async (req,res)=>{   
  try {
   
      const { name, city,  contact,email, password
        // ,token 
      } = req.body;

    // //verify token
    // let decoded;
    // try {
    //   decoded = jwt.verify(token, process.env.JWT_SECRET);
    // } catch (err) {
    //   return res.status(401).json({
    //     success: false,
    //     errors: [{ msg: "Invalid or expired verification" }],
    //   });
    // }

    // check email match
    // if (decoded.email !== email) {
    //   return res.status(401).json({
    //     success: false,
    //     errors: [{ msg: "Email mismatch" }],
    //   });
    // }

       //  check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
      errors: [{msg:"Email already registered"}],
      });
    }
         const hashedPassword = await bcrypt.hash(password, 12);
      
       const user = new User({
      name,
      city,
      email,
      contact,
      password: hashedPassword,
      role: "customer",
    });
      const savedUser = await user.save();
    
   console.log("saved User successfully");
    res.status(201).json({
      success: true,
    });
         
    } catch(err){
       console.log(err);
      return res.status(500).json({ message: err.message });
        };
}


// export const loginLimiter = rateLimit({
//   windowMs: 30 * 60 * 1000, // 15 min
//   max: 5, // max 5 attempts
//  errors: [{msg:"Invalid email or password"}],
  //  // message: "Too many login attempts, try again later"
// });

const login= async(req,res,next)=>{
  try{
const {email, password}=req.body;
const user = await User.findOne({ email });
if (!user ) {
  console.log("not found");
  return res.status(400).json({
    success: false,
      errors: [{msg:"Invalid email or password"}],
  });
}

 const isMatch= await  bcrypt.compare(password,user.password);
if(!isMatch){
  console.log("wrong password");
    return res.status(401).json({
    success: false,
    errors: [{msg:"Invalid email or password"}],
  });
}
  console.log(user.name,"is logged In");
  

//Sign token
const accessToken = jwt.sign(
  { userId: user._id },  //payload
  // role:user.role
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);
// console.log(accessToken);

const isProduction = process.env.NODE_ENV === "production";
res.cookie("token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  })
  .status(200)
  .json({
    message: "Login successful",
    success: true
  });
// return jwt.verify(token,process.env.JWT_SECRET);
console.log("DONE");
  }
  catch(err){
    console.log(err);
    return res.status(500).json({ message: "Server error. Please try again later."});
  }
 
}


const account= async(req,res,next)=>{
   try {
    console.log("fetching user detail");
    const user = await User.findById(req.userId).select("-Password");
    console.log(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  //     const profiles = await Profile.find({
  //     userId: req.userId
  //  });

  //  console.log(profiles);
    res.status(200).json({
      success: true,
      user,
      // profiles
    });

  

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

const logout= async(req,res,next)=>{
  console.log("User Logging Out");
  try{
    res
  .clearCookie("token",{
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/"
})
  .status(200)
  .json({ message: "Logged out successfully" });
  }catch(err){
    console.log(err);
    return res.status(500).json({ message: err.message });
  }

}


export default {sendOtp,verifyOtp,signup,login,logout,account,};  