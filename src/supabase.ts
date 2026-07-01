/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Prayer, Saint, LiturgicalDay, JournalEntry, Bookmark,
  OfficeReading, Announcement, ParishUser, AdBanner, PdfDocument
} from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

async function extractPdfText(file: File): Promise<string> {
  const { getDocument } = await import('pdfjs-dist/build/pdf.mjs');
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += `\n--- Page ${i} ---\n${pageText}`;
  }
  return fullText.trim();
}

function createSupabaseClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

// Persist client across HMR by attaching to window
let supabaseInstance: SupabaseClient | null = null;
if (!(window as any).__supabaseClient) {
  (window as any).__supabaseClient = createSupabaseClient();
}
supabaseInstance = (window as any).__supabaseClient;

export function getSupabase(): SupabaseClient {
  return supabaseInstance;
}

export const supabase = getSupabase();

export function getPdfStorageUrl(path: string): string {
  const { data } = supabase.storage.from('pdfs').getPublicUrl(path);
  return data.publicUrl;
}

// --- Auth ---

export async function loginAsAdmin(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function logoutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

export async function getAdminEmailSync(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.email || null;
}

export async function getAdminEmail(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email || null;
}

export function onAuthStateChange(callback: (event: string, session: any) => void): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription?.unsubscribe();
}

// --- Helpers ---

function mapRecord<T>(record: any): T {
  return record as T;
}

// --- Prayers ---

