

import { Submission } from "../models/submission.model.js"
import { User } from "../models/user.model.js"
import { getLanguageById, submitBatch, submitToken } from "../utils/problem.utility.js"
import { Problem } from "../models/problem.model.js"
import { GoogleGenerativeAI } from "@google/generative-ai";

export const createProblem = async(req,res)=>{
    const {title ,  description , difficultyLevel , tags , visibleTestCases,
        hiddenTestCases,startCode,referenceSolution,problemCreator} = req.body
    try {


        // CHECK IF PROBLEM TITLE ALREADY EXISTS
        const existing = await Problem.findOne({ title: title.trim() });
        if (existing) {
        return res.status(400).json({
            success: false,
            message: "A problem with this title already exists!",
        });
        }

        //! if the below for loop executes fully means admin ne jo data bheja hia wo ekdum picture perfect hai aur usko ham DB mein store kar skte hai 
        
        for(const {language , completeCode} of referenceSolution){


            //source_code
            // language_id
            //stdin
            //expected_output

            const languageId = getLanguageById(language)

            //creating a batch for submission
            const submissions = visibleTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id : languageId,
                stdin: testcase.input,
                expected_output:testcase.output
            }))

            //submit batch to judge0
            // console.log(submissions);
            
            const submitResult = await submitBatch(submissions)
            // console.log(submitResult);
            const resultToken = submitResult.map((value) => value.token)
            // console.log(resultToken);
            
            const testResult = await submitToken(resultToken)

            
            // console.log(testResult);  // this is output from judge0
            
            
            

            for(const test of testResult){
                if(test.status_id != 3 ){
                    console.log("Test failed:", test);
                    return res.status(400).send("Error occured") 

                    //! in future i will specify specific error here for each status_id
                }
            }
            
        }

        //now we will store it in db
        const userProblem = await Problem.create({
            ...req.body,
            problemCreator : req.result._id
        })

        res.status(201).json({message:"Problem created successfully"})

    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

export const updateProblem = async(req,res)=>{
    const {id} =  req.params
     //verify the data received from frontend
    const {title ,  description , difficultyLevel , tags , visibleTestCases,
    hiddenTestCases,startCode,referenceSolution,problemCreator} = req.body

    try {
       
        if(!id){
            return res.status(400).send("Missing id.")
        }

        const DSAProblem = await Problem.findById(id)
        if(!DSAProblem){
            return res.status(404).send("ID is not present in the server.")
        }

        //! if the below for loop executes fully means admin ne jo data bheja hia wo ekdum picture perfect hai aur usko ham DB mein store kar skte hai 
        
        for(const {language , completeCode} of referenceSolution){


            //source_code
            // language_id
            //stdin
            //expected_output

            const languageId = getLanguageById(language)

            //creating a batch for submission
            const submissions = visibleTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id : languageId,
                stdin: testcase.input,
                expected_output:testcase.output
            }))

            //submit batch to judge0
            const submitResult = await submitBatch(submissions)
            // console.log(submitResult);
            const resultToken = submitResult.map((value) => value.token)

            const testResult = await submitToken(resultToken)

            
            // console.log(testResult);
            
            
            

            for(const test of testResult){
                if(test.status_id != 3 ){
                    return res.status(400).send("Error occured") 

                    //! in future i will specify specific error here for each status_id
                }
            }
            
        }

        const newProblem = await Problem.findByIdAndUpdate(id , {...req.body} , {runValidators:true,new:true})
        return res.status(200).send(newProblem)

    } catch (error) {
        return res.status(500).send("Error "+error)
    }
}

export const deleteProblem = async(req,res)=>{
    const {id} = req.params
    try {
        if(!id){
            return res.status(400).send("Id is Missing.")
        }
        const deletedProblem = await Problem.findByIdAndDelete(id);

        if(!deletedProblem){
            return res.status(404).send("Problem is missing.")
        }
        return res.status(200).send("Successfully Deleted Problem.")
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getProblemById = async(req,res)=>{
    const {id} = req.params
    try {
        if(!id){
            return res.status(400).send("Id is Missing.")
        }
        
        const getProblem = await Problem.findById(id).select('title description difficultyLevel tags visibleTestCases startCode referenceSolution' )

        if(!getProblem){
            return res.status(404).send("Problem is missing")
        }
        return res.status(200).send(getProblem)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getAllProblem = async(req,res)=>{
    
    try {
       
        
        const getProblem = await Problem.find({}).select("_id title difficultyLevel tags ")

        if(getProblem.length == 0){
            return res.status(404).send("Problem is missing")
        }
        return res.status(200).send(getProblem)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const solvedAllProblemByUser = async(req,res)=>{
    try {
        
        const userId = req.result._id
        const user = await User.findById(userId).populate({
            path:"problemSolved",
            select:"_id title difficultyLevel tags"
        })
        res.status(200).send(user.problemSolved)

    } catch (error) {
        res.status(500).send("Error "+error || "Internal Server Error")
    }
}

export const submittedProblem = async(req,res)=>{
    try {
        const userId = req.result._id
        const problemId = req.params.pid
        const ans = await Submission.find({userId , problemId})

        if(ans.length == 0){
            return res.status(200).send("No submission")
        }

        return res.status(200).send(ans)
    } catch (error) {
        return res.status(500).send("Internal server error")
    }
}




// INIT GEMINI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getHint = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;   // FIXED 🔥

    const user = await User.findById(userId);
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // Find hint usage for this problem
    let usage = user.hintUsage.find(
      (h) => h.problemId.toString() === problemId.toString()  // FIXED 🔥
    );

    // Max 2 hints allowed
    if (usage && usage.count >= 2) {
      return res.status(403).json({
        success: false,
        message: "You have used your 2 available hints"
      });
    }

    // Build prompt
    const prompt = `
      Provide ONLY A HINT, not the full solution.
      Avoid giving code or explicit logic.

      Problem Title: ${problem.title}
      Difficulty: ${problem.difficultyLevel}
      Description: ${problem.description}
      Visible Test Cases: ${JSON.stringify(problem.visibleTestCases)}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const hint = result.response.text();

    // Update usage
    if (!usage) {
      user.hintUsage.push({ problemId, count: 1 });
    } else {
      usage.count += 1;
    }

    await user.save();

    return res.json({
      success: true,
      hint,
      remaining: usage ? 2 - usage.count : 1,
    });

  } catch (err) {
    console.log("Hint error:", err);
    return res.status(500).json({ success: false, message: "Failed to generate hint" });
  }
};

