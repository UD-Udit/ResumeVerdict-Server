// const { convert } = require('pdf-poppler');
// const path = require('path');
// require('dotenv').config();
// const { OpenAI } = require('openai');
// const fs = require('fs');

// function imageToBase64(filePath) {
//     try {
//       const image = fs.readFileSync(filePath);
//       return image.toString('base64');
//     } catch (error) {
//       console.error('Error reading image file:', error);
//       return null;
//     }
//   }

// async function pdfToImages(pdfPath) {
//   const outputDir = path.dirname(pdfPath);
//   const options = {
//     format: 'jpeg',
//     out_dir: outputDir,
//     out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
//     page: null, 
//   };

//   try {
//     await convert(pdfPath, options);
//     console.log('PDF successfully converted to images');
//   } catch (err) {
//     console.error('Error converting PDF to images:', err);
//   }
// }
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_KEY
// });

// async function getGPT4Response(prompt) {
//     try {
//       const response = await openai.chat.completions.create({
//         model: 'gpt-4o', 
//         messages: [
//           { role: 'system', content: 'You are a helpful assistant.' },
//           { role: 'user', content: prompt },
//         ],
//       });
  
//       // Extract and return the assistant's reply
//       const assistantReply = response.choices;
//       return assistantReply;
//     } catch (error) {
//       console.error('Error getting GPT-4 response:', error);
//       return null;
//     }
// }

// const main = () => {
//   const imgPath="./resume-2.jpg"; // path of the image
//   const base64Image = imageToBase64(imgPath);
//   if (base64Image) {
//     const prompt = `Extract the email of the candidate from this image: ${base64Image}`;
//     getGPT4Response(prompt).then((response) => {
//       console.log('GPT-4 Response:', response);
//     });
//   } else {
//     console.error('Failed to convert image to base64.');
//   }
// }


// const pdfPath = './resume.pdf';

// // Run this function to generate images of the pdf : already generated!
// // pdfToImages(pdfPath);

// // After generating images you need to run main()
// main();


function convertToJSON(inputString) {
  // Removing the backticks
  let cleanedString = inputString.replace(/```/g, '').replace(/^json\s+/, '');

  // Parsing the string into a valid JSON object
  let jsonString = cleanedString.trim();

  try {
    let jsonObject = JSON.parse(jsonString);
    return jsonObject;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

let inputString = '```json { "Name": "Udit Gupta", "PhoneNo": "+91-9368875433", "Email": "udgupta33@gmail.com", "Location": "N/A", "HardSkills": ["C/C++", "Java", "Javascript", "Python", "ReactJs", "NodeJS", "Git", "Github", "NextJS", "MongoDB", "Firebase", "Solidity", "ThirdWeb", "HBS"], "SoftSkills": ["Problem Solving", "Self-learning", "Presentation", "Adaptability"], "Education": [ { "Degree": "Bachelor of Engineering in Computer Science and Engineering", "Institution": "Chandigarh University, Punjab", "Years": "2021-25", "CGPA": "8.58" }, { "Degree": "Intermediate in Physics, Chemistry and Maths", "Institution": "B.R.B. Model School, Budaun", "Years": "2020-21", "Result": "94.6%" } ], "Experience": [ { "Title": "MERN Stack Developer", "Company": "TensorBlue", "Location": "Remote", "Years": "January 2024 - Present", "Responsibilities": [ "Led cross-functional collaboration to craft responsive and visually captivating interfaces leveraging AI Models", "Pioneered the successful launch of Ideaverse: an npm package, revolutionizing the integration of multiple AI models for developers and yielding a 30% reduction in development time and costs", "Engineered the creation of AI-Product-Manager, facilitating seamless user interaction through voice inputs and outputs, leading to a 40% increase in user productivity and satisfaction" ] }, { "Title": "Content Editor", "Company": "TechWhoop", "Location": "Remote", "Years": "Jan 2022 - Feb 2022", "Responsibilities": [ "Learned the fundamentals of WordPress and SEO Optimization", "Worked with the professionals to publish 50+ articles on the website" ] } ], "Skills": { "Languages": ["C/C++", "Java", "Javascript", "Python"], "Libraries": ["C++ STL", "ReactJs"], "Web Dev Tools": ["NodeJS", "VScode", "Git", "Github"], "Frameworks": ["NextJS"], "Databases": ["MongoDB", "Firebase"] }, "Work Experience": [ { "Title": "MERN Stack Developer", "Company": "TensorBlue", "Location": "Remote", "Years": "January 2024 - Present" }, { "Title": "Content Editor", "Company": "TechWhoop", "Location": "Remote", "Years": "Jan 2022 - Feb 2022" } ], "Achievements": [ "FrontEnd Developer at Alexa Developers Community - CU, Sept, 2023 - Present", "Web-3 Track Prize Winner at Hack-O-Octo-1.0 Hackathon - Chandigarh University, Punjab, Oct, 2023", "Solved 350+ DSA Questions at Coding Ninjas, Aug to Dec, 2023" ] } ```';

let jsonObject = convertToJSON(inputString);
console.log(jsonObject);
