// Vercel Serverless Function: POST /api/gemini/init
// JSON body: { profile: object }
// For serverless, we won't persist per-IP; just acknowledge receipt.

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	try {
		const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
		const { profile } = body;
		if (!profile || typeof profile !== 'object') {
			return res.status(400).json({ error: 'Invalid or missing profile' });
		}
		return res.status(200).json({ status: 'ok', message: 'Profile acknowledged.' });
	} catch (e) {
		return res.status(500).json({ error: e?.message || 'Unknown error' });
	}
}
