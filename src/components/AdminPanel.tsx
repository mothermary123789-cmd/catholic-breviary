import React, { useState, useRef } from 'react';
import { Lock, Unlock, Database, RefreshCw, Plus, Edit, Trash, Check, X, FileText, Calendar, Sparkles, Megaphone, Users, UserCheck, Trash2, Heart, BookOpen, Upload, File as FileIcon, Eye } from 'lucide-react';
import { Prayer, Saint, LiturgicalDay, PrayerCategory, AdBanner, ParishUser, Announcement, OfficeReading, PdfDocument } from '../types';
import { supabase, uploadPdf, deletePdfDocument, getPdfStorageUrl } from '../supabase';

interface AdminPanelProps {
  prayers: Prayer[];
  saints: Saint[];
  liturgicalDays: LiturgicalDay[];
  officeReadings?: OfficeReading[];
  onSavePrayer: (prayer: Prayer) => void;
  onDeletePrayer: (id: string) => void;
  onSaveSaint: (saint: Saint) => void;
  onDeleteSaint: (id: string) => void;
  onSaveLiturgicalDay: (day: LiturgicalDay) => void;
  onDeleteLiturgicalDay: (date: string) => void;
  onSaveOfficeReading?: (reading: OfficeReading) => void;
  onDeleteOfficeReading?: (id: string) => void;

