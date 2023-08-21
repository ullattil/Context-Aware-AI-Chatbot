require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const OpenAI = require("openai");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

// OpenAI API configuration
const openai=new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
    
app.use(express.static("public"));
    
io.on("connection", (socket) => {
    console.log("New user connected");
    // Initialize the conversation history
    conversationHistory=[];
     
    socket.on("sendMessage", async (message, callback) => {
        try {
            // Add the user message to the conversation history
             
            conversationHistory.push({ role: "user", content: message });
    
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: conversationHistory,
            });
    
            const response = completion.choices[0].message.content;
    
            // Add the assistant's response to the conversation history
            conversationHistory.push({ role: "assistant", content: response });
    
            socket.emit("message", response);
            callback();
        } catch (error) {
            console.error(error);
            callback("Error: in the application");
        }
    });
    
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
    
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});