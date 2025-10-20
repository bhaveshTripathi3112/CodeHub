import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { connectDB } from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/userAuth.routes.js"
import { redisClient } from "./config/redis.js"
import problemRouter from "./routes/problem.routes.js"

const app = express()

//middleware
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const port = process.env.PORT || 5000

app.use("/user",authRouter)
app.use("/problem",problemRouter)

const initilaizeConnection = async ()=>{
    try {
        await Promise.all([connectDB(),redisClient.connect()])
        app.listen(port , () =>{
            console.log(`Server running on port ${port}`);
        })
        
    } catch (error) {
        console.log("DB connection error : ",error);
        
    }
}

initilaizeConnection()