  isFirebaseConnected: boolean;
  currentUser: any;
  adBanner: AdBanner;
  onSaveAdBanner: (banner: AdBanner) => void;
  parishUsers: ParishUser[];
  onSaveParishUser: (user: ParishUser) => void;
  onDeleteParishUser: (id: string) => void;
  announcements?: Announcement[];
  onSaveAnnouncement?: (announcement: Announcement) => void;
  onDeleteAnnouncement?: (id: string) => void;
  onTriggerPushNotification?: (announcement: Announcement) => void;
  pdfDocuments?: PdfDocument[];
  onViewPdf?: (url: string, title: string) => void;
  onDeletePdf?: (id: string, filePath: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  prayers,
  saints,
  liturgicalDays,
  officeReadings = [],
  onSavePrayer,
  onDeletePrayer,
  onSaveSaint,
  onDeleteSaint,
  onSaveLiturgicalDay,
  onDeleteLiturgicalDay,
  onSaveOfficeReading,
  onDeleteOfficeReading,


  isFirebaseConnected,
  currentUser,
  adBanner,
  onSaveAdBanner,
  parishUsers,
  onSaveParishUser,
  onDeleteParishUser,
  announcements = [],
  onSaveAnnouncement,
  onDeleteAnnouncement,
  onTriggerPushNotification,
  pdfDocuments = [],
  onViewPdf,
  onDeletePdf,
}) => {
  // Admin Login Session
  const canAccessAdmin = currentUser?.email === 'mothermary123789@gmail.com';
  const [localIsAdminAuthenticated, setLocalIsAdminAuthenticated] = useState(false);

  const [adminEmail, setAdminEmail] = useState('mothermary123789@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Editing tabs
  const [activeTab, setActiveTab] = useState<'prayers' | 'saints' | 'calendar' | 'office' | 'ad' | 'users' | 'pdfs'>('prayers');

  // Form State managers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<Partial<Prayer> | null>(null);
  const [editingSaint, setEditingSaint] = useState<Partial<Saint> | null>(null);
  const [editingDay, setEditingDay] = useState<Partial<LiturgicalDay> | null>(null);
  const [editingOfficeReading, setEditingOfficeReading] = useState<Partial<OfficeReading> | null>(null);
  const [editingParishUser, setEditingParishUser] = useState<Partial<ParishUser> | null>(null);

  // AdBanner editing states
  const [adTitleEn, setAdTitleEn] = useState(adBanner?.titleEn || '');
  const [adTitleTa, setAdTitleTa] = useState(adBanner?.titleTa || '');
  const [adDescEn, setAdDescEn] = useState(adBanner?.descEn || '');
  const [adDescTa, setAdDescTa] = useState(adBanner?.descTa || '');
  const [adLinkUrl, setAdLinkUrl] = useState(adBanner?.linkUrl || '');
  const [adActive, setAdActive] = useState(adBanner?.active ?? false);
  const [adTheme, setAdTheme] = useState<'gold' | 'burgundy' | 'indigo' | 'charcoal'>(adBanner?.theme || 'gold');

  // Announcements custom management states
  const [annCategory, setAnnCategory] = useState('general');
  const [annTitleEn, setAnnTitleEn] = useState('');
  const [annTitleTa, setAnnTitleTa] = useState('');
  const [annDescEn, setAnnDescEn] = useState('');
  const [annDescTa, setAnnDescTa] = useState('');
  const [annTheme, setAnnTheme] = useState<'gold' | 'burgundy' | 'indigo' | 'charcoal'>('gold');
  const [annDate, setAnnDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [isAnnFormOpen, setIsAnnFormOpen] = useState(false);

  // PDF upload state
  const [pdfDate, setPdfDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pdfCategory, setPdfCategory] = useState<'morning' | 'noon' | 'evening' | 'night' | 'office' | 'saints' | 'readings'>('morning');
  const [pdfLanguage, setPdfLanguage] = useState<'en' | 'ta'>('en');
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitleEn || !annTitleTa || !annDescEn || !annDescTa) {
      alert('Please fill out all required announcement fields.');
      return;
    }
    const newAnn: Announcement = {
      id: 'ann-' + Date.now(),
      category: annCategory,
      titleEn: annTitleEn,
      titleTa: annTitleTa,
      descEn: annDescEn,
      descTa: annDescTa,
      theme: annTheme,
      date: annDate,
    };
    if (onSaveAnnouncement) {
      onSaveAnnouncement(newAnn);
      alert('Announcement created successfully!');
      setAnnTitleEn('');
      setAnnTitleTa('');
      setAnnDescEn('');
      setAnnDescTa('');
      setIsAnnFormOpen(false);
    }
  };

  React.useEffect(() => {
    if (adBanner) {
      setAdTitleEn(adBanner.titleEn || '');
      setAdTitleTa(adBanner.titleTa || '');
      setAdDescEn(adBanner.descEn || '');
      setAdDescTa(adBanner.descTa || '');
      setAdLinkUrl(adBanner.linkUrl || '');
      setAdActive(adBanner.active ?? false);
      setAdTheme(adBanner.theme || 'gold');
    }
  }, [adBanner]);

  // Authentication logic
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsAuthLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
      if (error) throw error;
      setLoginError('');
      setLocalIsAdminAuthenticated(true);
    } catch (err: any) {
      setLoginError(`Authentication failed: ${err.message}. Ensure you have created the user in Supabase Auth (Settings > Authentication > Users > Add User)`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoginError('');
    setIsAuthLoading(true);
    setLoginError('Google Sign-In is not available in this version. Please use email/password login.');
    setIsAuthLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setLocalIsAdminAuthenticated(false);
    } catch (err) {
      console.error("Sign-out failed", err);
    }
  };

  // Safe form close
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPrayer(null);
    setEditingSaint(null);
    setEditingDay(null);
    setEditingOfficeReading(null);
    setEditingParishUser(null);
  };

  // 1. PRAYER SUBMISSION HELPERS
  const triggerAddPrayer = () => {
    setEditingPrayer({
      id: `prayer-${Date.now()}`,
      category: 'morning',
      titleEn: '',
      titleTa: '',
      contentEn: '',
      contentTa: '',
      isCustom: true,
    });
    setIsFormOpen(true);
  };

  const triggerEditPrayer = (prayer: Prayer) => {
    setEditingPrayer({ ...prayer });
    setIsFormOpen(true);
  };

  const submitPrayerForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrayer || !editingPrayer.titleEn || !editingPrayer.titleTa || !editingPrayer.contentEn || !editingPrayer.contentTa) return;
    onSavePrayer(editingPrayer as Prayer);
    closeForm();
  };

  // 2. SAINT SUBMISSION HELPERS
  const triggerAddSaint = () => {
    setEditingSaint({
      id: `saint-${Date.now()}`,
      feastDate: '01-01',
      nameEn: '',
      nameTa: '',
      lifeHistoryEn: '',
      lifeHistoryTa: '',
      imageUrl: 'https://images.unsplash.com/photo-1548625361-155deee2614a?w=400&auto=format&fit=crop',
      isCustom: true,
    });
    setIsFormOpen(true);
  };

  const triggerEditSaint = (saint: Saint) => {
    setEditingSaint({ ...saint });
    setIsFormOpen(true);
  };

  const submitSaintForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSaint || !editingSaint.feastDate || !editingSaint.nameEn || !editingSaint.nameTa || !editingSaint.lifeHistoryEn || !editingSaint.lifeHistoryTa) return;
    onSaveSaint(editingSaint as Saint);
    closeForm();
  };

  // 3. LITURGICAL CALENDAR SUBMISSION HELPERS
  const triggerAddDay = () => {
    setEditingDay({
      date: '2026-06-25',
      seasonEn: 'Ordinary Time',
      seasonTa: 'சாதாரண காலம்',
      color: 'green',
      feastEn: '',
      feastTa: '',
      readingFirstRefEn: '',
      readingFirstRefTa: '',
      readingFirstEn: '',
      readingFirstTa: '',
      psalmRefEn: '',
      psalmRefTa: '',
      psalmEn: '',
      psalmTa: '',
      gospelRefEn: '',
      gospelRefTa: '',
      gospelEn: '',
      gospelTa: '',
      officeRefEn: '',
      officeRefTa: '',
      officeEn: '',
      officeTa: '',
      isCustom: true,
    });
    setIsFormOpen(true);
  };

  const triggerEditDay = (day: LiturgicalDay) => {
    setEditingDay({ ...day });
    setIsFormOpen(true);
  };

  const submitDayForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDay || !editingDay.date || !editingDay.feastEn || !editingDay.feastTa || !editingDay.readingFirstRefEn || !editingDay.readingFirstEn || !editingDay.psalmRefEn || !editingDay.psalmEn || !editingDay.gospelRefEn || !editingDay.gospelEn) return;
    onSaveLiturgicalDay(editingDay as LiturgicalDay);
    closeForm();
  };

  // 4. OFFICE READING HELPERS
  const triggerAddOfficeReading = () => {
    setEditingOfficeReading({
      id: `office-${Date.now()}`,
      refEn: '',
      refTa: '',
      textEn: '',
      textTa: '',
      isCustom: true,
    });
    setIsFormOpen(true);
  };

  const triggerEditOfficeReading = (reading: OfficeReading) => {
    setEditingOfficeReading({ ...reading });
    setIsFormOpen(true);
  };

  const submitOfficeReadingForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficeReading || !editingOfficeReading.refEn || !editingOfficeReading.refTa || !editingOfficeReading.textEn || !editingOfficeReading.textTa) return;
    if (onSaveOfficeReading) onSaveOfficeReading(editingOfficeReading as OfficeReading);
    closeForm();
  };

  // 5. PARISHIONER PROFILE HELPERS
  const triggerAddParishUser = () => {
    setEditingParishUser({
      id: `user-${Date.now()}`,
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'parishioner',
      registeredDate: new Date().toISOString().split('T')[0],
    });
    setIsFormOpen(true);
  };

  const triggerEditParishUser = (user: ParishUser) => {
    setEditingParishUser({ ...user });
    setIsFormOpen(true);
  };

  const submitParishUserForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParishUser || !editingParishUser.fullName || !editingParishUser.email) return;
    onSaveParishUser(editingParishUser as ParishUser);
    closeForm();
  };

  // 5. AD BANNER SAVE LOGIC
  const handleUpdateAdBanner = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAdBanner({
      id: 'ad-banner-primary',
      active: adActive,
      titleEn: adTitleEn,
      titleTa: adTitleTa,
      descEn: adDescEn,
      descTa: adDescTa,
      linkUrl: adLinkUrl,
      theme: adTheme,
    });
    alert('Advertisement announcement config updated successfully!');
  };

  // Unauthenticated Admin Screen
  if (!canAccessAdmin && !localIsAdminAuthenticated) {
    return (
      <div className="p-6 max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/40 rounded-full flex items-center justify-center mx-auto text-amber-700 dark:text-amber-400">
          <Lock size={32} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Secure Content Dashboard</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Authentication is required to perform canonical edits on live parish prayers, saint bios, or liturgical calendars in Firestore.
          </p>
        </div>

        {isFirebaseConnected ? (
          <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-950/35 p-3 rounded-xl text-left">
            <span className="text-[10.5px] font-bold text-amber-800 dark:text-amber-400 block mb-1">🔥 SUPABASE SYNCHRONIZATION ENABLED</span>
            <span className="text-[11px] text-amber-900/80 dark:text-amber-350/80 leading-relaxed block">
              Log in with credentials (<strong>mothermary123789@gmail.com</strong>) configured in Supabase Auth.
            </span>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-stone-800 p-3 rounded-xl text-left">
            <span className="text-[10.5px] font-bold text-slate-500 block mb-1">💻 CLIENT-ONLY MODE</span>
            <span className="text-[11px] text-slate-400 leading-relaxed block">
              No live cloud connection. Edits populate immediately on this device and persist safely in browser Local Storage.
            </span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full text-sm border px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
              required
              disabled={isAuthLoading}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Supabase Auth Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full text-sm border px-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required={isFirebaseConnected}
              disabled={isAuthLoading}
            />
          </div>

          {loginError && (
            <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-950/30">
              {loginError}
            </p>
          )}

          <div className="space-y-2">
            <button
              type="submit"
              id="admin-login-submit"
              disabled={isAuthLoading}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-750 text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isAuthLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Unlock size={16} />
              )}
              {isAuthLoading ? 'Authenticating...' : 'Authorize & Unlock Dashboard'}
            </button>

            {isFirebaseConnected && (
              <div className="text-[10px] text-slate-400 text-center">
                Supabase authentication active.
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4 text-left p-2">
      {/* Admin Header read-outs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Content Administration</h3>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-xs text-slate-400">Logged in: {currentUser?.email || 'mothermary123789@gmail.com'}</p>
            <button
              onClick={handleSignOut}
              className="text-[10px] text-rose-500 hover:underline font-bold"
            >
              (Logout)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          {/* Sync status */}
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <Database size={13} className="text-slate-500" />
            <span>Supabase</span>
          </span>

        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap border-b border-slate-100 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-900 rounded-xl gap-0.5">
        {[
          { id: 'prayers', label: 'Daily Prayers', icon: FileText },
          { id: 'saints', label: 'Saints Bio', icon: Sparkles },
          { id: 'calendar', label: 'Liturgy Calendar', icon: Calendar },
          { id: 'office', label: 'Divine Office', icon: BookOpen },
          { id: 'ad', label: 'Announcements', icon: Megaphone },
          { id: 'pdfs', label: 'PDF Documents', icon: FileIcon },
          { id: 'users', label: `Parish Users (${parishUsers.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsFormOpen(false);
              }}
              id={`admin-tab-btn-${tab.id}`}
              className={`flex-1 min-w-[80px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 shrink-0 ${
                isActive
                  ? 'bg-white dark:bg-slate-950 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={13} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Editing forms or tables */}
      {!isFormOpen ? (
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* 1. MANAGE PRAYERS SECTION */}
          {activeTab === 'prayers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  System Prayers ({prayers.length})
                </span>
                <button
                  onClick={triggerAddPrayer}
                  id="admin-add-prayer-btn"
                  className="flex items-center gap-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg"
                >
                  <Plus size={12} />
                  Add New Prayer
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl bg-white dark:bg-slate-930 border-slate-100 dark:border-slate-800/80 overflow-hidden">
                {prayers.map((prayer) => (
                  <div key={prayer.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900 border px-1.5 py-0.5 rounded">
                          {prayer.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-150 truncate">
                          {prayer.titleEn}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 italic truncate">
                        {prayer.titleTa}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => triggerEditPrayer(prayer)}
                        id={`edit-prayer-btn-${prayer.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeletePrayer(prayer.id)}
                        id={`delete-prayer-btn-${prayer.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. MANAGE SAINTS SECTION */}
          {activeTab === 'saints' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Saints Profiles ({saints.length})
                </span>
                <button
                  onClick={triggerAddSaint}
                  id="admin-add-saint-btn"
                  className="flex items-center gap-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg"
                >
                  <Plus size={12} />
                  Add New Saint
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl bg-white dark:bg-slate-930 border-slate-100 dark:border-slate-800/80 overflow-hidden">
                {saints.map((saint) => (
                  <div key={saint.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {saint.imageUrl && (
                        <img
                          src={saint.imageUrl}
                          alt={saint.nameEn}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-50 inline-block"
                        />
                      )}
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {saint.nameEn} (Feast: {saint.feastDate})
                        </h4>
                        <p className="text-xs text-slate-400 truncate italic mt-0.5">{saint.nameTa}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => triggerEditSaint(saint)}
                        id={`edit-saint-btn-${saint.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteSaint(saint.id)}
                        id={`delete-saint-btn-${saint.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. MANAGE LITURGICAL DAY RECTOR */}
          {activeTab === 'calendar' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Liturgical Calendar Index ({liturgicalDays.length})
                </span>
                <button
                  onClick={triggerAddDay}
                  id="admin-add-day-btn"
                  className="flex items-center gap-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg"
                >
                  <Plus size={12} />
                  Add Reading Day
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl bg-white dark:bg-slate-930 border-slate-100 dark:border-slate-800/80 overflow-hidden">
                {liturgicalDays.map((ld) => (
                  <div key={ld.date} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          ld.color === 'purple' ? 'bg-purple-500' :
                          ld.color === 'red' ? 'bg-red-500' :
                          ld.color === 'white' ? 'bg-yellow-400' : 'bg-emerald-500'
                        }`} />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {ld.date} — {ld.feastEn}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{ld.feastTa}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => triggerEditDay(ld)}
                        id={`edit-day-btn-${ld.date}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteLiturgicalDay(ld.date)}
                        id={`delete-day-btn-${ld.date}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MANAGE DIVINE OFFICE READINGS */}
          {activeTab === 'office' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Divine Office Patristic Readings ({officeReadings.length})
                </span>
                <button
                  onClick={triggerAddOfficeReading}
                  id="admin-add-office-btn"
                  className="flex items-center gap-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg"
                >
                  <Plus size={12} />
                  Add Patristic Reading
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl bg-white dark:bg-slate-930 border-slate-100 dark:border-slate-800/80 overflow-hidden">
                {officeReadings.map((r) => (
                  <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{r.refEn}</h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{r.refTa}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{r.textEn.substring(0, 100)}...</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => triggerEditOfficeReading(r)}
                        id={`edit-office-btn-${r.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => { if (onDeleteOfficeReading) onDeleteOfficeReading(r.id); }}
                        id={`delete-office-btn-${r.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. MANAGE PDF DOCUMENTS SECTION */}
          {activeTab === 'pdfs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  PDF Documents ({pdfDocuments.length})
                </span>
              </div>

              {/* Upload Form */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-stone-800 bg-white dark:bg-stone-930 text-left space-y-4 shadow-3xs max-w-xl mx-auto">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Upload size={18} className="text-amber-600" />
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100">Upload New PDF</h4>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!pdfFile || !pdfTitle) {
                    setPdfUploadError('Please fill all fields and select a PDF file.');
                    return;
                  }
                  setIsPdfUploading(true);
                  setPdfUploadError('');
                  try {
                    await uploadPdf(pdfFile, pdfDate, pdfCategory, pdfLanguage, pdfTitle);
                    setPdfTitle('');
                    setPdfFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    alert('PDF uploaded successfully! Users will see it immediately.');
                  } catch (err: any) {
                    setPdfUploadError(`Upload failed: ${err.message}`);
                  } finally {
                    setIsPdfUploading(false);
                  }
                }} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date</label>
                      <input
                        type="date"
                        value={pdfDate}
                        onChange={(e) => setPdfDate(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                      <select
                        value={pdfCategory}
                        onChange={(e) => setPdfCategory(e.target.value as any)}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 font-bold"
                      >
                        <option value="morning">Morning Prayer</option>
                        <option value="noon">Noon Prayer</option>
                        <option value="evening">Evening Prayer</option>
                        <option value="night">Night Prayer</option>
                        <option value="office">Office of Reading</option>
                        <option value="saints">Saints of the Day</option>
                        <option value="readings">Today's Reading</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Language</label>
                      <select
                        value={pdfLanguage}
                        onChange={(e) => setPdfLanguage(e.target.value as 'en' | 'ta')}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 font-bold"
                      >
                        <option value="en">English</option>
                        <option value="ta">தமிழ்</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Title</label>
                      <input
                        type="text"
                        value={pdfTitle}
                        onChange={(e) => setPdfTitle(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                        placeholder={`e.g. ${pdfLanguage === 'en' ? 'Morning Prayer' : 'காலை செபம்'} - ${pdfDate}`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">PDF File</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
                        required
                      />
                    </div>
                  </div>

                  {pdfUploadError && (
                    <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-950/30">
                      {pdfUploadError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isPdfUploading}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800/50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                  >
                    {isPdfUploading ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    {isPdfUploading ? 'Uploading...' : 'Upload PDF'}
                  </button>
                </form>
              </div>

              {/* PDF List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl bg-white dark:bg-slate-930 border-slate-100 dark:border-slate-800/80 overflow-hidden">
                {pdfDocuments.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 space-y-2">
                    <FileIcon size={32} className="mx-auto text-amber-200" />
                    <p className="text-xs">No PDF documents uploaded yet.</p>
                  </div>
                ) : (
                  pdfDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900 border px-1.5 py-0.5 rounded">
                            {doc.category}
                          </span>
                          <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 px-1.5 py-0.5 rounded">
                            {doc.language === 'ta' ? 'தமிழ்' : 'EN'}
                          </span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                            {doc.date}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-150 truncate">
                            {doc.title}
                          </h4>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {doc.fileName} {doc.fileSize ? `(${(doc.fileSize / 1024).toFixed(0)} KB)` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            const url = getPdfStorageUrl(doc.filePath);
                            if (onViewPdf) onViewPdf(url, doc.titleEn);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition"
                          title="View PDF"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${doc.title}"?`)) {
                              if (onDeletePdf) {
                                onDeletePdf(doc.id, doc.filePath);
                              } else {
                                deletePdfDocument(doc.id, doc.filePath).catch(err => console.error('Failed to delete PDF:', err));
                              }
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                          title="Delete PDF"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 6. MANAGE ADVERTISEMENTS SECTION */}
          {activeTab === 'ad' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-stone-800 bg-white dark:bg-stone-930 text-left space-y-4 shadow-3xs max-w-xl mx-auto">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Megaphone size={18} className="text-amber-600" />
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100">Configure Bottom Banner Announcements</h4>
                </div>
                
                <form onSubmit={handleUpdateAdBanner} className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-stone-300">Banner Display Status</label>
                      <p className="text-[10px] text-slate-400">Toggle public advertisement visibility across all application viewports</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAdActive(!adActive)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                        adActive ? 'bg-amber-600' : 'bg-slate-300 dark:bg-stone-855'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-250 ease-in-out ${
                        adActive ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">English Title</label>
                      <input
                        type="text"
                        value={adTitleEn}
                        onChange={(e) => setAdTitleEn(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                        placeholder="e.g. Annual Feast Donation Campaign"
                        required={adActive}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tamil Title</label>
                      <input
                        type="text"
                        value={adTitleTa}
                        onChange={(e) => setAdTitleTa(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                        placeholder="எ.கா. ஆண்டு திருவிழா நன்கொடை"
                        required={adActive}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">English Short Description</label>
                      <textarea
                        value={adDescEn}
                        onChange={(e) => setAdDescEn(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                        placeholder="Help renovate Basilica main hallways..."
                        rows={2}
                        required={adActive}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tamil Short Description</label>
                      <textarea
                        value={adDescTa}
                        onChange={(e) => setAdDescTa(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                        placeholder="கடல் அன்னை ஆலய புதிய மண்டப திருப்பணிக்கு தாராளமாக உதவுங்கள்..."
                        rows={2}
                        required={adActive}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Action Link URL (Optional)</label>
                      <input
                        type="url"
                        value={adLinkUrl}
                        onChange={(e) => setAdLinkUrl(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                        placeholder="https://parish.org/donate"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Visual Color Style Theme</label>
                      <select
                        value={adTheme}
                        onChange={(e) => setAdTheme(e.target.value as any)}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-800 text-slate-800 dark:text-slate-100 font-bold"
                      >
                        <option value="gold">Yellow Amber Gold Theme</option>
                        <option value="burgundy">Sacred Deep Burgundy Red</option>
                        <option value="indigo">Graceful Royal Blue Indigo</option>
                        <option value="charcoal">Stately Slate Charcoal Black</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="save-ad-banner-adm-btn"
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-[0.99]"
                  >
                    Save & Activate bottom Ad Campaign
                  </button>
                </form>
              </div>

              {/* BRAND NEW: CONFIGURE PARISH PUSH ANNOUNCEMENTS */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-stone-800 bg-white dark:bg-stone-930 text-left space-y-4 shadow-3xs max-w-xl mx-auto mt-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Megaphone size={18} className="text-indigo-600 animate-pulse" />
                    <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100">Broadcast Push Announcements Board</h4>
                  </div>
                  <button
                    onClick={() => setIsAnnFormOpen(!isAnnFormOpen)}
                    className="text-[10px] font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-100/70"
                  >
                    {isAnnFormOpen ? 'View Announcements List' : '＋ Create Notice'}
                  </button>
                </div>

                {isAnnFormOpen ? (
                  <form onSubmit={handleSubmitAnnouncement} className="space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                        <select
                          value={annCategory}
                          onChange={(e) => setAnnCategory(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-880 text-slate-800 dark:text-slate-100 font-bold"
                        >
                          <option value="notice">📢 General Notice</option>
                          <option value="festival">🎉 Festival / Feast</option>
                          <option value="youth">👥 Youth Group</option>
                          <option value="liturgy">⛪ Liturgy / Sacrament</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date</label>
                        <input
                          type="date"
                          value={annDate}
                          onChange={(e) => setAnnDate(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-880 text-slate-800 dark:text-slate-100 font-semibold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">English Title</label>
                        <input
                          type="text"
                          value={annTitleEn}
                          onChange={(e) => setAnnTitleEn(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-880 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                          placeholder="e.g. Sunday Choir Auditions"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tamil Title</label>
                        <input
                          type="text"
                          value={annTitleTa}
                          onChange={(e) => setAnnTitleTa(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-880 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                          placeholder="எ.கா. பாடகர் குழு தேர்வு"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">English Message Body</label>
                        <textarea
                          value={annDescEn}
                          onChange={(e) => setAnnDescEn(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-880 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                          placeholder="Join the choir at morning prayers..."
                          rows={2}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tamil Message Body</label>
                        <textarea
                          value={annDescTa}
                          onChange={(e) => setAnnDescTa(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-880 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                          placeholder="காலை திருவழிபாட்டில் பாடகர்..."
                          rows={2}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Visual Theme Color</label>
                        <select
                          value={annTheme}
                          onChange={(e) => setAnnTheme(e.target.value as any)}
                          className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white dark:bg-stone-900 border-slate-250 dark:border-stone-880 text-slate-800 dark:text-slate-100 font-bold"
                        >
                          <option value="gold">Yellow Amber Theme</option>
                          <option value="burgundy">Sacred Burgundy Red</option>
                          <option value="indigo">Royal Indigo Blue</option>
                          <option value="charcoal">Slate Charcoal Black</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Publish Announcement Notice
                    </button>
                  </form>
                ) : (
                  <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                    {announcements.length === 0 ? (
                      <p className="text-xs text-slate-405 dark:text-stone-500 py-6 text-center">No broadcast notices created in database.</p>
                    ) : (
                      announcements.map((ann) => (
                        <div key={ann.id} className="p-3 rounded-xl border border-slate-100 dark:border-stone-850/80 bg-slate-50/50 dark:bg-stone-900/40 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-[7.5px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded">
                                {ann.category}
                              </span>
                              <span className="text-[8.5px] text-slate-400 font-mono font-bold">{ann.date}</span>
                            </div>
                            <h5 className="font-bold text-slate-800 dark:text-slate-100 truncate mt-1">{ann.titleEn}</h5>
                            <p className="text-[10px] text-slate-450 dark:text-stone-400 truncate leading-tight">{ann.descEn}</p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                if (onTriggerPushNotification) {
                                  onTriggerPushNotification(ann);
                                }
                              }}
                              className="px-2 py-1 bg-amber-500 text-stone-950 hover:bg-amber-600 font-extrabold text-[9px] rounded-lg transition"
                              title="Send simulated push notification alert to smartphone screens"
                            >
                              Push
                            </button>
                            <button
                              onClick={() => {
                                if (onDeleteAnnouncement) {
                                  onDeleteAnnouncement(ann.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition"
                              title="Remove announcement"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. MANAGE PARISH MEMBERS DIRECTORY COUNTER (add number of users in admin dashboard) */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Aggregate Dashboard Read-out values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-950/25 flex items-center gap-3 shadow-3xs">
                  <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-xs">
                    <Users size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Parishioners</span>
                    <h4 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-50 mt-0.5">{parishUsers.length} Registered</h4>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/5 border border-indigo-200/40 dark:border-stone-850 flex items-center gap-3 shadow-3xs">
                  <div className="p-2.5 rounded-xl bg-indigo-600/90 text-white shadow-xs">
                    <UserCheck size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Pastors & Catechists</span>
                    <h4 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-50 mt-0.5">
                      {parishUsers.filter(u => u.role === 'pastor' || u.role === 'catechist').length} Clergy/Staff
                    </h4>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-500/5 border border-rose-200/40 dark:border-stone-850 flex items-center gap-3 sm:col-span-2 lg:col-span-1 shadow-3xs">
                  <div className="p-2.5 rounded-xl bg-rose-600/95 text-white shadow-xs">
                    <Heart size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Choir & Organist Leaders</span>
                    <h4 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-50 mt-0.5">
                      {parishUsers.filter(u => u.role === 'choir_leader').length} Leaders
                    </h4>
                  </div>
                </div>
              </div>

              {/* Header and Add button */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  PARISH REGISTRY DIRECTORY
                </span>
                <button
                  type="button"
                  onClick={triggerAddParishUser}
                  id="admin-add-parishioner-btn"
                  className="flex items-center gap-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg transition-all active:scale-95"
                >
                  <Plus size={12} />
                  Register New Parishioner
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl bg-white dark:bg-stone-930 border-slate-150 dark:border-stone-850/80 overflow-hidden">
                {parishUsers.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 space-y-2">
                    <Users size={32} className="mx-auto text-amber-200" />
                    <p className="text-xs">No registered parishioners in local database. Register one to see count update!</p>
                  </div>
                ) : (
                  parishUsers.map((user) => (
                    <div key={user.id} className="p-4 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap hover:bg-slate-50/50 dark:hover:bg-stone-900/30 transition">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 dark:text-slate-50 text-sm truncate">{user.fullName}</h4>
                          <span className={`text-[8.5px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                            user.role === 'pastor'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-750 dark:text-rose-400'
                              : user.role === 'catechist'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-400'
                              : user.role === 'choir_leader'
                              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-750 dark:text-indigo-400'
                              : 'bg-stone-100 border-stone-250 text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10.5px] text-slate-500 dark:text-stone-400 mt-1 flex-wrap font-sans">
                          <span className="truncate">Email: {user.email}</span>
                          {user.phoneNumber && <span className="truncate">Phone: {user.phoneNumber}</span>}
                          <span>Registered: {user.registeredDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-auto md:ml-0">
                        <button
                          type="button"
                          onClick={() => triggerEditParishUser(user)}
                          id={`edit-user-btn-${user.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all cursor-pointer"
                          title="Edit Parishioner"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteParishUser(user.id)}
                          id={`delete-user-btn-${user.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                          title="Unregister Parishioner"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* EDITING AND CREATION MODAL/FLYER */
        <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-y-auto flex-1 text-xs" style={{ maxHeight: '70vh' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Form Editor (Dual Languages)
            </span>
            <button
              onClick={closeForm}
              className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form: Prayers */}
          {editingPrayer && (
            <form onSubmit={submitPrayerForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unique Identifier Key</label>
                  <input
                    type="text"
                    value={editingPrayer.id}
                    onChange={(e) => setEditingPrayer({ ...editingPrayer, id: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-slate-100 dark:bg-slate-950/50 text-slate-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category Slot</label>
                  <select
                    value={editingPrayer.category}
                    onChange={(e) => setEditingPrayer({ ...editingPrayer, category: e.target.value as PrayerCategory })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="morning">Morning Prayer (Lauds)</option>
                    <option value="noon">Midday Prayer (Sext)</option>
                    <option value="evening">Evening Prayer (Vespers)</option>
                    <option value="night">Night Prayer (Compline)</option>
                    <option value="office">Office of Readings</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 p-3 bg-white dark:bg-slate-950/20 border rounded-xl border-slate-150 dark:border-slate-800">
                  <h5 className="font-bold text-amber-700 dark:text-amber-400">English Standard Text</h5>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">Prayer Title (EN)</label>
                    <input
                      type="text"
                      id="edit-prayer-title-en"
                      value={editingPrayer.titleEn || ''}
                      onChange={(e) => setEditingPrayer({ ...editingPrayer, titleEn: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">Scripture Reference (EN)</label>
                    <input
                      type="text"
                      value={editingPrayer.scriptureRefEn || ''}
                      onChange={(e) => setEditingPrayer({ ...editingPrayer, scriptureRefEn: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">Prayer Content (EN)</label>
                    <textarea
                      value={editingPrayer.contentEn || ''}
                      onChange={(e) => setEditingPrayer({ ...editingPrayer, contentEn: e.target.value })}
                      className="w-full p-2 border rounded-lg h-36 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 p-3 bg-white dark:bg-slate-950/20 border rounded-xl border-slate-150 dark:border-slate-800">
                  <h5 className="font-bold text-amber-700 dark:text-amber-400">Tamil Standard Text</h5>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">Prayer Title (TA)</label>
                    <input
                      type="text"
                      id="edit-prayer-title-ta"
                      value={editingPrayer.titleTa || ''}
                      onChange={(e) => setEditingPrayer({ ...editingPrayer, titleTa: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">Scripture Reference (TA)</label>
                    <input
                      type="text"
                      value={editingPrayer.scriptureRefTa || ''}
                      onChange={(e) => setEditingPrayer({ ...editingPrayer, scriptureRefTa: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">Prayer Content (TA)</label>
                    <textarea
                      value={editingPrayer.contentTa || ''}
                      onChange={(e) => setEditingPrayer({ ...editingPrayer, contentTa: e.target.value })}
                      className="w-full p-2 border rounded-lg h-36 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button type="button" onClick={closeForm} className="px-3 py-2 border rounded-lg">Cancel</button>
                <button type="submit" id="save-prayer-admin-btn" className="px-5 py-2 bg-amber-600 text-white rounded-lg font-bold flex items-center gap-1">
                  <Check size={14} /> Save Prayer Entry
                </button>
              </div>
            </form>
          )}

          {/* Form: Saints */}
          {editingSaint && (
            <form onSubmit={submitSaintForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Feast Calendar Date (MM-DD)</label>
                  <input
                    type="text"
                    placeholder="e.g. 06-19"
                    value={editingSaint.feastDate}
                    onChange={(e) => setEditingSaint({ ...editingSaint, feastDate: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950 text-slate-900"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Illustration Profile URL</label>
                  <input
                    type="text"
                    value={editingSaint.imageUrl || ''}
                    onChange={(e) => setEditingSaint({ ...editingSaint, imageUrl: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 p-3 bg-white dark:bg-slate-950/20 border rounded-xl border-slate-150 dark:border-slate-800">
                  <h5 className="font-bold text-amber-700 dark:text-amber-400">English Standard Text</h5>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">Saint Name (EN)</label>
                    <input
                      type="text"
                      id="edit-saint-name-en"
                      value={editingSaint.nameEn || ''}
                      onChange={(e) => setEditingSaint({ ...editingSaint, nameEn: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">Saint Biography & History (EN)</label>
                    <textarea
                      value={editingSaint.lifeHistoryEn || ''}
                      onChange={(e) => setEditingSaint({ ...editingSaint, lifeHistoryEn: e.target.value })}
                      className="w-full p-2 border rounded-lg h-44"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 p-3 bg-white dark:bg-slate-950/20 border rounded-xl border-slate-150 dark:border-slate-800">
                  <h5 className="font-bold text-amber-700 dark:text-amber-400">Tamil Standard Text</h5>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">Saint Name (TA)</label>
                    <input
                      type="text"
                      id="edit-saint-name-ta"
                      value={editingSaint.nameTa || ''}
                      onChange={(e) => setEditingSaint({ ...editingSaint, nameTa: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">Saint Biography & History (TA)</label>
                    <textarea
                      value={editingSaint.lifeHistoryTa || ''}
                      onChange={(e) => setEditingSaint({ ...editingSaint, lifeHistoryTa: e.target.value })}
                      className="w-full p-2 border rounded-lg h-44"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button type="button" onClick={closeForm} className="px-3 py-2 border rounded-lg">Cancel</button>
                <button type="submit" id="save-saint-admin-btn" className="px-5 py-2 bg-amber-600 text-white rounded-lg font-bold flex items-center gap-1">
                  <Check size={14} /> Save Saint Page
                </button>
              </div>
            </form>
          )}

          {/* Form: Liturgical Day Readings */}
          {editingDay && (
            <form onSubmit={submitDayForm} className="space-y-4 text-[11px] font-medium text-slate-700 dark:text-slate-350">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Calender Date (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    value={editingDay.date}
                    onChange={(e) => setEditingDay({ ...editingDay, date: e.target.value })}
                    placeholder="2026-06-25"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950"
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Liturgical Colors</label>
                  <select
                    value={editingDay.color}
                    onChange={(e) => setEditingDay({ ...editingDay, color: e.target.value as any })}
                    className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-950 text-slate-900"
                  >
                    <option value="green">Ordinary Time (Green — பசுமை)</option>
                    <option value="purple">Lent & Advent (Purple — ஊதா)</option>
                    <option value="white">Solemnities & Memorials (White — வெள்ளை)</option>
                    <option value="red">Martyrs & Holy Spirit (Red — சிவப்பு)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Season Name (EN)</label>
                  <input
                    type="text"
                    value={editingDay.seasonEn || ''}
                    onChange={(e) => setEditingDay({ ...editingDay, seasonEn: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Season Name (TA)</label>
                  <input
                    type="text"
                    value={editingDay.seasonTa || ''}
                    onChange={(e) => setEditingDay({ ...editingDay, seasonTa: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 bg-amber-500/5 border rounded-xl border-amber-500/10 mb-2">
                <span className="font-bold text-xs text-amber-600 block">Day's Feast / Memorial Heading</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">Feast Heading (EN)</label>
                    <input
                      type="text"
                      id="edit-day-feast-en"
                      value={editingDay.feastEn || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, feastEn: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">Feast Heading (TA)</label>
                    <input
                      type="text"
                      id="edit-day-feast-ta"
                      value={editingDay.feastTa || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, feastTa: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Liturgical Readings Section */}
              <div className="space-y-4">
                {/* FIRST READING */}
                <div className="p-3 bg-white dark:bg-slate-950/10 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-350 block">First Reading Texts</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Citation Reference (EN) e.g. Gen 1:1"
                      value={editingDay.readingFirstRefEn || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, readingFirstRefEn: e.target.value })}
                      className="p-1.5 border rounded-lg w-full"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Citation Reference (TA) e.g. தொடக்க நூல் 1:1"
                      value={editingDay.readingFirstRefTa || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, readingFirstRefTa: e.target.value })}
                      className="p-1.5 border rounded-lg w-full"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <textarea
                      placeholder="First Reading Scripture text in English..."
                      value={editingDay.readingFirstEn || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, readingFirstEn: e.target.value })}
                      className="p-2 border rounded-lg w-full h-20"
                      required
                    />
                    <textarea
                      placeholder="முதல் வாசகம் தமிழ் உரை..."
                      value={editingDay.readingFirstTa || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, readingFirstTa: e.target.value })}
                      className="p-2 border rounded-lg w-full h-20"
                      required
                    />
                  </div>
                </div>

                {/* RESPONSORIAL PSALM */}
                <div className="p-3 bg-white dark:bg-slate-950/10 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-350 block">Responsorial Psalms</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Citation Reference (EN) e.g. Ps 23"
                      value={editingDay.psalmRefEn || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, psalmRefEn: e.target.value })}
                      className="p-1.5 border rounded-lg w-full"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Citation Reference (TA) e.g. திருப்பாடல் 23"
                      value={editingDay.psalmRefTa || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, psalmRefTa: e.target.value })}
                      className="p-1.5 border rounded-lg w-full"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <textarea
                      placeholder="Psalm response and verses..."
                      value={editingDay.psalmEn || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, psalmEn: e.target.value })}
                      className="p-2 border rounded-lg w-full h-20"
                      required
                    />
                    <textarea
                      placeholder="பதிலுரைத் திருப்பாடல் தமிழ் உரை..."
                      value={editingDay.psalmTa || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, psalmTa: e.target.value })}
                      className="p-2 border rounded-lg w-full h-20"
                      required
                    />
                  </div>
                </div>

                {/* GOSPEL */}
                <div className="p-3 bg-white dark:bg-slate-950/10 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-350 block">Holy Gospel Passage</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Citation Reference (EN) e.g. Mt 6"
                      value={editingDay.gospelRefEn || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, gospelRefEn: e.target.value })}
                      className="p-1.5 border rounded-lg w-full"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Citation Reference (TA) e.g. மத்தேயு 6"
                      value={editingDay.gospelRefTa || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, gospelRefTa: e.target.value })}
                      className="p-1.5 border rounded-lg w-full"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <textarea
                      placeholder="Gospel Scripture readings..."
                      value={editingDay.gospelEn || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, gospelEn: e.target.value })}
                      className="p-2 border rounded-lg w-full h-20"
                      required
                    />
                    <textarea
                      placeholder="நற்செய்தி வசனங்கள்..."
                      value={editingDay.gospelTa || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, gospelTa: e.target.value })}
                      className="p-2 border rounded-lg w-full h-20"
                      required
                    />
                  </div>
                </div>

                {/* OFFICE OF READINGS */}
                <div className="p-3 bg-white dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-300 block">Office of Readings (Daily Devotional)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Citation Reference (EN) e.g. Wisdom 2"
                      value={editingDay.officeRefEn || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, officeRefEn: e.target.value })}
                      className="p-1.5 border rounded-lg w-full bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Citation Reference (TA) e.g. ஞானம் 2"
                      value={editingDay.officeRefTa || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, officeRefTa: e.target.value })}
                      className="p-1.5 border rounded-lg w-full bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <textarea
                      placeholder="Office of Readings text in English..."
                      value={editingDay.officeEn || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, officeEn: e.target.value })}
                      className="p-2 border rounded-lg w-full h-24 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs font-sans"
                    />
                    <textarea
                      placeholder="வாசகங்களின் வழிபாட்டு உரை (தமிழ்)..."
                      value={editingDay.officeTa || ''}
                      onChange={(e) => setEditingDay({ ...editingDay, officeTa: e.target.value })}
                      className="p-2 border rounded-lg w-full h-24 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={closeForm} className="px-3 py-2 border rounded-lg">Cancel</button>
                <button type="submit" id="save-calendar-admin-btn" className="px-5 py-2 bg-amber-600 text-white rounded-lg font-bold flex items-center gap-1">
                  <Check size={14} /> Save Readings Day
                </button>
              </div>
            </form>
          )}

          {/* Form: Divine Office Patristic Reading */}
          {editingOfficeReading && (
            <form onSubmit={submitOfficeReadingForm} className="space-y-4 text-[11px] font-medium text-slate-700 dark:text-slate-350">
              <h4 className="font-bold text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wider">
                Patristic Reading Entry
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Reference (EN)</label>
                  <input
                    type="text"
                    value={editingOfficeReading.refEn || ''}
                    onChange={(e) => setEditingOfficeReading({ ...editingOfficeReading, refEn: e.target.value })}
                    placeholder="e.g. From the Confessions of St. Augustine"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Reference (TA)</label>
                  <input
                    type="text"
                    value={editingOfficeReading.refTa || ''}
                    onChange={(e) => setEditingOfficeReading({ ...editingOfficeReading, refTa: e.target.value })}
                    placeholder="e.g. புனித அகஸ்டின் எழுதிய 'அறிக்கைகள்' நூலிலிருந்து"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Text (EN)</label>
                  <textarea
                    value={editingOfficeReading.textEn || ''}
                    onChange={(e) => setEditingOfficeReading({ ...editingOfficeReading, textEn: e.target.value })}
                    placeholder="Patristic reading text in English..."
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950 h-24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Text (TA)</label>
                  <textarea
                    value={editingOfficeReading.textTa || ''}
                    onChange={(e) => setEditingOfficeReading({ ...editingOfficeReading, textTa: e.target.value })}
                    placeholder="துறவி முதல்வர்களின் வாசகம் தமிழில்..."
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950 h-24"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={closeForm} className="px-3 py-2 border rounded-lg">Cancel</button>
                <button type="submit" id="save-office-admin-btn" className="px-5 py-2 bg-amber-600 text-white rounded-lg font-bold flex items-center gap-1">
                  <Check size={14} /> Save Patristic Reading
                </button>
              </div>
            </form>
          )}

          {/* Form: Parishioners */}
          {editingParishUser && (
            <form onSubmit={submitParishUserForm} className="space-y-4 text-left">
              <h4 className="font-bold text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wider">
                Register / Edit Parish User Profile
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingParishUser.fullName || ''}
                    onChange={(e) => setEditingParishUser({ ...editingParishUser, fullName: e.target.value })}
                    placeholder="e.g. Maria Joseph"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingParishUser.email || ''}
                    onChange={(e) => setEditingParishUser({ ...editingParishUser, email: e.target.value })}
                    placeholder="e.g. maria@gmail.com"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Mobile Connection (Optional)</label>
                  <input
                    type="text"
                    value={editingParishUser.phoneNumber || ''}
                    onChange={(e) => setEditingParishUser({ ...editingParishUser, phoneNumber: e.target.value })}
                    placeholder="e.g. +91 98402 12345"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Assigned Role Category</label>
                  <select
                    value={editingParishUser.role}
                    onChange={(e) => setEditingParishUser({ ...editingParishUser, role: e.target.value as any })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-105 text-xs font-bold"
                  >
                    <option value="parishioner">Parishioner (பங்கு மக்கள்)</option>
                    <option value="catechist">Catechist (மறைக்கல்வி ஆசிரியர்)</option>
                    <option value="choir_leader">Choir / Organ Leader (பஜனை குழு இயக்குநர்)</option>
                    <option value="pastor">Pastor / Clergy (பங்குத்தந்தை)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={closeForm} className="px-3 py-2 border rounded-lg text-xs">Cancel</button>
                <button type="submit" id="save-user-profile-btn" className="px-5 py-2 bg-amber-600 text-white rounded-lg font-bold flex items-center gap-1 text-xs">
                  <Check size={13} /> Save Parishioner Info
                </button>
              </div>
            </form>
          )}

        </div>
      )}
    </div>
  );
};
