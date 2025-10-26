import express,{ Router } from "express";
import { adminRegister, deleteProfile, getProfile, login, logout, register } from "../controllers/userAuth.controllers.js";
import { userMiddleware } from "../middleware/user.middleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import isEmail from "validator/lib/isEmail.js";

const authRouter = Router()

//register
//login
//logout
//getProfile
authRouter.post("/register",register)
authRouter.post("/admin/register", adminMiddleware, adminRegister)
authRouter.post("/login",login)
authRouter.post("/logout",userMiddleware,logout)
authRouter.get("/check",userMiddleware,(req,res)=>{
    const reply = {
        firstName : req.result.firstName,
        emailId: req.result.emailId,
        _id : req.result._id
    }
    res.status(200).json({
        user:reply,
        message: "valid user"
    })
})

authRouter.delete('/deleteProfile',userMiddleware,deleteProfile)
// authRouter.get("/getProfile",getProfile)

export default authRouter