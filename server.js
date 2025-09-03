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

  // Build a structured summary from the stored profile to ground the AI in concrete facts
  let profileSummary = '';
  if (profile && typeof profile === 'object') {
    const skills = Array.isArray(profile.skills) ? profile.skills.join(', ') : '';
    const projects = Array.isArray(profile.projects)
      ? profile.projects
          .map((p) => {
            const name = p?.name || '';
            const desc = p?.description || '';
            return name ? `- ${name}: ${desc}` : null;
          })
          .filter(Boolean)
          .join('\n')
      : '';
    const achievements = Array.isArray(profile.majorAchievements)
      ? profile.majorAchievements.map((a) => `- ${a}`).join('\n')
      : '';
    const interests = Array.isArray(profile.interests) ? profile.interests.join(', ') : '';

    profileSummary = [
      skills ? `Skills: ${skills}` : '',
      projects ? `Projects:\n${projects}` : '',
      achievements ? `Achievements:\n${achievements}` : '',
      interests ? `Interests: ${interests}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  const systemPrompt = profile
  ? `You are the AI assistant for visitors to Siddhant Sharma's portfolio. Here is Siddhant's profile: ${JSON.stringify(profile)}\n\nStructured summary (use these facts directly, do not invent):\n${profileSummary}\n\n
Do not assume the visitor's identity. Do not start with a greeting. Answer directly, concisely, and helpfully, with occasional wit. Use concrete details from the profile and portfolio; never use placeholders like [mention ...] or generic fillers. If specific info is missing, say so briefly. Prefer clear bullets that cite project names, tech, and impact. When asked "why should we hire him" or similar, respond with: a 1–2 sentence value prop followed by 3–5 concrete bullets (skills, flagship projects, outcomes/impact, collaboration/leadership, reliability). If the question is unrelated, answer briefly and steer back to portfolio topics.`
  : `You are the AI assistant for visitors to Siddhant Sharma's portfolio. Do not assume the visitor's identity. Do not start with a greeting. Answer directly, concisely, and helpfully, with occasional wit. Prefer describing Siddhant in third person ("Siddhant has...") unless explicitly asked to roleplay. Use concrete details from his profile; never use placeholders like [mention ...] or generic fillers. If specific info is missing, say so briefly. Prefer clear bullets with project names, tech, and impact. For "why hire" questions: a 1–2 sentence value prop plus 3–5 concrete bullets. If a question is unrelated, answer briefly and redirect to portfolio-related topics.`
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
