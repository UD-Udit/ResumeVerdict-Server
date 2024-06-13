const { convert } = require('pdf-poppler');
const path = require('path');
require('dotenv').config();
const { OpenAI } = require('openai');
const fs = require('fs');

function imageToBase64(filePath) {
    try {
      const image = fs.readFileSync(filePath);
      return image.toString('base64');
    } catch (error) {
      console.error('Error reading image file:', error);
      return null;
    }
  }

async function pdfToImages(pdfPath) {
  const outputDir = path.dirname(pdfPath);
  const options = {
    format: 'jpeg',
    out_dir: outputDir,
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    page: null, 
  };

  try {
    await convert(pdfPath, options);
    console.log('PDF successfully converted to images');
  } catch (err) {
    console.error('Error converting PDF to images:', err);
  }
}

const pdfPath = './resume.pdf';



const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

async function getGPT4Response(prompt) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o', 
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
      });
  
      // Extract and return the assistant's reply
      const assistantReply = response.choices;
      return assistantReply;
    } catch (error) {
      console.error('Error getting GPT-4 response:', error);
      return null;
    }
  }
  const imgPath = './resume-2.jpg'; 
  const base64Image = imageToBase64(imgPath);
  console.log(base64Image)
  if (base64Image) {
    const prompt = `Extract the email of the candidate from this image: ${base64Image}`;
    getGPT4Response(prompt).then((response) => {
      console.log('GPT-4 Response:', response);
    });
  } else {
    console.error('Failed to convert image to base64.');
  }
// pdfToImages(pdfPath);
