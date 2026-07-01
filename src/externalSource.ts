import { LiturgicalDay, Saint, Prayer, PrayerCategory, OfficeReading } from './types';

interface ExternalFetchResult<T> {
  data: T | null;
  source: string;
}

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
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

// ─── USCCB helpers ───

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

function extractSaintNameUsccb(html: string): string | null {
  const saintMatch = html.match(/Optional Memorial of\s+(.*?)</i);
  if (saintMatch) return saintMatch[1].trim();
  const saintLink = html.match(/bible\/readings\/\d{4}-memorial-(.*?)\.cfm/i);
  if (saintLink) {
    return saintLink[1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
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

// ─── iBreviary helpers ───

function extractIbreviaryContent(html: string): string {
  const m = html.match(/<div\s+id="contenuto">(.*?)<\/div>\s*<\/body>/s);
  if (!m) return html;
  return m[1];
}

function extractIbreviaryTitle(html: string): string {
  const h1 = html.match(/<h1>(.*?)<\/h1>/);
  if (h1) return cleanHtml(h1[1]);
  return '';
}

function extractIbreviaryFeastDesc(html: string): string {
  const p = html.match(/<h1>.*?<\/h1>\s*<p>(.*?)<\/p>\s*<p>(.*?)<\/p>/s);
  if (p) return cleanHtml(p[2]);
  return '';
}

function extractIbreviaryDateLabel(html: string): string {
  const p = html.match(/<h1>.*?<\/h1>\s*<p>(.*?)<\/p>/s);
  if (p) return cleanHtml(p[1]);
  return '';
}

function extractIbreviaryReadings(html: string): {
  firstReading: { ref: string; text: string } | null;
  psalm: { ref: string; text: string } | null;
  gospel: { ref: string; text: string } | null;
} {
  const content = extractIbreviaryContent(html);
  const readings: any = { firstReading: null, psalm: null, gospel: null };

  const sections = content.split(/<hr\s*\/?>/i);
  let currentTitle = '';

  for (const section of sections) {
    const titleMatch = section.match(/<span\s+class="titolo">(.*?)<\/span>/i);
    if (titleMatch) currentTitle = cleanHtml(titleMatch[1]).toLowerCase();

    const citationMatch = section.match(/<span\s+class="citazione">(.*?)<\/span>/i);
    const ref = citationMatch ? cleanHtml(citationMatch[1]) : '';

    let text = cleanHtml(section)
      .replace(/^.*?(?:first reading|responsorial psalm|acclamation before the gospel|gospel)\s*/i, '')
      .trim();

    if (currentTitle.includes('first reading')) {
      readings.firstReading = { ref, text };
    } else if (currentTitle.includes('responsorial psalm')) {
      const respMatch = section.match(/℟\.[^<]*<strong>(.*?)<\/strong>/);
      const respRef = respMatch ? cleanHtml(respMatch[1]) : ref;
      readings.psalm = { ref: respRef, text };
    } else if (currentTitle.includes('gospel') && !currentTitle.includes('acclamation')) {
      readings.gospel = { ref, text };
    }
  }

  return readings;
}

function extractPrayerContent(html: string, sectionName: string): Prayer | null {
  const content = extractIbreviaryContent(html);
  const dateLabel = extractIbreviaryDateLabel(html);

  const sections: string[] = [];
  const partRegex = /<span\s+class="capolettera_piccolo">(.*?)<\/span>/gi;
  let match;
  while ((match = partRegex.exec(content)) !== null) {
    sections.push(cleanHtml(match[1]));
  }

  let fullText = cleanHtml(content)
    .replace(/\*\*\*\*\*\*/g, '')
    .replace(/- Menu -/g, '')
    .trim();

  const titleBySection: Record<string, string> = {
    lodi: 'Morning Prayer',
    ora_media: 'Daytime Prayer',
    vespri: 'Evening Prayer',
    compieta: 'Night Prayer',
  };
  const categoryBySection: Record<string, PrayerCategory> = {
    lodi: 'morning',
    ora_media: 'noon',
    vespri: 'evening',
    compieta: 'night',
  };

  const hourLabel = titleBySection[sectionName] || sectionName;
  const category = categoryBySection[sectionName] || 'morning';

  return {
    id: `ibreviary-${sectionName}-${Date.now()}`,
    category,
    titleEn: `${hourLabel} - ${dateLabel}`,
    titleTa: `${hourLabel} - ${dateLabel}`,
    contentEn: fullText,
    contentTa: fullText,
    scriptureRefEn: '',
    scriptureRefTa: '',
  };
}

function extractOfficeReading(html: string, date: string): OfficeReading | null {
  const content = extractIbreviaryContent(html);
  const sectionRegex = /<span\s+class="capolettera_piccolo">(.*?)<\/span>/gi;
  let match;
  let currentSection = '';
  let readingText = '';
  let readingRef = '';

  const parts = content.split(/<span\s+class="capolettera_piccolo">/gi);
  for (const part of parts) {
    const secMatch = part.match(/^(.*?)<\/span>/i);
    const secName = secMatch ? cleanHtml(secMatch[1]).toLowerCase() : '';
    if (secName.includes('reading') || secName.includes('second reading')) {
      const refMatch = part.match(/<span\s+class="rubrica">(.*?)<\/span>/i);
      if (refMatch) readingRef = cleanHtml(refMatch[1]);
      readingText = cleanHtml(part);
      break;
    }
  }

  if (!readingText) return null;

  return {
    id: `ibreviary-office-${date}`,
    refEn: readingRef,
    refTa: readingRef,
    textEn: readingText,
    textTa: readingText,
  };
}

function extractSaintFromIbreviary(html: string, date: string): Saint | null {
  const content = extractIbreviaryContent(html);
  const feastDesc = extractIbreviaryFeastDesc(html);

  if (feastDesc && (feastDesc.toLowerCase().includes('saint') || feastDesc.toLowerCase().includes('memorial'))) {
    const monthDay = date.substring(5);
    const name = feastDesc.replace(/^(Optional )?(Memorial|Feast|Solemnity) of /i, '').trim();
    if (name && name.length < 100) {
      return {
        id: `ibreviary-saint-${monthDay}`,
        nameEn: name,
        nameTa: name,
        feastDate: monthDay,
        lifeHistoryEn: `Feast observed: ${feastDesc}. Source: iBreviary.`,
        lifeHistoryTa: `திருவிழா: ${feastDesc}. மூலம்: iBreviary.`,
      };
    }
  }
  return null;
}

function extractIbreviarySaintsList(html: string): { name: string; url: string }[] {
  const saints: { name: string; url: string }[] = [];
  const linkRegex = /<A\s+CLASS="santiebeati_linktesto"\s+HREF="(.*?)"[^>]*>([^<]+)<\/A>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    saints.push({ name: cleanHtml(match[2]), url: match[1] });
  }
  return saints;
}

function extractSeasonFromIbreviary(html: string): { seasonEn: string; color: string } {
  const content = extractIbreviaryContent(html);
  const tipo = content.match(/Tipo:\s*(.*?)<\/p>/i);
  if (!tipo) return { seasonEn: 'Ordinary Time', color: 'green' };
  const desc = tipo[1].toLowerCase();
  if (desc.includes('quaresima') || desc.includes('lent')) return { seasonEn: 'Lent', color: 'purple' };
  if (desc.includes('avvento') || desc.includes('advent')) return { seasonEn: 'Advent', color: 'purple' };
  if (desc.includes('pasqua') || desc.includes('easter')) return { seasonEn: 'Easter', color: 'white' };
  if (desc.includes('natale') || desc.includes('christmas')) return { seasonEn: 'Christmas', color: 'white' };
  return { seasonEn: 'Ordinary Time', color: 'green' };
}

// ─── API helpers ───

async function fetchViaApi(endpoint: string): Promise<string | null> {
  try {
    const resp = await fetch(endpoint, { signal: AbortSignal.timeout(15000) });
    if (!resp.ok) return null;
    return await resp.text();
  } catch {
    return null;
  }
}

async function fetchUsccbPage(date: string): Promise<string | null> {
  const path = getUsccbDatePath(date);
  const viaApi = await fetchViaApi(`/api/usccb?path=/bible/readings/${path}.cfm`);
  if (viaApi) return viaApi;
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

async function fetchIbreviarySection(section: string, date: string): Promise<string | null> {
  return fetchViaApi(`/api/ibreviary?section=${section}&date=${date}`);
}

// ─── USCCB parsers ───

function parseUsccbReadings(html: string, date: string): LiturgicalDay | null {
  try {
    const feastEn = extractFeastName(html);
    const firstReading = extractFirstReading(html);
    const psalm = extractPsalmBlock(html);
    const gospel = extractGospelBlock(html);
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
    const name = extractSaintNameUsccb(html);
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

// ─── iBreviary parsers ───

function parseIbreviaryReadings(html: string, date: string): LiturgicalDay | null {
  try {
    const feastDesc = extractIbreviaryFeastDesc(html) || extractIbreviaryTitle(html);
    const readings = extractIbreviaryReadings(html);
    const { seasonEn, color } = extractSeasonFromIbreviary(html);

    if (!readings.firstReading && !readings.gospel) return null;

    return {
      date,
      seasonEn,
      seasonTa: seasonEn,
      color,
      feastEn: feastDesc || 'Daily Mass',
      feastTa: feastDesc || 'தினசரி திருப்பலி',
      readingFirstRefEn: readings.firstReading?.ref || '',
      readingFirstRefTa: readings.firstReading?.ref || '',
      readingFirstEn: readings.firstReading?.text || '',
      readingFirstTa: readings.firstReading?.text || '',
      psalmRefEn: readings.psalm?.ref || '',
      psalmRefTa: readings.psalm?.ref || '',
      psalmEn: readings.psalm?.text || '',
      psalmTa: readings.psalm?.text || '',
      gospelRefEn: readings.gospel?.ref || '',
      gospelRefTa: readings.gospel?.ref || '',
      gospelEn: readings.gospel?.text || '',
      gospelTa: readings.gospel?.text || '',
      officeRefEn: '',
      officeRefTa: '',
      officeEn: '',
      officeTa: '',
    };
  } catch {
    return null;
  }
}

// ─── Exported fetch functions ───

export async function fetchExternalReadings(date: string): Promise<ExternalFetchResult<LiturgicalDay>> {
  let html = await fetchUsccbPage(date);
  if (html) {
    const data = parseUsccbReadings(html, date);
    if (data) return { data, source: 'USCCB' };
  }

  html = await fetchIbreviarySection('readings', date);
  if (html) {
    const data = parseIbreviaryReadings(html, date);
    if (data) return { data, source: 'iBreviary' };
  }

  return { data: null, source: 'none' };
}

export async function fetchExternalSaint(date: string): Promise<ExternalFetchResult<Saint>> {
  let html = await fetchUsccbPage(date);
  if (html) {
    const data = parseUsccbSaint(html, date);
    if (data) return { data, source: 'USCCB' };
  }

  html = await fetchIbreviarySection('lodi', date);
  if (html) {
    const data = extractSaintFromIbreviary(html, date);
    if (data) return { data, source: 'iBreviary' };
  }

  return { data: null, source: 'none' };
}

export async function fetchExternalPrayers(date: string): Promise<ExternalFetchResult<Prayer[]>> {
  const hours = ['lodi', 'ora_media', 'vespri', 'compieta'];
  const prayers: Prayer[] = [];
  let source = 'none';

  for (const hour of hours) {
    const html = await fetchIbreviarySection(hour, date);
    if (!html) continue;
    source = 'iBreviary';
    const prayer = extractPrayerContent(html, hour);
    if (prayer) prayers.push(prayer);
  }

  if (prayers.length > 0) return { data: prayers, source };
  return { data: null, source: 'none' };
}

export async function fetchExternalOfficeReading(date: string): Promise<ExternalFetchResult<OfficeReading>> {
  const html = await fetchIbreviarySection('ufficio_delle_letture', date);
  if (!html) return { data: null, source: 'none' };

  const data = extractOfficeReading(html, date);
  if (data) return { data, source: 'iBreviary' };
  return { data: null, source: 'none' };
}

export async function fetchExternalFeastInfo(date: string): Promise<ExternalFetchResult<{ feastEn: string; dateLabel: string }>> {
  const html = await fetchIbreviarySection('lodi', date);
  if (!html) return { data: null, source: 'none' };

  const feastDesc = extractIbreviaryFeastDesc(html);
  const dateLabel = extractIbreviaryDateLabel(html);
  if (feastDesc || dateLabel) {
    return { data: { feastEn: feastDesc || dateLabel, dateLabel }, source: 'iBreviary' };
  }
  return { data: null, source: 'none' };
}
