-- migrations/001-init.sql
-- Run this on Railway PostgreSQL to create all tables

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  avatar TEXT DEFAULT 'avatar-leaf',
  notes TEXT,
  joined_at TEXT NOT NULL,
  xp INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS hadiths (
  number INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  reference TEXT DEFAULT '',
  explanation TEXT DEFAULT '',
  category TEXT DEFAULT 'عام',
  points INTEGER DEFAULT 100,
  badge_name TEXT DEFAULT '',
  badge_icon TEXT DEFAULT 'stars'
);

CREATE TABLE IF NOT EXISTS student_hadiths (
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  hadith_number INTEGER REFERENCES hadiths(number) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('memorized', 'review', 'none')) DEFAULT 'none',
  PRIMARY KEY (student_id, hadith_number)
);

CREATE TABLE IF NOT EXISTS student_surahs (
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  surah_number INTEGER NOT NULL,
  status TEXT CHECK (status IN ('memorized', 'review', 'none')) DEFAULT 'none',
  PRIMARY KEY (student_id, surah_number)
);

CREATE TABLE IF NOT EXISTS student_surah_pages (
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL,
  PRIMARY KEY (student_id, page_id)
);

CREATE TABLE IF NOT EXISTS vocab_lists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vocab_words (
  list_id TEXT REFERENCES vocab_lists(id) ON DELETE CASCADE,
  word_index INTEGER NOT NULL,
  word TEXT NOT NULL,
  definition TEXT DEFAULT '',
  PRIMARY KEY (list_id, word_index)
);

CREATE TABLE IF NOT EXISTS student_vocab (
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  vocab_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('memorized', 'review', 'none')) DEFAULT 'none',
  PRIMARY KEY (student_id, vocab_id)
);

CREATE TABLE IF NOT EXISTS student_english_units (
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  unit_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('memorized', 'review', 'none')) DEFAULT 'none',
  PRIMARY KEY (student_id, unit_id)
);
