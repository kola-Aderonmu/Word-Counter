import React from 'react';
import { TextStats } from '../types';
import { BookOpen, Gauge, HelpCircle, Check, Info } from 'lucide-react';

interface ReadabilityDetailsProps {
  stats: TextStats;
}

export const ReadabilityDetails: React.FC<ReadabilityDetailsProps> = ({ stats }) => {
  const score = stats.readingEaseScore;

  // Color according to readability
  const scoreColor =
    score >= 70
      ? 'text-emerald-600 dark:text-emerald-400'
      : score >= 50
      ? 'text-sky-600 dark:text-sky-400'
      : score >= 30
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-rose-600 dark:text-rose-400';

  const badgeBg =
    score >= 70
      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
      : score >= 50
      ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60'
      : score >= 30
      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60';

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#111827] shadow-xs p-5 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-4 h-4 text-indigo-500" />
          Readability & Complexity
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Flesch-Kincaid Standard
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Score dial / summary */}
        <div className={`p-4 rounded-xl border ${badgeBg} flex flex-col justify-center items-center text-center`}>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Reading Ease Score
          </span>
          <span className={`text-4xl font-extrabold font-mono-numbers ${scoreColor}`}>
            {stats.words === 0 ? '—' : score}
            <span className="text-lg font-normal text-slate-400">/100</span>
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">
            {stats.words === 0 ? 'Awaiting text' : stats.readingGradeLevel}
          </span>
        </div>

        {/* Narrative & Benchmark */}
        <div className="md:col-span-2 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3 rounded-lg bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {score >= 60 ? (
                <span>
                  <strong>Standard Accessibility:</strong> Your content is clear and accessible for broad consumer, business, or web audiences.
                </span>
              ) : score >= 30 ? (
                <span>
                  <strong>Academic / Professional:</strong> This text exhibits higher sentence length or syllable density suitable for technical, legal, or editorial documents.
                </span>
              ) : (
                <span>
                  <strong>Dense / Specialized:</strong> Sentences are long and syllable-dense. Consider breaking complex sentences to improve scannability.
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono-numbers">
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
              <span className="text-[11px] text-slate-400 block">Avg Words / Sent</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : '0'}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
              <span className="text-[11px] text-slate-400 block">Chars / Word</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {stats.averageWordLength}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
              <span className="text-[11px] text-slate-400 block">Vocabulary Richness</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {stats.lexicalDiversity}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
