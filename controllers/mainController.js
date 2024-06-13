    const {OpenAI} = require('openai');
    const fs = require('fs');
    const pdf = require('pdf-parse');
    const dotenv = require('dotenv');
    dotenv.config();

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY
    });

    async function getGPTResponse(prompt) {
        try {
            const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', 
            messages: [
                { role: 'system', content: `You need to extract these fields from the data provided by user\n If anything is missing simply use "N/A" to denote it and move forward. \n\n
                To Extract:
                Candidate Name,
                Email,
                Location,
                Phone Number ,
                Hard Skills,
                Soft Skills,
                Education,
                Previous Companies,
                Skills ,
                Work Experience,
                Achivements`
            },
                { role: 'user', content: prompt },
            ],
            });
        
            const summary = response.choices[0].message.content;
            return summary;
        } catch (error) {
            console.error('Error getting GPT-4 response:', error);
            return null;
        }
    }

    function extractResumeData(resumeText) {
        const data = {};
    
        const candidateNameRegex = /Candidate Name: ([^\n]+)/;
        const candidateNameMatch = resumeText.match(candidateNameRegex);
        if (candidateNameMatch) {
            data.candidateName = candidateNameMatch[1].trim();
        }
    
        const emailRegex = /Email: ([^\n]+)/;
        const emailMatch = resumeText.match(emailRegex);
        if (emailMatch) {
            data.email = emailMatch[1].trim();
        }
    
        const locationRegex = /Location: ([^\n]+)/;
        const locationMatch = resumeText.match(locationRegex);
        if (locationMatch) {
            data.location = locationMatch[1].trim();
        }
    
        const phoneNumberRegex = /Phone Number: ([^\n]+)/;
        const phoneNumberMatch = resumeText.match(phoneNumberRegex);
        if (phoneNumberMatch) {
            data.phoneNumber = phoneNumberMatch[1].trim();
        }
    
        const hardSkillsRegex = /Hard Skills:\s*([\s\S]+?)\n\n/;
        const hardSkillsMatch = resumeText.match(hardSkillsRegex);
        if (hardSkillsMatch) {
            const hardSkills = hardSkillsMatch[1].trim().split(', ');
            data.hardSkills = hardSkills;
        }

        const softSkillsRegex = /Soft Skills:\s*([\s\S]+?)\n\n/;
        const softSkillsMatch = resumeText.match(softSkillsRegex);
        if (softSkillsMatch) {
            const softSkills = softSkillsMatch[1].trim().split(', ');
            data.softSkills = softSkills;
        }
    
        const educationRegex = /Education:\s*([\s\S]+?)\n\n/;
        const educationMatch = resumeText.match(educationRegex);
        if (educationMatch) {
            data.education = educationMatch[1].trim();
        }
    
        const prevCompaniesRegex = /Previous Companies:\s*([\s\S]+?)\n\n/;
        const prevCompaniesMatch = resumeText.match(prevCompaniesRegex);
        if (prevCompaniesMatch) {
            const previousCompanies = prevCompaniesMatch[1].trim().split('\n');
            data.previousCompanies = previousCompanies;
        }
    
        const skillsRegex = /Skills:\s*([\s\S]+?)\n\n/;
        const skillsMatch = resumeText.match(skillsRegex);
        if (skillsMatch) {
            const skills = skillsMatch[1].trim().split(', ');
            data.skills = skills;
        }
    
        const workExperienceRegex = /Work Experience:\s*([\s\S]+?)\n\n/;
        const workExperienceMatch = resumeText.match(workExperienceRegex);
        if (workExperienceMatch) {
            data.workExperience = workExperienceMatch[1].trim();
        }
    
        const achievementsRegex = /Achievements:\s*([\s\S]+)/;
        const achievementsMatch = resumeText.match(achievementsRegex);
        if (achievementsMatch) {
            data.achievements = achievementsMatch[1].trim();
        }
    
        return data;
    }
    

    const handleResume = async (req, res) => {
        try {
            const files = req.files;
            const responses = [];
            for (const file of files) {
                const pdfData = await pdf(file.buffer); 
                const gptRes = await getGPTResponse(pdfData.text);
                console.log(gptRes);
                // const data = extractResumeData(gptRes);
                responses.push(gptRes);
            }   

            res.status(200).json({ message: "Successfully processed resumes", result: responses });
        } catch (error) {
            console.error('Error handling resume:', error.message);
            res.status(500).send('An error occurred while processing the resume.');
        }
    }

    module.exports = { handleResume };