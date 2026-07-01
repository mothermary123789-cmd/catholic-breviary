import { LiturgicalDay, Saint, Prayer, PrayerCategory, OfficeReading } from './types';

interface ExternalFetchResult<T> {
  data: T | null;
  source: string;
}

const USCCB_BASE = 'https://bible.usccb.org';

function getUsccbDatePath(date: string): string {
  const [y, m, d] = date.split('-');
  return `${m}${d}${y.slice(2)}`;
}

function extractBetween(text: string, start: string, end: string): string {
  const s = text.indexOf(start);
  if (s === -1) return '';
  const from = s + start.length;
  const e = text.indexOf(end, from);
  if (e === -1) return text.slice(from);
  return text.slice(from, e);
}

function cleanHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

function extractReadingBlock(html: string, readingLabel: string): { ref: string; text: string } | null {
  const labelPattern = `<h3[^>]*class="name"[^>]*>${readingLabel}</h3>`;
  const match = html.match(new RegExp(labelPattern, 'i'));
  if (!match) return null;

  const afterLabel = html.slice(match.index! + match[0].length);

  const addrMatch = afterLabel.match(/<div\s+class="address">(.*?)<\/div>/s);
  const ref = addrMatch ? cleanHtml(addrMatch[1]) : '';

  const bodyMatch = afterLabel.match(/<div\s+class="content-body">(.*?)(?=<div\s+class="content-header|<div\s+class="b-note)/s);
  const text = bodyMatch ? cleanHtml(bodyMatch[1]) : '';

  return { ref, text };
}

function extractFeastName(html: string): string {
  const titleMatch = html.match(/<title>(.*?)\s*\|?\s*USCCB\s*<\/title>/i);
  if (titleMatch) return titleMatch[1].trim();

  const h2Match = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
  if (h2Match) return cleanHtml(h2Match[1]);

  return '';
}

