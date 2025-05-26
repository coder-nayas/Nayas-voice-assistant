require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  console.log("🔵 Received prompt from frontend:", prompt);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful voice assistant called Nayas Voice Assistant." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response from AI.";
    console.log("🟢 Reply from AI:", reply);
    res.json({ reply });

  } catch (error) {
    console.error("🔴 Error:", error);
    res.status(500).json({ error: 'Failed to fetch from OpenRouter' });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
