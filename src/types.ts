export type PrayerCategory = 'morning' | 'noon' | 'evening' | 'night' | 'office';

export interface Prayer {
  id: string; // e.g. 'morning-prayer-1', 'custom-123'
  category: PrayerCategory;
  titleEn: string;
  titleTa: string;
  contentEn: string;
  contentTa: string;
  scriptureRefEn?: string;
  scriptureRefTa?: string;
  isCustom?: boolean;
}

export interface Saint {
  id: string;
  nameEn: string;
  nameTa: string;
  feastDate: string; // MM-DD format e.g. "06-19"
  lifeHistoryEn: string;
  lifeHistoryTa: string;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface LiturgicalDay {
  id?: string;
  date: string; // YYYY-MM-DD e.g. "2026-06-19"
  seasonEn: string; // e.g. "Ordinary Time", "Advent"
  seasonTa: string; // e.g. "சாதாரண காலம்", "வருகை காலம்"
  color: string; // Purple, Green, White, Red
  feastEn: string; // e.g. "St. Romuald, Abbot"
  feastTa: string; // e.g. "புனித ரொமுவால்டு, மடாதிபதி"
  readingFirstRefEn: string;
  readingFirstRefTa: string;
  readingFirstEn: string;
  readingFirstTa: string;
  psalmRefEn: string;
  psalmRefTa: string;
  psalmEn: string;
  psalmTa: string;
  gospelRefEn: string;
  gospelRefTa: string;
  gospelEn: string;
  gospelTa: string;
  officeRefEn?: string;
  officeRefTa?: string;
  officeEn?: string;
  officeTa?: string;
  isCustom?: boolean;
}

export interface JournalEntry {
  id: string;
  date: string; // DateTime ISO
  title: string;
  reflection: string;
  associatedPrayerId?: string;
}

export interface Bookmark {
  id: string;
  itemType: 'prayer' | 'saint' | 'reading';
  itemId: string; // ID of primary prayer, saint feastDate, or liturgical's date
  titleEn: string;
  titleTa: string;
}

export interface UserSettings {
  language: 'ta' | 'en';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily?: 'serif' | 'sans' | 'mono';
  fontColor?: 'default' | 'amber' | 'sepia' | 'emerald' | 'blue';
  highContrast?: boolean;
  darkMode: boolean;
}

export interface AdBanner {
  id: string;
  active: boolean;
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
  linkUrl: string;
  theme: 'gold' | 'burgundy' | 'indigo' | 'charcoal';
}

export interface ParishUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'parishioner' | 'catechist' | 'choir_leader' | 'pastor';
  registeredDate: string;
}

export interface OfficeReading {
  id: string;
  refEn: string;
  refTa: string;
  textEn: string;
  textTa: string;
  isCustom?: boolean;
}

export interface Announcement {
  id: string;
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
  date: string; // YYYY-MM-DD
  category: string; // e.g. "festival", "youth", "liturgy", "general"
  theme: 'gold' | 'burgundy' | 'indigo' | 'charcoal';
}

export interface PdfDocument {
  id: string;
  date: string;
  category: 'morning' | 'noon' | 'evening' | 'night' | 'office' | 'saints' | 'readings';
  language: 'en' | 'ta';
  title: string;
  fileName: string;
  filePath: string;
  fileSize?: number;
  contentType?: string;
  uploadedBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  extractedText?: string;
  pageCount?: number;
}

