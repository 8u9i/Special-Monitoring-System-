-- Cleanup orphan tables no longer used by the application
DROP TABLE IF EXISTS student_english_units CASCADE;
DROP TABLE IF EXISTS student_vocab CASCADE;
DROP TABLE IF EXISTS vocab_words CASCADE;
DROP TABLE IF EXISTS vocab_lists CASCADE;
