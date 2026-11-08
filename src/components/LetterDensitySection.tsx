import React, { useState } from 'react';
import { LetterFrequency } from '../types';
import { calculateLetterFrequency } from '../utils/textAnalysis';
import { BarChart2, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface LetterDensitySectionProps {
  text: string;
}

export const LetterDensitySection: React.FC<LetterDensitySectionProps> = ({ text }) => {
  const [showAll, setShowAll] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const frequencies: LetterFrequency[] = calculateLetterFrequency(text, {
    includeAllCharacters: includeSymbols,
    caseSensitive
  });

  const displayedList = showAll ? frequencies : frequencies.slice(0, 5);
  const maxPercentage = frequencies.length > 0 ? frequencies[0].percentage : 1;

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#111827] shadow-xs p-5 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            Letter Density & Frequency
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time percentage and occurrence distribution of characters in your text.
          </p>
        </div>

        {/* Options */}
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
            />
            <span>Include Symbols & Numbers</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
            />
            <span>Case Sensitive</span>
          </label>
        </div>
      </div>

      {frequencies.length === 0 ? (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          No characters to analyze yet. Type or paste your content in the editor above.
        </div>
      ) : (
        <div className="space-y-3">
          {displayedList.map((item) => {
            // Relative width for bar visual contrast
            const barWidth = Math.min(100, Math.max(3, (item.percentage / Math.max(maxPercentage, 1)) * 100));

            return (
              <div key={item.char} className="flex items-center gap-3 text-xs">
                {/* Character Label */}
                <div className="w-8 shrink-0 text-center font-mono-numbers font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 py-1 rounded">
                  {item.char === ' ' ? 'SPC' : item.char}
                </div>

                {/* Progress Bar Container */}
                <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                {/* Count & Percentage */}
                <div className="w-28 text-right font-mono-numbers text-slate-600 dark:text-slate-300 shrink-0">
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

          {frequencies.length > 5 && (
            <div className="pt-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors py-1 cursor-pointer"
              >
                {showAll ? (
                  <>
                    <span>See Less (Show Top 5)</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>See More ({frequencies.length - 5} more characters)</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
