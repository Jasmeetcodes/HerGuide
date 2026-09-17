require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON body parsing for incoming POST requests
app.use(express.json());

// Initialize GoogleGenAI client with the server-side API key
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

// System instruction prompt to guide Gemini's persona and guardrails
const HERGUIDE_SYSTEM_INSTRUCTION = `You are HerGuide Assistant, a supportive, reliable, and empathetic digital guide designed to help women navigate everyday resources, support networks, and vital services.

Your Core Directives:
1. Help users discover relevant categories and official resources (such as health, safety, legal aid, career development, and mental wellness).
2. Keep responses concise, clear, and practical.
3. Prioritize directing users toward verified, official support organizations and helplines.
4. Professional boundary: Do NOT act as or pretend to be a doctor, lawyer, therapist, or emergency responder. Always recommend professional consultation where appropriate.
5. In emergencies: If the user expresses imminent danger, violence, self-harm, or severe medical distress, immediately instruct them to contact official emergency authorities (such as Women's Helpline 181, National Emergency 112, Police 100, or Cyber Helpline 1930) rather than relying on this AI chat.
6. Factual integrity: Avoid hallucinating or inventing helpline numbers, links, or organizations. Stick to verified information or ask the user to check the HerGuide Resource Directory.`;

// Path to resources data file
const resourcesFilePath = path.join(__dirname, 'data', 'resources.json');

// Serve static frontend assets from public directory
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/resources - Read and return resources JSON
app.get('/api/resources', (req, res) => {
  fs.readFile(resourcesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading resources.json:', err);
      return res.status(500).json({ error: 'Failed to read resources data' });
    }
    try {
      const resources = JSON.parse(data);
      res.json(resources);
    } catch (parseErr) {
      console.error('Error parsing resources.json:', parseErr);
      res.status(500).json({ error: 'Invalid resources data format' });
    }
  });
});

// POST /api/ask - Gemini AI Resource Assistant endpoint
app.post('/api/ask', async (req, res) => {
  const { message } = req.body;

  // Validate message
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      error: 'Invalid request: "message" field is required and cannot be empty.'
    });
  }

  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
    return res.status(500).json({
      error: 'Gemini API key is not configured on the server. Please set a valid GEMINI_API_KEY in the .env file.'
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message.trim(),
      config: {
        systemInstruction: HERGUIDE_SYSTEM_INSTRUCTION
      }
    });

    const reply = response.text || 'I could not generate a response. Please try again.';
    return res.json({ reply });
  } catch (err) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({
      error: 'Unable to communicate with the AI assistant right now. Please try again later.'
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`HerGuide server is running at http://localhost:${PORT}`);
});
