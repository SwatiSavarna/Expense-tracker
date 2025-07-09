

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate', async (req, res) => {
  const { transactions } = req.body;

  if (!transactions || !Array.isArray(transactions)) {
    return res.status(400).json({ error: 'Transactions array is required' });
  }

  const prompt = `
You are a financial advisor AI. Analyze the following income transactions and provide 3 personalized budget tips.

Transactions:
${transactions.map(t => `• ${t.date} - ₹${t.amount} from ${t.source} (Icon: ${t.icon || 'None'})`).join('\n')}

Respond with simple and practical advice in a concise format.
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Updated to a supported model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();

    res.json({ suggestions });
  } catch (error) {
    console.error('[Google AI Error]', error);
    res.status(500).json({ error: 'AI suggestion generation failed' });
  }
});

module.exports = router;