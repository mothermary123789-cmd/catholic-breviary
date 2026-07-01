export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { path } = req.query;
  if (!path) {
    return res.status(400).json({ error: 'Missing path query param' });
  }

  try {
    const url = `https://bible.usccb.org${path}`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) {
      return res.status(resp.status).json({ error: `USCCB returned ${resp.status}` });
    }
    const html = await resp.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
