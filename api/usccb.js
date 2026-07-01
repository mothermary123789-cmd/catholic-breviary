const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
];

function randomHeaders() {
  const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  return {
    'User-Agent': ua,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://www.usccb.org/',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-site',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  };
}

async function fetchWithFallback(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const resp = await fetch(url, {
        headers: randomHeaders(),
        signal: AbortSignal.timeout(15000),
      });
      if (resp.ok) return resp;
      if (resp.status === 403 && i < retries) {
        await new Promise(r => setTimeout(r, 500 * (i + 1)));
        continue;
      }
      return resp;
    } catch (e) {
      if (i >= retries) throw e;
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { path } = req.query;
  if (!path) {
    return res.status(400).json({ error: 'Missing path query param' });
  }

  try {
    const urls = [
      `https://bible.usccb.org${path}`,
      `https://www.usccb.org${path}`,
    ];

    let html = null;
    for (const url of urls) {
      const resp = await fetchWithFallback(url);
      if (resp.ok) {
        html = await resp.text();
        break;
      }
    }

    if (!html) {
      return res.status(502).json({ error: 'All USCCB endpoints returned non-ok status' });
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
