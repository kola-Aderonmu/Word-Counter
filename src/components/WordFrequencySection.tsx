import React, { useState } from 'react';
import { WordFrequency, TextStats } from '../types';
import { calculateWordFrequency } from '../utils/textAnalysis';
import { AlignJustify, Filter, Sparkles } from 'lucide-react';

interface WordFrequencySectionProps {
  text: string;
  stats: TextStats;
}

export const WordFrequencySection: React.FC<WordFrequencySectionProps> = ({ text, stats }) => {
  const [ignoreStopWords, setIgnoreStopWords] = useState(true);
  const [limit, setLimit] = useState(10);

  const wordFrequencies: WordFrequency[] = calculateWordFrequency(text, {
    ignoreStopWords,
    minLength: 2
  });

  const displayedWords = wordFrequencies.slice(0, limit);
  const maxCount = wordFrequencies.length > 0 ? wordFrequencies[0].count : 1;

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#111827] shadow-xs p-5 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <AlignJustify className="w-4 h-4 text-emerald-500" />
            Word Frequency & Vocabulary
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify repeated keywords, density, and lexical richness.
          </p>
        </div>

        {/* Options */}
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreStopWords}
              onChange={(e) => setIgnoreStopWords(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
            />
            <span>Filter Common Stop Words</span>
          </label>
        </div>
      </div>

      {/* Vocabulary Overview strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-3 rounded-lg bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Unique Words</span>
          <span className="text-base font-bold text-slate-900 dark:text-white font-mono-numbers">
            {stats.uniqueWords.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Lexical Diversity</span>
          <span className="text-base font-bold text-slate-900 dark:text-white font-mono-numbers">
            {stats.lexicalDiversity}%
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Est. Pages (250w/p)</span>
          <span className="text-base font-bold text-slate-900 dark:text-white font-mono-numbers">
            {stats.estimatedPages}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Longest Word</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate block font-mono-numbers" title={stats.longestWord}>
            {stats.longestWord || '—'}
          </span>
        </div>
      </div>

      {wordFrequencies.length === 0 ? (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          No words available for frequency analysis.
        </div>
      ) : (
        <div className="space-y-3">
          {displayedWords.map((item, idx) => {
            const barWidth = Math.min(100, Math.max(4, (item.count / maxCount) * 100));

            return (
              <div key={item.word} className="flex items-center gap-3 text-xs">
                {/* Rank & Word */}
                <div className="w-28 sm:w-32 truncate font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shrink-0">
                  <span className="w-5 text-slate-400 dark:text-slate-500 font-mono-numbers text-[11px]">
                    #{idx + 1}
                  </span>
                  <span className="truncate">{item.word}</span>
                </div>

                {/* Bar */}
                <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                {/* Count & % */}
                <div className="w-24 text-right font-mono-numbers text-slate-600 dark:text-slate-300 shrink-0">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {item.count.toLocaleString()}
                  </span>{' '}
                  <span className="text-slate-400 dark:text-slate-500">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}

          {wordFrequencies.length > limit && (
            <div className="pt-2">
              <button
                onClick={() => setLimit(limit + 10)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors py-1 cursor-pointer"
              >
                Load More Words ({wordFrequencies.length - limit} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
