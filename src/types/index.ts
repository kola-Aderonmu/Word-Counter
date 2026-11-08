export interface TextStats {
  charactersTotal: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  estimatedPages: number;
  averageWordLength: number;
  longestWord: string;
  uniqueWords: number;
  lexicalDiversity: number; // percentage of unique words
  readingEaseScore: number; // Flesch Reading Ease approximation
  readingGradeLevel: string;
}

export interface LetterFrequency {
  char: string;
  count: number;
  percentage: number;
}

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface SocialLimitPreset {
  id: string;
  name: string;
  platform: string;
  limit: number;
  description: string;
  icon: string;
}

export type TextCaseType = 
  | 'uppercase' 
  | 'lowercase' 
  | 'titlecase' 
  | 'sentencecase' 
  | 'camelcase' 
  | 'snakecase' 
  | 'kebabcase';
