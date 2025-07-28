import express from 'express';
import axios from 'axios';
import fs from "fs"



export const judgeRouter = express.Router();

const guidelines = JSON.parse(fs.readFileSync("guidelines.json", "utf-8"))
const prompt = `
    Read the guidelines: ${JSON.stringify(guidelines)}
    For each guideline, provide:
        1. A score (out of 4)
        2. A brief rationale explaining the score if it's less than 4

    Here's an example of the expected output with just 2 guidelines:
    {
        "creative idea" : {
            "strategic": {"score": "<score>", "rationale": "<rationale>", "suggestion: "<your suggestions to enhance this point if possible>"},
            "connection": {"score": "<score>", "rationale": "<rationale>", "suggestion: "<your suggestions to enhance this point if possible>"},
            "distinctive": {"score": "<score>", "rationale": "<rationale>", "suggestion: "<your suggestions to enhance this point if possible>"}
        },
        "Brand Visual ID" : {
            "color palette": {

                "primary colors": {"score": "<score>", "rationale": "<rationale>", "suggestion: "<your suggestions to enhance this point if possible>"},
                "secondary colors": {"score": "<score>", "rationale": "<rationale>", "suggestion: "<your suggestions to enhance this point if possible>"},
                "color tints": {"score": "<score>", "rationale": "<rationale>", "suggestion: "<your suggestions to enhance this point if possible>"}

            }
    } 
    Return a similar-syntx JSON with evaluation for all guidelines. 

`



judgeRouter.post('/', async (req, res) => {
    const { url} = req.body;
    console.log(url);
    const response = await axios.post("https://python.dragify.ai/api/llm/google-gemini/generate-response", {
        "model_name":"gemini-2.0-flash",
        "prompt": prompt,
        "file_url": url
    });
    const result = response.data;
    console.log(result);
    

    res.json(result);
})

