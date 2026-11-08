import React from 'react';
import { Moon, Sun, FileText, Sparkles, Download, Check, Smile } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onExportReport: () => void;
  isCopiedReport: boolean;
  onReplaySplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  activeTab,
  onSelectTab,
  onExportReport,
  isCopiedReport,
  onReplaySplash
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0c1220]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            WordCounter<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links / Section Switcher */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('editor')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Editor & Stats
          </button>
          <button
            onClick={() => onSelectTab('density')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'density'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Letter Density
          </button>
          <button
            onClick={() => onSelectTab('vocabulary')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'vocabulary'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Word Frequency
          </button>
          <button
            onClick={() => onSelectTab('social')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'social'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Social Limits
          </button>
        </nav>

        {/* Zone 3: Actions (Replay Intro, Theme Toggle & Report Export) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onReplaySplash && (
            <button
              onClick={onReplaySplash}
              title="Replay funny intro splash screen"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Smile className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Splash</span>
            </button>
          )}

          <button
            onClick={onExportReport}
            title="Copy Full Analysis Summary"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            {isCopiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Report Copied</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