function extractSaintName(html: string): string | null {
  const saintMatch = html.match(/Optional Memorial of\s+(.*?)</i);
  if (saintMatch) return saintMatch[1].trim();

  const saintLink = html.match(/bible\/readings\/\d{4}-memorial-(.*?)\.cfm/i);
  if (saintLink) {
    return saintLink[1]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return null;
}

function inferSeasonAndColor(feastName: string): { seasonEn: string; seasonTa: string; color: string } {
  const lower = feastName.toLowerCase();
  if (lower.includes('advent')) return { seasonEn: 'Advent', seasonTa: 'வருகைக் காலம்', color: 'purple' };
  if (lower.includes('lent')) return { seasonEn: 'Lent', seasonTa: 'தவக் காலம்', color: 'purple' };
  if (lower.includes('easter')) return { seasonEn: 'Easter', seasonTa: 'பாஸ்கா காலம்', color: 'white' };
  if (lower.includes('christmas')) return { seasonEn: 'Christmas', seasonTa: 'கிறிஸ்துமஸ் காலம்', color: 'white' };
  if (lower.includes('assumption')) return { seasonEn: 'Assumption', seasonTa: 'விண்ணேற்பு பெருவிழா', color: 'white' };
  if (lower.includes('all saint') || lower.includes('all soul')) return { seasonEn: 'All Saints / Souls', seasonTa: 'அனைத்து புனிதர் நினைவு', color: 'white' };
  if (lower.includes('saint') || lower.includes('memorial') || lower.includes('feast') || lower.includes('solemnity')) {
    if (lower.includes('martyr')) return { seasonEn: 'Memorial', seasonTa: 'நினைவு', color: 'red' };
    return { seasonEn: 'Memorial', seasonTa: 'நினைவு', color: 'white' };
  }
  return { seasonEn: 'Ordinary Time', seasonTa: 'சாதாரண காலம்', color: 'green' };
}

function extractPsalmBlock(html: string): { ref: string; text: string } | null {
  const psMatch = html.match(/<h3[^>]*class="name"[^>]*>Responsorial\s*Psalm<\/h3>/i);
  if (!psMatch) return null;

  const after = html.slice(psMatch.index! + psMatch[0].length);
  const addrMatch = after.match(/<div\s+class="address">(.*?)<\/div>/s);
  const ref = addrMatch ? cleanHtml(addrMatch[1]) : '';

  const bodyMatch = after.match(/<div\s+class="content-body">(.*?)(?=<div\s+class="content-header|<div\s+class="b-note)/s);
  const text = bodyMatch ? cleanHtml(bodyMatch[1]) : '';

  return { ref, text };
}

function extractGospelBlock(html: string): { ref: string; text: string } | null {
  return extractReadingBlock(html, 'Gospel');
}

function extractFirstReading(html: string): { ref: string; text: string } | null {
  return extractReadingBlock(html, 'Reading I');
}

function extractAlleluiaText(html: string): string {
  const bodyMatch = html.match(/Alleluia<\/h3>.*?<div\s+class="content-body">(.*?)(?=<div\s+class="content-header|<div\s+class="b-note)/s);
  if (!bodyMatch) return '';
  return cleanHtml(bodyMatch[1]);
}

async function fetchUsccbPage(date: string): Promise<string | null> {
  const path = getUsccbDatePath(date);
  try {
    const resp = await fetch(`/api/usccb/bible/readings/${path}.cfm`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!resp.ok) return null;
    return await resp.text();
  } catch {
    return null;
  }
}

function parseUsccbReadings(html: string, date: string): LiturgicalDay | null {
  try {
    const feastEn = extractFeastName(html);
    const firstReading = extractFirstReading(html);
    const psalm = extractPsalmBlock(html);
    const gospel = extractGospelBlock(html);
    const saintName = extractSaintName(html);
    const { seasonEn, seasonTa, color } = inferSeasonAndColor(feastEn);

    if (!feastEn && !firstReading && !gospel) return null;

    return {
      date,
      seasonEn,
      seasonTa: seasonTa || seasonEn,
      color,
      feastEn: feastEn || 'Daily Mass',
      feastTa: feastEn || 'தினசரி திருப்பலி',
      readingFirstRefEn: firstReading?.ref || '',
      readingFirstRefTa: firstReading?.ref || '',
      readingFirstEn: firstReading?.text || '',
      readingFirstTa: firstReading?.text || '',
      psalmRefEn: psalm?.ref || '',
      psalmRefTa: psalm?.ref || '',
      psalmEn: psalm?.text || '',
      psalmTa: psalm?.text || '',
      gospelRefEn: gospel?.ref || '',
      gospelRefTa: gospel?.ref || '',
      gospelEn: gospel?.text || '',
      gospelTa: gospel?.text || '',
      officeRefEn: '',
      officeRefTa: '',
      officeEn: '',
      officeTa: '',
    };
  } catch {
    return null;
  }
}

function parseUsccbSaint(html: string, date: string): Saint | null {
  try {
    const name = extractSaintName(html);
    if (!name) return null;

    const monthDay = date.substring(5);
    return {
      id: `external-saint-${monthDay}`,
      nameEn: name,
      nameTa: name,
      feastDate: monthDay,
      lifeHistoryEn: `Feast of ${name}. Source: USCCB Daily Readings.`,
      lifeHistoryTa: `புனித ${name} திருவிழா. மூலம்: USCCB தினசரி வாசகங்கள்.`,
    };
  } catch {
    return null;
  }
}

export async function fetchExternalReadings(date: string): Promise<ExternalFetchResult<LiturgicalDay | null>> {
  const html = await fetchUsccbPage(date);
  if (!html) return { data: null, source: 'none' };

  const readings = parseUsccbReadings(html, date);
  if (readings) return { data: readings, source: 'USCCB' };

  return { data: null, source: 'none' };
}

export async function fetchExternalSaint(date: string): Promise<ExternalFetchResult<Saint | null>> {
  const html = await fetchUsccbPage(date);
  if (!html) return { data: null, source: 'none' };

  const saint = parseUsccbSaint(html, date);
  if (saint) return { data: saint, source: 'USCCB' };

  return { data: null, source: 'none' };
}

export async function fetchExternalOfficeReading(_date: string): Promise<ExternalFetchResult<OfficeReading | null>> {
  return { data: null, source: 'none' };
}

export async function fetchExternalPrayers(): Promise<ExternalFetchResult<Prayer[] | null>> {
  return { data: null, source: 'none' };
}
