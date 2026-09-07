
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config({ path: "./.env" });
console.log(
  "Gemini API key loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);
const app = express();

app.use(
  cors({
    origin: "https://cashflowx-wmgo.onrender.com",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, financialData } = req.body;

const prompt = `
You are the AI financial assistant inside CashFlowX.

Your job is to help the user understand their personal cash flow using ONLY the financial data provided below.

IMPORTANT RULES:
- Use Indian Rupees (₹).
- Do not invent or assume financial data.
- If the required information is not available, clearly say that it is not available.
- Give simple, practical and concise answers.
- Do not claim to be a professional financial advisor.
- When calculating totals, use the transaction data provided.
- Distinguish between income and expenses.
- Consider recurring payments when discussing upcoming expenses.
- For recurring payments, if the nextDate has already passed, calculate the next occurrence based on its frequency (Monthly, Weekly, or Yearly).
- Do not treat a past recurring payment date as the next payment date.
- Consider savings goals when discussing savings progress.
- Explain calculations when useful.

USER QUESTION:
${message}

USER FINANCIAL DATA:
${JSON.stringify(financialData, null, 2)}

Answer the user's question based only on the information above.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    res.status(500).json({
      reply: "Sorry, I couldn't connect to the AI assistant right now.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CashFlowX AI server running on port ${PORT}`);
});