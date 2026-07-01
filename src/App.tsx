import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Sparkles, 
  PenTool, 
  Bookmark as BookmarkIcon,
  Settings,
  Moon, 
  Sun, 
  Globe, 
  Download, 
  Search,
  Check,
  RefreshCw,
  Lock,
  ArrowRight,
  BookmarkCheck,
  Smartphone,
  Database,
  Type,
  Compass,
  HelpCircle,
  Megaphone,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react';
import { Prayer, Saint, LiturgicalDay, JournalEntry, Bookmark, UserSettings, PrayerCategory, AdBanner, ParishUser, Announcement, OfficeReading, PdfDocument } from './types';

import { JournalReflections } from './components/JournalReflections';
import { AdminPanel } from './components/AdminPanel';
import { RosarySection } from './components/RosarySection';
import { PdfReader } from './components/PdfReader';
import { supabase, onAuthStateChange, getAdminEmail } from './supabase';
import { fetchPrayers, savePrayer, deletePrayer, fetchSaints, saveSaint, deleteSaint, fetchLiturgicalDays, saveLiturgicalDay, deleteLiturgicalDay, fetchOfficeReadings, saveOfficeReading, deleteOfficeReading, fetchJournalEntries, fetchBookmarks, saveJournalEntry, deleteJournalEntry, saveBookmark, deleteBookmark, subscribePrayers, subscribeSaints, subscribeLiturgicalDays, subscribeOfficeReadings, subscribeJournalEntries, subscribeBookmarks, subscribePdfDocuments, fetchPdfDocuments, fetchPdfDocumentsByDate, getPdfStorageUrl, fetchAnnouncements, saveAnnouncement, deleteAnnouncement, fetchParishUsers, saveParishUser, deleteParishUser, fetchAdBanner, saveAdBanner, subscribeAnnouncements, deletePdfDocument } from './supabase';
import { fetchExternalReadings, fetchExternalSaint, fetchExternalPrayers, fetchExternalOfficeReading, prefetchNextDays, getCachedReadings, getCachedSaint, getCachedPrayers, getCachedOfficeReading, updateCachedReadings, updateCachedSaint, updateCachedPrayers, updateCachedOfficeReading } from './externalSource';

