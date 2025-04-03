const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

function getPrompt(message, products) {
  let prompt = `You are a helpful shopping assistant. Your responses should be:
- Concise and easy to read
- Keep responses short (max 2-3 sentences per point)
- Use bullet points for lists
- Be friendly but professional

Follow these guidelines for product recommendations:
1. Pay close attention to the user's message intent:
   - If they explicitly ask to see products or use phrases like "show me", "recommend", "what options", etc. → IMMEDIATELY show product recommendations
   - If they provide clear requirements → IMMEDIATELY show relevant product recommendations
   - Only ask questions if critical information is missing

2. Limit to ONE question when information is needed, focusing on the most important missing detail.

3. When presenting product options, format clearly as:
   - ID: [product_id]
   - Name: [product_name]
   - Price: [price]
   - Key feature: [brief highlight]

4. When explaining recommendations, be brief but specific about how they match user needs.

5. IMPORTANT: Default to showing relevant products rather than asking additional questions.

User message: ${message}
List of products: ${products.join(", ")}`;

  return prompt;
}

async function getResponse({ message, products, history }) {
  // console.log(products);
  const chatSession = model.startChat({
    generationConfig,
    history: history || [],
  });
  const prompt = getPrompt(message, products);
  const result = await chatSession.sendMessage(prompt);

  // console.log(prompt);
  return result.response.text();
}

module.exports = {
  getResponse,
};
