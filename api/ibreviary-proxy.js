const IBREVIARY_DOMAIN = 'https://www.ibreviary.com';

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

async function setDateSession(date) {
  const [y, m, d] = date.split('-');
  const params = new URLSearchParams({
    giorno: String(parseInt(d, 10)),
    mese: String(parseInt(m, 10)),
    anno: y,
    lang: 'en',
    ok: 'ok',
  });
  const jar = [];
  const resp = await fetch(`${IBREVIARY_DOMAIN}/m2/opzioni.php?b=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    body: params.toString(),
    redirect: 'manual',
  });
  collectCookies(resp, jar);
  return parseCookies(jar);
}

function rewriteUrls(html, date) {
  const qs = date ? `date=${date}&url=` : `url=`;
  return html
    .replace(
      '<head>',
      `<head><base href="${IBREVIARY_DOMAIN}/">`
    )
    .replace(
      /(href|src|action)="\/(?!api\/)/gi,
      (m) => `${m.slice(0, m.indexOf('"') + 1)}/api/ibreviary-proxy?${qs}/`
    );
}

function getContentType(path) {
  if (path.endsWith('.css')) return 'text/css; charset=utf-8';
  if (path.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.gif')) return 'image/gif';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.ico')) return 'image/x-icon';
  if (path.endsWith('.woff2')) return 'font/woff2';
  if (path.endsWith('.woff')) return 'font/woff';
  if (path.endsWith('.ttf')) return 'font/ttf';
  return 'text/html; charset=utf-8';
}

function isStaticResource(urlPath) {
  return /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|webp|avif)(\?|$)/i.test(urlPath);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { date, url } = req.query;
  const targetPath = url || '/m2/breviario.php?b=1';
  const fullUrl = `${IBREVIARY_DOMAIN}${targetPath}`;

  try {
    const isStatic = isStaticResource(targetPath);

    let cookieStr = '';
    if (date && !isStatic) {
      cookieStr = await setDateSession(date);
    }

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    };
    if (cookieStr) headers['Cookie'] = cookieStr;

    const resp = await fetch(fullUrl, {
      headers,
      signal: AbortSignal.timeout(20000),
    });

    if (!resp.ok) {
      return res.status(resp.status).json({ error: `iBreviary returned ${resp.status}` });
    }

    const contentType = resp.headers.get('content-type') || getContentType(targetPath);
    const isHtml = contentType.includes('text/html') && !isStatic;

    if (isHtml) {
      let html = await resp.text();
      html = rewriteUrls(html, date);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }

    const buffer = await resp.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    if (contentType.includes('font') || contentType.includes('image')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    return res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
