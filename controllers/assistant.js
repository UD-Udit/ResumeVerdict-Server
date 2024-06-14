const { OpenAI } = require('openai');
require('dotenv').config();

const startConversation = async(req, res) => {
    const data = JSON.stringify(req.body.data);
    const prompt = "You are a Hiring Manager, you have data of some candidates, according to that data, you need to answer users's question. Just give one line answers don't explain too much. Start the chat by greeting the user.";
    const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});

    try {
        const assistant = await openai.beta.assistants.create({
            name: "Hiring Manager",
            instructions: `${prompt} \n\n\nData is:\n ${data}`,
            tools: [{ type: "code_interpreter" }],
            model: "gpt-4-turbo-preview"
        });
    
        const thread = await openai.beta.threads.create();
    
        let run = await openai.beta.threads.runs.create(
            thread.id,
            { 
                assistant_id: assistant.id
            }
        );
        while (run.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            run = await openai.beta.threads.runs.retrieve(
                thread.id,
                run.id
            );
            console.log(run.status);
        }
    
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data.filter(
            (message) => message.run_id === run.id && message.role === "assistant"
        ).pop();
        res.status(200).json({content: lastMessage.content[0].text.value, threadId: thread.id, assistantId: assistant.id});
    } catch (error) {
      console.log(error.message);
      res.status(400).json({error: error.message});
    }
}

const sendMessage = async(req, res) => {
    const prompt = req.body.message;
    if (!prompt) {
        throw new Error("Message is empty");
    }

    const threadId = req.body.threadId;
    if (!threadId) {
        throw new Error("ThreadId is empty");
    }

    const assistantId = req.body.assistantId;
    if (!assistantId) {
        throw new Error("assistantId is empty");
    }
    try{
        const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});
        const message = await openai.beta.threads.messages.create(
            threadId,
            {
              role: "user",
              content: prompt
            }
        );
        let run = await openai.beta.threads.runs.create(
            threadId,
            { 
                assistant_id: assistantId,
            }
        );
        console.log("Running", run.status);
        while (run.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            run = await openai.beta.threads.runs.retrieve(
                threadId,
                run.id
            );
            console.log(run.status);
        }
        console.log("loop done");

        const messages = await openai.beta.threads.messages.list(
            threadId
          );
        
        const lastMessage = messages.data.filter(
            (message) => message.run_id === run.id && message.role === "assistant"
        ).pop();
        
        res.status(200).json({content: lastMessage.content[0].text.value});
        
        
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    startConversation, 
    sendMessage,
}