// Vercel Serverless Function: POST /api/gemini
// JSON body: { prompt: string }

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	try {
		const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
		const { prompt } = body;

		if (!prompt || typeof prompt !== 'string') {
			return res.status(400).json({ error: 'Invalid or missing prompt' });
		}

		const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
		if (!apiKey) {
			return res.status(500).json({ error: 'Missing GEMINI_API_KEY in environment.' });
		}

		const upstream = await fetch(
			`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: prompt }],
						},
					],
				}),
			}
		);

		if (!upstream.ok) {
			let details = null;
			try { details = await upstream.json(); } catch {}
			return res.status(upstream.status).json({ error: 'Upstream error', details });
		}

		const data = await upstream.json();
		const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
		return res.status(200).json({ text: reply });
	} catch (e) {
		return res.status(500).json({ error: e?.message || 'Unknown error' });
	}
}
