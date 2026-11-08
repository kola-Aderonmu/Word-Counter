import React, { useRef, useState } from 'react';
import { 
  Copy, 
  Check, 
  Trash2, 
  ClipboardPaste, 
  Download, 
  Upload, 
  Type, 
  Sparkles,
  AlertCircle,
  FileCode,
  RotateCcw
} from 'lucide-react';
import { SAMPLE_TEXTS, SampleItem } from '../utils/sampleTexts';
import { transformTextCase } from '../utils/textAnalysis';

interface TextEditorProps {
  text: string;
  onChangeText: (newText: string) => void;
  excludeSpaces: boolean;
  onToggleExcludeSpaces: (val: boolean) => void;
  charLimitEnabled: boolean;
  onToggleCharLimit: (val: boolean) => void;
  charLimit: number;
  onChangeCharLimit: (val: number) => void;
  onShowToast: (msg: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onChangeText,
  excludeSpaces,
  onToggleExcludeSpaces,
  charLimitEnabled,
  onToggleCharLimit,
  charLimit,
  onChangeCharLimit,
  onShowToast
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [lastClearedText, setLastClearedText] = useState<string | null>(null);
  const [caseMenuOpen, setCaseMenuOpen] = useState(false);

  const activeCharCount = excludeSpaces ? text.replace(/\s/g, '').length : text.length;
  const isOverLimit = charLimitEnabled && activeCharCount > charLimit;
  const remainingChars = charLimit - activeCharCount;
  const progressPercent = charLimit > 0 ? Math.min(100, (activeCharCount / charLimit) * 100) : 0;

  const handleCopy = async () => {
    if (!text) {
      onShowToast('Nothing to copy yet');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onShowToast('Text copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Unable to access clipboard');
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        onChangeText(text ? `${text}\n${clipboardText}` : clipboardText);
        onShowToast('Text pasted from clipboard');
      }
    } catch {
      onShowToast('Please allow clipboard permission to paste');
    }
  };

  const handleClear = () => {
    if (!text) return;
    setLastClearedText(text);
    onChangeText('');
    onShowToast('Text cleared');
  };

  const handleUndoClear = () => {
    if (lastClearedText !== null) {
      onChangeText(lastClearedText);
      setLastClearedText(null);
      onShowToast('Restored previous text');
    }
  };

  const handleApplyCase = (type: string) => {
    if (!text) return;
    const transformed = transformTextCase(text, type);
    onChangeText(transformed);
    setCaseMenuOpen(false);
    onShowToast(`Converted to ${type}`);
  };

  const handleLoadSample = (sample: SampleItem) => {
    onChangeText(sample.text);
    onShowToast(`Loaded "${sample.title}" sample`);
  };

  const handleDownload = () => {
    if (!text) {
      onShowToast('Write or paste some text first');
      return;
    }
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wordcounter-export-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('File downloaded');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content !== undefined) {
        onChangeText(content);
        onShowToast(`Imported ${file.name}`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#111827] shadow-xs overflow-hidden transition-colors">
      {/* Editor Top Toolbar */}
      <div className="px-4 py-3 border-b border-slate-200/90 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
        {/* Left Toolbar: Samples & Case Transforms */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Sample Loader */}
          <div className="relative group">
            <select
              value=""
              onChange={(e) => {
                const selected = SAMPLE_TEXTS.find((s) => s.id === e.target.value);
                if (selected) handleLoadSample(selected);
              }}
              className="text-xs font-medium py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Load Sample Text...
              </option>
              {SAMPLE_TEXTS.map((sample) => (
                <option key={sample.id} value={sample.id}>
                  {sample.category}: {sample.title}
                </option>
              ))}
            </select>
          </div>

          {/* Case Conversions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCaseMenuOpen(!caseMenuOpen)}
              className="inline-flex items-center gap-1.5 text-xs font-medium py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              <Type className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Change Case</span>
            </button>

            {caseMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setCaseMenuOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-44 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161f30] z-30 py-1 text-xs">
                  <button
                    onClick={() => handleApplyCase('sentencecase')}
                    className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Sentence case
                  </button>
                  <button
                    onClick={() => handleApplyCase('titlecase')}
                    className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Title Case
                  </button>
                  <button
                    onClick={() => handleApplyCase('uppercase')}
                    className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    UPPERCASE
                  </button>
                  <button
                    onClick={() => handleApplyCase('lowercase')}
                    className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    lowercase
                  </button>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                  <button
                    onClick={() => handleApplyCase('camelcase')}
                    className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    camelCase
                  </button>
                  <button
                    onClick={() => handleApplyCase('snakecase')}
                    className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    snake_case
                  </button>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                  <button
                    onClick={() => handleApplyCase('cleanspaces')}
                    className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Clean Extra Spaces
                  </button>
                  <button
                    onClick={() => handleApplyCase('removelines')}
                    className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Remove Line Breaks
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Toolbar: Actions (Paste, Copy, Upload, Download, Clear) */}
        <div className="flex items-center gap-1.5">
          {lastClearedText && !text && (
            <button
              onClick={handleUndoClear}
              title="Undo clear"
              className="inline-flex items-center gap-1 text-xs py-1.5 px-2.5 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo Clear</span>
            </button>
          )}

          <button
            onClick={handlePaste}
            title="Paste text from clipboard"
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ClipboardPaste className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            title="Copy text"
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload text file"
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md,.text"
            className="hidden"
          />

          <button
            onClick={handleDownload}
            title="Download text file"
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />

          <button
            onClick={handleClear}
            disabled={!text}
            title="Clear all text"
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Text Area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Start typing, paste an article, or load a sample above..."
          className="w-full h-72 sm:h-80 p-4 sm:p-5 text-base sm:text-lg bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none resize-y leading-relaxed"
          spellCheck={true}
        />
      </div>

      {/* Character Limit Visual Bar (if limit is enabled) */}
      {charLimitEnabled && (
        <div className="px-4 sm:px-5 py-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/30">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono-numbers">
            <span className="text-slate-500 dark:text-slate-400">
              Limit Progress: {activeCharCount.toLocaleString()} / {charLimit.toLocaleString()}
            </span>
            <span
              className={`font-semibold ${
                isOverLimit
                  ? 'text-red-600 dark:text-red-400 flex items-center gap-1'
                  : remainingChars <= 20
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {isOverLimit ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Exceeded by {Math.abs(remainingChars).toLocaleString()} chars</span>
                </>
              ) : (
                <span>{remainingChars.toLocaleString()} chars remaining</span>
              )}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                isOverLimit
                  ? 'bg-red-500'
                  : progressPercent >= 80
                  ? 'bg-amber-500'
                  : 'bg-indigo-600 dark:bg-indigo-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Settings & Options Bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-200/90 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Checkbox Options */}
        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={excludeSpaces}
              onChange={(e) => onToggleExcludeSpaces(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
            />
            <span>Exclude Spaces</span>
          </label>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={charLimitEnabled}
                onChange={(e) => onToggleCharLimit(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
              />
              <span>Set Character Limit</span>
            </label>

            {charLimitEnabled && (
              <input
                type="number"
                min="10"
                max="500000"
                step="50"
                value={charLimit}
                onChange={(e) => onChangeCharLimit(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-20 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono-numbers outline-none focus:ring-1 focus:ring-indigo-500"
              />
            )}
          </div>
        </div>

        {/* Live Quick Counter Summary */}
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-mono-numbers">
          <span>{activeCharCount.toLocaleString()} {excludeSpaces ? 'chars (no sp)' : 'chars'}</span>
          <span aria-hidden="true">·</span>
          <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
        </div>
      </div>
    </div>
  );
};
