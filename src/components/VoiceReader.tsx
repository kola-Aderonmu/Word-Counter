import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  User, 
  Sparkles, 
  Gauge, 
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { formatTimeEstimate } from '../utils/textAnalysis';

interface VoiceReaderProps {
  text: string;
  totalWords: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  onShowToast: (msg: string) => void;
}

export type VoiceGender = 'female' | 'male';

export const VoiceReader: React.FC<VoiceReaderProps> = ({
  text,
  totalWords,
  isOpen,
  onToggleOpen,
  onShowToast
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedGender, setSelectedGender] = useState<VoiceGender>('female');
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [spokenWordCount, setSpokenWordCount] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>('');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available system voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Classify voices by gender heuristics
  const { maleVoices, femaleVoices } = React.useMemo(() => {
    const femaleKeywords = ['female', 'samantha', 'victoria', 'karen', 'zira', 'susan', 'fiona', 'moira', 'tessa', 'veena', 'alice', 'anna', 'helena', 'elena', 'laura', 'eva', 'serena', 'ava', 'allison', 'jennifer'];
    const maleKeywords = ['male', 'david', 'daniel', 'aaron', 'arthur', 'george', 'mark', 'james', 'alex', 'fred', 'rishi', 'oliver', 'thomas', 'richard', 'guy', 'tom', 'lee', 'cosmo'];

    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const pool = englishVoices.length > 0 ? englishVoices : voices;

    const female: SpeechSynthesisVoice[] = [];
    const male: SpeechSynthesisVoice[] = [];

    pool.forEach(voice => {
      const nameLower = voice.name.toLowerCase();
      if (femaleKeywords.some(k => nameLower.includes(k))) {
        female.push(voice);
      } else if (maleKeywords.some(k => nameLower.includes(k))) {
        male.push(voice);
      } else {
        // Fallback default distribution
        if (female.length <= male.length) female.push(voice);
        else male.push(voice);
      }
    });

    return {
      maleVoices: male.length > 0 ? male : pool,
      femaleVoices: female.length > 0 ? female : pool
    };
  }, [voices]);

  // Pick suitable voice based on gender
  const currentVoice = React.useMemo(() => {
    if (selectedVoiceURI) {
      const found = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (found) return found;
    }

    if (selectedGender === 'female' && femaleVoices.length > 0) {
      return femaleVoices[0];
    }
    if (selectedGender === 'male' && maleVoices.length > 0) {
      return maleVoices[0];
    }
    return voices[0] || null;
  }, [selectedGender, selectedVoiceURI, femaleVoices, maleVoices, voices]);

  // Cancel speech on unmount or when text changes drastically
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleStartSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onShowToast('Voice synthesis is not supported on this device');
      return;
    }

    if (!text.trim()) {
      onShowToast('Write or paste some text first to read aloud');
      return;
    }

    // If currently paused, resume
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Otherwise cancel any ongoing speech and start fresh
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    if (currentVoice) {
      utterance.voice = currentVoice;
    }

    // Set voice pitch based on gender preference for natural audio tone
    if (selectedGender === 'female') {
      utterance.pitch = 1.1;
    } else {
      utterance.pitch = 0.85;
    }

    utterance.rate = playbackRate;

    // Track word boundaries
    let wordsSpoken = 0;
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        wordsSpoken++;
        setSpokenWordCount(wordsSpoken);
        const charIndex = event.charIndex;
        const snippet = text.slice(charIndex, charIndex + 25).split(/\s+/)[0];
        setCurrentWord(snippet);
      }
    };

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setSpokenWordCount(0);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWord('');
      setSpokenWordCount(totalWords);
    };

    utterance.onerror = (e) => {
      // If manually canceled, ignore error
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      setIsPlaying(false);
      setIsPaused(false);
      onShowToast('Speech synthesis stopped');
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setSpokenWordCount(0);
      setCurrentWord('');
    }
  };

  const handleGenderChange = (gender: VoiceGender) => {
    setSelectedGender(gender);
    setSelectedVoiceURI(''); // Reset custom URI to pick the best default for that gender
    if (isPlaying) {
      // Restart speaking with new voice
      setTimeout(() => {
        handleStartSpeaking();
      }, 50);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying && utteranceRef.current) {
      // Web speech synthesis requires re-speaking to apply rate changes smoothly
      handleStop();
      setTimeout(() => {
        handleStartSpeaking();
      }, 100);
    }
  };

  const progressPercentage = totalWords > 0 
    ? Math.min(100, Math.round((spokenWordCount / totalWords) * 100)) 
    : 0;

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#111827] shadow-xs overflow-hidden transition-colors">
      {/* Header Bar */}
      <div className="px-4 sm:px-5 py-3 border-b border-slate-200/90 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Read Aloud & Voice Practice</span>
              {isPlaying && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 animate-pulse">
                  Playing
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Listen to your text spoken with a chosen voice to test cadence, clarity, and pacing.
            </p>
          </div>
        </div>

        {/* Quick Collapse / Expand button */}
        <button
          onClick={onToggleOpen}
          className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-md"
        >
          {isOpen ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Voice Gender & Speed Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Voice Gender
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedGender === 'female'
                      ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Female Voice</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedGender === 'male'
                      ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Male Voice</span>
                </button>
              </div>
            </div>

            {/* Reading Speed / Pacing */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Reading Pace ({playbackRate}x)
              </label>
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                {[0.8, 1.0, 1.2, 1.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleRateChange(rate)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer font-mono-numbers ${
                      playbackRate === rate
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* System Voice Selection (Fine tuning) */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                System Voice Profile
              </label>
              <select
                value={selectedVoiceURI || currentVoice?.voiceURI || ''}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="w-full py-2 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer truncate"
              >
                {(selectedGender === 'female' ? femaleVoices : maleVoices).map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
                {voices.length === 0 && (
                  <option value="">Default System Voice</option>
                )}
              </select>
            </div>
          </div>

          {/* Live Progress Bar & Playback Controls */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Play, Pause, Stop Buttons */}
            <div className="flex items-center gap-2">
              {!isPlaying && !isPaused ? (
                <button
                  onClick={handleStartSpeaking}
                  disabled={!text.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium text-xs transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Reading Aloud</span>
                </button>
              ) : isPaused ? (
                <button
                  onClick={handleStartSpeaking}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
              )}

              {(isPlaying || isPaused) && (
                <button
                  onClick={handleStop}
                  title="Stop reading"
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
            </div>

            {/* Word Progress & Spoken Pacing */}
            <div className="flex-1 sm:max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono-numbers text-slate-500 dark:text-slate-400">
                <span className="truncate">
                  {isPlaying && currentWord ? (
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      Speaking: "{currentWord}"
                    </span>
                  ) : (
                    <span>Progress: {spokenWordCount} / {totalWords} words</span>
                  )}
                </span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-150"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
