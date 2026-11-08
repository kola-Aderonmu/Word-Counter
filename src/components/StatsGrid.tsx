import React from 'react';
import { TextStats } from '../types';
import { formatTimeEstimate } from '../utils/textAnalysis';
import { BookOpen, Mic, FileText, AlignLeft, Hash, Volume2 } from 'lucide-react';

interface StatsGridProps {
  stats: TextStats;
  excludeSpaces: boolean;
  onOpenVoiceReader: () => void;
  isVoiceActive?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  excludeSpaces,
  onOpenVoiceReader,
  isVoiceActive
}) => {
  const displayedCharacters = excludeSpaces ? stats.charactersNoSpaces : stats.charactersTotal;
  const wordsPerSentence = stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Words Card */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#111827] shadow-xs transition-colors relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Words
          </span>
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-mono-numbers">
            {stats.words.toLocaleString()}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>Avg length:</span>
          <span className="font-medium text-slate-700 dark:text-slate-300 font-mono-numbers">
            {stats.averageWordLength} chars
          </span>
        </div>
      </div>

      {/* Total Characters Card */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#111827] shadow-xs transition-colors relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {excludeSpaces ? 'Chars (No Space)' : 'Total Characters'}
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Hash className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-mono-numbers">
            {displayedCharacters.toLocaleString()}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>{excludeSpaces ? 'With spaces:' : 'No spaces:'}</span>
          <span className="font-medium text-slate-700 dark:text-slate-300 font-mono-numbers">
            {excludeSpaces ? stats.charactersTotal.toLocaleString() : stats.charactersNoSpaces.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Sentences & Paragraphs Card */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#111827] shadow-xs transition-colors relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Sentences
          </span>
          <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <AlignLeft className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-mono-numbers">
            {stats.sentences.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            / {stats.paragraphs} {stats.paragraphs === 1 ? 'para' : 'paras'}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>Words/sentence:</span>
          <span className="font-medium text-slate-700 dark:text-slate-300 font-mono-numbers">
            {wordsPerSentence}
          </span>
        </div>
      </div>

      {/* Reading & Speaking Time Card with Voice Action */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#111827] shadow-xs transition-colors relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Reading Time
          </span>
          <button
            onClick={onOpenVoiceReader}
            title="Read aloud with male or female voice"
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              isVoiceActive
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isVoiceActive ? 'animate-bounce' : ''}`} />
            <span>Voice</span>
          </button>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-mono-numbers">
            {formatTimeEstimate(stats.readingTimeMinutes)}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Mic className="w-3 h-3 text-slate-400" />
            <span>Speaking:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 font-mono-numbers">
              {formatTimeEstimate(stats.speakingTimeMinutes)}
            </span>
          </div>
          <button
            onClick={onOpenVoiceReader}
            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Choose Voice →
          </button>
        </div>
      </div>
    </div>
  );
};
