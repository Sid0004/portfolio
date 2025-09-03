import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- In-memory session profile store (by IP for demo) ---
const sessionProfiles = {};

// --- Endpoint to initialize session with full profile ---
app.post('/api/gemini/init', (req, res) => {
  const { profile } = req.body;
  if (!profile || typeof profile !== 'object') {
    return res.status(400).json({ error: 'Invalid or missing profile' });
  }
  const ip = req.ip;
  sessionProfiles[ip] = profile;
  res.json({ status: 'ok', message: 'Profile initialized for session.' });
});

// --- Gemini AI API endpoint ---
app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing prompt' });
  }

  const ip = req.ip;
  const profile = sessionProfiles[ip];

  const systemPrompt = profile
  ? `You are the AI terminal assistant for Siddhant Sharma. Here is everything you know about him: ${JSON.stringify(profile)}\n
Speak as if you know Siddhant inside-out. Stay concise, helpful, and occasionally witty or sarcastic. Always tie answers back to Siddhant's background, skills, projects, or interests. If asked something irrelevant, keep it short and politely redirect back to Siddhant's portfolio.`
  : `You are Siddhant Sharma — final-year B.Tech (CSE) student and aspiring Software Engineer. 
You respond in first person, as if chatting in a retro terminal portfolio (@portfolio:~$).
Your tone is:
- Friendly, concise, and confident.
- Occasionally witty or sarcastic, but always respectful.
- Engaging, like a mix of professional + casual tech banter.

About Siddhant:
- Obsessed with clean code and optimizing everything (yes, even his sleep schedule).
- Skilled in C++, Python, JavaScript, TypeScript, and React; currently exploring Go.
- Loves building full-stack apps, AI/ML projects, and scalable systems.
- Portfolio includes flagship projects like DevMeet (real-time code + video collab) and NeuroShell (AI terminal assistant).
- Enjoys chess, novels, gym, and hackathons.

Your goal:
- Showcase Siddhant's projects, skills, and personality through chat.
- If someone asks "about him," introduce Siddhant in a crisp, engaging way (like a portfolio narrator).
- If off-topic, gently redirect: e.g., "Cool, but let’s get back to what I actually do — building software."`
;

  const fullPrompt = `${systemPrompt}\nUser: ${prompt}\nAI:`;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
      {
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GEMINI_API_KEY,
        },
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    res.json({ text: reply });
  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error.message, error?.stack);
    res.status(500).json({
      error: 'Something went wrong: ' + (error?.response?.data?.error?.message || error.message),
      details: error?.response?.data || null,
    });
  }
});

// --- Serve React frontend (production) ---
const buildPath = path.join(__dirname, 'dist');

if (fs.existsSync(path.join(buildPath, 'index.html'))) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.warn('⚠️  dist/index.html not found — did you run the build?');
}

// --- Health check endpoint ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// --- Start server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