export default function App() {
  // --- STATE LAYER ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [dismissedAuthError, setDismissedAuthError] = useState(false);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [saints, setSaints] = useState<Saint[]>([]);
  const [liturgicalDays, setLiturgicalDays] = useState<LiturgicalDay[]>([]);
  const [officeReadings, setOfficeReadings] = useState<OfficeReading[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>([]);
  const [externalReadings, setExternalReadings] = useState<LiturgicalDay | null>(null);
  const [externalSourceLabel, setExternalSourceLabel] = useState<string>('');
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);
  const [pdfViewerTitle, setPdfViewerTitle] = useState('');
  const [autoOpenPdfId, setAutoOpenPdfId] = useState<string | null>(null);
  const [pdfViewerDoc, setPdfViewerDoc] = useState<PdfDocument | null>(null);

  // User preferences
  const [userSettings, setUserSettings] = useState<UserSettings>({
    language: 'en',
    fontSize: 'md',
    darkMode: true
  });

  // Ad Banner setup
  const [adBanner, setAdBanner] = useState<AdBanner>(() => {
    const cached = localStorage.getItem('breviary_ad');
    if (cached) {
      try { return JSON.parse(cached); } catch { }
    }
    return {
      id: 'ad-default',
      active: true,
      titleEn: 'Parish Announcement: Catechism Registration & Holy Sacrament preparation has begun.',
      titleTa: 'பங்கு அறிவிப்பு: மறைக்கல்வி வகுப்பு மற்றும் நற்கருணை தயாரிப்பு பதிவுகள் தொடங்கப்பட்டுள்ளது.',
      descEn: 'Please submit application slots to the parish office. Contributions for Holy Way Cathedral expansion are accepted.',
      descTa: 'பங்கு அலுவலகத்தில் விண்ணப்பப் படிவங்களைச் சமர்ப்பிக்கவும். பேராலய விரிவாக்க நிதி நன்கொடைகள் வரவேற்கப்படுகின்றன.',
      linkUrl: 'https://www.trichydiocese.org',
      theme: 'gold'
    };
  });

  // Parish registered users setup
  const [parishUsers, setParishUsers] = useState<ParishUser[]>(() => {
    const cached = localStorage.getItem('breviary_users');
    if (cached) {
      try { return JSON.parse(cached); } catch { }
    }
    return [
      { id: 'usr-1', fullName: 'Rev. Fr. Bastin', email: 'bastin.v@trichydiocese.org', phoneNumber: '+91 94431 23456', role: 'pastor', registeredDate: '2026-01-15' },
      { id: 'usr-2', fullName: 'Amalorpavam Anthony', email: 'amalorpavam.a@yahoo.com', phoneNumber: '+91 98425 67890', role: 'catechist', registeredDate: '2026-02-10' },
      { id: 'usr-3', fullName: 'Savarimuthu Maria', email: 'savarimuthu.m@gmail.com', phoneNumber: '+91 81224 87654', role: 'choir_leader', registeredDate: '2026-03-01' },
      { id: 'usr-4', fullName: 'Theresa John', email: 'theresa.john@hotmail.com', role: 'parishioner', registeredDate: '2026-04-12' },
      { id: 'usr-5', fullName: 'Deacon Bastin Savarimuthu', email: 'bastin.deacon@gmail.com', role: 'parishioner', registeredDate: '2026-05-18' }
    ];
  });

  // Announcements dynamic storage with beautiful initial values
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const cached = localStorage.getItem('breviary_announcements');
    if (cached) {
      try { return JSON.parse(cached); } catch { }
    }
    return [
      { id: 'ann-1', titleEn: 'Solemn Feast of St. Thomas the Apostle', titleTa: 'புனித தோமா திருவிழா பெருநாள்', descEn: 'The annual flag hoisting starts next Monday. Special Novena masses daily at 6:00 PM with traditional benedictions.', descTa: 'மாபெரும் கொடியேற்ற விழா அடுத்த திங்கள் தொடங்குகிறது. மாலை 6:00 மணிக்கு நவநாள் திருப்பலி மற்றும் நற்கருணை ஆசீர்வாதம் நடைபெறும்.', date: '2026-06-19', category: 'festival', theme: 'gold' },
      { id: 'ann-2', titleEn: 'Parish Catechism Admissions Open', titleTa: 'மறைக்கல்வி வகுப்பு சேர்க்கை', descEn: 'Applications for Holy Communion preparation classes are now ready at the Parish office. Classes commence July 5th.', descTa: 'முதல் நற்கருணை மற்றும் உறுதிபூசுதல் வகுப்புகளுக்கான சேர்க்கை படிவங்கள் பங்கு அலுவலகத்தில் கிடைக்கின்றன.', date: '2026-06-17', category: 'liturgy', theme: 'indigo' },
      { id: 'ann-3', titleEn: 'Diocesan Youth Choir Auditions', titleTa: 'புதிய பாடகர் குழு தேர்வு', descEn: 'We are recruiting new choir vocalists and instrumentalists for Sunday services. Join us this Saturday at 4 PM in school hall.', descTa: 'ஞாயிறு திருப்பலிக்கான பாடகர்கள் மற்றும் இசைக்கலைஞர்கள் சேர்க்கை. இந்த சனிக்கிழமை மாலை 4 மணிக்கு பள்ளி அரங்கில்.', date: '2026-06-15', category: 'youth', theme: 'burgundy' }
    ];
  });

  // Simulated push notification banner
  const [activePush, setActivePush] = useState<{
    show: boolean;
    title: string;
    body: string;
    announcementId?: string;
  }>({
    show: false,
    title: '',
    body: ''
  });

  const handleSaveAnnouncement = async (ann: Announcement) => {
    const updated = [ann, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('breviary_announcements', JSON.stringify(updated));
    try {
      await saveAnnouncement(ann);
    } catch (err) {
      console.error('Failed to save announcement to Supabase:', err);
    }
    // Trigger simulation of Push Notification immediately for the newly written announcement!
    setActivePush({
      show: true,
      title: userSettings.language === 'ta' ? ann.titleTa : ann.titleEn,
      body: userSettings.language === 'ta' ? ann.descTa : ann.descEn,
      announcementId: ann.id
    });
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('breviary_announcements', JSON.stringify(updated));
    try {
      await deleteAnnouncement(id);
    } catch (err) {
      console.error('Failed to delete announcement from Supabase:', err);
    }
  };

  const handleTriggerPushNotification = (ann: Announcement) => {
    setActivePush({
      show: true,
      title: userSettings.language === 'ta' ? ann.titleTa : ann.titleEn,
      body: userSettings.language === 'ta' ? ann.descTa : ann.descEn,
      announcementId: ann.id
    });
    // Let's dismiss after 6 seconds
    setTimeout(() => {
      setActivePush(p => {
        if (p.announcementId === ann.id) {
          return { ...p, show: false };
        }
        return p;
      });
    }, 6000);
  };

  const formatDateToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Active views / tabs within the Simulated Phone View
  // 'prayers' | 'calendar' | 'saints' | 'journal' | 'bookmarks' | 'offline_download' | 'rosary'
  const [activePhoneTab, setActivePhoneTab] = useState<string>('prayers');
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedPrayerCategory, setSelectedPrayerCategory] = useState<PrayerCategory>('morning');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const hasInteracted = useRef(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Search input for prayers list
  const [prayerSearch, setPrayerSearch] = useState('');
  const [officeMode, setOfficeMode] = useState<'canonical' | 'proprium'>('proprium');

  // Dual Pane split toggle for desktop
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPbConnected, setIsPbConnected] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  // Offline Download Manager state
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadedOffline, setIsDownloadedOffline] = useState(false);

  // --- ADAPTIVE DISPLAY SYSTEM FOR WEB, WINDOW, AND ANDROID ---
  const [displayMode, setDisplayMode] = useState<'simulator' | 'responsive-web' | 'android-native'>(() => {
    if (typeof window !== 'undefined') {
      const isNative = (window as any).Capacitor?.isNativePlatform?.();
      const isMobileScreen = window.innerWidth < 1024;
      if (isNative || isSmallScreenDevice()) {
        return 'android-native';
      }
    }
    return 'simulator';
  });

  function isSmallScreenDevice() {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024 || /Mobi|Android|iPhone/i.test(window.navigator.userAgent);
  }

  // Auto-open PDF in full-page reader when selected date + category + language finds a match
  useEffect(() => {
    if (!hasInteracted.current) return;
    if (!pdfViewerUrl && !autoOpenPdfId) {
      const pdf = pdfDocuments.find(
        d => d.category === selectedPrayerCategory && d.date === selectedDate && d.language === userSettings.language
      ) || pdfDocuments.find(
        d => d.category === selectedPrayerCategory && d.date === selectedDate && d.language !== userSettings.language
      );
      if (pdf) {
        const url = getPdfStorageUrl(pdf.filePath);
        setPdfViewerUrl(url);
        setPdfViewerTitle(pdf.title);
        setAutoOpenPdfId(pdf.id);
        setPdfViewerDoc(pdf);
      }
    }
  }, [selectedDate, selectedPrayerCategory, userSettings.language, pdfDocuments]);

  // Fetch readings from external source (USCCB / iBreviary) when date changes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoadingExternal(true);
      setExternalSourceLabel('');

      // Check cache first for instant offline display
      const cachedReadings = getCachedReadings(selectedDate);
      const cachedSaint = getCachedSaint(selectedDate);
      const cachedPrayers = getCachedPrayers(selectedDate);
      const cachedOffice = getCachedOfficeReading(selectedDate);

      let hasCached = false;
      if (cachedReadings) {
        hasCached = true;
        setExternalReadings(cachedReadings);
        setExternalSourceLabel('cached');
        setLiturgicalDays(prev => {
          if (prev.find(d => d.date === selectedDate)) return prev;
          return [cachedReadings, ...prev];
        });
      }
      if (cachedSaint) {
        hasCached = true;
        setSaints(prev => {
          if (prev.find(s => s.feastDate === cachedSaint.feastDate)) return prev;
          return [...prev, cachedSaint];
        });
      }
      if (cachedPrayers) {
        hasCached = true;
        setPrayers(prev => {
          const ids = new Set(prev.map(p => p.id));
          const newP = cachedPrayers.filter(p => !ids.has(p.id));
          if (newP.length === 0) return prev;
          return [...newP, ...prev];
        });
        if (!externalSourceLabel) setExternalSourceLabel('cached');
      }
      if (cachedOffice) {
        hasCached = true;
        setOfficeReadings(prev => {
          if (prev.find(o => o.id === cachedOffice.id)) return prev;
          return [...prev, cachedOffice];
        });
      }

      const [readingsResult, saintResult, prayersResult, officeResult] = await Promise.all([
        fetchExternalReadings(selectedDate),
        fetchExternalSaint(selectedDate),
        fetchExternalPrayers(selectedDate),
        fetchExternalOfficeReading(selectedDate),
      ]);
      if (cancelled) return;
      setIsLoadingExternal(false);

      // Update cache with fresh results
      updateCachedReadings(selectedDate, readingsResult.data, readingsResult.source);
      updateCachedSaint(selectedDate, saintResult.data, saintResult.source);
      updateCachedPrayers(selectedDate, prayersResult.data, prayersResult.source);
      updateCachedOfficeReading(selectedDate, officeResult.data, officeResult.source);

      if (readingsResult.data) {
        setExternalReadings(readingsResult.data);
        setExternalSourceLabel(readingsResult.source);
        setLiturgicalDays(prev => {
          const existing = prev.find(d => d.date === selectedDate);
          if (existing) return prev;
          return [readingsResult.data!, ...prev];
        });
      }
      if (saintResult.data) {
        setSaints(prev => {
          const existing = prev.find(s => s.feastDate === saintResult.data!.feastDate);
          if (existing) return prev;
          return [...prev, saintResult.data!];
        });
      }
      if (prayersResult.data) {
        setPrayers(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newPrayers = prayersResult.data!.filter(p => !existingIds.has(p.id));
          if (newPrayers.length === 0) return prev;
          return [...newPrayers, ...prev];
        });
        if (!externalSourceLabel) setExternalSourceLabel(prayersResult.source);
      }
      if (officeResult.data) {
        setOfficeReadings(prev => {
          const existing = prev.find(o => o.id === officeResult.data!.id);
          if (existing) return prev;
          return [...prev, officeResult.data!];
        });
      }
      if (!readingsResult.data && !saintResult.data && !prayersResult.data && !officeResult.data && !hasCached) {
        setExternalSourceLabel('');
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedDate]);

  // Automatically update layout mode on resizing or orienting
  useEffect(() => {
    const handleResize = () => {
      const isNative = (window as any).Capacitor?.isNativePlatform?.();
      if (isNative) return;
      if (isSmallScreenDevice()) {
        setDisplayMode('android-native');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- INITIALIZATION: Supabase first, then localStorage fallback ---
  useEffect(() => {
    const loadFromSupabase = async () => {
      let anySuccess = false;

      async function safeFetch<T>(fetchFn: () => Promise<T>, onData: (data: T) => void, cacheKey?: string): Promise<void> {
        try {
          const data = await fetchFn();
          anySuccess = true;
          onData(data);
          if (cacheKey && Array.isArray(data) && data.length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify(data));
          }
          if (cacheKey && !Array.isArray(data) && data) {
            localStorage.setItem(cacheKey, JSON.stringify(data));
          }
        } catch (err) {
          console.warn(`Supabase fetch failed for ${cacheKey || 'unknown'}:`, err);
        }
      }

      await Promise.all([
        safeFetch(fetchPrayers, setPrayers, 'breviary_prayers'),
        safeFetch(fetchSaints, setSaints, 'breviary_saints'),
        safeFetch(fetchLiturgicalDays, setLiturgicalDays, 'breviary_liturgical_days'),
        safeFetch(fetchOfficeReadings, setOfficeReadings, 'breviary_office_readings'),
        safeFetch(fetchPdfDocuments, setPdfDocuments, 'breviary_pdfs'),
        safeFetch(fetchAnnouncements, (data) => { setAnnouncements(data); localStorage.setItem('breviary_announcements', JSON.stringify(data)); }),
        safeFetch(fetchParishUsers, (data) => { setParishUsers(data); localStorage.setItem('breviary_users', JSON.stringify(data)); }),
        safeFetch(fetchAdBanner, (data) => { if (data) { setAdBanner(data); localStorage.setItem('breviary_ad', JSON.stringify(data)); } }),
      ]);

      if (anySuccess) {
        setIsPbConnected(true);
        return;
      }

      // Fallback: localStorage only
      const cachedPdfs = localStorage.getItem('breviary_pdfs');
      if (cachedPdfs) setPdfDocuments(JSON.parse(cachedPdfs));
    };

    loadFromSupabase();

    // Load journal, bookmarks, settings from localStorage (user-scoped, not in PB for guests)
    const cachedJournals = localStorage.getItem('breviary_journal');
    if (cachedJournals) {
      setJournalEntries(JSON.parse(cachedJournals));
    } else {
      setJournalEntries([{
        id: 'journal-prebuild-01',
        date: new Date('2026-06-19T08:30:00-07:00').toISOString(),
        title: 'Opening Meditation',
        reflection: 'Quietly meditated on the Morning invitatory.',
        associatedPrayerId: 'morning-prayer-01'
      }]);
    }

    const cachedBookmarks = localStorage.getItem('breviary_bookmarks');
    if (cachedBookmarks) {
      setBookmarks(JSON.parse(cachedBookmarks));
    } else {
      setBookmarks([{
        id: 'bookmark-prebuild-01',
        itemType: 'prayer',
        itemId: 'morning-prayer-01',
        titleEn: 'Morning Prayer (Lauds)',
        titleTa: 'காலை வழிபாடு (புகழ்மாலை)'
      }]);
    }

    const cachedPrefs = localStorage.getItem('breviary_settings');
    if (cachedPrefs) {
      setUserSettings(JSON.parse(cachedPrefs));
    }

    prefetchNextDays(7);
  }, []);

  // --- SUPABASE AUTH SYNC ---
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Verify the session is valid by fetching user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          // Session token is invalid (e.g. JWT secret rotated)
          console.warn('Session verification failed, clearing:', userError?.message);
          await supabase.auth.signOut();
          setCurrentUser({
            uid: 'local-guest',
            isAnonymous: true,
            displayName: 'Local Guest'
          });
          return;
        }
        setCurrentUser({
          uid: user.id,
          email: user.email,
          isAnonymous: false,
          displayName: user.email || 'Admin'
        });
        setAuthError(null);
      } else {
        setCurrentUser({
          uid: 'local-guest',
          isAnonymous: true,
          displayName: 'Local Guest'
        });
      }
    };
    initAuth();

    const unsub = onAuthStateChange((event, session) => {
      if (session?.user) {
        setCurrentUser({
          uid: session.user.id,
          email: session.user.email,
          isAnonymous: false,
          displayName: session.user.email || 'Admin'
        });
        setAuthError(null);
      } else {
        setCurrentUser({
          uid: 'local-guest',
          isAnonymous: true,
          displayName: 'Local Guest'
        });
      }
    });
    return () => unsub();
  }, []);

  // --- WELCOME SCREEN CLOCK ---
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // --- SUPABASE REALTIME SUBSCRIPTIONS ---
  useEffect(() => {
    const unsubPrayers = subscribePrayers((action, record) => {
      setPrayers(prev => {
        let updated = [...prev];
        if (action === 'INSERT') {
          const exists = updated.some(p => p.id === record.id);
          if (!exists) updated = [record as Prayer, ...updated];
        } else if (action === 'UPDATE') {
          const idx = updated.findIndex(p =>
            p.id === record.id
          );
          if (idx >= 0) {
            updated[idx] = record as Prayer;
          } else {
            updated = [record as Prayer, ...updated];
          }
        } else if (action === 'DELETE') {
          updated = updated.filter(p => p.id !== record.id);
        }
        localStorage.setItem('breviary_prayers', JSON.stringify(updated));
        return updated;
      });
    });

    const unsubSaints = subscribeSaints((action, record) => {
      setSaints(prev => {
        let updated = [...prev];
        if (action === 'INSERT') {
          const exists = updated.some(s => s.id === record.id);
          if (!exists) updated = [record as Saint, ...updated];
        } else if (action === 'UPDATE') {
          const idx = updated.findIndex(s => s.id === record.id);
          if (idx >= 0) {
            updated[idx] = record as Saint;
          } else {
            updated = [record as Saint, ...updated];
          }
        } else if (action === 'DELETE') {
          updated = updated.filter(s => s.id !== record.id);
        }
        localStorage.setItem('breviary_saints', JSON.stringify(updated));
        return updated;
      });
    });

    const unsubLitDays = subscribeLiturgicalDays((action, record) => {
      setLiturgicalDays(prev => {
        let updated = [...prev];
        if (action === 'INSERT') {
          const exists = updated.some(d => d.date === record.date);
          if (!exists) updated = [record as LiturgicalDay, ...updated];
        } else if (action === 'UPDATE') {
          updated = updated.map(d => d.date === record.date ? (record as LiturgicalDay) : d);
        } else if (action === 'DELETE') {
          updated = updated.filter(d => d.date !== record.date);
        }
        localStorage.setItem('breviary_liturgical_days', JSON.stringify(updated));
        return updated;
      });
    });

    const unsubOffice = subscribeOfficeReadings((action, record) => {
      setOfficeReadings(prev => {
        let updated = [...prev];
        if (action === 'INSERT') {
          const exists = updated.some(o => o.id === record.id);
          if (!exists) updated = [record as OfficeReading, ...updated];
        } else if (action === 'UPDATE') {
          updated = updated.map(o => o.id === record.id ? (record as OfficeReading) : o);
        } else if (action === 'DELETE') {
          updated = updated.filter(o => o.id !== record.id);
        }
        localStorage.setItem('breviary_office_readings', JSON.stringify(updated));
        return updated;
      });
    });

    const unsubPdfs = subscribePdfDocuments((action, record) => {
      setPdfDocuments(prev => {
        let updated = [...prev];
        if (action === 'INSERT') {
          const exists = updated.some(d => d.id === record.id);
          if (!exists) updated = [{ ...record, titleEn: record.title_en, titleTa: record.title_ta, fileName: record.file_name, filePath: record.file_path, fileSize: record.file_size }, ...updated];
        } else if (action === 'UPDATE') {
          updated = updated.map(d => d.id === record.id ? { ...record, titleEn: record.title_en, titleTa: record.title_ta, fileName: record.file_name, filePath: record.file_path } : d);
        } else if (action === 'DELETE') {
          updated = updated.filter(d => d.id !== record.id);
        }
        localStorage.setItem('breviary_pdfs', JSON.stringify(updated));
        return updated;
      });
    });

    const unsubAnnouncements = subscribeAnnouncements((action, record) => {
      setAnnouncements(prev => {
        let updated = [...prev];
        if (action === 'INSERT') {
          const exists = updated.some(a => a.id === record.id);
          if (!exists) updated = [{ id: record.id, titleEn: record.title_en, titleTa: record.title_ta, descEn: record.desc_en, descTa: record.desc_ta, date: record.date, category: record.category, theme: record.theme }, ...updated];
        } else if (action === 'UPDATE') {
          updated = updated.map(a => a.id === record.id ? { id: record.id, titleEn: record.title_en, titleTa: record.title_ta, descEn: record.desc_en, descTa: record.desc_ta, date: record.date, category: record.category, theme: record.theme } : a);
        } else if (action === 'DELETE') {
          updated = updated.filter(a => a.id !== record.old.id);
        }
        localStorage.setItem('breviary_announcements', JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      unsubPrayers();
      unsubSaints();
      unsubLitDays();
      unsubOffice();
      unsubPdfs();
      unsubAnnouncements();
    };
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.id || null;
    };
    let unsubJournal: (() => void) | null = null;
    let unsubBookmarks: (() => void) | null = null;

    async function loadUserData(uid: string) {
      try {
        const [journalData, bookmarkData] = await Promise.all([
          fetchJournalEntries(uid),
          fetchBookmarks(uid),
        ]);
        setJournalEntries(journalData);
        localStorage.setItem('breviary_journal', JSON.stringify(journalData));
        setBookmarks(bookmarkData);
        localStorage.setItem('breviary_bookmarks', JSON.stringify(bookmarkData));
      } catch (err) {
        console.warn('Failed to load user data:', err);
      }
    }

    function subscribeUserData(uid: string) {
      unsubJournal = subscribeJournalEntries(uid, (action, record) => {
        setJournalEntries(prev => {
          let updated = [...prev];
          if (action === 'INSERT') {
            const exists = updated.some(j => j.id === record.id);
            if (!exists) updated = [record as JournalEntry, ...updated];
          } else if (action === 'UPDATE') {
            updated = updated.map(j => j.id === record.id ? (record as JournalEntry) : j);
          } else if (action === 'DELETE') {
            updated = updated.filter(j => j.id !== record.id);
          }
          localStorage.setItem('breviary_journal', JSON.stringify(updated));
          return updated;
        });
      });

      unsubBookmarks = subscribeBookmarks(uid, (action, record) => {
        setBookmarks(prev => {
          let updated = [...prev];
          if (action === 'INSERT') {
            const exists = updated.some(b => b.id === record.id);
            if (!exists) updated = [record as Bookmark, ...updated];
          } else if (action === 'UPDATE') {
            updated = updated.map(b => b.id === record.id ? (record as Bookmark) : b);
          } else if (action === 'DELETE') {
            updated = updated.filter(b => b.id !== record.id);
          }
          localStorage.setItem('breviary_bookmarks', JSON.stringify(updated));
          return updated;
        });
      });
    }

    let userId: string | null = null;
    getUserId().then(id => {
      userId = id;
      if (!userId) return;
      loadUserData(userId);
      subscribeUserData(userId);
    });
    return () => { unsubJournal?.(); unsubBookmarks?.(); };
  }, [currentUser?.uid]);

  // Save specific states back to offline Local DB
  const savePrayersToCache = (updated: Prayer[]) => {
    setPrayers(updated);
    localStorage.setItem('breviary_prayers', JSON.stringify(updated));
  };

  const saveSaintsToCache = (updated: Saint[]) => {
    setSaints(updated);
    localStorage.setItem('breviary_saints', JSON.stringify(updated));
  };

  const saveLitDaysToCache = (updated: LiturgicalDay[]) => {
    setLiturgicalDays(updated);
    localStorage.setItem('breviary_liturgical_days', JSON.stringify(updated));
  };

  const saveOfficeReadingsToCache = (updated: OfficeReading[]) => {
    setOfficeReadings(updated);
    localStorage.setItem('breviary_office_readings', JSON.stringify(updated));
  };

  const saveJournalToCache = (updated: JournalEntry[]) => {
    setJournalEntries(updated);
    localStorage.setItem('breviary_journal', JSON.stringify(updated));
  };

  const saveBookmarksToCache = (updated: Bookmark[]) => {
    setBookmarks(updated);
    localStorage.setItem('breviary_bookmarks', JSON.stringify(updated));
  };

  const updateSettingField = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...userSettings, [key]: value };
    setUserSettings(updated);
    localStorage.setItem('breviary_settings', JSON.stringify(updated));
  };

  // --- ADMINISTRATOR OPERATIONS ---
  const handleSaveAdBanner = (newAd: AdBanner) => {
    setAdBanner(newAd);
    localStorage.setItem('breviary_ad', JSON.stringify(newAd));
  };

  const handleSaveParishUser = (newUser: ParishUser) => {
    const exists = parishUsers.some((u) => u.id === newUser.id);
    let updated: ParishUser[];
    if (exists) {
      updated = parishUsers.map((u) => u.id === newUser.id ? newUser : u);
    } else {
      updated = [...parishUsers, newUser];
    }
    setParishUsers(updated);
    localStorage.setItem('breviary_users', JSON.stringify(updated));
  };

  const handleDeleteParishUser = (userId: string) => {
    const updated = parishUsers.filter((u) => u.id !== userId);
    setParishUsers(updated);
    localStorage.setItem('breviary_users', JSON.stringify(updated));
  };

  const handleSavePrayer = async (newOrEditedPrayer: Prayer) => {
    const exists = prayers.some((p) => p.id === newOrEditedPrayer.id);
    let updated: Prayer[];
    if (exists) {
      updated = prayers.map((p) => p.id === newOrEditedPrayer.id ? newOrEditedPrayer : p);
    } else {
      updated = [newOrEditedPrayer, ...prayers];
    }
    savePrayersToCache(updated);
    try {
      await savePrayer(newOrEditedPrayer);
    } catch (err) {
      console.error('Failed to save prayer to Supabase:', err);
    }
  };

  const handleDeletePrayer = async (prayerId: string) => {
    const updated = prayers.filter((p) => p.id !== prayerId);
    savePrayersToCache(updated);
    const bUpdated = bookmarks.filter((b) => b.itemId !== prayerId);
    saveBookmarksToCache(bUpdated);
    try {
      await deletePrayer(prayerId);
    } catch (err) {
      console.error('Failed to delete prayer from Supabase:', err);
    }
  };

  const handleSaveSaint = async (newOrEditedSaint: Saint) => {
    const exists = saints.some((s) => s.id === newOrEditedSaint.id);
    let updated: Saint[];
    if (exists) {
      updated = saints.map((s) => s.id === newOrEditedSaint.id ? newOrEditedSaint : s);
    } else {
      updated = [newOrEditedSaint, ...saints];
    }
    saveSaintsToCache(updated);
    try {
      await saveSaint(newOrEditedSaint);
    } catch (err) {
      console.error('Failed to save saint to Supabase:', err);
    }
  };

  const handleDeleteSaint = async (saintId: string) => {
    const updated = saints.filter((s) => s.id !== saintId);
    saveSaintsToCache(updated);
    const bUpdated = bookmarks.filter((b) => b.itemId !== saintId);
    saveBookmarksToCache(bUpdated);
    try {
      await deleteSaint(saintId);
    } catch (err) {
      console.error('Failed to delete saint from Supabase:', err);
    }
  };

  const handleSaveLiturgicalDay = async (newOrEditedDay: LiturgicalDay) => {
    const exists = liturgicalDays.some((d) => d.date === newOrEditedDay.date);
    let updated: LiturgicalDay[];
    if (exists) {
      updated = liturgicalDays.map((d) => d.date === newOrEditedDay.date ? newOrEditedDay : d);
    } else {
      updated = [newOrEditedDay, ...liturgicalDays];
    }
    saveLitDaysToCache(updated);
    try {
      await saveLiturgicalDay(newOrEditedDay);
    } catch (err) {
      console.error('Failed to save liturgical day to Supabase:', err);
    }
  };


  const handleDeleteLiturgicalDay = async (date: string) => {
    const updated = liturgicalDays.filter((d) => d.date !== date);
    saveLitDaysToCache(updated);
    const bUpdated = bookmarks.filter((b) => b.itemId !== date);
    saveBookmarksToCache(bUpdated);
    try {
      await deleteLiturgicalDay(date);
    } catch (err) {
      console.error('Failed to delete liturgical day from Supabase:', err);
    }
  };

  const handleSaveOfficeReading = async (reading: OfficeReading) => {
    const exists = officeReadings.some((o) => o.id === reading.id);
    let updated: OfficeReading[];
    if (exists) {
      updated = officeReadings.map((o) => o.id === reading.id ? reading : o);
    } else {
      updated = [reading, ...officeReadings];
    }
    saveOfficeReadingsToCache(updated);
    try {
      await saveOfficeReading(reading);
    } catch (err) {
      console.error('Failed to save office reading to Supabase:', err);
    }
  };

  const handleDeleteOfficeReading = async (id: string) => {
    const updated = officeReadings.filter((o) => o.id !== id);
    saveOfficeReadingsToCache(updated);
    try {
      await deleteOfficeReading(id);
    } catch (err) {
      console.error('Failed to delete office reading from Supabase:', err);
    }
  };

  const handleDeletePdf = async (id: string, filePath: string) => {
    try {
      await deletePdfDocument(id, filePath);
      setPdfDocuments(prev => {
        const updated = prev.filter(d => d.id !== id);
        localStorage.setItem('breviary_pdfs', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Failed to delete PDF:', err);
    }
  };

  // --- USER LEVEL INTERACTIONS ---
  // Adding journal reflection entry
  const handleAddJournalEntry = async (title: string, reflection: string, associatedPrayerId?: string) => {
    const journalId = `journal-${Date.now()}`;
    const newEntry: JournalEntry = {
      id: journalId,
      date: new Date().toISOString(),
      title,
      reflection,
      associatedPrayerId
    };
    const updated = [newEntry, ...journalEntries];
    saveJournalToCache(updated);

    const { data: { session: s1 } } = await supabase.auth.getSession();
    const userId = s1?.user?.id || null;
    if (userId) {
      try {
        await saveJournalEntry(userId, newEntry);
      } catch (err) {
        console.error('Failed to save journal entry to Supabase:', err);
      }
    }
  };

  const handleEditJournalEntry = async (id: string, title: string, reflection: string, associatedPrayerId?: string) => {
    const updated = journalEntries.map((j) => {
      if (j.id === id) {
        return {
          ...j,
          title,
          reflection,
          associatedPrayerId
        };
      }
      return j;
    });
    saveJournalToCache(updated);

    const { data: { session: s2 } } = await supabase.auth.getSession();
    const userId = s2?.user?.id || null;
    if (userId) {
      const entry = updated.find(j => j.id === id);
      if (entry) {
        try {
          await saveJournalEntry(userId, entry);
        } catch (err) {
          console.error('Failed to update journal entry to Supabase:', err);
        }
      }
    }
  };

  const handleDeleteJournalEntry = async (id: string) => {
    const updated = journalEntries.filter((j) => j.id !== id);
    saveJournalToCache(updated);

    const { data: { session: s3 } } = await supabase.auth.getSession();
    const userId = s3?.user?.id || null;
    if (userId) {
      try {
        await deleteJournalEntry(id);
      } catch (err) {
        console.error('Failed to delete journal entry from Supabase:', err);
      }
    }
  };

  // Saving Bookmarks
  const isItemBookmarked = (itemId: string) => {
    return bookmarks.some((b) => b.itemId === itemId);
  };

  const handleToggleBookmark = async (itemId: string, titleEn: string, titleTa: string) => {
    const exists = bookmarks.some((b) => b.itemId === itemId);
    let updated: Bookmark[];
    let bItemToDelete: Bookmark | null = null;
    let bItemToAdd: Bookmark | null = null;

    if (exists) {
      bItemToDelete = bookmarks.find((b) => b.itemId === itemId) || null;
      updated = bookmarks.filter((b) => b.itemId !== itemId);
    } else {
      let type: 'prayer' | 'saint' | 'reading' = 'prayer';
      if (itemId.includes('-06-') || itemId.startsWith('2026')) {
        type = 'reading';
      } else if (itemId.includes('saint')) {
        type = 'saint';
      }
      const newB: Bookmark = {
        id: `bookmark-${Date.now()}`,
        itemId,
        itemType: type,
        titleEn,
        titleTa
      };
      bItemToAdd = newB;
      updated = [...bookmarks, newB];
    }
    saveBookmarksToCache(updated);

    const { data: { session: s4 } } = await supabase.auth.getSession();
    const bmUserId = s4?.user?.id || null;
    if (bmUserId) {
      try {
        if (exists && bItemToDelete) {
          await deleteBookmark(bItemToDelete.id);
        } else if (bItemToAdd) {
          await saveBookmark(bmUserId, bItemToAdd);
        }
      } catch (err) {
        console.error('Failed to sync bookmark to Supabase:', err);
      }
    }
  };

  // --- OFFLINE SIMULATION ---
  const handleTriggerOfflineDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(2);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setIsDownloadedOffline(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 150);
  };

  // --- RENDER RESOLVERS ---
  const getAccessibilityClasses = (
    sz: 'sm' | 'md' | 'lg' | 'xl',
    family?: 'serif' | 'sans' | 'mono',
    color?: 'default' | 'amber' | 'sepia' | 'emerald' | 'blue',
    isDark?: boolean,
    highContrast?: boolean
  ) => {
    let sizeClass = '';
    switch (sz) {
      case 'sm': sizeClass = 'text-xs md:text-sm leading-relaxed'; break;
      case 'md': sizeClass = 'text-sm md:text-base leading-relaxed'; break;
      case 'lg': sizeClass = 'text-base md:text-lg leading-relaxed'; break;
      case 'xl': sizeClass = 'text-lg md:text-xl leading-relaxed'; break;
    }
    
    let fontClass = 'font-serif';
    if (family === 'sans') {
      fontClass = 'font-sans';
    } else if (family === 'mono') {
      fontClass = 'font-mono tracking-tight';
    }

    let colorClass = '';
    if (highContrast) {
      colorClass = isDark ? 'text-white font-bold' : 'text-black font-bold';
    } else if (isDark) {
      switch (color) {
        case 'amber': colorClass = 'text-amber-400 font-medium'; break;
        case 'sepia': colorClass = 'text-orange-200/95 font-medium'; break;
        case 'emerald': colorClass = 'text-emerald-400 font-medium'; break;
        case 'blue': colorClass = 'text-blue-200 font-medium'; break;
        default: colorClass = 'text-stone-100 font-medium'; // Ultra-readable warm contrast off-white
      }
    } else {
      switch (color) {
        case 'amber': colorClass = 'text-amber-950 font-medium'; break;
        case 'sepia': colorClass = 'text-stone-900'; break;
        case 'emerald': colorClass = 'text-emerald-950 font-medium'; break;
        case 'blue': colorClass = 'text-indigo-950'; break;
        default: colorClass = 'text-slate-900'; // Pure charcoal
      }
    }
    
    return `${sizeClass} ${fontClass} ${colorClass}`;
  };

  const activeFontClass = getAccessibilityClasses(
    userSettings.fontSize,
    userSettings.fontFamily || 'serif',
    userSettings.fontColor || 'default',
    userSettings.darkMode,
    userSettings.highContrast
  );

  const fontSizeClass: Record<string, string> = {
    sm: 'text-xs md:text-sm',
    md: 'text-sm md:text-base',
    lg: 'text-base md:text-lg',
    xl: 'text-lg md:text-xl',
  };
  const contentSizeClass = fontSizeClass[userSettings.fontSize] || 'text-sm md:text-base';


  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${userSettings.darkMode ? 'bg-[#0f0c08] text-amber-50/90 dark' : 'bg-[#fdfaf6] text-slate-900'}`}>
      
      {/* 1. APP MAIN HEADER BAR */}
      {displayMode !== 'android-native' && !isAdminPanelOpen && (
        <header className="border-b border-slate-205 dark:border-stone-850 bg-white/90 dark:bg-[#16120e]/95 backdrop-blur-md sticky top-0 z-50 px-6 py-4 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-indigo-950 dark:bg-amber-600 flex items-center justify-center text-white font-serif text-xl border border-amber-600/20 shadow-xs select-none animate-pulse">
                Ω
              </div>
              <div className="text-left">
                <h1 className="text-lg font-bold text-indigo-950 dark:text-amber-100 tracking-tight flex items-center gap-1.5 leading-none">
                  <span>திருவழிபாடு & வாசகங்கள்</span>
                  <span className="text-slate-300 dark:text-stone-700 font-extralight">|</span>
                  <span className="text-indigo-900 dark:text-amber-500 font-serif font-medium text-base italic">Breviarium Digitalis</span>
                </h1>
                <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-widest mt-1">
                  Ordinary Time • Latin-English-Tamil Devotional Liturgy
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-start md:justify-end gap-2.5">
              
              {/* Adaptive Page Display layout picker */}
              <div className="bg-slate-100 dark:bg-stone-900 border border-slate-200/60 dark:border-stone-850 p-1 rounded-xl flex items-center gap-1 shadow-3xs" id="display-mode-selector">
                <button
                  onClick={() => setDisplayMode('simulator')}
                  className={`flex items-center gap-1 text-[10.5px] font-extrabold px-2 py-1.5 rounded-lg transition-all ${
                    displayMode === 'simulator'
                      ? 'bg-amber-600 text-stone-950 font-bold shadow-3xs'
                      : 'text-slate-500 hover:text-[#120e0a] dark:text-stone-400 dark:hover:text-amber-200'
                  }`}
                  title="Mobile smartphone bezel frames wrapper"
                >
                  <Smartphone size={12} />
                  <span className="hidden sm:inline">Simulator</span>
                </button>
                
                <button
                  onClick={() => setDisplayMode('responsive-web')}
                  className={`flex items-center gap-1 text-[10.5px] font-extrabold px-2 py-1.5 rounded-lg transition-all ${
                    displayMode === 'responsive-web'
                      ? 'bg-amber-600 text-stone-950 font-bold shadow-3xs'
                      : 'text-slate-500 hover:text-[#120e0a] dark:text-stone-400 dark:hover:text-amber-200'
                  }`}
                  title="Fluid responsive widescreen layout"
                >
                  <BookOpen size={12} />
                  <span className="hidden sm:inline">Web/Window</span>
                </button>
                
                <button
                  onClick={() => setDisplayMode('android-native')}
                  className={`flex items-center gap-1 text-[10.5px] font-extrabold px-2 py-1.5 rounded-lg transition-all ${
                    displayMode === 'android-native'
                      ? 'bg-amber-600 text-stone-950 font-bold shadow-3xs'
                      : 'text-slate-500 hover:text-[#120e0a] dark:text-stone-400 dark:hover:text-amber-200'
                  }`}
                  title="Full viewport native rendering (100% exact device sizing)"
                >
                  <Check size={12} />
                  <span className="hidden sm:inline">Android App</span>
                </button>
              </div>

              {/* Quick language toggle */}
              <button
                onClick={() => updateSettingField('language', userSettings.language === 'ta' ? 'en' : 'ta')}
                id="global-language-toggle"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-stone-850 bg-white dark:bg-stone-900 hover:bg-[#fdfaf6] dark:hover:bg-stone-800 text-indigo-950 dark:text-amber-200 shadow-xs transition duration-150"
                title="Switch devotional translation text"
              >
                <Globe size={14} className="text-amber-700 dark:text-amber-400" />
                <span>{userSettings.language === 'ta' ? 'English' : 'தமிழ்'}</span>
              </button>

            {/* Quick Dark/Light Toggle */}
            <button
              onClick={() => updateSettingField('darkMode', !userSettings.darkMode)}
              id="global-dark-toggle"
              className="p-2.5 rounded-lg border border-slate-200 dark:border-stone-850 bg-white dark:bg-stone-900 text-slate-505 dark:text-amber-300/80 hover:bg-[#fdfaf6] dark:hover:bg-stone-800 transition shadow-xs"
              title="Comfort Night Reading mode"
            >
              {userSettings.darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

          </div>
        </div>
      </header>
      )}

      {/* 2. CORE CONTAINER - GRID FOR DUAL PRESENTATION */}
      <main className={displayMode === 'android-native' ? "w-full p-0 m-0 min-h-screen" : "max-w-7xl mx-auto px-4 py-6 md:py-8"}>
        {isAdminPanelOpen ? (

          /* --- FULL PAGE ADMIN PANEL --- */
          <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b border-slate-200 dark:border-stone-850 px-6 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 dark:bg-[#1a103c]/30 text-indigo-950 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-indigo-150/40 dark:border-stone-800">
                  <Database size={10} />
                  <span>PARISH SYSTEM PORTAL</span>
                </div>
              </div>
              <button
                onClick={() => setIsAdminPanelOpen(false)}
                id="global-admin-close"
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/50 transition"
              >
                <span>&larr;</span>
                <span>{userSettings.language === 'ta' ? 'மூடு' : 'Close Admin'}</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <AdminPanel
                prayers={prayers}
                saints={saints}
                liturgicalDays={liturgicalDays}
                officeReadings={officeReadings}
                onSavePrayer={handleSavePrayer}
                onDeletePrayer={handleDeletePrayer}
                onSaveSaint={handleSaveSaint}
                onDeleteSaint={handleDeleteSaint}
                onSaveLiturgicalDay={handleSaveLiturgicalDay}
                onDeleteLiturgicalDay={handleDeleteLiturgicalDay}
                onSaveOfficeReading={handleSaveOfficeReading}
                onDeleteOfficeReading={handleDeleteOfficeReading}
                isFirebaseConnected={isPbConnected}
                currentUser={currentUser}
                adBanner={adBanner}
                onSaveAdBanner={handleSaveAdBanner}
                parishUsers={parishUsers}
                onSaveParishUser={handleSaveParishUser}
                onDeleteParishUser={handleDeleteParishUser}
                announcements={announcements}
                onSaveAnnouncement={handleSaveAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
                onTriggerPushNotification={handleTriggerPushNotification}
                pdfDocuments={pdfDocuments}
                onViewPdf={(url, title) => {
                  setPdfViewerUrl(url);
                  setPdfViewerTitle(title);
                }}
                onDeletePdf={handleDeletePdf}
              />
            </div>
          </div>

        ) : (

        <div className={displayMode === 'android-native' ? "w-full" : "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"}>
          
          {/* LEFT COLUMN: INTRO & LIVE CONTENT MANAGEMENT STATUS */}
          {displayMode !== 'android-native' && (
            <div className="lg:col-span-4 space-y-6">
            
            {/* Title card */}
            <div className="p-6 rounded-3xl border bg-white dark:bg-[#16120e] border-slate-200 dark:border-stone-850/80 shadow-xs text-left">
              <span className="text-amber-700 dark:text-amber-400 font-bold text-[10px] uppercase tracking-widest block mb-1">Liturgical Guide</span>
              <h2 className="text-xl font-bold tracking-tight text-indigo-950 dark:text-amber-50 font-serif">
                {userSettings.language === 'ta' ? 'அறிமுகம் மற்றும் ஆவணம்' : 'Sacred Liturgical Readings'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-stone-400 mt-2 leading-relaxed">
                {userSettings.language === 'ta' 
                  ? 'ஆஃப்லைன் அணுகலுடன் தமிழ் மற்றும் ஆங்கிலத்தில் திருவழிபாட்டு வாசகங்கள் மற்றும் கத்தோலிக்க செபங்களின் தொகுப்பு. இக்குறிப்பேடு காலத்திற்கு உகந்தவாறு தானாகவே மாறக் கூடியது.'
                  : 'Welcome to your daily companion for Catholic prayer and meditative liturgy. Featuring dual English & Tamil versions of morning, midday, evening, and night liturgies, saints biography sheets, and integrated scriptural passages.'
                }
              </p>

              {/* Offline Status indicator banner */}
              <div className="mt-5 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-xs text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-905 dark:text-amber-300">
                    Offline Database Status
                  </span>
                  <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-0.5 rounded-md ${
                    isDownloadedOffline 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-amber-200/50 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200'
                  }`}>
                    <span>●</span>
                    <span>{isDownloadedOffline ? 'Synchronized' : 'Draft Local Cache'}</span>
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-250 leading-relaxed font-sans">
                  The entire breviary database is ready offline. Replicate sacred texts seamlessly anywhere.
                </p>

                {!isDownloadedOffline ? (
                  <button
                    onClick={handleTriggerOfflineDownload}
                    disabled={isDownloading}
                    id="trigger-download-offline-btn"
                    className="w-full mt-2 bg-indigo-950 dark:bg-[#1a103c] hover:bg-slate-800 dark:hover:bg-[#251950] disabled:bg-slate-300 text-white font-semibold text-[11px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition duration-150"
                  >
                    <Download size={13} />
                    {isDownloading ? `Caching texts ${downloadProgress}%` : 'Download Liturgy Offline'}
                  </button>
                ) : (
                  <div className="pt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <Check size={14} />
                    <span>Liturgy DB is now 100% available offline.</span>
                  </div>
                )}

                {isDownloading && (
                  <div className="w-full bg-slate-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-150" 
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Accessibility Adjuster Widget */}
            <div className="p-5 rounded-3xl border bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-500/2 bg-white dark:bg-[#16120e] border-amber-500/15 dark:border-amber-500/25 shadow-xs text-left space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-955 dark:text-amber-300">
                  <div className="p-1.5 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg text-amber-700 dark:text-amber-400">
                    <Type size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block">Accessibility Center</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium block">Customize text size & styling</span>
                  </div>
                </div>
              </div>

              {/* 1. Font Sizer buttons with visual examples */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">1. Dynamic Font Scale</span>
                <div className="grid grid-cols-4 gap-1.5 bg-[#fdfaf6] dark:bg-stone-900 border border-slate-200/60 dark:border-stone-850 p-1 rounded-xl">
                  {[
                    { id: 'sm', label: 'A-', desc: 'Small', textSample: 'Aa' },
                    { id: 'md', label: 'A', desc: 'Med', textSample: 'Aa' },
                    { id: 'lg', label: 'A+', desc: 'Lrg', textSample: 'Aa' },
                    { id: 'xl', label: 'AA', desc: 'Xl', textSample: 'Aa' },
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => updateSettingField('fontSize', size.id as any)}
                      id={`pref-font-btn-${size.id}`}
                      className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center justify-center border ${
                        userSettings.fontSize === size.id
                          ? 'bg-amber-600 border-amber-600 text-white dark:text-[#120e0a] font-bold shadow-xs'
                          : 'bg-white dark:bg-stone-950 border-slate-200/40 dark:border-stone-900 text-slate-600 dark:text-stone-400 hover:bg-amber-500/5 hover:border-amber-500/20'
                      }`}
                      title={`${size.desc} scale`}
                    >
                      <span className={`font-semibold ${
                        size.id === 'sm' ? 'text-[11px]' : size.id === 'md' ? 'text-[13px]' : size.id === 'lg' ? 'text-[15px]' : 'text-[17px]'
                      }`}>
                        {size.textSample}
                      </span>
                      <span className="text-[9px] opacity-75 mt-0.5">{size.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Font Style (Typeface Selector) */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">2. Typeface Styling</span>
                <div className="grid grid-cols-3 gap-1.5 bg-[#fdfaf6] dark:bg-stone-900 border border-slate-200/60 dark:border-stone-850 p-1 rounded-xl">
                  {[
                    { id: 'serif', name: 'Serif', label: 'Traditional' },
                    { id: 'sans', name: 'Sans', label: 'Legible' },
                    { id: 'mono', name: 'Focus', label: 'Mono' },
                  ].map((family) => (
                    <button
                      key={family.id}
                      onClick={() => updateSettingField('fontFamily', family.id as any)}
                      id={`pref-family-btn-${family.id}`}
                      className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center justify-center border ${
                        (userSettings.fontFamily || 'serif') === family.id
                          ? 'bg-indigo-950 dark:bg-amber-500 text-white dark:text-[#120e0a] font-bold shadow-xs'
                          : 'bg-white dark:bg-stone-950 border-slate-200/40 dark:border-stone-900 text-slate-600 dark:text-stone-400 hover:bg-amber-500/5 hover:border-amber-500/20'
                      }`}
                    >
                      <span className={`text-xs font-bold leading-none ${
                        family.id === 'serif' ? 'font-serif' : family.id === 'sans' ? 'font-sans' : 'font-mono'
                      }`}>
                        {family.name}
                      </span>
                      <span className="text-[8px] opacity-75 mt-1 truncate max-w-full">
                        {family.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Reading Text Color Selector */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">3. Reading Text Color</span>
                <div className="grid grid-cols-5 gap-1.5 bg-[#fdfaf6] dark:bg-stone-900 border border-slate-200/60 dark:border-stone-850 p-1 rounded-xl">
                  {[
                    { id: 'default', label: 'Default', colorBg: 'bg-slate-800 dark:bg-[#ffe8d6]' },
                    { id: 'amber', label: 'Amber', colorBg: 'bg-amber-800 dark:bg-amber-400' },
                    { id: 'sepia', label: 'Sepia', colorBg: 'bg-stone-900 dark:bg-amber-200' },
                    { id: 'emerald', label: 'Emerald', colorBg: 'bg-emerald-800 dark:bg-emerald-400' },
                    { id: 'blue', label: 'Blue', colorBg: 'bg-indigo-950 dark:bg-blue-300' },
                  ].map((colorOpt) => (
                    <button
                      key={colorOpt.id}
                      onClick={() => updateSettingField('fontColor', colorOpt.id as any)}
                      id={`pref-color-btn-${colorOpt.id}`}
                      className={`py-1.5 px-0.5 rounded-lg transition-all flex flex-col items-center justify-center border ${
                        (userSettings.fontColor || 'default') === colorOpt.id
                          ? 'bg-indigo-950 dark:bg-amber-500 text-white dark:text-[#120e0a] font-bold shadow-xs'
                          : 'bg-white dark:bg-stone-950 border-slate-200/40 dark:border-stone-900 text-slate-650 dark:text-stone-400 hover:bg-amber-500/5 hover:border-amber-500/20'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${colorOpt.colorBg} border border-slate-350 dark:border-stone-700 mb-0.5`} />
                      <span className="text-[8.5px] tracking-tight">{colorOpt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. High Contrast Mode Toggle */}
              <div className="pt-3 border-t border-slate-100 dark:border-stone-850/80 flex items-center justify-between">
                <div className="space-y-0.5 text-left">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350 block">High Contrast Mode</span>
                  <span className="text-[9.5px] text-slate-400 dark:text-slate-505 block leading-tight">Overrides bright themes with solid ink contrast</span>
                </div>
                <button
                  onClick={() => updateSettingField('highContrast', !userSettings.highContrast)}
                  id="pref-high-contrast-toggle"
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    userSettings.highContrast ? 'bg-amber-600' : 'bg-slate-200 dark:bg-stone-800'
                  }`}
                  aria-label="Toggle High-Contrast mode"
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      userSettings.highContrast ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Mini Bookmarks shelf */}
              <div className="pt-3 border-t border-slate-100 dark:border-stone-850">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Stored Bookmarks ({bookmarks.length})</span>
                  <button 
                    onClick={() => setActivePhoneTab('bookmarks')}
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    View Bookshelf
                  </button>
                </div>

                {bookmarks.length === 0 ? (
                  <p className="text-[11px] text-slate-450 italic">No bookmarked passages yet. Click the outline star inside prayers or saints.</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {bookmarks.slice(0, 3).map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          hasInteracted.current = true;
                          if (b.itemType === 'prayer') {
                            const p = prayers.find((x) => x.id === b.itemId);
                            if (p) {
                              setSelectedPrayerCategory(p.category);
                              setActivePhoneTab('prayers');
                            }
                          } else if (b.itemType === 'saint') {
                            setActivePhoneTab('saints');
                          } else if (b.itemType === 'reading') {
                            setSelectedDate(b.itemId);
                            setActivePhoneTab('calendar');
                          }
                        }}
                        className="w-full text-left p-1.5 text-xs bg-slate-50 dark:bg-[#1f1914] rounded-lg hover:bg-slate-100 dark:hover:bg-stone-800 transition flex items-center justify-between gap-1.5 text-slate-705 dark:text-amber-100/90"
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <BookmarkCheck size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>{userSettings.language === 'ta' ? b.titleTa : b.titleEn}</span>
                        </span>
                        <span className="text-[9px] font-bold uppercase text-slate-400 shrink-0">{b.itemType}</span>
                      </button>
                    ))}
                    {bookmarks.length > 3 && (
                      <span className="text-[10px] text-stone-500 font-medium block pt-1">+ {bookmarks.length - 3} more bookmarked items</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Traditional liturgical seasons key banner */}
            <div className="p-5 rounded-3xl border bg-white dark:bg-[#16120e] border-slate-200 dark:border-stone-850 shadow-xs text-left space-y-3">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Liturgical Seasons Guide</span>
              <div className="grid grid-cols-2 gap-2.5 text-[11px] text-slate-650 dark:text-stone-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Ordinary Time (சாதாரண)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
                  <span>Feasts & Rejoices (வெள்ளை)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                  <span>Lent & Mourning (ஊதா)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span>Martyrs (சிவப்பு)</span>
                </div>
              </div>
            </div>

          </div>
          )}

          {/* RIGHT PANELS OR INTEGRATION WORKSPACE */}
          <div className={displayMode === 'android-native' ? "w-full min-h-screen" : "lg:col-span-8"}>
            <div className={displayMode === 'android-native' ? "w-full" : "grid grid-cols-1 md:grid-cols-12 gap-6"}>
              
              {/* COMPONENT COL 1 (PHONE SIMULATOR OR FULL COMPANION INTEGRATION) */}
              <div className={displayMode === 'android-native' ? "w-full min-h-screen animate-in fade-in" : `md:col-span-12 ${isAdminPanelOpen ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col items-center justify-center w-full`}>
                
                {/* 3. DEVOTIONAL VIEWER FRAME OR DIRECT SCREEN */}
                <div 
                  id="simulated-device-frame" 
                  className={
                    displayMode === 'android-native'
                      ? "w-full h-screen min-h-screen relative overflow-hidden flex flex-col"
                      : displayMode === 'responsive-web'
                      ? "w-full bg-[#fdfaf6] dark:bg-[#120e0a] rounded-[24px] shadow-lg border border-slate-200/60 dark:border-amber-900/15 relative overflow-hidden flex flex-col transition-all duration-300"
                      : "w-full max-w-lg bg-indigo-950/20 p-4 rounded-[48px] shadow-2xl border-[10px] border-[#1e130c] dark:border-[#2a1d13] relative overflow-hidden flex flex-col transition-transform"
                  }
                >
                  
                  {displayMode === 'simulator' && (
                    /* Phone Speaker & Camera punch hole details */
                    <div className="absolute top-0 inset-x-0 h-6 bg-transparent z-30 flex justify-center items-center">
                      <div className="w-20 h-4 bg-stone-900/90 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-stone-850 mr-2" />
                        <span className="w-10 h-1 bg-stone-850 rounded-full" />
                      </div>
                    </div>
                  )}

                  {/* Inner telephone viewport screen */}
                  <div className={`transition-colors duration-200 flex flex-col relative ${
                    displayMode === 'android-native'
                      ? 'w-full min-h-screen h-screen'
                      : displayMode === 'responsive-web'
                      ? 'w-full min-h-[720px]'
                      : 'rounded-[36px] overflow-hidden pt-6 h-[740px]'
                  } ${
                    userSettings.highContrast 
                      ? 'bg-white text-black border-4 border-black' 
                      : 'bg-[#fdfaf6] dark:bg-[#120e0a] text-slate-900 dark:text-amber-100/90 border border-slate-200/50 dark:border-amber-900/20'
                  }`}>
                    
                    {/* Simulated Phone status bar */}
                    <div className={`px-5 py-2.5 flex items-center justify-between text-[11px] font-semibold border-b transition-colors duration-150 ${
                      userSettings.highContrast 
                        ? 'bg-black text-white border-black' 
                        : 'text-amber-800 dark:text-amber-400/80 border-amber-100/70 dark:border-stone-900/60 bg-[#faf6ee] dark:bg-[#191410]'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <button 
                          onClick={() => setShowWelcome(true)} 
                          className="hover:text-amber-600 transition flex items-center gap-1 text-[10.5px] font-bold"
                          title="View Welcome Splash Screen"
                        >
                          <HelpCircle size={11} className={userSettings.highContrast ? 'text-white' : 'text-amber-600 animate-pulse'} />
                          <span className={userSettings.highContrast ? 'text-white' : ''}>Fr. Bastin - Trichy</span>
                        </button>

                        <span className="opacity-40">|</span>

                        {/* Quick Font Sizer shortcuts */}
                        <button 
                          onClick={() => {
                            const scales = ['sm', 'md', 'lg', 'xl'] as const;
                            const currentIdx = scales.indexOf(userSettings.fontSize);
                            const nextScale = scales[(currentIdx + 1) % scales.length];
                            updateSettingField('fontSize', nextScale);
                          }}
                          className={`flex items-center gap-1 text-[10.5px] font-bold py-0.5 px-1.5 rounded-sm transition ${
                            userSettings.highContrast 
                              ? 'bg-white/10 text-white hover:bg-white/20' 
                              : 'bg-amber-500/10 text-amber-900 dark:text-amber-350 hover:bg-amber-500/20'
                          }`}
                          title={`Scale Text. Current: ${userSettings.fontSize}`}
                        >
                          <Type size={11} />
                          <span>Scale ({userSettings.fontSize.toUpperCase()})</span>
                        </button>

                        <span className="opacity-40">|</span>

                        {/* Quick Language shortcut */}
                        <button
                          onClick={() => updateSettingField('language', userSettings.language === 'ta' ? 'en' : 'ta')}
                          className={`flex items-center gap-1.5 text-[10.5px] font-bold py-0.5 px-1.5 rounded-sm transition ${
                            userSettings.highContrast 
                              ? 'bg-white/10 text-white hover:bg-white/20' 
                              : 'bg-amber-500/10 text-[#451a03] dark:text-amber-300 hover:bg-amber-500/20'
                          }`}
                          title="Switch language translation"
                        >
                          <Globe size={11} className="text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>{userSettings.language === 'ta' ? 'EN' : 'தமிழ்'}</span>
                        </button>

                        <span className="opacity-40">|</span>

                        {/* Quick Dark Mode shortcut */}
                        <button
                          onClick={() => updateSettingField('darkMode', !userSettings.darkMode)}
                          className={`p-1 rounded-md transition ${
                            userSettings.highContrast 
                              ? 'bg-white/10 text-white hover:bg-white/20' 
                              : 'bg-amber-500/10 text-[#451a03] dark:text-amber-300 hover:bg-amber-500/20'
                          }`}
                          title="Toggle dark mode"
                        >
                          {userSettings.darkMode ? <Sun size={11.5} /> : <Moon size={11.5} />}
                        </button>

                        <span className="opacity-40">|</span>

                        {/* Accessibility Settings Gear */}
                        <button
                          onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                          className={`p-1 rounded-md transition ${
                            userSettings.highContrast 
                              ? 'bg-white/10 text-white hover:bg-white/20' 
                              : 'bg-amber-500/10 text-[#451a03] dark:text-amber-300 hover:bg-amber-500/20'
                          }`}
                          title="Accessibility settings"
                        >
                          <Settings size={11.5} />
                        </button>

                        <span className="opacity-40">|</span>

                        {/* Admin Panel Toggle */}
                        <button
                          onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
                          id="global-admin-toggle"
                          className={`flex items-center gap-1 text-[10.5px] font-bold py-0.5 px-1.5 rounded-sm transition ${
                            userSettings.highContrast 
                              ? 'bg-white/10 text-white hover:bg-white/20' 
                              : isAdminPanelOpen
                              ? 'bg-indigo-950 text-white dark:bg-amber-600 dark:text-[#120e0a]'
                              : 'bg-amber-500/10 text-[#451a03] dark:text-amber-300 hover:bg-amber-500/20'
                          }`}
                          title={isAdminPanelOpen ? 'Close Administration Console' : 'Open Admin Panel'}
                        >
                          <Lock size={11} />
                          <span>{isAdminPanelOpen ? 'Close Admin' : 'Admin Panel'}</span>
                        </button>

                        {/* Exit full view button (only on wide screens) */}
                        {displayMode === 'android-native' && window.innerWidth >= 1024 && (
                          <>
                            <span className="opacity-40">|</span>
                            <button
                              onClick={() => setDisplayMode('simulator')}
                              className="text-[9.5px] bg-[#451a03] dark:bg-amber-600 text-amber-50 dark:text-[#120e0a] font-black px-1.5 py-0.5 rounded-md hover:scale-102 active:scale-98 transition shrink-0"
                              title="Exit Full View"
                            >
                              Exit
                            </button>
                          </>
                        )}
                      </div>
                      
                      {displayMode !== 'responsive-web' ? (
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span>9:41 AM • 5G</span>
                          <div className={`w-5 h-2.5 border rounded-xs p-0.5 flex ${
                            userSettings.highContrast ? 'border-white' : 'border-amber-905/30 dark:border-amber-105'
                          }`}>
                            <div className={`h-full w-full ${
                              userSettings.highContrast ? 'bg-white' : 'bg-amber-800 dark:bg-amber-400'
                            }`} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 shrink-0 select-none">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-[#451a03] dark:text-amber-350 bg-amber-500/10 dark:bg-amber-500/10 px-2 py-0.5 rounded-md">
                            Web & Desktop Window View
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Accessibility Settings Dropdown */}
                    {isAccessibilityOpen && (
                      <div className="px-4 py-3 border-b border-amber-100/70 dark:border-stone-900/60 bg-[#faf6ee] dark:bg-[#191410] animate-in slide-in-from-top duration-200 z-40">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Font:</span>
                          {['sm', 'md', 'lg', 'xl'].map((size) => (
                            <button
                              key={size}
                              onClick={() => updateSettingField('fontSize', size as any)}
                              className={`text-[9px] font-bold px-2 py-1 rounded-md transition ${
                                userSettings.fontSize === size
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-white dark:bg-stone-900 text-slate-600 dark:text-stone-400 border border-slate-200 dark:border-stone-800'
                              }`}
                            >
                              {size === 'sm' ? 'A-' : size === 'md' ? 'A' : size === 'lg' ? 'A+' : 'AA'}
                            </button>
                          ))}
                          <span className="opacity-30 mx-1">|</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Style:</span>
                          {['serif', 'sans', 'mono'].map((f) => (
                            <button
                              key={f}
                              onClick={() => updateSettingField('fontFamily', f as any)}
                              className={`text-[9px] font-bold px-2 py-1 rounded-md transition ${
                                (userSettings.fontFamily || 'serif') === f
                                  ? 'bg-indigo-950 dark:bg-amber-500 text-white dark:text-stone-950'
                                  : 'bg-white dark:bg-stone-900 text-slate-600 dark:text-stone-400 border border-slate-200 dark:border-stone-800'
                              }`}
                            >
                              {f === 'serif' ? 'Serif' : f === 'sans' ? 'Sans' : 'Mono'}
                            </button>
                          ))}
                          <span className="opacity-30 mx-1">|</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Color:</span>
                          {[
                            { id: 'default', cls: 'bg-slate-800 dark:bg-[#ffe8d6]' },
                            { id: 'amber', cls: 'bg-amber-800 dark:bg-amber-400' },
                            { id: 'sepia', cls: 'bg-stone-900 dark:bg-amber-200' },
                            { id: 'emerald', cls: 'bg-emerald-800 dark:bg-emerald-400' },
                            { id: 'blue', cls: 'bg-indigo-950 dark:bg-blue-300' },
                          ].map((c) => (
                            <button
                              key={c.id}
                              onClick={() => updateSettingField('fontColor', c.id as any)}
                              className={`w-4 h-4 rounded-full border-2 transition ${c.cls} ${
                                (userSettings.fontColor || 'default') === c.id
                                  ? 'border-amber-600 scale-110'
                                  : 'border-transparent'
                              }`}
                              title={c.id}
                            />
                          ))}
                          <span className="opacity-30 mx-1">|</span>
                          <button
                            onClick={() => updateSettingField('highContrast', !userSettings.highContrast)}
                            className={`text-[9px] font-bold px-2 py-1 rounded-md transition ${
                              userSettings.highContrast
                                ? 'bg-amber-600 text-white'
                                : 'bg-white dark:bg-stone-900 text-slate-600 dark:text-stone-400 border border-slate-200 dark:border-stone-800'
                            }`}
                          >
                            {userSettings.highContrast ? 'Contrast: ON' : 'Contrast: OFF'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* IN-APP SIMULATED PUSH NOTIFICATION ALERT */}
                    {activePush.show && (
                      <div className="absolute top-12 inset-x-3 z-50 animate-in slide-in-from-top duration-300">
                        <div 
                          onClick={() => {
                            setActivePhoneTab('announcements');
                            setShowWelcome(false);
                            setActivePush(p => ({ ...p, show: false }));
                          }}
                          className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-amber-500/20 dark:border-amber-950/40 p-3.5 rounded-2xl shadow-xl flex items-start gap-3 text-left relative cursor-pointer hover:scale-[1.01] transition duration-200"
                        >
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                            <Megaphone size={14} className="stroke-[2.5px]" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                                {userSettings.language === 'ta' ? 'புதிய அறிவிப்பு 🔔' : 'New Announcement 🔔'}
                              </span>
                              <span className="text-[8px] text-slate-400 font-bold">
                                {userSettings.language === 'ta' ? 'இப்போது' : 'now'}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-indigo-950 dark:text-slate-100 tracking-tight leading-snug mt-0.5 truncate">
                              {activePush.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-stone-300 leading-snug mt-0.5 line-clamp-2">
                              {activePush.body}
                            </p>
                            <span className="text-[8.5px] font-bold text-amber-700 dark:text-amber-400 select-none inline-block mt-1 hover:underline">
                              {userSettings.language === 'ta' ? 'தட்டவும் →' : 'Tap to view details →'}
                            </span>
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePush(p => ({ ...p, show: false }));
                            }}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 text-sm font-bold"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Smartphone Screen main content area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 relative flex flex-col" id="simulated-screen-scroller">
                      
                      {authError && !dismissedAuthError && (
                        <div className="mb-3.5 mx-0.5 bg-amber-50/95 dark:bg-[#1f1911]/95 border border-amber-500/30 p-2.5 rounded-xl shadow-xs flex items-start gap-2 text-left relative text-[10px] leading-snug">
                          <span className="text-sm shrink-0">⚠️</span>
                          <div className="flex-1 text-[#78350f] dark:text-amber-200">
                            <p className="font-extrabold uppercase tracking-wide text-[8px] opacity-90 mb-0.5">
                              {userSettings.language === 'ta' ? 'அமைப்பு தகவல்' : 'Firebase Sync Notice'}
                            </p>
                            <p className="font-medium">
                              {userSettings.language === 'ta' 
                                ? 'உங்கள் Firebase திட்டத்தில் அனானிமஸ் உள்நுழைவு முடக்கப்பட்டுள்ளது. சேவைகளை முழுமையாக ஒத்திசைக்க, Firebase Console-ல் "Anonymous Auth" வசதியை இயக்குங்கள். இப்போது ஆஃப்லைன் சேமிப்பகம் வெற்றிகரமாகச் செயல்படுகிறது!'
                                : 'Anonymous authentication is disabled in your Firebase console. Please enable the "Anonymous" provider under Authentication in your Firebase Console. All your journal and bookmarks are safely saved in local offline storage.'
                              }
                            </p>
                          </div>
                          <button 
                            onClick={() => setDismissedAuthError(true)} 
                            className="text-amber-750 dark:text-amber-450 hover:text-amber-950 font-bold px-1.5 py-0.5"
                          >
                            ×
                          </button>
                        </div>
                      )}

                      {showWelcome ? (
                        <div className="flex-1 flex flex-col justify-between py-5 px-3 text-center my-auto transition-all duration-300">
                          
                          {/* Elegant top embellishment */}
                          <div className="space-y-1.5 select-none pt-2">
                            <div className="mx-auto w-11 h-11 rounded-full border border-amber-200/40 bg-indigo-950 dark:bg-amber-500/10 flex items-center justify-center text-amber-700 dark:text-amber-400 font-serif text-xl shadow-xs">
                              Ω
                            </div>
                            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-amber-200 to-transparent mx-auto" />
                          </div>

                          <div className="space-y-5 my-auto pt-4 pb-6 text-center">
                            
                            {/* App Title */}
                            <div>
                              <h2 className="text-2xl font-serif font-extrabold tracking-tight text-[#b45309] dark:text-amber-100 leading-tight">
                                {userSettings.language === 'ta' ? 'திருவழிபாட்டுச் செயலி' : 'Breviary App'}
                              </h2>
                              <p className="text-[10px] text-indigo-950 dark:text-amber-400/80 font-bold uppercase tracking-widest mt-1.5 font-sans">
                                {userSettings.language === 'ta' ? 'கத்தோலிக்க தினசரித் துணைவன்' : 'Catholic Daily Companion'}
                              </p>
                            </div>

                            {/* Author credit - Requested Welcome Highlight */}
                            <div className="p-4 rounded-2xl bg-[#faf6ee]/90 dark:bg-[#1a1511]/90 border border-amber-250/50 dark:border-amber-950/40 relative shadow-2xs max-w-[280px] mx-auto">
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#fdfaf6] dark:bg-[#120e0a] px-2.5 text-[8.5px] uppercase font-bold text-amber-800 dark:text-amber-450 tracking-wider">
                                {userSettings.language === 'ta' ? 'வழங்குபவர்' : 'Presented By'}
                              </span>
                              <p className="text-sm font-serif font-black text-indigo-955 dark:text-amber-100 leading-none">
                                Fr. Bastin - Trichy
                              </p>
                              <p className="text-[10px] font-sans font-medium text-slate-500 dark:text-stone-400 mt-1">
                                {userSettings.language === 'ta' ? 'அருட்பணி. பாஸ்டின் - திருச்சி' : 'Rev. Fr. Bastin - Diocese of Trichy'}
                              </p>
                            </div>

                            {/* Today's Liturgical Info - Date, Time, Color, Saint */}
                            {(() => {
                              const monthDay = selectedDate.substring(5);
                              const todaySaint = saints.find(s => s.feastDate === monthDay);
                              const todayDay = liturgicalDays.find(d => d.date === selectedDate);
                              const dayColor = todayDay?.color || 'green';
                              const seasonLabel = userSettings.language === 'ta'
                                ? (todayDay?.seasonTa || 'சாதாரண காலம்')
                                : (todayDay?.seasonEn || 'Ordinary Time');
                              const feastLabel = userSettings.language === 'ta'
                                ? (todayDay?.feastTa || 'சாதாரண கால வாரநாள்')
                                : (todayDay?.feastEn || 'Weekday in Ordinary Time');
                              const colorDot = dayColor === 'purple' ? 'bg-purple-500' :
                                dayColor === 'red' ? 'bg-red-500' :
                                dayColor === 'white' ? 'bg-yellow-400' : 'bg-emerald-500';
                              return (
                                <div className="p-3 rounded-2xl bg-[#faf6ee]/90 dark:bg-[#1a1511]/90 border border-amber-250/50 dark:border-amber-950/40 max-w-[280px] mx-auto space-y-1.5">
                                  <div className="flex items-center justify-center gap-2 text-[11px] font-bold">
                                    <span className="text-indigo-950 dark:text-amber-100">
                                      {currentTime.toLocaleDateString(userSettings.language === 'ta' ? 'ta-IN' : 'en-US', {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                      })}
                                    </span>
                                    <span className="text-amber-700 dark:text-amber-400 font-mono">
                                      {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-center gap-1.5 text-[10px]">
                                    <span className={`w-2 h-2 rounded-full ${colorDot} border border-slate-300 dark:border-stone-700`} />
                                    <span className="font-bold text-slate-600 dark:text-stone-400">{seasonLabel}</span>
                                    <span className="font-serif font-bold text-indigo-950 dark:text-amber-100">{feastLabel}</span>
                                  </div>
                                  {todaySaint && (
                                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 dark:text-stone-400">
                                      <Sparkles size={10} className="text-amber-600" />
                                      <span className="font-bold text-indigo-950 dark:text-amber-200">
                                        {userSettings.language === 'ta' ? todaySaint.nameTa : todaySaint.nameEn}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Features breakdown */}
                            <div className="space-y-2 max-w-[290px] mx-auto text-left py-1">
                              {[
                                { 
                                  titleEn: "Catholic Liturgy of the Hours", 
                                  titleTa: "திருவழிபாட்டுச் செபங்கள்", 
                                  descEn: "Morning, midday, evening, and night prayers.",
                                  descTa: "காலை, மதிய, மாலை மற்றும் இரவு நேர செபங்கள்."
                                },
                                { 
                                  titleEn: "Rosary Companion & Live Beads", 
                                  titleTa: "புனித ஜெபமாலை", 
                                  descEn: "With Joyful, Sorrowful, Glorious & Luminous meditations.",
                                  descTa: "கன்னி மரியாளின் அன்பு மணி-செப வழிகாட்டி."
                                },
                                { 
                                  titleEn: "Saints Profiles & Daily Readings", 
                                  titleTa: "புனிதர் சரிதம் & திருவாசகம்", 
                                  descEn: "Daily readings synchronized with parish databases.",
                                  descTa: "தினசரி நற்செய்தி மற்றும் புனிதர்களின் வரலாற்றுக்குறிப்புகள்."
                                }
                              ].map((f, i) => (
                                <div key={i} className="flex gap-2 items-start text-[11px] leading-snug">
                                  <span className="w-4 h-4 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                                    ✓
                                  </span>
                                  <div>
                                    <h4 className="font-bold text-indigo-950 dark:text-amber-200">
                                      {userSettings.language === 'ta' ? f.titleTa : f.titleEn}
                                    </h4>
                                    <p className="text-slate-500 dark:text-stone-550 text-[10px] font-sans leading-tight">
                                      {userSettings.language === 'ta' ? f.descTa : f.descEn}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                          </div>

                          {/* Proceed button */}
                          <div className="space-y-2 shrink-0 pb-2">
                            <button
                              onClick={() => setShowWelcome(false)}
                              id="welcome-enter-app-btn"
                              className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all active:scale-[0.98]"
                            >
                              <span>{userSettings.language === 'ta' ? 'வழிபாட்டிக்குள் செல்க' : 'Begin Sacred Devotion'}</span>
                              <ArrowRight size={13} />
                            </button>
                            <p className="text-[9.5px] text-slate-400">
                              {userSettings.language === 'ta' ? 'சகல தரவுகளும் ஆஃப்லைன் பயன்பாட்டிற்கு தயார் நிலையில் உள்ளது.' : 'All features support offline-first local reading cache.'}
                            </p>
                          </div>

                        </div>
                      ) : (
                        <>
                          {/* VIEW: PDF CONTENT BY CATEGORY */}
                          {['prayers', 'saints', 'office', 'calendar'].includes(activePhoneTab) && (
                            <div className="space-y-4 flex-1 flex flex-col text-left">
                              {/* Date picker */}
                              <div className="flex items-center gap-2 bg-[#eae3d5] dark:bg-[#251e19] p-2 rounded-xl border border-amber-200/30 dark:border-amber-950/20">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  {userSettings.language === 'ta' ? 'தேதி:' : 'Date:'}
                                </span>
                                <input
                                  type="date"
                                  value={selectedDate}
                                  onChange={(e) => { hasInteracted.current = true; setSelectedDate(e.target.value); }}
                                  className="flex-1 text-xs px-2 py-1.5 rounded-lg border bg-white dark:bg-stone-900 border-slate-200 dark:border-stone-800 text-slate-800 dark:text-slate-100 font-bold"
                                />
                                <button
                                  onClick={() => { hasInteracted.current = true; setSelectedDate(new Date().toISOString().split('T')[0]); }}
                                  className="text-[10px] font-bold text-amber-700 dark:text-amber-400 px-2 py-1 hover:underline"
                                >
                                  {userSettings.language === 'ta' ? 'இன்று' : 'Today'}
                                </button>
                              </div>

                              {/* Category tabs */}
                              <div className="flex flex-wrap gap-1 bg-[#eae3d5] dark:bg-[#251e19] p-1.5 rounded-xl border border-amber-200/30 dark:border-amber-950/20">
                                {[
                                  { id: 'morning', labelEn: 'Morning', labelTa: 'காலை' },
                                  { id: 'noon', labelEn: 'Noon', labelTa: 'நண்பகல்' },
                                  { id: 'evening', labelEn: 'Evening', labelTa: 'மாலை' },
                                  { id: 'night', labelEn: 'Night', labelTa: 'இரவு' },
                                  ...(activePhoneTab === 'office' 
                                    ? [{ id: 'office' as const, labelEn: 'Office', labelTa: 'வாசகம்' }]
                                    : activePhoneTab === 'saints'
                                    ? [{ id: 'saints' as const, labelEn: 'Saints', labelTa: 'புனிதர்' }]
                                    : [{ id: 'office' as const, labelEn: 'Office', labelTa: 'வாசகம்' }]),
                                  ...(activePhoneTab === 'prayers' 
                                    ? [{ id: 'readings' as const, labelEn: 'Readings', labelTa: 'வாசிப்பு' }]
                                    : []),
                                ].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).map((hour) => {
                                  const isActive = selectedPrayerCategory === hour.id;
                                  return (
                                    <button
                                      key={hour.id}
                                      onClick={() => {
                                        hasInteracted.current = true;
                                        setSelectedPrayerCategory(hour.id as any);
                                        setPrayerSearch('');
                                      }}
                                      className={`flex-1 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all truncate px-1 ${
                                        isActive
                                          ? 'bg-indigo-950 dark:bg-amber-500 text-white dark:text-stone-950 shadow-xs font-bold'
                                          : 'text-slate-600 dark:text-stone-400 hover:text-indigo-900 dark:hover:text-amber-250'
                                      }`}
                                    >
                                      {userSettings.language === 'ta' ? hour.labelTa : hour.labelEn}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* PDF view for selected category + date + language */}
                              <div className="flex-1 flex flex-col items-center justify-center text-center py-4 space-y-4 content-scroll overflow-y-auto">
                                {(() => {
                                  const pdf = pdfDocuments.find(
                                    d => d.category === selectedPrayerCategory && d.date === selectedDate && d.language === userSettings.language
                                  );
                                  const pdfOtherLang = pdfDocuments.find(
                                    d => d.category === selectedPrayerCategory && d.date === selectedDate && d.language !== userSettings.language
                                  );
                                  if (!pdf && !pdfOtherLang) {
                                    if (selectedPrayerCategory === 'saints') {
                                      const monthDay = selectedDate.substring(5);
                                      const saint = saints.find(s => s.feastDate === monthDay);
                                      if (saint) {
                                        return (
                                          <div className="space-y-3 text-left w-full">
                                            <div className="p-5 rounded-xl bg-white dark:bg-stone-900/95 border border-amber-200/40 dark:border-amber-900/30 shadow-sm">
                                              <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">{userSettings.language === 'ta' ? 'இன்றைய புனிதர்' : 'Saint of the Day'}</span>
                                              <h3 className="text-lg font-bold text-indigo-950 dark:text-amber-50 mt-1 font-serif">{userSettings.language === 'ta' ? saint.nameTa : saint.nameEn}</h3>
                                              <p className="text-xs text-slate-500 dark:text-stone-400 mt-1 italic">{saint.feastDate}</p>
                                              <div className="h-px bg-amber-200/30 dark:bg-amber-900/20 my-3" />
                                              <p className={`${contentSizeClass} leading-loose font-serif text-left text-slate-700 dark:text-stone-200/90 max-w-prose`}>{userSettings.language === 'ta' ? saint.lifeHistoryTa : saint.lifeHistoryEn}</p>
                                            </div>
                                          </div>
                                        );
                                      }
                                    }
                                    if (selectedPrayerCategory === 'office' || selectedPrayerCategory === 'readings') {
                                      const day = liturgicalDays.find(d => d.date === selectedDate) || externalReadings;
                                      if (day) {
                                        const isExternal = externalReadings?.date === selectedDate && externalSourceLabel;
                                        return (
                                          <div className="space-y-4 text-left w-full">
                                            {isExternal && (
                                              <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest block text-center">Source: {externalSourceLabel}</span>
                                            )}
                                            {day.readingFirstEn && (
                                              <div className="p-5 rounded-xl bg-white dark:bg-stone-900/95 border border-slate-200 dark:border-stone-800 shadow-sm">
                                                <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">{userSettings.language === 'ta' ? 'முதல் வாசகம்' : 'First Reading'}</span>
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-300 block mb-2 italic">{day.readingFirstRefEn}</span>
                                                <p className={`${contentSizeClass} leading-loose font-serif text-left text-slate-700 dark:text-stone-200/90 max-w-prose`}>{userSettings.language === 'ta' ? day.readingFirstTa : day.readingFirstEn}</p>
                                              </div>
                                            )}
                                            {day.psalmEn && (
                                              <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/30 dark:border-amber-900/20 shadow-sm">
                                                <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">{userSettings.language === 'ta' ? 'பதிலுரைத் திருப்பாடல்' : 'Responsorial Psalm'}</span>
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-300 block mb-2 italic">{day.psalmRefEn}</span>
                                                <p className={`${contentSizeClass} leading-loose italic font-serif text-left text-slate-600 dark:text-stone-300/80 max-w-prose`}>{userSettings.language === 'ta' ? day.psalmTa : day.psalmEn}</p>
                                              </div>
                                            )}
                                            {day.gospelEn && (
                                              <div className="p-4 rounded-xl bg-rose-50/30 dark:bg-rose-950/10 border border-rose-200/40 dark:border-rose-900/20 shadow-sm">
                                                <span className="text-[9px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest block">{userSettings.language === 'ta' ? 'நற்செய்தி' : 'Gospel'}</span>
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-300 block mb-2 italic">{day.gospelRefEn}</span>
                                                <p className={`${contentSizeClass} leading-loose font-serif text-left text-slate-700 dark:text-stone-200/90 max-w-prose`}>{userSettings.language === 'ta' ? day.gospelTa : day.gospelEn}</p>
                                              </div>
                                            )}
                                            {selectedPrayerCategory === 'office' && day.officeEn && (
                                              <div className="p-4 rounded-xl bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-200/30 dark:border-indigo-900/20 shadow-sm">
                                                <span className="text-[9px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest block">{userSettings.language === 'ta' ? 'வாசகங்கள் வழிபாடு' : 'Office of Readings'}</span>
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-300 block mb-2 italic">{day.officeRefEn}</span>
                                                <p className={`${contentSizeClass} leading-loose font-serif text-left text-slate-700 dark:text-stone-200/90 max-w-prose`}>{userSettings.language === 'ta' ? day.officeTa : day.officeEn}</p>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      }
                                    }
                                    if (selectedPrayerCategory === 'morning' || selectedPrayerCategory === 'noon' || selectedPrayerCategory === 'evening' || selectedPrayerCategory === 'night') {
                                      const prayer = prayers.find(p => p.category === selectedPrayerCategory);
                                      if (prayer) {
                                        return (
                                          <div className="space-y-3 text-left w-full">
                                            <div className="p-6 rounded-xl bg-white dark:bg-stone-900/95 border border-amber-200/40 dark:border-amber-900/30 shadow-sm">
                                              <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">{userSettings.language === 'ta' ? 'இன்றைய செபம்' : "Today's Prayer"}</span>
                                              <h3 className="text-base font-bold text-indigo-950 dark:text-amber-50 mt-1.5 font-serif">{userSettings.language === 'ta' ? prayer.titleTa : prayer.titleEn}</h3>
                                              <div className="h-px bg-amber-200/40 dark:bg-amber-900/30 my-4" />
                                              <div className={`prayer-content leading-loose ${contentSizeClass}`}>{userSettings.language === 'ta' ? prayer.contentTa : prayer.contentEn}</div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    }
                                    return (
                                      <div className="space-y-2">
                                        <FileText size={40} className="mx-auto text-amber-300 dark:text-amber-600/40" />
                                        <p className="text-sm font-bold text-slate-500 dark:text-stone-400">
                                          {userSettings.language === 'ta' 
                                            ? `இந்த நாளுக்கான தரவு எதுவும் இல்லை - வேறு தேதியைத் தேர்ந்தெடுக்கவும்`
                                            : `No data available for ${selectedDate} - Select another date`}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                          {userSettings.language === 'ta'
                                            ? 'PDF ஏற்றப்படவில்லை அல்லது வெளிப்புற மூலத்திலிருந்து தரவு கிடைக்கவில்லை'
                                            : 'No PDF uploaded and no external data found for this date'}
                                        </p>
                                        {isLoadingExternal && (
                                          <div className="flex items-center justify-center gap-2 text-xs text-amber-600">
                                            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                                            <span>{userSettings.language === 'ta' ? 'வெளிப்புற மூலத்திலிருந்து தரவு பெறப்படுகிறது...' : 'Fetching from external source...'}</span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                  return pdfViewerUrl ? (
                                    <div className="flex items-center justify-center min-h-[200px]">
                                      <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                                      <p className="text-xs text-slate-400 ml-3">Opening PDF reader...</p>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center min-h-[200px]">
                                      <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                                      <p className="text-xs text-slate-400 ml-3">Loading PDF...</p>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          )}

                      {/* VIEW: SAINTS/CALENDAR handled by PDF viewer above */}

                      {/* VIEW: JOURNAL & REFLECTIONS */}
                      {activePhoneTab === 'journal' && (
                        <JournalReflections
                          entries={journalEntries}
                          prayers={prayers}
                          onAddEntry={handleAddJournalEntry}
                          onEditEntry={handleEditJournalEntry}
                          onDeleteEntry={handleDeleteJournalEntry}
                          language={userSettings.language}
                        />
                      )}

                      {/* VIEW: SAVED BOOKMARKS LIST */}
                      {activePhoneTab === 'bookmarks' && (
                        <div className="space-y-4 text-left flex-1" id="saved-bookmarks-screen">
                          <h3 className="text-base font-bold text-indigo-950 dark:text-slate-100 flex items-center gap-1.5 font-serif">
                            <BookmarkIcon size={18} className="text-amber-600" />
                            <span>{userSettings.language === 'ta' ? 'சேமிக்கப்பட்ட பகுதி' : 'My Saved Bookmarks'}</span>
                          </h3>

                          {bookmarks.length === 0 ? (
                            <div className="py-24 text-center text-slate-400 space-y-2">
                              <BookmarkIcon size={32} className="mx-auto text-amber-200" />
                              <p className="text-xs">No bookmarks saved yet.</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {bookmarks.map((b) => {
                                const hasBookmark = isItemBookmarked(b.itemId);
                                return (
                                  <div
                                    key={b.id}
                                    className="p-3 border rounded-xl bg-white dark:bg-stone-900 border-amber-100/50 dark:border-stone-850 flex items-center justify-between gap-3 text-xs"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block mb-0.5">
                                        {b.itemType}
                                      </span>
                                      <button
                                        onClick={() => {
                                          hasInteracted.current = true;
                                          if (b.itemType === 'prayer') {
                                            const p = prayers.find((x) => x.id === b.itemId);
                                            if (p) {
                                              setSelectedPrayerCategory(p.category);
                                              setActivePhoneTab('prayers');
                                            }
                                          } else if (b.itemType === 'saint') {
                                            setActivePhoneTab('saints');
                                          } else if (b.itemType === 'reading') {
                                            setSelectedDate(b.itemId);
                                            setActivePhoneTab('calendar');
                                          }
                                        }}
                                        className="font-bold text-indigo-955 dark:text-amber-100 hover:underline truncate block text-left w-full"
                                      >
                                        {userSettings.language === 'ta' ? b.titleTa : b.titleEn}
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => handleToggleBookmark(b.itemId, b.titleEn, b.titleTa)}
                                      className="text-stone-400 hover:text-rose-600 rounded p-1 transition shrink-0 font-bold"
                                    >
                                      Unsave
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* VIEW: ANNOUNCEMENTS */}
                      {activePhoneTab === 'announcements' && (
                        <div className="space-y-4 text-left flex-1" id="parish-notices-screen">
                          <div className="flex items-center justify-between border-b border-amber-100/40 dark:border-stone-850 pb-2">
                            <h3 className="text-base font-bold text-indigo-950 dark:text-slate-100 flex items-center gap-1.5 font-serif">
                              <Megaphone size={18} className="text-amber-600 animate-bounce" />
                              <span>{userSettings.language === 'ta' ? 'அறிவிப்புகள் பலகை' : 'Parish Announcements'}</span>
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono">
                              {announcements.length} Live
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            {announcements.length === 0 ? (
                              <div className="py-24 text-center text-slate-400 space-y-2">
                                <Megaphone size={32} className="mx-auto text-amber-200" />
                                <p className="text-xs">No active announcements at this time.</p>
                              </div>
                            ) : (
                              announcements.map((ann) => {
                                const isGold = ann.theme === 'gold';
                                const isBurgundy = ann.theme === 'burgundy';
                                const isIndigo = ann.theme === 'indigo';
                                return (
                                  <div 
                                    key={ann.id} 
                                    className={`p-4 rounded-2xl border text-left shadow-2xs transition duration-200 relative overflow-hidden ${
                                      isGold 
                                        ? 'bg-amber-500/5 border-amber-250/50 dark:border-amber-975/30 text-slate-800 dark:text-slate-100' 
                                        : isBurgundy 
                                        ? 'bg-rose-500/5 border-rose-250/50 dark:border-rose-975/30 text-slate-800 dark:text-slate-100' 
                                        : isIndigo 
                                        ? 'bg-indigo-500/5 border-indigo-250/50 dark:border-indigo-975/30 text-slate-800 dark:text-slate-100' 
                                        : 'bg-stone-500/5 border-stone-250/50 dark:border-stone-850/30 text-slate-800 dark:text-slate-100'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-2.5">
                                      <span className={`text-[8.5px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                        isGold 
                                          ? 'bg-amber-100 dark:bg-amber-955/50 text-amber-800 dark:text-amber-400' 
                                          : isBurgundy 
                                          ? 'bg-rose-100 dark:bg-[#4c0519] text-rose-800 dark:text-rose-300' 
                                          : isIndigo 
                                          ? 'bg-indigo-100 dark:bg-indigo-955/50 text-indigo-855 dark:text-indigo-400' 
                                          : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-400'
                                      }`}>
                                        {ann.category}
                                      </span>
                                      <span className="text-[9px] font-bold text-slate-400 font-mono">
                                        {formatDateToDDMMYYYY(ann.date)}
                                      </span>
                                    </div>

                                    <h4 className="text-xs font-bold text-indigo-950 dark:text-slate-50 tracking-tight leading-snug mt-2">
                                      {userSettings.language === 'ta' ? ann.titleTa : ann.titleEn}
                                    </h4>

                                    <p className="text-[11px] text-slate-600 dark:text-stone-300 leading-relaxed mt-1.5 whitespace-pre-wrap">
                                      {userSettings.language === 'ta' ? ann.descTa : ann.descEn}
                                    </p>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}

                      {/* VIEW: ROSARY DEVOTIONS */}
                      {activePhoneTab === 'rosary' && (
                        <RosarySection
                          language={userSettings.language}
                          fontSizeClass={activeFontClass}
                        />
                      )}

                    </>
                  )}

                    </div>
                    
                    {/* ADVERTISEMENT / ANNOUNCEMENT BANNER */}
                    {adBanner && adBanner.active && activePhoneTab === 'announcements' && (
                      <div className={`mx-3 mb-2 p-2 rounded-xl border text-left flex items-start gap-2 border-dashed shadow-2xs relative overflow-hidden shrink-0 transition-all ${
                        adBanner.theme === 'gold'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-955 dark:text-amber-200'
                          : adBanner.theme === 'burgundy'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-955 dark:text-rose-200'
                          : adBanner.theme === 'indigo'
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-955 dark:text-indigo-200'
                          : 'bg-stone-500/10 border-stone-510/30 text-stone-900 dark:text-stone-300'
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[7.5px] font-extrabold uppercase tracking-widest text-[#b45309] dark:text-amber-400">
                            {userSettings.language === 'ta' ? 'அறிவிப்பு பலகை' : 'Parish Announcement / Ad'}
                          </p>
                          <h5 className="text-[10px] font-bold leading-snug truncate mt-0.5">
                            {userSettings.language === 'ta' ? adBanner.titleTa : adBanner.titleEn}
                          </h5>
                          <p className="text-[9px] opacity-80 leading-tight mt-0.5 line-clamp-1">
                            {userSettings.language === 'ta' ? adBanner.descTa : adBanner.descEn}
                          </p>
                          {adBanner.linkUrl && (
                            <a 
                              href={adBanner.linkUrl} 
                              target="_blank" 
                              referrerPolicy="no-referrer"
                              className="text-[8.5px] font-bold text-amber-700 dark:text-amber-400 underline inline-block mt-0.5 hover:text-amber-800"
                            >
                              {userSettings.language === 'ta' ? 'விளக்க உரை →' : 'Learn More →'}
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* PHONE SIMULATOR NAVIGATION TAB BAR */}
                    <div className="border-t border-amber-100/60 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm py-2 px-1 grid grid-cols-7 gap-0.2 select-none z-10 shrink-0">
                      
                      {[
                        { id: 'prayers', icon: BookOpen, labelEn: 'Liturgy', labelTa: 'சபை' },
                        { id: 'calendar', icon: CalendarIcon, labelEn: 'Calendar', labelTa: 'நாட்கள்' },
                        { id: 'saints', icon: Sparkles, labelEn: 'Saints', labelTa: 'புனிதர்' },
                        { id: 'rosary', icon: Compass, labelEn: 'Rosary', labelTa: 'மணி' },
                        { id: 'journal', icon: PenTool, labelEn: 'Diary', labelTa: 'குறிப்பு' },
                        { id: 'bookmarks', icon: BookmarkIcon, labelEn: 'Saved', labelTa: 'சேமிப்பு' },
                        { id: 'announcements', icon: Megaphone, labelEn: 'Notices', labelTa: 'அறிவிப்பு' },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isChosen = activePhoneTab === tab.id && !showWelcome;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              hasInteracted.current = true;
                              setActivePhoneTab(tab.id);
                              setShowWelcome(false);
                              if (tab.id === 'saints') setSelectedPrayerCategory('saints');
                              else if (tab.id === 'calendar') setSelectedPrayerCategory('readings');
                            }}
                            id={`sim-nav-btn-${tab.id}`}
                            className={`flex flex-col items-center justify-center py-1 rounded-xl transition duration-150 ${
                              isChosen 
                                ? 'text-indigo-950 dark:text-amber-400 scale-102 font-bold' 
                                : 'text-slate-400 hover:text-indigo-900 dark:hover:text-amber-250'
                            }`}
                          >
                            <Icon size={16} className={`${isChosen ? 'stroke-[2.5px] text-amber-700 dark:text-amber-400' : 'stroke-[1.8px] text-slate-400 dark:text-stone-500'}`} />
                            <span className="text-[8.5px] mt-0.5 font-bold truncate tracking-tight w-full max-w-[55px] text-center">
                              {userSettings.language === 'ta' ? tab.labelTa : tab.labelEn}
                            </span>
                          </button>
                        );
                      })}

                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
        )}

      </main>

      {/* FOOTER BAR */}
      {displayMode !== 'android-native' && !isAdminPanelOpen && (
        <footer className="border-t border-slate-200 dark:border-stone-850 bg-white dark:bg-[#120e0a] mt-12 py-10 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-6 space-y-3">
            <p className="font-bold text-slate-600 dark:text-amber-200/90 font-serif italic text-sm">
              Breviarium Digitalis & Meditative Liturgy
            </p>
            <p className="max-w-xl mx-auto leading-relaxed text-slate-500 dark:text-stone-500 font-sans text-[11px]">
              This companion app is designed for both personal off-line daily devotion and dynamic parish management. All cached entries replicates locally for secure and zero-latency readings. Crafted with Professional Polish elements of sacred design.
            </p>
          </div>
        </footer>
      )}

      {/* PDF Reader Modal */}
      {pdfViewerUrl && (
        <PdfReader
          url={pdfViewerUrl}
          title={pdfViewerTitle}
          pdfData={pdfViewerDoc}
          onClose={() => {
            setPdfViewerUrl(null);
            setPdfViewerTitle('');
            setAutoOpenPdfId(null);
            setPdfViewerDoc(null);
          }}
        />
      )}

    </div>
  );
}
