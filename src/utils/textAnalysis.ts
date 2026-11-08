import { LetterFrequency, TextStats, WordFrequency } from '../types';

const COMMON_STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each',
  'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up',
  'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

// Estimate syllables in a word
function countSyllables(word: string): number {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanWord) return 0;
  if (cleanWord.length <= 3) return 1;

  const stripped = cleanWord.replace(/(?:[^laeiouy]|ed|es|e)$/, '')
    .replace(/^y/, '');
  const matches = stripped.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

export function analyzeText(text: string): TextStats {
  const charactersTotal = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  if (!text.trim()) {
    return {
      charactersTotal,
      charactersNoSpaces,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      estimatedPages: 0,
      averageWordLength: 0,
      longestWord: '',
      uniqueWords: 0,
      lexicalDiversity: 0,
      readingEaseScore: 100,
      readingGradeLevel: 'N/A'
    };
  }

  // Words breakdown
  const rawWords = text.trim().split(/\s+/).filter(Boolean);
  const words = rawWords.length;

  // Sentences breakdown - match sentences ending with . ! ? followed by space or end of text
  const sentenceMatches = text.match(/[^.!?\n]+(?:[.!?]+|$)/g);
  const validSentences = (sentenceMatches || []).map(s => s.trim()).filter(s => s.length > 0 && /[a-zA-Z0-9]/.test(s));
  const sentences = Math.max(1, validSentences.length);

  // Paragraphs
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0).length || 1;

  // Average word length
  const totalLettersInWords = rawWords.reduce((sum, w) => sum + w.replace(/[^a-zA-Z0-9]/g, '').length, 0);
  const averageWordLength = words > 0 ? Number((totalLettersInWords / words).toFixed(1)) : 0;

  // Longest word
  let longestWord = '';
  for (const w of rawWords) {
    const cleanW = w.replace(/^[^\w]+|[^\w]+$/g, '');
    if (cleanW.length > longestWord.length) {
      longestWord = cleanW;
    }
  }

  // Unique words & Lexical Diversity
  const normalizedWords = rawWords.map(w => w.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '')).filter(Boolean);
  const uniqueWordsSet = new Set(normalizedWords);
  const uniqueWords = uniqueWordsSet.size;
  const lexicalDiversity = words > 0 ? Number(((uniqueWords / words) * 100).toFixed(1)) : 0;

  // Reading time (standard 200 words per minute)
  const readingTimeMinutes = Number((words / 200).toFixed(2));

  // Speaking time (standard 130 words per minute)
  const speakingTimeMinutes = Number((words / 130).toFixed(2));

  // Estimated pages (250 words per single-spaced standard page)
  const estimatedPages = Number((words / 250).toFixed(2));

  // Readability - Flesch Reading Ease approximation
  const totalSyllables = rawWords.reduce((sum, w) => sum + countSyllables(w), 0);
  let easeScore = 100;
  let gradeLevel = '5th Grade (Very Easy)';

  if (words > 0 && sentences > 0) {
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (totalSyllables / words));
    easeScore = Math.max(0, Math.min(100, Math.round(score)));

    if (easeScore >= 90) gradeLevel = '5th Grade (Very Easy)';
    else if (easeScore >= 80) gradeLevel = '6th Grade (Easy)';
    else if (easeScore >= 70) gradeLevel = '7th Grade (Fairly Easy)';
    else if (easeScore >= 60) gradeLevel = '8th–9th Grade (Plain English)';
    else if (easeScore >= 50) gradeLevel = '10th–12th Grade (Fairly Difficult)';
    else if (easeScore >= 30) gradeLevel = 'College Level (Difficult)';
    else gradeLevel = 'Graduate Level (Very Difficult)';
  }

  return {
    charactersTotal,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
    estimatedPages,
    averageWordLength,
    longestWord,
    uniqueWords,
    lexicalDiversity,
    readingEaseScore: easeScore,
    readingGradeLevel: gradeLevel
  };
}

export function calculateLetterFrequency(
  text: string, 
  options: { includeAllCharacters?: boolean; caseSensitive?: boolean } = {}
): LetterFrequency[] {
  if (!text) return [];

  const charCounts = new Map<string, number>();
  let totalCounted = 0;

  for (const ch of text) {
    // If spaces, skip
    if (/\s/.test(ch)) continue;

    let targetChar = ch;
    if (!options.caseSensitive) {
      targetChar = ch.toUpperCase();
    }

    if (!options.includeAllCharacters) {
      // Only alphabetic letters A-Z
      if (!/[a-zA-Z]/.test(ch)) continue;
    }

    charCounts.set(targetChar, (charCounts.get(targetChar) || 0) + 1);
    totalCounted++;
  }

  if (totalCounted === 0) return [];

  const result: LetterFrequency[] = [];
  charCounts.forEach((count, char) => {
    result.push({
      char,
      count,
      percentage: Number(((count / totalCounted) * 100).toFixed(1))
    });
  });

  // Sort descending by count, then alphabetical
  result.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.char.localeCompare(b.char);
  });

  return result;
}

export function calculateWordFrequency(
  text: string, 
  options: { ignoreStopWords?: boolean; minLength?: number } = {}
): WordFrequency[] {
  if (!text.trim()) return [];

  const rawWords = text.trim().split(/\s+/).filter(Boolean);
  const wordCounts = new Map<string, number>();
  let totalWordsCounted = 0;

  for (const w of rawWords) {
    const clean = w.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
    if (!clean) continue;
    if (options.minLength && clean.length < options.minLength) continue;
    if (options.ignoreStopWords && COMMON_STOP_WORDS.has(clean)) continue;

    wordCounts.set(clean, (wordCounts.get(clean) || 0) + 1);
    totalWordsCounted++;
  }

  if (totalWordsCounted === 0) return [];

  const result: WordFrequency[] = [];
  wordCounts.forEach((count, word) => {
    result.push({
      word,
      count,
      percentage: Number(((count / totalWordsCounted) * 100).toFixed(1))
    });
  });

  result.sort((a, b) => b.count - a.count);
  return result;
}

// Format minutes into clean mm:ss or "Xm Ys" / "X min"
export function formatTimeEstimate(minutes: number): string {
  if (minutes <= 0) return '0 sec';
  const totalSeconds = Math.round(minutes * 60);
  if (totalSeconds < 60) {
    return `${totalSeconds} sec`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (secs === 0) {
    return `${mins} min`;
  }
  return `${mins}m ${secs}s`;
}

// Text case conversion utilities
export function transformTextCase(text: string, type: string): string {
  switch (type) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titlecase':
      return text.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
      });
    case 'sentencecase':
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
    case 'camelcase':
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase());
    case 'snakecase':
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    case 'kebabcase':
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    case 'cleanspaces':
      return text
        .replace(/[ \t]+/g, ' ')
        .split('\n')
        .map(line => line.trim())
        .join('\n')
        .trim();
    case 'removelines':
      return text.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
    default:
      return text;
  }
}
