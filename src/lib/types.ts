export interface Student {
  id: string;
  name: string;
  age?: number;
  avatar: string;
  notes?: string;
  joinedAt: string;
  memorizedHadithNumbers: number[];
  reviewHadithNumbers: number[];
  memorizedSurahNumbers: number[];
  reviewSurahNumbers: number[];
  memorizedSurahPages: string[];
  memorizedEnglishUnits: number[];
  reviewEnglishUnits: number[];
}

export interface Hadith {
  number: number;
  text: string;
  explanation: string;
  category: string;
  points: number;
}

export interface EnglishUnitWithWords {
  unitNumber: number;
  words: { word: string; definition: string }[];
}

export interface Stage {
  level: number;
  name: string;
  minPct: number;
  maxPct: number;
  description: string;
  badgeIcon: string;
}

export interface Surah {
  number: number;
  name: string;
  pagesCount?: number;
}
