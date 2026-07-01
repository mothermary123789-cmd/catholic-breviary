import React, { useRef, useState, useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  minHeight?: string;
  placeholder?: string;
  label?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  minHeight = '250px',
  placeholder = 'Type here...',
  label,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleFontSize = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    if (!size) return;
    document.execCommand('fontSize', false, '7');
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const parent = range.commonAncestorContainer.parentElement;
      if (parent && parent.tagName === 'FONT' && (parent as HTMLFontElement).size === '7') {
        parent.removeAttribute('size');
        parent.style.fontSize = size;
      }
    }
    editorRef.current?.focus();
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    e.target.value = '';
  }, [onChange]);

  const handleColor = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    exec('foreColor', e.target.value);
    e.target.value = '';
  }, [exec]);

  const handleHeading = useCallback((tag: string) => {
    document.execCommand('formatBlock', false, `<${tag}>`);
    editorRef.current?.focus();
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  return (
    <div className="rich-text-editor border rounded-xl overflow-hidden bg-white dark:bg-stone-900 border-slate-200 dark:border-stone-800">
      {label && (
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0 px-3 pt-2">
          {label}
        </label>
      )}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-slate-100 dark:border-stone-800 bg-slate-50 dark:bg-stone-950">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('bold'); }}
          className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold hover:bg-slate-200 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 transition"
          title="Bold"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('italic'); }}
          className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold hover:bg-slate-200 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 transition italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('underline'); }}
          className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold hover:bg-slate-200 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 transition underline"
          title="Underline"
        >
          U
        </button>
        <span className="w-px h-5 bg-slate-200 dark:bg-stone-700 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleHeading('h1'); }}
          className="px-2 h-7 flex items-center justify-center rounded text-xs font-bold hover:bg-slate-200 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 transition"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleHeading('h2'); }}
          className="px-2 h-7 flex items-center justify-center rounded text-xs font-bold hover:bg-slate-200 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 transition"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleHeading('h3'); }}
          className="px-2 h-7 flex items-center justify-center rounded text-xs font-bold hover:bg-slate-200 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 transition"
          title="Heading 3"
        >
          H3
        </button>
        <span className="w-px h-5 bg-slate-200 dark:bg-stone-700 mx-1" />
        <select
          onChange={handleFontSize}
          className="h-7 text-[10px] px-1.5 rounded border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-slate-700 dark:text-stone-300 font-bold cursor-pointer"
          title="Font Size"
        >
          <option value="">Size</option>
          <option value="12px">Small</option>
          <option value="16px">Normal</option>
          <option value="20px">Large</option>
          <option value="28px">X-Large</option>
        </select>
        <div className="relative w-7 h-7 flex items-center justify-center">
          <input
            type="color"
            onChange={handleColor}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Text Color"
          />
          <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-stone-600" style={{ backgroundColor: '#000' }} />
        </div>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('removeFormat'); }}
          className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold hover:bg-slate-200 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 transition"
          title="Clear Formatting"
        >
          <span className="text-[9px]">Tx</span>
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        className={`px-3 py-2 text-sm leading-relaxed outline-none overflow-y-auto font-serif text-slate-800 dark:text-stone-200 ${
          !value && !isFocused ? 'before:content-[attr(data-placeholder)] before:text-slate-400' : ''
        }`}
        data-placeholder={placeholder}
        style={{ minHeight }}
        suppressContentEditableWarning
      />
    </div>
  );
};
