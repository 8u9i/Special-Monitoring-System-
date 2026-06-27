-- migrations/005-performance-indexes.sql
-- Performance indexes for frequently queried columns

-- Student progress lookups (used by badge checks, dashboard, API)
CREATE INDEX IF NOT EXISTS idx_student_hadiths_student_status ON student_hadiths(student_id, status);
CREATE INDEX IF NOT EXISTS idx_student_surahs_student_status ON student_surahs(student_id, status);
CREATE INDEX IF NOT EXISTS idx_student_surah_pages_student ON student_surah_pages(student_id);
CREATE INDEX IF NOT EXISTS idx_student_vocab_student_status ON student_vocab(student_id, status);
CREATE INDEX IF NOT EXISTS idx_student_english_units_student_status ON student_english_units(student_id, status);

-- Vocab words lookup (used by GET /api/vocab-lists)
CREATE INDEX IF NOT EXISTS idx_vocab_words_list_id ON vocab_words(list_id, word_index);

-- Badge lookups
CREATE INDEX IF NOT EXISTS idx_student_badges_student_trail ON student_badges(student_id, badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_definitions_trail_threshold ON badge_definitions(trail, threshold);

-- Students ordering
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);

-- Hadith ordering
CREATE INDEX IF NOT EXISTS idx_hadiths_number ON hadiths(number);
