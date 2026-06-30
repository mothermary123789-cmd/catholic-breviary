import React from 'react';
import { X, FileText, Download, ExternalLink } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, title, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-950 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={18} className="text-rose-600 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-950/60 transition"
            >
              <ExternalLink size={13} />
              <span>Open</span>
            </a>
            <a
              href={url}
              download
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-950/60 transition"
            >
              <Download size={13} />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-stone-800 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-slate-100 dark:bg-stone-950">
          <iframe
            src={url}
            className="w-full h-full min-h-[70vh]"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};
