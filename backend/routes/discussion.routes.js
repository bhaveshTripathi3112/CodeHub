import { Router } from "express";
import {  addComment, createPost, getAllPosts } from "../controllers/discussion.controllers.js";
import { userMiddleware } from "../middleware/user.middleware.js";

const discussionRouter = Router()
discussionRouter.post("/create",userMiddleware,createPost)
discussionRouter.get("/all",userMiddleware,getAllPosts)
discussionRouter.post("/:postId/comment",userMiddleware,addComment)

export default discussionRouter