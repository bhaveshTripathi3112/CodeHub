import { redisClient } from "../config/redis.js";
import { Submission } from "../models/submission.model.js";
import { User } from "../models/user.model.js";
import validate from "../utils/validator.js";
import bcrypt, { hash }  from "bcryptjs";
import jwt from "jsonwebtoken"


export const register = async(req,res)=>{
    try {
        console.log("Incoming body:", req.body);
        //validate the data
        validate(req.body)
        console.log("Validation passed");

        const {firstName , emailId , password} = req.body

        //hash the password
        req.body.password = await bcrypt.hash(password,10)

        //to ensure invalid person doesnt register as admin
        req.body.role='user'

        const user = await User.create(req.body)

        //generate token 
        const token = jwt.sign({_id:user._id,emailId , role:'user'},process.env.JWT_KEY ,{expiresIn : 7*24*60*60})

        //cookie
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENVIRONMENT === "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })

        const reply={
            firstName : user.firstName,
            emailId : user.emailId,
            _id : user._id,
            role: user.role
        }

        res.status(201).json({
            user:reply,
            message:"User registered successfully"
        })

    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

export const login = async(req,res)=>{
    try {
        const {emailId , password} = req.body

        if(!emailId || !password){
            throw new Error("Invalid Credentials")
        }

        const user = await User.findOne({emailId})

        const match =await  bcrypt.compare(password,user.password)
        if(!match){
            throw new Error("Invalid Credentials")
        }

        const reply={
            firstName : user.firstName,
            emailId : user.emailId,
            _id : user._id,
            role: user.role
        }

        const token = jwt.sign({_id:user._id,emailId , role:user.role},process.env.JWT_KEY ,{expiresIn : 7*24*60*60})

        //cookie
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENVIRONMENT === "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })

        res.status(201).json({
            user:reply,
            message:"Login Successful"
        })


    } catch (error) {
        res.status(401).json({message:error.message})
    }
}

export const logout = async(req,res)=>{
    try {
        const {token} = req.cookies

        // add token to redis blocklist till its expiry is not completed
        const payload = jwt.decode(token)
        await redisClient.set(`token:${token}`,'Blocked')
        await redisClient.expireAt(`token:${token}`,payload.exp)
        //clear cookies

        res.cookie("token",null,{expires:new Date(Date.now())})
        res.send("Logged Out Successful").status(200)
    } catch (error) {
        res.status(503).json({message:error.message})
    }
}

export const getProfile = async(req,res)=>{
    // is to be written 
}

export const adminRegister = async(req,res)=>{
    try {

        //? use this if you want to use only usermiddleware
        // if(req.result.role != 'admin'){
        //     throw new Error("Invalid Credentials")
        // }

        //validate the data
        validate(req.body)

        const {firstName , emailId , password} = req.body

        //hash the password
        req.body.password = await bcrypt.hash(password,10)

        //!to ensure invalid person doesnt register as admin
        // req.body.role = 'admin'

        const user = await User.create(req.body)

        //! here ww will not generate token for when admin registers someone as if we here will generate token so the current admin will automatically we logged out
        // //generate token 
        // const token = jwt.sign({_id:user._id,emailId , role:user.role},process.env.JWT_KEY ,{expiresIn : 7*24*60*60})

        // //cookie
        // res.cookie('token',token,{
        //     httpOnly:true,
        //     secure:process.env.NODE_ENVIRONMENT === "production",
        //     sameSite:"strict",
        //     maxAge:7*24*60*60*1000
        // })

        res.status(201).json({
            message: "User created successfully by admin",
            user: { _id: user._id, emailId: user.emailId, role: user.role },
        });

    } catch (error) {
        res.status(400).json({message:error.message})
    }
}


export const deleteProfile = async(req,res)=>{
    try {
        const userId = req.result._id

        await User.findByIdAndDelete(userId)
        // await Submission.deleteMany({userId})

        res.status(200).send("Deleted Successfully")
    } catch (error) {
       return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}