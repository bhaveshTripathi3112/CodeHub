import { Router } from "express"
import { createProblem, deleteProblem, getAllProblem, getHint, getProblemById, getProblemByIdAdmin, solvedAllProblemByUser, submittedProblem, updateProblem } from "../controllers/problem.controllers.js"
import { adminMiddleware } from "../middleware/adminMiddleware.js"
import { userMiddleware } from "../middleware/user.middleware.js"


const problemRouter = Router()

//create problem
//fetch problem
//update problem
//delete problem

//requires admin access 
problemRouter.post("/create",adminMiddleware,createProblem)
problemRouter.put("/update/:id",adminMiddleware,updateProblem) 
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem)

problemRouter.get("/adminGetProblem/:id",adminMiddleware,getProblemByIdAdmin);

//user can access
problemRouter.get("/ProblemById/:id",userMiddleware,getProblemById)  // to fetch individual problem
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem)   // to fetch all problems
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblemByUser)  // to get total no of solved problem by user
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)
problemRouter.post(":id/hint",userMiddleware,getHint)

export default problemRouter
