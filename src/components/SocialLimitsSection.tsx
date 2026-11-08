import React from 'react';
import { SOCIAL_PRESETS } from '../utils/sampleTexts';
import { Share2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface SocialLimitsSectionProps {
  text: string;
  excludeSpaces: boolean;
  onApplyLimit: (limit: number) => void;
}

export const SocialLimitsSection: React.FC<SocialLimitsSectionProps> = ({
  text,
  excludeSpaces,
  onApplyLimit
}) => {
  const currentCount = excludeSpaces ? text.replace(/\s/g, '').length : text.length;

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#111827] shadow-xs p-5 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-sky-500" />
            Social Media Platform Constraints
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test and preview your content against character limits for major platforms.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers">
          Active text: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentCount.toLocaleString()}</span> chars
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {SOCIAL_PRESETS.map((preset) => {
          const isOver = currentCount > preset.limit;
          const diff = preset.limit - currentCount;
          const percentage = Math.min(100, Math.round((currentCount / preset.limit) * 100));

          return (
            <div
              key={preset.id}
              className={`p-4 rounded-xl border transition-colors flex flex-col justify-between ${
                isOver
                  ? 'border-red-200 dark:border-red-950/80 bg-red-50/30 dark:bg-red-950/20'
                  : currentCount > 0 && percentage >= 85
                  ? 'border-amber-200 dark:border-amber-950/80 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    {preset.name}
                  </span>
                  <span className="text-xs font-mono-numbers text-slate-500 dark:text-slate-400">
                    Max: {preset.limit.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {preset.description}
                </p>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-2.5">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOver
                        ? 'bg-red-500'
                        : percentage >= 85
                        ? 'bg-amber-500'
                        : 'bg-sky-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Status indicator */}
                <div className="flex items-center justify-between text-xs font-mono-numbers mb-3">
                  <div className="flex items-center gap-1.5">
                    {isOver ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Over by {Math.abs(diff).toLocaleString()} chars
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {diff.toLocaleString()} chars left
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onApplyLimit(preset.limit)}
                className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Set as Editor Limit</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
