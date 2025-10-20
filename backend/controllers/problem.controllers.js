import { Problem } from "../models/problem.model.js"
import { getLanguageById, submitBatch, submitToken } from "../utils/problem.utility.js"


export const createProblem = async(req,res)=>{
    const {title ,  description , difficultyLevel , tags , visibleTestCases,
        hiddenTestCases,startCode,referenceSolution,problemCreator} = req.body
    try {

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
       
        
        const getProblem = await Problem.find({})

        if(getProblem.length == 0){
            return res.status(404).send("Problem is missing")
        }
        return res.status(200).send(getProblem)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const solvedAllProblemByUser = async(req,res)=>{
    
}