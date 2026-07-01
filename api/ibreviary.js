const IBREVIARY_BASE = 'https://www.ibreviary.com/m2';

function parseCookies(cookieStrings) {
  const parts = [];
  for (const cs of cookieStrings) {
    if (!cs) continue;
    const entries = cs.split(',').filter(Boolean);
    for (const c of entries) {
      const m = c.match(/^([^=]+)=([^;]+)/);
      if (m) parts.push(`${m[1].trim()}=${m[2].trim()}`);
    }
  }
  return parts.join('; ');
}

function collectCookies(resp, jar) {
  try {
    const cookies = resp.headers.getSetCookie?.() || [];
    for (const c of cookies) if (c) jar.push(c);
  } catch {}
  const sc = resp.headers.get('set-cookie');
  if (sc) jar.push(sc);
}

async function fetchSection(section, date) {
  const [y, m, d] = date.split('-');
  const params = new URLSearchParams({
    giorno: String(parseInt(d, 10)),
    mese: String(parseInt(m, 10)),
    anno: y,
    lang: 'en',
    ok: 'ok',
  });

  const jar = [];
  const postResp = await fetch(`${IBREVIARY_BASE}/opzioni.php?b=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (compatible; BreviaryApp/1.0)',
    },
    body: params.toString(),
    redirect: 'manual',
  });
  collectCookies(postResp, jar);

  const cookieStr = parseCookies(jar);

  const sectionUrl =
    section === 'readings'
      ? `${IBREVIARY_BASE}/letture.php?s=letture&b=1`
      : `${IBREVIARY_BASE}/breviario.php?s=${section}&b=1`;

  const resp = await fetch(sectionUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; BreviaryApp/1.0)',
      Cookie: cookieStr,
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
