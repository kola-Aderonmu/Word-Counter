import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { SplashScreen } from './components/SplashScreen';
import { StatsGrid } from './components/StatsGrid';
import { VoiceReader } from './components/VoiceReader';
import { TextEditor } from './components/TextEditor';
import { LetterDensitySection } from './components/LetterDensitySection';
import { WordFrequencySection } from './components/WordFrequencySection';
import { SocialLimitsSection } from './components/SocialLimitsSection';
import { ReadabilityDetails } from './components/ReadabilityDetails';
import { Toast } from './components/Toast';
import { analyzeText, formatTimeEstimate } from './utils/textAnalysis';
import { SAMPLE_TEXTS } from './utils/sampleTexts';

export default function App() {
  // Theme state - defaults to dark mode per user request
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('wc_theme');
    if (saved) return saved === 'dark';
    return true; // Default to dark mode
  });

  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [text, setText] = useState<string>(SAMPLE_TEXTS[0].text);
  const [excludeSpaces, setExcludeSpaces] = useState<boolean>(false);
  const [charLimitEnabled, setCharLimitEnabled] = useState<boolean>(false);
  const [charLimit, setCharLimit] = useState<number>(280);
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopiedReport, setIsCopiedReport] = useState<boolean>(false);
  const [voiceReaderOpen, setVoiceReaderOpen] = useState<boolean>(true);

  // Section refs for smooth navigation
  const voiceRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const densityRef = useRef<HTMLDivElement>(null);
  const vocabularyRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  // Update HTML class whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wc_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Real-time text analysis calculation
  const stats = useMemo(() => {
    return analyzeText(text);
  }, [text]);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'editor' && editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tab === 'density' && densityRef.current) {
      densityRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tab === 'vocabulary' && vocabularyRef.current) {
      vocabularyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tab === 'social' && socialRef.current) {
      socialRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenVoice = () => {
    setVoiceReaderOpen(true);
    if (voiceRef.current) {
      voiceRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleApplySocialLimit = (limit: number) => {
    setCharLimitEnabled(true);
    setCharLimit(limit);
    showToast(`Character limit set to ${limit.toLocaleString()}`);
    if (editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate complete text analysis report to clipboard
  const handleExportReport = async () => {
    const report = [
      '========================================',
      'WORDCOUNTER PRO — ANALYSIS REPORT',
      `Date: ${new Date().toLocaleString()}`,
      '========================================\n',
      '--- CORE STATISTICS ---',
      `Total Words: ${stats.words.toLocaleString()}`,
      `Total Characters: ${stats.charactersTotal.toLocaleString()}`,
      `Characters (No Spaces): ${stats.charactersNoSpaces.toLocaleString()}`,
      `Sentences: ${stats.sentences.toLocaleString()}`,
      `Paragraphs: ${stats.paragraphs.toLocaleString()}`,
      `Avg Word Length: ${stats.averageWordLength} characters`,
      `Words Per Sentence: ${stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0}`,
      `Estimated Pages (250 words/p): ${stats.estimatedPages}\n`,
      '--- TIME BENCHMARKS ---',
      `Reading Time (200 wpm): ${formatTimeEstimate(stats.readingTimeMinutes)}`,
      `Speaking Time (130 wpm): ${formatTimeEstimate(stats.speakingTimeMinutes)}\n`,
      '--- READABILITY & VOCABULARY ---',
      `Flesch Reading Ease: ${stats.readingEaseScore} / 100 (${stats.readingGradeLevel})`,
      `Unique Words: ${stats.uniqueWords.toLocaleString()} (${stats.lexicalDiversity}% lexical diversity)`,
      `Longest Word: ${stats.longestWord || 'N/A'}\n`,
      '--- TEXT PREVIEW ---',
      text.slice(0, 300) + (text.length > 300 ? '...' : ''),
      '\n========================================'
    ].join('\n');

    try {
      await navigator.clipboard.writeText(report);
      setIsCopiedReport(true);
      showToast('Full analysis report copied to clipboard');
      setTimeout(() => setIsCopiedReport(false), 2500);
    } catch {
      showToast('Unable to copy report');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Animated Funny Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      <Header
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onExportReport={handleExportReport}
        isCopiedReport={isCopiedReport}
        onReplaySplash={() => setShowSplash(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Real-time KPI Statistics Cards */}
        <section aria-label="Real-time statistics">
          <StatsGrid 
            stats={stats} 
            excludeSpaces={excludeSpaces} 
            onOpenVoiceReader={handleOpenVoice}
            isVoiceActive={voiceReaderOpen}
          />
        </section>

        {/* Voice Reader Section (Male/Female voice reader for testing reading time) */}
        <section ref={voiceRef} aria-label="Voice reader">
          <VoiceReader
            text={text}
            totalWords={stats.words}
            isOpen={voiceReaderOpen}
            onToggleOpen={() => setVoiceReaderOpen((prev) => !prev)}
            onShowToast={showToast}
          />
        </section>

        {/* Text Area & Controls */}
        <section ref={editorRef} aria-label="Text editor">
          <TextEditor
            text={text}
            onChangeText={setText}
            excludeSpaces={excludeSpaces}
            onToggleExcludeSpaces={setExcludeSpaces}
            charLimitEnabled={charLimitEnabled}
            onToggleCharLimit={setCharLimitEnabled}
            charLimit={charLimit}
            onChangeCharLimit={setCharLimit}
            onShowToast={showToast}
          />
        </section>

        {/* Two-Column Analytics Layout: Readability & Letter Density */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Readability & Complexity */}
          <div className="lg:col-span-5 space-y-6">
            <ReadabilityDetails stats={stats} />
          </div>

          {/* Letter Density & Frequency (Inspired by YouTube / Frontend Mentor project) */}
          <div ref={densityRef} className="lg:col-span-7">
            <LetterDensitySection text={text} />
          </div>
        </div>

        {/* Word Frequency & Social Limits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Word Frequency & Vocabulary */}
          <div ref={vocabularyRef} className="lg:col-span-6">
            <WordFrequencySection text={text} stats={stats} />
          </div>

          {/* Social Platform Constraints */}
          <div ref={socialRef} className="lg:col-span-6">
            <SocialLimitsSection
              text={text}
              excludeSpaces={excludeSpaces}
              onApplyLimit={handleApplySocialLimit}
            />
          </div>
        </div>
      </main>

      {/* Clean human footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>WordCounter Pro</span>
            <span aria-hidden="true">·</span>
            <span>Client-side, privacy-first text analysis & speech synthesis</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSplash(true)}
              className="hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Replay Intro Mascot
            </button>
            <span aria-hidden="true">·</span>
            <span>Standard 200 WPM reading rate</span>
            <span aria-hidden="true">·</span>
            <span>130 WPM speaking rate</span>
          </div>
        </div>
      </footer>

      {/* Floating Feedback Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
