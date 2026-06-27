-- migrations/004-fix-english-unit-ids.sql
-- Fix English unit IDs: b1-u01 → b1-u1 (match client-side format)

-- First, re-point any student progress from OLD ids to NEW ids
-- (only where the NEW id doesn't already have a row)
UPDATE student_english_units s
SET unit_id = REGEXP_REPLACE(s.unit_id, '-u0+(\d+)$', '-u\1')
WHERE s.unit_id ~ '-u0\d+$'
  AND NOT EXISTS (
    SELECT 1 FROM student_english_units s2
    WHERE s2.student_id = s.student_id
      AND s2.unit_id = REGEXP_REPLACE(s.unit_id, '-u0+(\d+)$', '-u\1')
  );

-- Delete student progress rows that still have old IDs (now duplicated)
DELETE FROM student_english_units WHERE unit_id ~ '-u0\d+$';

-- Delete old-format english_units rows (the new-format ones already exist)
DELETE FROM english_units WHERE id ~ '-u0\d+$';
