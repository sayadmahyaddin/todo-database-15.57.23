
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                message: "Please enter a message"
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",

            contents: message,

            config: {
                systemInstruction:
                    "You are Daylist, a friendly productivity assistant. Help users organise daily tasks. Keep answers short and simple."
            }
        });

        return res.status(200).json({
            reply: response.text
        });

    } catch (error) {
        console.error("Gemini Error:", error);

        return res.status(500).json({
            message: "Chatbot error"
        });
    }
};

module.exports = { chat };

