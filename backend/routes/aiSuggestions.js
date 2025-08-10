

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// router.post('/generate', async (req, res) => {
//   const { transactions } = req.body;

//   if (!transactions || !Array.isArray(transactions)) {
//     return res.status(400).json({ error: 'Transactions array is required' });
//   }

//   const prompt = `
// You are a financial advisor AI. Analyze the following income transactions and provide 3 personalized budget tips.

// Transactions:
// ${transactions.map(t => `• ${t.date} - ₹${t.amount} from ${t.source} (Icon: ${t.icon || 'None'})`).join('\n')}

// Respond with simple and practical advice in a concise format.
// `;

//   try {
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Updated to a supported model
//     const result = await model.generateContent(prompt);
//     console.log(result,"Resultsssssssssssss")
//     const response = await result.response;
//     const suggestions = response.text();

//     res.json({ suggestions });
//   } catch (error) {
//     console.error('[Google AI Error]', error);
//     res.status(500).json({ error: 'AI suggestion generation failed' });
//   }
// });

// module.exports = router;




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

  const maxRetries = 3;
  let retryCount = 0;
  let delay = 42000; // Start with 42 seconds as suggested by error

  while (retryCount < maxRetries) {
    try {
      // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestions = response.text();

      return res.json({ suggestions });
    } catch (error) {
      if (error.status === 429 && retryCount < maxRetries - 1) {
        console.warn(`[Google AI] Rate limit hit, retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        retryCount++;
      } else {
        console.error('[Google AI Error]', error);
        return res.status(500).json({ error: 'AI suggestion generation failed' });
      }
    }
  }

  return res.status(429).json({ error: 'Rate limit exceeded after retries' });
});

module.exports = router;