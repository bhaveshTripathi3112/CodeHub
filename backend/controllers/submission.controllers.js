import { Problem } from "../models/problem.model.js"
import { Submission } from "../models/submission.model.js"
import { User } from "../models/user.model.js"
import { getLanguageById, submitBatch, submitToken } from "../utils/problem.utility.js"
export const submitCode = async(req,res)=>{
    try {
        const userId = req.result._id
        const problemId = req.params.id

        const {code , language} = req.body

        if(!userId || !code || !problemId || !language){
            return res.status(400).send("Some field is missing.")
        }

        //fetch the problem for DB
        const problem = await Problem.findById(problemId)  //from here we can get hidden testcases

        //if problem is invalid or not found
        if (!problem) {
            return res.status(404).send("Problem not found.");
        }

        
        //submit code received from frontend in DB 
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasesPassed:0,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        })

        //now we can submit code to judge0
        const languageId = getLanguageById(language)

        //creating a batch for submission
        const submissions = problem.hiddenTestCases.map((testcase)=>({
            source_code:code,
            language_id : languageId,
            stdin: testcase.input,
            expected_output:testcase.output
        }))

         //submit batch to judge0
        const submitResult = await submitBatch(submissions)

        const resultToken = submitResult.map((value) => value.token)

        const testResult = await submitToken(resultToken)

        //update result in DB (submission schema)
        // 1 . check for error
        let testCasesPassed = 0
        let runtime = 0, memory = 0
        let status = 'accepted'
        let errorMessage = null

       for(const test of testResult){
            if(test.status_id == 3){
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time)
                memory = Math.max(memory , test.memory)
            }
            else{
                if(test.status_id == 4){
                    status = 'error'
                    errorMessage = test.stderr
                }
                else{
                    status = 'wrong'
                    errorMessage = test.stderr
                }
            }
        }

        //2.store the result in Database in submission
        submittedResult.status = status
        submittedResult.testCasesPassed = testCasesPassed
        submittedResult.errorMessage = errorMessage
        submittedResult.runtime = runtime
        submittedResult.memory = memory

        await submittedResult.save()

        //check whether the problemId is present in problemSolved in User Schema.
        //If not present we will store it in DB.
        //req.result has user information
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId)
            await req.result.save()
        }

        return res.status(201).send(submittedResult)


    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

export const runCode = async(req,res)=>{
    try {
        const userId = req.result._id
        const problemId = req.params.id

        const {code , language} = req.body

        if(!userId || !code || !problemId || !language){
            return res.status(400).send("Some field is missing.")
        }

        //fetch the problem for DB
        const problem = await Problem.findById(problemId)  //from here we can get hidden testcases

        //if problem is invalid or not found
        if (!problem) {
            return res.status(404).send("Problem not found.");
        }


        //now we can submit code to judge0
        const languageId = getLanguageById(language)

        //creating a batch for submission
        const submissions = problem.visibleTestCases.map((testcase)=>({
            source_code:code,
            language_id : languageId,
            stdin: testcase.input,
            expected_output:testcase.output
        }))

         //submit batch to judge0
        const submitResult = await submitBatch(submissions)

        const resultToken = submitResult.map((value) => value.token)

        const testResult = await submitToken(resultToken)

        return res.status(201).send(testResult)


    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}