import React, { useState, useEffect } from 'react';
import { Sparkles, Play, FastForward, CheckCircle2, Feather, BookOpen, Smile } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const FUNNY_QUIPS = [
  "Sharpening 2,400 HB pencils...",
  "Debating whether 'yeet' is an irregular verb...",
  "Counting: 1 word... 2 words... wait, did you mean 'their' or 'there'?",
  "Calculating the exact weight of a dangling modifier...",
  "Consulting William Shakespeare about Oxford commas...",
  "Checking if 'supercalifragilisticexpialidocious' fits in a tweet...",
  "Hamsters are currently spinning the word-counting turbines at 500 RPM...",
  "Wiping virtual spilled coffee off the margins..."
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [quipIndex, setQuipIndex] = useState(0);
  const [poked, setPoked] = useState(false);
  const [pokeCount, setPokeCount] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // Cycle through funny quips
  useEffect(() => {
    const quipInterval = setInterval(() => {
      setQuipIndex((prev) => (prev + 1) % FUNNY_QUIPS.length);
    }, 900);
    return () => clearInterval(quipInterval);
  }, []);

  // Smooth loading progress bar (completes in ~3 seconds)
  useEffect(() => {
    const start = Date.now();
    const duration = 2800; // 2.8s

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          handleDismiss();
        }, 500);
      }
    }, 40);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  const handlePoke = () => {
    setPoked(true);
    setPokeCount((c) => c + 1);
    setTimeout(() => setPoked(false), 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090d16]/95 backdrop-blur-xl transition-all duration-400 ${
        isClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient glow circles */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl -top-12 -left-12 pointer-events-none animate-pulse" />
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-3xl -bottom-12 -right-12 pointer-events-none animate-pulse" />

      <div className="relative max-w-md w-full bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center text-slate-100 overflow-hidden">
        {/* Top skip button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleDismiss}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <span>Skip</span>
            <FastForward className="w-3 h-3" />
          </button>
        </div>

        {/* Mascot Character Container */}
        <div className="my-3 flex flex-col items-center justify-center">
          <div
            onClick={handlePoke}
            title="Click to poke Count Vocabula!"
            className={`relative w-36 h-36 flex items-center justify-center cursor-pointer transition-transform duration-200 select-none ${
              poked ? 'scale-110 rotate-6' : 'hover:scale-105'
            }`}
          >
            {/* Mascot: Animated Pencil / Abacus Wizard "Count Vocabula" */}
            <div className="relative flex flex-col items-center">
              {/* Pointy Pencil Tip / Wizard Hat */}
              <div className="w-0 h-0 border-x-[24px] border-x-transparent border-b-[38px] border-b-amber-500 drop-shadow-md relative animate-bounce">
                {/* Graphite Tip */}
                <div className="absolute -bottom-[38px] left-[-7px] w-0 h-0 border-x-[7px] border-x-transparent border-b-[14px] border-b-slate-900" />
                {/* Wizard star on hat */}
                <div className="absolute top-4 left-[-4px] text-[10px] text-amber-200">
                  ✦
                </div>
              </div>

              {/* Hexagonal Pencil Body / Little Robe */}
              <div className="w-20 h-20 bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-800 rounded-2xl border-2 border-indigo-400/40 shadow-inner flex flex-col items-center justify-center relative -mt-1">
                {/* Big Googly Eyes */}
                <div className="flex items-center gap-3">
                  <div className="w-5 h-6 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-300 relative overflow-hidden">
                    <div
                      className={`w-2.5 h-2.5 bg-slate-950 rounded-full transition-transform duration-150 ${
                        poked ? 'scale-125' : 'translate-x-0.5 translate-y-0.5'
                      }`}
                    />
                    {/* Eyelid blink */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-amber-400/60" />
                  </div>
                  <div className="w-5 h-6 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-300 relative overflow-hidden">
                    <div
                      className={`w-2.5 h-2.5 bg-slate-950 rounded-full transition-transform duration-150 ${
                        poked ? 'scale-125' : '-translate-x-0.5 translate-y-0.5'
                      }`}
                    />
                    <div className="absolute top-0 inset-x-0 h-1 bg-amber-400/60" />
                  </div>
                </div>

                {/* Mouth expression */}
                <div className="mt-2">
                  {poked ? (
                    <div className="w-4 h-3 bg-red-400 rounded-full border border-red-600 animate-ping" />
                  ) : (
                    <div className="w-5 h-2.5 border-b-2 border-amber-300 rounded-full" />
                  )}
                </div>

                {/* Tiny Robe Ribbon */}
                <div className="absolute -bottom-2 px-2 py-0.5 bg-amber-400 text-slate-950 text-[9px] font-bold rounded-sm shadow-xs uppercase tracking-wider font-mono">
                  1, 2, 3...
                </div>
              </div>

              {/* Floating animated speech bubbles / flying letters */}
              <div className="absolute -top-3 -right-6 animate-pulse text-indigo-400 text-xs font-mono font-bold bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800 shadow-xs">
                {poked ? "HEY! 😜" : pokeCount > 0 ? `Pokes: ${pokeCount}` : "Aa... Zz!"}
              </div>

              <div className="absolute -bottom-1 -left-6 animate-bounce text-emerald-400 text-[11px] font-mono font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded-full border border-emerald-800">
                WPM: ∞
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic mt-1">
            (Pencil wizard "Count Vocabula" is frantically counting every letter...)
          </p>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
          WordCounter<span className="text-indigo-400">Pro</span>
        </h2>

        {/* Funny Quip Ticker */}
        <div className="h-12 flex items-center justify-center my-3 px-2">
          <p className="text-xs sm:text-sm text-amber-300 font-medium transition-all duration-200">
            "{FUNNY_QUIPS[quipIndex]}"
          </p>
        </div>

        {/* Progress bar container */}
        <div className="w-full space-y-2 mt-4">
          <div className="flex items-center justify-between text-xs font-mono-numbers text-slate-400">
            <span>
              {progress < 40
                ? "Feeding the spellchecker..."
                : progress < 80
                ? "Calibrating vowel density..."
                : "Polishing sentences..."}
            </span>
            <span className="font-semibold text-indigo-400">{progress}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700/60 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-100 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom CTA / Action */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={handleDismiss}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Let's Count Some Words!</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
