-- migrations/007-redesign-english-vocab.sql
-- Clean redesign: 2 tables for English vocab
--   1. english_unit_words — the vocab data (unit + word + definition)
--   2. student_english_progress — tracks student progress per unit
--
-- Drops: vocab_lists, vocab_words, student_vocab, english_units, student_english_units

-- ═══════════════════════════════════════════════
-- 1. Create new clean tables
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS english_unit_words (
  unit_number INTEGER NOT NULL,
  word_index  INTEGER NOT NULL,
  word        TEXT NOT NULL,
  definition  TEXT DEFAULT '',
  PRIMARY KEY (unit_number, word_index)
);

CREATE TABLE IF NOT EXISTS student_english_progress (
  student_id  TEXT REFERENCES students(id) ON DELETE CASCADE,
  unit_number INTEGER NOT NULL,
  status      TEXT CHECK (status IN ('memorized', 'review', 'none')) DEFAULT 'none',
  PRIMARY KEY (student_id, unit_number)
);

CREATE INDEX IF NOT EXISTS idx_english_unit_words_unit ON english_unit_words(unit_number);
CREATE INDEX IF NOT EXISTS idx_student_english_progress_student ON student_english_progress(student_id, status);

-- ═══════════════════════════════════════════════
-- 2. Migrate data from old tables
-- ═══════════════════════════════════════════════

-- Copy vocab words from vocab_lists/vocab_words into english_unit_words
-- (vocab_lists named 'vlist_unit_N' → unit_number N)
INSERT INTO english_unit_words (unit_number, word_index, word, definition)
SELECT
  CAST(REPLACE(vl.id, 'vlist_unit_', '') AS INTEGER),
  vw.word_index,
  vw.word,
  vw.definition
FROM vocab_words vw
JOIN vocab_lists vl ON vl.id = vw.list_id
WHERE vl.id LIKE 'vlist_unit_%'
ON CONFLICT (unit_number, word_index) DO NOTHING;

-- Copy student progress from student_english_units → student_english_progress
-- (unit_id like 'b1-u5' → unit_number 5)
INSERT INTO student_english_progress (student_id, unit_number, status)
SELECT
  student_id,
  CAST(SUBSTR(unit_id, POSITION('-u' IN unit_id) + 2) AS INTEGER),
  status
FROM student_english_units
WHERE unit_id ~ '-u\d+$'
ON CONFLICT (student_id, unit_number) DO NOTHING;

-- Copy student progress from student_vocab → student_english_progress
-- (vocab_id like 'vlist_unit_3-5' → unit 3)
INSERT INTO student_english_progress (student_id, unit_number, status)
SELECT
  sv.student_id,
  CAST(SPLIT_PART(SUBSTR(sv.vocab_id, LENGTH('vlist_unit_') + 1), '-', 1) AS INTEGER),
  sv.status
FROM student_vocab sv
WHERE sv.vocab_id LIKE 'vlist_unit_%'
ON CONFLICT (student_id, unit_number) DO NOTHING;

-- ═══════════════════════════════════════════════
-- 3. Drop old tables (no longer needed)
-- ═══════════════════════════════════════════════

DROP TABLE IF EXISTS student_vocab CASCADE;
DROP TABLE IF EXISTS vocab_words CASCADE;
DROP TABLE IF EXISTS vocab_lists CASCADE;
DROP TABLE IF EXISTS student_english_units CASCADE;
DROP TABLE IF EXISTS english_units CASCADE;
