import express,{ Router } from "express";
import { adminRegister, getProfile, login, logout, register } from "../controllers/userAuth.controllers.js";
import { userMiddleware } from "../middleware/user.middleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const authRouter = Router()

//register
//login
//logout
//getProfile
authRouter.post("/register",register)
authRouter.post("/admin/register", adminMiddleware, adminRegister)
authRouter.post("/login",login)
authRouter.post("/logout",userMiddleware,logout)
// authRouter.get("/getProfile",getProfile)

export default authRouter