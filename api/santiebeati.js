const SANTIEBEATI_BASE = 'https://www.santiebeati.it';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { month, day } = req.query;

  if (!month || !day) {
    return res.status(400).json({ error: 'Missing month or day query param' });
  }

  try {
    const resp = await fetch(`${SANTIEBEATI_BASE}/${month}/${day}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BreviaryApp/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!resp.ok) {
      return res.status(502).json({ error: 'Failed to fetch from santiebeati.it' });
    }

    const html = await resp.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
