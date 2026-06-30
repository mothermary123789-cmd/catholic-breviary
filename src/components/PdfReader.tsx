import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Search, Download, ExternalLink, FileText, Settings, Sun, Moon, Palette } from 'lucide-react';
import { PdfDocument } from '../types';

interface PdfReaderProps {
  url: string;
  title: string;
  onClose: () => void;
  pdfData?: PdfDocument;
}

interface ReadingSettings {
  brightness: number;
  contrast: number;
  sepia: number;
  invert: number;
  background: 'default' | 'cream' | 'dark' | 'blue' | 'green';
}

export const PdfReader: React.FC<PdfReaderProps> = ({ url, title, onClose, pdfData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageWrapRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIdx, setCurrentSearchIdx] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [pageAnim, setPageAnim] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [pageDir, setPageDir] = useState<1 | -1>(1);
  const [showTools, setShowTools] = useState(false);
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>({
    brightness: 100,
    contrast: 100,
    sepia: 0,
    invert: 0,
    background: 'default',
  });
  const prevPageRef = useRef<number>(1);
  const [offlinePages, setOfflinePages] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPdf = useCallback(async () => {
    try {
      setLoading(true);
      const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument(url).promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setLoading(false);
      renderPage(pdf, 1, 1.5);
    } catch (err) {
      console.error('Failed to load PDF:', err);
      setLoading(false);
    }
  }, [url]);

  const renderPage = useCallback(async (pdf: any, pageNum: number, pageScale: number) => {
    if (!pdf || !canvasRef.current) return;
    setRendering(true);
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: pageScale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (err) {
      console.error('Failed to render page:', err);
    }
    setRendering(false);
  }, []);

  useEffect(() => {
    if (isOffline && pdfData?.extractedText) {
      const raw = pdfData.extractedText;
      const regex = /--- Page \d+ ---/;
      const parts = raw.split(regex).filter(p => p.trim().length > 0);
      if (parts.length > 0) {
        setOfflinePages(parts);
        setTotalPages(parts.length);
      } else {
        setOfflinePages([raw]);
        setTotalPages(1);
      }
      setCurrentPage(1);
      setLoading(false);
    } else if (!isOffline) {
      loadPdf();
    } else {
      setLoading(false);
    }
  }, [url, pdfData, isOffline, loadPdf]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pdfDoc, currentPage, scale);
    }
  }, [pdfDoc, currentPage, scale, renderPage]);

  const goToPage = (n: number) => {
    const p = Math.max(1, Math.min(n, totalPages));
    if (p === currentPage) return;
    const dir = p > currentPage ? 1 : -1;
    prevPageRef.current = currentPage;
    setPageDir(dir);
    setPageAnim('exit');
    setTimeout(() => {
      setCurrentPage(p);
      setPageAnim('enter');
      setTimeout(() => setPageAnim('idle'), 350);
    }, 300);
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.25, 4));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));

  const searchInPdf = useCallback(async () => {
    if (!searchQuery.trim() || !pdfDoc) return;
    const results: number[] = [];
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');
      if (text.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push(i);
      }
    }
    setSearchResults(results);
    setCurrentSearchIdx(0);
    if (results.length > 0) {
      setCurrentPage(results[0]);
    }
  }, [searchQuery, pdfDoc]);

  const searchInText = useCallback(() => {
    if (!searchQuery.trim() || offlinePages.length === 0) return;
    const results: number[] = [];
    offlinePages.forEach((text, idx) => {
      if (text.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push(idx + 1);
      }
    });
    setSearchResults(results);
    setCurrentSearchIdx(0);
    if (results.length > 0) {
      setCurrentPage(results[0]);
    }
  }, [searchQuery, offlinePages]);

  const nextSearchResult = () => {
    if (searchResults.length === 0) return;
    const next = (currentSearchIdx + 1) % searchResults.length;
    setCurrentSearchIdx(next);
    setCurrentPage(searchResults[next]);
  };

  const prevSearchResult = () => {
    if (searchResults.length === 0) return;
    const prev = (currentSearchIdx - 1 + searchResults.length) % searchResults.length;
    setCurrentSearchIdx(prev);
    setCurrentPage(searchResults[prev]);
  };

  const updateSetting = (key: keyof ReadingSettings, value: number | string) => {
    setReadingSettings(prev => ({ ...prev, [key]: value }));
  };

  const filterStyle: React.CSSProperties = {
    filter: `brightness(${readingSettings.brightness}%) contrast(${readingSettings.contrast}%) sepia(${readingSettings.sepia}%) invert(${readingSettings.invert}%)`,
    transition: 'filter 0.2s ease',
  };

  const bgClass = readingSettings.background === 'cream' ? 'bg-amber-50' :
    readingSettings.background === 'dark' ? 'bg-slate-900' :
    readingSettings.background === 'blue' ? 'bg-blue-50' :
    readingSettings.background === 'green' ? 'bg-emerald-50' :
    'bg-stone-100 dark:bg-stone-950';

  const pageExitClass = pageAnim === 'exit'
    ? (pageDir === 1
      ? 'opacity-0 -translate-x-12 scale-[0.97] rotate-[-1deg]'
      : 'opacity-0 translate-x-12 scale-[0.97] rotate-[1deg]')
    : '';

  const pageEnterClass = pageAnim === 'enter'
    ? (pageDir === 1
      ? 'animate-page-in-right'
      : 'animate-page-in-left')
    : '';

  const animClass = pageAnim === 'exit' ? pageExitClass : pageEnterClass;

  const showOfflineText = isOffline && offlinePages.length > 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-2 md:p-4">
      <style>{`
        @keyframes pageInRight {
          from { opacity: 0; transform: translateX(60px) scale(0.96) rotate(1deg); }
          to { opacity: 1; transform: translateX(0) scale(1) rotate(0deg); }
        }
        @keyframes pageInLeft {
          from { opacity: 0; transform: translateX(-60px) scale(0.96) rotate(-1deg); }
          to { opacity: 1; transform: translateX(0) scale(1) rotate(0deg); }
        }
        .animate-page-in-right {
          animation: pageInRight 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-page-in-left {
          animation: pageInLeft 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-950 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="text-rose-600 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] md:max-w-[400px]">
              {title}
            </h3>
            <span className="text-[10px] text-slate-400 font-medium shrink-0">
              {showOfflineText ? 'Offline' : `Page ${currentPage} / ${totalPages}`}
            </span>
            {showOfflineText && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 shrink-0">
                Offline
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-1.5 rounded-lg transition ${showSearch ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-stone-800'}`}
              title="Search"
            >
              <Search size={15} />
            </button>
            {!showOfflineText && (
              <>
                <button onClick={zoomOut} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-stone-800 transition" title="Zoom Out">
                  <ZoomOut size={15} />
                </button>
                <span className="text-[10px] font-bold text-slate-500 w-8 text-center">{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-stone-800 transition" title="Zoom In">
                  <ZoomIn size={15} />
                </button>
              </>
            )}

            <div className="w-px h-5 bg-slate-200 dark:bg-stone-700 mx-1" />

            {/* Reading Tools Toggle */}
            <button
              onClick={() => setShowTools(!showTools)}
              className={`p-1.5 rounded-lg transition ${showTools ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-stone-800'}`}
              title="Reading Tools"
            >
              <Palette size={15} />
            </button>

            {!showOfflineText && (
              <>
                <a href={url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-stone-800 transition" title="Open in new tab">
                  <ExternalLink size={15} />
                </a>
                <a href={url} download className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-stone-800 transition" title="Download">
                  <Download size={15} />
                </a>
              </>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition" title="Close">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Reading Tools Panel */}
        {showTools && (
          <div className="px-4 py-3 border-b border-slate-200 dark:border-stone-800 bg-white dark:bg-stone-950 shrink-0 animate-in slide-in-from-top duration-200">
            <div className="flex flex-wrap items-center gap-4">
              {/* Brightness */}
              <div className="flex items-center gap-2">
                <Sun size={13} className="text-slate-400" />
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={readingSettings.brightness}
                  onChange={(e) => updateSetting('brightness', parseInt(e.target.value))}
                  className="w-20 h-1.5 accent-amber-600"
                />
                <span className="text-[10px] text-slate-500 w-8">{readingSettings.brightness}%</span>
              </div>

              {/* Contrast */}
              <div className="flex items-center gap-2">
                <Sun size={13} className="text-slate-400" />
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={readingSettings.contrast}
                  onChange={(e) => updateSetting('contrast', parseInt(e.target.value))}
                  className="w-20 h-1.5 accent-amber-600"
                />
                <span className="text-[10px] text-slate-500 w-8">{readingSettings.contrast}%</span>
              </div>

              {/* Sepia */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSetting('sepia', readingSettings.sepia === 100 ? 0 : 100)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition ${
                    readingSettings.sepia === 100
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-stone-800 text-slate-600 dark:text-stone-400 border border-slate-200 dark:border-stone-700'
                  }`}
                >
                  Sepia
                </button>
              </div>

              {/* Invert */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSetting('invert', readingSettings.invert === 100 ? 0 : 100)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition ${
                    readingSettings.invert === 100
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-stone-800 text-slate-600 dark:text-stone-400 border border-slate-200 dark:border-stone-700'
                  }`}
                >
                  Invert
                </button>
              </div>

              {/* Background */}
              <div className="flex items-center gap-1.5">
                <Moon size={13} className="text-slate-400" />
                {[
                  { id: 'default', label: 'Default', cls: 'bg-stone-100 dark:bg-stone-950 border-stone-300' },
                  { id: 'cream', label: 'Cream', cls: 'bg-amber-50 border-amber-300' },
                  { id: 'dark', label: 'Dark', cls: 'bg-slate-900 border-slate-600' },
                  { id: 'blue', label: 'Blue', cls: 'bg-blue-50 border-blue-300' },
                  { id: 'green', label: 'Green', cls: 'bg-emerald-50 border-emerald-300' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => updateSetting('background', bg.id)}
                    className={`w-5 h-5 rounded-full border-2 transition ${bg.cls} ${
                      readingSettings.background === bg.id ? 'scale-125 ring-2 ring-amber-500 ring-offset-1 dark:ring-offset-stone-900' : ''
                    }`}
                    title={bg.label}
                  />
                ))}
              </div>

              {/* Reset */}
              <button
                onClick={() => setReadingSettings({ brightness: 100, contrast: 100, sepia: 0, invert: 0, background: 'default' })}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {showSearch && (
          <div className="px-4 py-2 border-b border-slate-200 dark:border-stone-800 bg-white dark:bg-stone-950 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (showOfflineText) searchInText();
                      else searchInPdf();
                    }
                  }}
                  placeholder="Search text in this PDF..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button onClick={showOfflineText ? searchInText : searchInPdf} className="px-3 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition">
                Search
              </button>
              {searchResults.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <button onClick={prevSearchResult} className="p-1 hover:bg-slate-100 dark:hover:bg-stone-800 rounded">
                    <ChevronLeft size={14} />
                  </button>
                  <span className="font-medium whitespace-nowrap">
                    {currentSearchIdx + 1} / {searchResults.length}
                  </span>
                  <button onClick={nextSearchResult} className="p-1 hover:bg-slate-100 dark:hover:bg-stone-800 rounded">
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
            {searchResults.length === 0 && searchQuery && (
              <p className="text-[10px] text-slate-400 mt-1">No results found</p>
            )}
          </div>
        )}

        {/* PDF Canvas / Text Area */}
        <div className={`flex-1 overflow-auto ${bgClass} flex flex-col items-center p-4 relative`}>
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">
                  {isOffline ? 'No offline content available.' : 'Loading PDF...'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Page Navigation Top */}
              <div className="flex items-center gap-3 mb-3 bg-white dark:bg-stone-900 px-4 py-1.5 rounded-xl shadow-xs border border-slate-200 dark:border-stone-800">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1 || pageAnim !== 'idle'}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                    className="w-12 text-center text-xs font-bold py-1 rounded-lg border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min={1}
                    max={totalPages}
                  />
                  <span className="text-xs text-slate-400">/ {totalPages}</span>
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages || pageAnim !== 'idle'}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {showOfflineText ? (
                <div
                  className={`w-full transition-all duration-300 ease-out ${animClass}`}
                  style={{ perspective: '1200px' }}
                >
                  <div
                    className={`p-6 rounded-lg ${bgClass} text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap font-serif text-sm`}
                    style={filterStyle}
                  >
                    {offlinePages[currentPage - 1] || 'No content available.'}
                  </div>
                </div>
              ) : (
                <>
                  {/* Canvas with page turn animation + reading filters */}
                  <div
                    ref={pageWrapRef}
                    className={`transition-all duration-300 ease-out ${animClass}`}
                    style={{ perspective: '1200px' }}
                  >
                    <div style={filterStyle}>
                      <canvas
                        ref={canvasRef}
                        className={`shadow-xl rounded-lg ${readingSettings.background === 'dark' ? 'ring-1 ring-white/10' : ''}`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  </div>

                  {rendering && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </>
              )}

              {/* Page Navigation Bottom */}
              <div className="flex items-center gap-3 mt-3 bg-white dark:bg-stone-900 px-4 py-1.5 rounded-xl shadow-xs border border-slate-200 dark:border-stone-800">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1 || pageAnim !== 'idle'}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages || pageAnim !== 'idle'}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};