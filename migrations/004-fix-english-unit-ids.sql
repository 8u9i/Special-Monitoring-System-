-- migrations/004-fix-english-unit-ids.sql
-- Fix English unit IDs: b1-u01 → b1-u1 (match client-side format)

-- Update student progress references first
UPDATE student_english_units
SET unit_id = REGEXP_REPLACE(unit_id, '-u0+(\d+)$', '-u\1')
WHERE unit_id ~ '-u0\d+$';

-- Update english_units table
UPDATE english_units
SET id = REGEXP_REPLACE(id, '-u0+(\d+)$', '-u\1')
WHERE id ~ '-u0\d+$';
