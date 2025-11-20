const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 12001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// API proxy endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt, isLanguageSwahili } = req.body;
    
    const API_KEY = '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';
    
    // Dynamic import for node-fetch
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://work-1-tkgogqhngjihnluq.prod-runtime.all-hands.dev',
        'X-Title': 'XLYGER AI'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: messages[messages.length - 1].content }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});