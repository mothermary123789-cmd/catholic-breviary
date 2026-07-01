const IBREVIARY_BASE = 'https://www.ibreviary.com/m2';

async function fetchSection(section, date) {
  const [y, m, d] = date.split('-');
  const dateParams = `&giorno=${parseInt(d,10)}&mese=${parseInt(m,10)}&anno=${y}&lang=en`;

  const sectionUrl =
    section === 'readings'
      ? `${IBREVIARY_BASE}/letture.php?s=letture&b=1${dateParams}`
      : `${IBREVIARY_BASE}/breviario.php?s=${section}&b=1${dateParams}`;

  const resp = await fetch(sectionUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; BreviaryApp/1.0)',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!resp.ok) return null;
  return await resp.text();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { section, date } = req.query;

  if (!section || !date) {
    return res.status(400).json({ error: 'Missing section or date query param' });
  }

  try {
    const html = await fetchSection(section, date);
    if (!html) {
      return res.status(502).json({ error: 'Failed to fetch from iBreviary' });
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
