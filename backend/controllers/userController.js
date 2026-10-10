import { userModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bycript from "bcryptjs";
import validator from "validator";
import { configDotenv } from "dotenv";

// login user...
export const loginUser = async (req,res) => {
    const {password,email} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false,message:"User Doesn't exist.."})
        }
        const isMatch = await bycript.compare(password,user.password)
        if (!isMatch) {
            return res.json({success:false,message:"Invalid password.."});
        }
        const token = createToken(user._id);
        res.json({success:true,token,message:"logedin"})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
// genater jwt token..
const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

// register user...
export const registerUser = async (req,res) => {
    const {name,password,email} = req.body;
    try {
        // cheking is user already exists..
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false,message:"User already exists"})
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please enter a valid email"})
        }

        if (password.length<8) {
            return res.json({success:false,message:"Please enter a strong password"})
        }

        // hasing user password...
        const salt = await bycript.genSalt(10);
        const hasPassword = await bycript.hash(password,salt);

        // creat new user..
        const newUser = new userModel({
            name:name,
            email:email,
            password:hasPassword
        })

        // save user in the DB..
       const user = await newUser.save();
       
       const token = createToken(user._id);
       res.json({success:true,token})
     

    } catch (error) {
        res.json({success:true,message:error.message})
    }
}

