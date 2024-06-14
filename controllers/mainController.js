const {OpenAI} = require('openai');
const pdf = require('pdf-parse');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

async function getGPTResponse(prompt) {
    try {
        
        const response = await openai.chat.completions.create({
            model: 'gpt-4o', 
            messages: [
                {
                    "role": "system",
                    "content": "Your task is to extract the required details of the candidate from the data provided by the user. The output should follow this format: \n\n { \"Name\": \"CANDIDATE_NAME\", \"PhoneNo\": \"0000000000\", \"Email\": \"example@example.com\", ... }. \n\n If any information is missing, denote it as \"N/A\" and proceed. Ensure all values are strings and avoid creating arrays or other data structures for any key. Keep the points short. \n\n The required fields are: \n - Name\n - Email\n - Location\n - PhoneNo\n - SoftSkills\n - Education\n - Experience\n - Skills\n - Achievements"
                },                      
                { role: 'user', content: prompt },
            ],
            });
    
        const summary = response.choices[0].message.content;
        return summary;
    } catch (error) {
        console.error('Error getting GPT-4o response:', error);
        return null;
    }
}

function convertToJSON(inputString) {
    let cleanedString = inputString.replace(/```/g, '').replace(/^json\s+/, '');
    
    let jsonString = cleanedString.trim();
    
    try {
        let jsonObject = JSON.parse(jsonString);
        return jsonObject;
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
}   

const handleResume = async (req, res) => {
    try {
        const files = req.files;
        const responses = [];
        for (const file of files) {
            const pdfData = await pdf(file.buffer); 
            const gptRes = await getGPTResponse(pdfData.text);
            console.log(gptRes);
            const data = convertToJSON(gptRes);
            console.log("conversion is: ",data);
            responses.push(data);
        }   

        res.status(200).json({ message: "Successfully processed resumes", result: responses });
    } catch (error) {
        console.error('Error handling resume:', error.message);
        res.status(500).send('An error occurred while processing the resume.');
    }
}

module.exports = { handleResume };