export async function fetchPrayers(): Promise<Prayer[]> {
  const { data, error } = await supabase
    .from('prayers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(r => mapPrayerFromDb(r));
}

export function mapPrayerFromDb(r: any): Prayer {
  return {
    id: r.id,
    date: r.date || '',
    category: r.category,
    titleEn: r.title_en,
    titleTa: r.title_ta,
    contentEn: r.content_en,
    contentTa: r.content_ta,
    scriptureRefEn: r.scripture_ref_en,
    scriptureRefTa: r.scripture_ref_ta,
    isCustom: r.is_custom,
  };
}

function mapPrayerToDb(prayer: Prayer): any {
  return {
    date: prayer.date,
    category: prayer.category,
    title_en: prayer.titleEn,
    title_ta: prayer.titleTa,
    content_en: prayer.contentEn,
    content_ta: prayer.contentTa,
    scripture_ref_en: prayer.scriptureRefEn,
    scripture_ref_ta: prayer.scriptureRefTa,
    is_custom: prayer.isCustom,
  };
}

export async function savePrayer(prayer: Prayer): Promise<void> {
  const dbData = { id: prayer.id, ...mapPrayerToDb(prayer) };
  const { error } = await supabase.from('prayers').upsert(dbData, { onConflict: 'date,category' });
  if (error) throw error;
}

export async function deletePrayer(id: string): Promise<void> {
  const { error } = await supabase.from('prayers').delete().eq('id', id);
  if (error) throw error;
}

// --- Saints ---

export async function fetchSaints(): Promise<Saint[]> {
  const { data, error } = await supabase
    .from('saints')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(r => mapSaintFromDb(r));
}

export function mapSaintFromDb(r: any): Saint {
  return {
    id: r.id,
    nameEn: r.name_en,
    nameTa: r.name_ta,
    feastDate: r.feast_date,
    lifeHistoryEn: r.life_history_en,
    lifeHistoryTa: r.life_history_ta,
    imageUrl: r.image_url,
    isCustom: r.is_custom,
  };
}

function mapSaintToDb(saint: Saint): any {
  return {
    name_en: saint.nameEn,
    name_ta: saint.nameTa,
    feast_date: saint.feastDate,
    life_history_en: saint.lifeHistoryEn,
    life_history_ta: saint.lifeHistoryTa,
    image_url: saint.imageUrl,
    is_custom: saint.isCustom,
  };
}

export async function saveSaint(saint: Saint): Promise<void> {
  const dbData = { id: saint.id, ...mapSaintToDb(saint) };
  const { error } = await supabase.from('saints').upsert(dbData, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteSaint(id: string): Promise<void> {
  const { error } = await supabase.from('saints').delete().eq('id', id);
  if (error) throw error;
}

// --- Liturgical Days ---

export async function fetchLiturgicalDays(): Promise<LiturgicalDay[]> {
  const { data, error } = await supabase
    .from('liturgical_days')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(r => mapLiturgicalDayFromDb(r));
}

export function mapLiturgicalDayFromDb(r: any): LiturgicalDay {
  return {
    id: r.id,
    date: r.date,
    seasonEn: r.season_en,
    seasonTa: r.season_ta,
    color: r.color,
    feastEn: r.feast_en,
    feastTa: r.feast_ta,
    readingFirstRefEn: r.reading_first_ref_en,
    readingFirstRefTa: r.reading_first_ref_ta,
    readingFirstEn: r.reading_first_en,
    readingFirstTa: r.reading_first_ta,
    psalmRefEn: r.psalm_ref_en,
    psalmRefTa: r.psalm_ref_ta,
    psalmEn: r.psalm_en,
    psalmTa: r.psalm_ta,
    gospelRefEn: r.gospel_ref_en,
    gospelRefTa: r.gospel_ref_ta,
    gospelEn: r.gospel_en,
    gospelTa: r.gospel_ta,
    officeRefEn: r.office_ref_en,
    officeRefTa: r.office_ref_ta,
    officeEn: r.office_en,
    officeTa: r.office_ta,
    isCustom: r.is_custom,
  };
}

export async function saveLiturgicalDay(day: LiturgicalDay): Promise<void> {
  const { date, ...rest } = day;
  const dbData = {
    id: day.id,
    date,
    season_en: rest.seasonEn,
    season_ta: rest.seasonTa,
    color: rest.color,
    feast_en: rest.feastEn,
    feast_ta: rest.feastTa,
    reading_first_ref_en: rest.readingFirstRefEn,
    reading_first_ref_ta: rest.readingFirstRefTa,
    reading_first_en: rest.readingFirstEn,
    reading_first_ta: rest.readingFirstTa,
    psalm_ref_en: rest.psalmRefEn,
    psalm_ref_ta: rest.psalmRefTa,
    psalm_en: rest.psalmEn,
    psalm_ta: rest.psalmTa,
    gospel_ref_en: rest.gospelRefEn,
    gospel_ref_ta: rest.gospelRefTa,
    gospel_en: rest.gospelEn,
    gospel_ta: rest.gospelTa,
    office_ref_en: rest.officeRefEn,
    office_ref_ta: rest.officeRefTa,
    office_en: rest.officeEn,
    office_ta: rest.officeTa,
    is_custom: rest.isCustom,
  };
  const { error } = await supabase.from('liturgical_days').upsert(dbData, { onConflict: 'date' });
  if (error) throw error;
}

export async function deleteLiturgicalDay(date: string): Promise<void> {
  const { error } = await supabase.from('liturgical_days').delete().eq('date', date);
  if (error) throw error;
}

// --- Office Readings ---

export async function fetchOfficeReadings(): Promise<OfficeReading[]> {
  const { data, error } = await supabase
    .from('office_readings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(r => mapOfficeReadingFromDb(r));
}

export function mapOfficeReadingFromDb(r: any): OfficeReading {
  return {
    id: r.id,
    refEn: r.ref_en,
    refTa: r.ref_ta,
    textEn: r.text_en,
    textTa: r.text_ta,
    isCustom: r.is_custom,
  };
}

export async function saveOfficeReading(reading: OfficeReading): Promise<void> {
  const dbData = { id: reading.id, ...{
    ref_en: reading.refEn,
    ref_ta: reading.refTa,
    text_en: reading.textEn,
    text_ta: reading.textTa,
    is_custom: reading.isCustom,
  }};
  const { error } = await supabase.from('office_readings').upsert(dbData, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteOfficeReading(id: string): Promise<void> {
  const { error } = await supabase.from('office_readings').delete().eq('id', id);
  if (error) throw error;
}

// --- Journal Entries ---

export async function fetchJournalEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(r => ({
    id: r.id,
    date: r.date,
    title: r.title,
    reflection: r.reflection,
    associatedPrayerId: r.associated_prayer_id,
  }));
}

export async function saveJournalEntry(userId: string, entry: JournalEntry): Promise<void> {
  const dbData = {
    id: entry.id,
    user_id: userId,
    date: entry.date,
    title: entry.title,
    reflection: entry.reflection,
    associated_prayer_id: entry.associatedPrayerId,
  };
  const { error } = await supabase.from('journal_entries').upsert(dbData, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id);
  if (error) throw error;
}

// --- Bookmarks ---

export async function fetchBookmarks(userId: string): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(r => ({
    id: r.id,
    itemType: r.item_type,
    itemId: r.item_id,
    titleEn: r.title_en,
    titleTa: r.title_ta,
  }));
}

export async function saveBookmark(userId: string, bookmark: Bookmark): Promise<void> {
  const dbData = {
    id: bookmark.id,
    user_id: userId,
    item_type: bookmark.itemType,
    item_id: bookmark.itemId,
    title_en: bookmark.titleEn,
    title_ta: bookmark.titleTa,
  };
  const { error } = await supabase.from('bookmarks').upsert(dbData, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteBookmark(id: string): Promise<void> {
  const { error } = await supabase.from('bookmarks').delete().eq('id', id);
  if (error) throw error;
}

// --- PDF Documents ---

export async function fetchPdfDocuments(): Promise<PdfDocument[]> {
  const { data, error } = await supabase
    .from('pdf_documents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(r => ({
    id: r.id,
    date: r.date,
    category: r.category,
    language: r.language,
    title: r.title,
    fileName: r.file_name,
    filePath: r.file_path,
    fileSize: r.file_size,
    contentType: r.content_type,
    uploadedBy: r.uploaded_by,
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    extractedText: r.extracted_text,
    pageCount: r.page_count,
  }));
}

export async function fetchPdfDocumentsByDate(date: string, lang?: 'en' | 'ta'): Promise<PdfDocument[]> {
  let query = supabase
    .from('pdf_documents')
    .select('*')
    .eq('date', date)
    .order('category');
  if (lang) query = query.eq('language', lang);
  const { data, error } = await query;
  if (error) throw error;
  return data.map(r => ({
    id: r.id,
    date: r.date,
    category: r.category,
    language: r.language,
    title: r.title,
    fileName: r.file_name,
    filePath: r.file_path,
    fileSize: r.file_size,
    contentType: r.content_type,
    uploadedBy: r.uploaded_by,
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    extractedText: r.extracted_text,
    pageCount: r.page_count,
  }));
}

export async function uploadPdf(
  file: File,
  date: string,
  category: string,
  language: 'en' | 'ta',
  title: string,
): Promise<PdfDocument> {
  // Try refreshing the session first (handles expired tokens)
  const { error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) {
    console.warn('Session refresh failed:', refreshError.message);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Auth error: Auth session missing! Please log in again.');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `${category}/${date}/${language}_${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(fileName, file, {
      contentType: 'application/pdf',
      cacheControl: '3600',
    });
  if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

  const { data, error: dbError } = await supabase
    .from('pdf_documents')
    .insert({
      date,
      category,
      language,
      title,
      file_name: file.name,
      file_path: fileName,
      file_size: file.size,
      content_type: 'application/pdf',
      uploaded_by: user.id,
      is_active: true,
    })
    .select()
    .single();

  if (dbError) throw dbError;

  let extractedText = '';
  let pageCount = 0;
  try {
    extractedText = await extractPdfText(file);
    pageCount = extractedText.split('--- Page ').length - 1;
  } catch (err) {
    console.warn('PDF text extraction failed:', err);
  }

  if (extractedText) {
    const { error: updateError } = await supabase
      .from('pdf_documents')
      .update({ extracted_text: extractedText, page_count: pageCount })
      .eq('id', data.id);
    if (updateError) console.warn('Failed to save extracted text:', updateError);
  }

  return {
    id: data.id,
    date: data.date,
    category: data.category,
    language: data.language,
    title: data.title,
    fileName: data.file_name,
    filePath: data.file_path,
    fileSize: data.file_size,
    contentType: data.content_type,
    uploadedBy: data.uploaded_by,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    extractedText: extractedText || undefined,
    pageCount: pageCount || undefined,
  };
}

export async function deletePdfDocument(id: string, filePath: string): Promise<void> {
  const { error: storageError } = await supabase.storage.from('pdfs').remove([filePath]);
  if (storageError) console.warn('Storage remove failed:', storageError);
  const { error } = await supabase.from('pdf_documents').delete().eq('id', id);
  if (error) throw error;
}

// --- Announcements ---

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(r => ({
    id: r.id,
    titleEn: r.title_en,
    titleTa: r.title_ta,
    descEn: r.desc_en,
    descTa: r.desc_ta,
    date: r.date,
    category: r.category,
    theme: r.theme,
  }));
}

export async function saveAnnouncement(ann: Announcement): Promise<void> {
  const dbData = {
    id: ann.id,
    title_en: ann.titleEn,
    title_ta: ann.titleTa,
    desc_en: ann.descEn,
    desc_ta: ann.descTa,
    date: ann.date,
    category: ann.category,
    theme: ann.theme,
  };
  const { error } = await supabase.from('announcements').upsert(dbData, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
}

// --- Parish Users ---

export async function fetchParishUsers(): Promise<ParishUser[]> {
  const { data, error } = await supabase
    .from('parish_users')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(r => ({
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    phoneNumber: r.phone_number,
    role: r.role,
    registeredDate: r.registered_date,
  }));
}

export async function saveParishUser(user: ParishUser): Promise<void> {
  const dbData = {
    id: user.id,
    full_name: user.fullName,
    email: user.email,
    phone_number: user.phoneNumber,
    role: user.role,
    registered_date: user.registeredDate,
  };
  const { error } = await supabase.from('parish_users').upsert(dbData, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteParishUser(id: string): Promise<void> {
  const { error } = await supabase.from('parish_users').delete().eq('id', id);
  if (error) throw error;
}

// --- Ad Banner ---

export async function fetchAdBanner(): Promise<AdBanner | null> {
  const { data, error } = await supabase
    .from('ad_banners')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    active: data.active,
    titleEn: data.title_en,
    titleTa: data.title_ta,
    descEn: data.desc_en,
    descTa: data.desc_ta,
    linkUrl: data.link_url,
    theme: data.theme,
  };
}

export async function saveAdBanner(banner: AdBanner): Promise<void> {
  const dbData = {
    id: banner.id,
    active: banner.active,
    title_en: banner.titleEn,
    title_ta: banner.titleTa,
    desc_en: banner.descEn,
    desc_ta: banner.descTa,
    link_url: banner.linkUrl,
    theme: banner.theme,
  };
  const { error } = await supabase.from('ad_banners').upsert(dbData, { onConflict: 'id' });
  if (error) throw error;
}

// --- Realtime Subscriptions ---

export function subscribePrayers(callback: (action: string, record: Prayer) => void): () => void {
  const channel = supabase
    .channel('prayers-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'prayers' },
      (payload) => {
        const raw = payload.new || payload.old;
        callback(payload.eventType, mapPrayerFromDb(raw));
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeSaints(callback: (action: string, record: Saint) => void): () => void {
  const channel = supabase
    .channel('saints-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'saints' },
      (payload) => {
        const raw = payload.new || payload.old;
        callback(payload.eventType, mapSaintFromDb(raw));
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeLiturgicalDays(callback: (action: string, record: LiturgicalDay) => void): () => void {
  const channel = supabase
    .channel('liturgical-days-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'liturgical_days' },
      (payload) => {
        const raw = payload.new || payload.old;
        callback(payload.eventType, mapLiturgicalDayFromDb(raw));
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeOfficeReadings(callback: (action: string, record: OfficeReading) => void): () => void {
  const channel = supabase
    .channel('office-readings-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'office_readings' },
      (payload) => {
        const raw = payload.new || payload.old;
        callback(payload.eventType, mapOfficeReadingFromDb(raw));
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeJournalEntries(userId: string, callback: (action: string, record: JournalEntry) => void): () => void {
  const channel = supabase
    .channel('journal-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'journal_entries', filter: `user_id=eq.${userId}` },
      (payload) => {
        const raw = (payload.new || payload.old) as any;
        callback(payload.eventType, {
          id: raw.id,
          date: raw.date,
          title: raw.title,
          reflection: raw.reflection,
          associatedPrayerId: raw.associated_prayer_id,
        });
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeBookmarks(userId: string, callback: (action: string, record: Bookmark) => void): () => void {
  const channel = supabase
    .channel('bookmarks-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` },
      (payload) => {
        const raw = (payload.new || payload.old) as any;
        callback(payload.eventType, {
          id: raw.id,
          itemType: raw.item_type,
          itemId: raw.item_id,
          titleEn: raw.title_en,
          titleTa: raw.title_ta,
        });
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribePdfDocuments(callback: (action: string, record: any) => void): () => void {
  const channel = supabase
    .channel('pdf-documents-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'pdf_documents' },
      (payload) => {
        const raw = payload.new || payload.old;
        callback(payload.eventType, raw);
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribePdfDocumentsByDate(date: string, callback: (action: string, record: any) => void): () => void {
  const channel = supabase
    .channel(`pdf-documents-${date}-changes`)
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'pdf_documents', filter: `date=eq.${date}` },
      (payload) => {
        const raw = payload.new || payload.old;
        callback(payload.eventType, raw);
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeAnnouncements(callback: (action: string, record: any) => void): () => void {
  const channel = supabase
    .channel('announcements-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'announcements' },
      (payload) => {
        const raw = payload.new || payload.old;
        callback(payload.eventType, raw);
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

// --- Seed functions (deprecated) ---

export async function seedPrayers(prayers: Prayer[]): Promise<void> {
  for (const p of prayers) {
    const { data: existing } = await supabase
      .from('prayers')
      .select('id')
      .eq('category', p.category)
      .maybeSingle();
    if (!existing) {
      await supabase.from('prayers').insert(mapPrayerToDb(p));
    }
  }
}

export async function seedSaints(saints: Saint[]): Promise<void> {
  for (const s of saints) {
    const { data: existing } = await supabase
      .from('saints')
      .select('id')
      .eq('feast_date', s.feastDate)
      .maybeSingle();
    if (!existing) {
      await supabase.from('saints').insert(mapSaintToDb(s));
    }
  }
}

export async function seedLiturgicalDays(days: LiturgicalDay[]): Promise<void> {
  for (const d of days) {
    const { data: existing } = await supabase
      .from('liturgical_days')
      .select('id')
      .eq('date', d.date)
      .maybeSingle();
    if (!existing) {
      await supabase.from('liturgical_days').insert({
        date: d.date,
        season_en: d.seasonEn || '',
        season_ta: d.seasonTa || '',
        color: d.color || 'green',
        feast_en: d.feastEn || '',
        feast_ta: d.feastTa || '',
        reading_first_ref_en: d.readingFirstRefEn || '',
        reading_first_ref_ta: d.readingFirstRefTa || '',
        reading_first_en: d.readingFirstEn || '',
        reading_first_ta: d.readingFirstTa || '',
        psalm_ref_en: d.psalmRefEn || '',
        psalm_ref_ta: d.psalmRefTa || '',
        psalm_en: d.psalmEn || '',
        psalm_ta: d.psalmTa || '',
        gospel_ref_en: d.gospelRefEn || '',
        gospel_ref_ta: d.gospelRefTa || '',
        gospel_en: d.gospelEn || '',
        gospel_ta: d.gospelTa || '',
      });
    }
  }
}

export async function seedOfficeReadings(readings: OfficeReading[]): Promise<void> {
  for (const r of readings) {
    const { data: existing } = await supabase
      .from('office_readings')
      .select('id')
      .eq('ref_en', r.refEn)
      .maybeSingle();
    if (!existing) {
      await supabase.from('office_readings').insert({
        ref_en: r.refEn,
        ref_ta: r.refTa,
        text_en: r.textEn,
        text_ta: r.textTa,
      });
    }
  }
}
