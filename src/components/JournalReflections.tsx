import React, { useState } from 'react';
import { PenTool, Calendar, Trash2, Plus, PenSquare, X, Search, Check, Link } from 'lucide-react';
import { JournalEntry, Prayer } from '../types';

interface JournalReflectionsProps {
  entries: JournalEntry[];
  prayers: Prayer[];
  onAddEntry: (title: string, reflection: string, associatedPrayerId?: string) => void;
  onEditEntry: (id: string, title: string, reflection: string, associatedPrayerId?: string) => void;
  onDeleteEntry: (id: string) => void;
  language: 'ta' | 'en';
}

export const JournalReflections: React.FC<JournalReflectionsProps> = ({
  entries,
  prayers,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  language,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [reflection, setReflection] = useState('');
  const [associatedPrayerId, setAssociatedPrayerId] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const resetForm = () => {
    setTitle('');
    setReflection('');
    setAssociatedPrayerId('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reflection.trim()) return;

    if (editingId) {
      onEditEntry(editingId, title, reflection, associatedPrayerId || undefined);
    } else {
      onAddEntry(title, reflection, associatedPrayerId || undefined);
    }
    resetForm();
  };

  const startEdit = (entry: JournalEntry) => {
    setTitle(entry.title);
    setReflection(entry.reflection);
    setAssociatedPrayerId(entry.associatedPrayerId || '');
    setEditingId(entry.id);
    setIsAdding(true);
  };

  const filteredEntries = entries.filter((e) => {
    const term = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(term) ||
      e.reflection.toLowerCase().includes(term)
    );
  });

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleString(language === 'ta' ? 'ta-IN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAssociatedPrayerName = (pId?: string) => {
    if (!pId) return null;
    const p = prayers.find((x) => x.id === pId);
    if (!p) return null;
    return language === 'ta' ? p.titleTa : p.titleEn;
  };

  return (
    <div className="flex flex-col h-full gap-4 text-left">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenTool size={20} className="text-amber-600 dark:text-amber-400" />
          <span className="text-base font-bold text-slate-900 dark:text-slate-100">
            {language === 'ta' ? 'எனது செபக்குறிப்பேடு' : 'My Prayer Journal'}
          </span>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            id="add-entry-btn"
            className="flex items-center gap-1 text-xs font-semibold bg-amber-600 text-white px-3 py-1.5 rounded-xl hover:bg-amber-700 shadow-sm transition"
          >
            <Plus size={14} />
            {language === 'ta' ? 'புதிய குறிப்பு' : 'New Entry'}
          </button>
        )}
      </div>

      {isAdding ? (
        /* Journal Input Form */
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {editingId 
                ? (language === 'ta' ? 'குறிப்பைத் திருத்துக' : 'Edit Reflection')
                : (language === 'ta' ? 'உங்களது தியானத்தை இங்கு எழுதுங்கள்' : 'Write Devotional Reflection')
              }
            </span>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {language === 'ta' ? 'தலைப்பு' : 'Title'}
            </label>
            <input
              type="text"
              id="journal-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'ta' ? 'எ.கா: இன்றைய காலை தியானம்' : 'e.g. My Morning Reflection'}
              className="w-full text-sm border px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {language === 'ta' ? 'சுருக்கம் / தியான கருத்துக்கள்' : 'Your Reflection'}
            </label>
            <textarea
              id="journal-reflection-textarea"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder={language === 'ta' ? 'இறைவன் உங்களுடன் எதைப் பேசினார்...' : 'What did God speak to your heart today? Describe your thoughts here...'}
              className="w-full text-sm border px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 h-28 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Link size={10} />
              {language === 'ta' ? 'செப இணைப்பு (இதர)' : 'Link to a Daily Prayer (Optional)'}
            </label>
            <select
              id="journal-prayer-link"
              value={associatedPrayerId}
              onChange={(e) => setAssociatedPrayerId(e.target.value)}
              className="w-full text-sm border px-2 py-2 rounded-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">{language === 'ta' ? '-- எதையும் இணைக்காதே --' : '-- No Link / General --'}</option>
              {prayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {language === 'ta' ? p.titleTa : p.titleEn}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="text-xs px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-300"
            >
              {language === 'ta' ? 'வெளியேறு' : 'Cancel'}
            </button>
            <button
              type="submit"
              id="save-journal-submit"
              className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
            >
              <Check size={14} />
              {language === 'ta' ? 'சேமி' : 'Save Reflection'}
            </button>
          </div>
        </form>
      ) : (
        /* Reflections List */
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search bar */}
          <div className="relative mb-3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'வார்த்தை மூலம் தேடுக...' : 'Search your journals...'}
              className="w-full pl-9 pr-4 py-1.5 text-xs border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {filteredEntries.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <PenSquare size={28} className="text-slate-300 mb-2" />
              <p className="text-xs">
                {language === 'ta'
                  ? 'செபக்குறிப்புகள் எதுவும் இல்லை.'
                  : 'No reflection diaries found. Start recording your daily insights!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: '52vh' }}>
              {filteredEntries.map((entry) => {
                const linkedName = getAssociatedPrayerName(entry.associatedPrayerId);
                return (
                  <div
                    key={entry.id}
                    className="p-4 border rounded-2xl bg-white dark:bg-slate-930 border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {entry.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                          <Calendar size={10} />
                          <span>{formatDate(entry.date)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(entry)}
                          id={`edit-journal-btn-${entry.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition"
                          title="Edit"
                        >
                          <PenSquare size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          id={`delete-journal-btn-${entry.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {entry.reflection}
                    </p>

                    {linkedName && (
                      <div className="mt-3 pt-2 border-t border-dashed border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 dark:text-amber-500">
                        <Link size={10} />
                        <span>{language === 'ta' ? 'இணைக்கப்பட்ட செபம்: ' : 'Linked Devotion: '} {linkedName}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
