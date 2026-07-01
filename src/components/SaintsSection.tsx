import React, { useState } from 'react';
import { Search, Bookmark, Sparkles } from 'lucide-react';
import { Saint } from '../types';

interface SaintsSectionProps {
  saints: Saint[];
  language: 'ta' | 'en';
  fontSizeClass: string;
  onToggleBookmark: (id: string, titleEn: string, titleTa: string) => void;
  isBookmarked: (id: string) => boolean;
}

export const SaintsSection: React.FC<SaintsSectionProps> = ({
  saints,
  language,
  fontSizeClass,
  onToggleBookmark,
  isBookmarked,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSaints = saints.filter((saint) => {
    const term = searchQuery.toLowerCase();
    return (
      saint.nameEn.toLowerCase().includes(term) ||
      saint.nameTa.toLowerCase().includes(term) ||
      saint.lifeHistoryEn.toLowerCase().includes(term) ||
      saint.lifeHistoryTa.toLowerCase().includes(term) ||
      saint.feastDate.includes(term)
    );
  });

  const getMonthName = (monthStr: string) => {
    const monthMap: Record<string, { en: string; ta: string }> = {
      '01': { en: 'January', ta: 'ஜனவரி' },
      '02': { en: 'February', ta: 'பிப்ரவரி' },
      '03': { en: 'March', ta: 'மார்ச்' },
      '04': { en: 'April', ta: 'ஏப்ரல்' },
      '05': { en: 'May', ta: 'மே' },
      '06': { en: 'June', ta: 'ஜூன்' },
      '07': { en: 'July', ta: 'ஜூலை' },
      '08': { en: 'August', ta: 'ஆகஸ்ட்' },
      '09': { en: 'September', ta: 'செப்டம்பர்' },
      '10': { en: 'October', ta: 'அக்டோபர்' },
      '11': { en: 'November', ta: 'நவம்பர்' },
      '12': { en: 'December', ta: 'டிசம்பர்' },
    };
    return monthMap[monthStr] || { en: monthStr, ta: monthStr };
  };

  const formatFeastDate = (dateStr: string) => {
    const [m, d] = dateStr.split('-');
    const mName = getMonthName(m);
    const dayNumeric = parseInt(d, 10);
    if (language === 'ta') {
      return `${mName.ta} ${dayNumeric}`;
    }
    return `${mName.en} ${dayNumeric}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <Search size={18} id="search-saints-icon" />
        </span>
        <input
          type="text"
          id="search-saints-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            language === 'ta'
              ? 'புனிதர்களைப் தேடுக...'
              : 'Search saints by name, history or date...'
          }
          className="w-full pl-10 pr-4 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
        />
      </div>

      {filteredSaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <Sparkles size={36} className="mb-2 text-slate-300" />
          <p className="text-sm">
            {language === 'ta'
              ? 'இந்தத் தேடலுக்குப் பொருந்தும் புனிதர்கள் யாரும் இல்லை.'
              : 'No saints match your search query.'}
          </p>
          {!searchQuery && saints.length === 0 && (
            <p className="text-xs text-slate-500 mt-2 max-w-xs">
              {language === 'ta'
                ? 'வேறு தேதியைத் தேர்ந்தெடுக்க நாட்காட்டி தாவலுக்குச் செல்லவும் அல்லது நிர்வாகி புனிதர்களைச் சேர்க்கும் வரை காத்திருக்கவும்.'
                : 'Try selecting a different date in the Calendar tab, or wait for an admin to add saints.'}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto pr-1 flex-1" style={{ maxHeight: '60vh' }}>
          {filteredSaints.map((saint) => {
            const hasBookmark = isBookmarked(saint.id);
            return (
              <div
                key={saint.id}
                className="p-4 border rounded-2xl bg-white dark:bg-slate-930 border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-200 text-left relative group overflow-hidden"
              >
                {/* Visual Accent bar */}
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500" />

                <div className="flex items-start gap-4">
                  {saint.imageUrl && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 bg-slate-50">
                      <img
                        src={saint.imageUrl}
                        alt={saint.nameEn}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                          {language === 'ta' ? saint.nameTa : saint.nameEn}
                        </h4>
                        <span className="inline-block text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md mt-1">
                          {language === 'ta' ? 'திருவிழா வேளை: ' : 'Feast Day: '}
                          {formatFeastDate(saint.feastDate)}
                        </span>
                      </div>
                      <button
                        onClick={() => onToggleBookmark(saint.id, saint.nameEn, saint.nameTa)}
                        id={`bookmark-saint-${saint.id}`}
                        className={`p-2 rounded-lg transition-colors shrink-0 ${
                          hasBookmark
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                        title="Bookmark Saint Profile"
                      >
                        <Bookmark size={18} fill={hasBookmark ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <p className={`mt-3 leading-relaxed ${fontSizeClass}`}>
                      {language === 'ta' ? saint.lifeHistoryTa : saint.lifeHistoryEn}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
