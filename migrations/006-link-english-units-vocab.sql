-- migrations/006-link-english-units-vocab.sql
-- Link english_units to vocab_lists so units show their vocab words

ALTER TABLE english_units ADD COLUMN IF NOT EXISTS vocab_list_id TEXT REFERENCES vocab_lists(id) ON DELETE SET NULL;

-- Link existing vocab_lists (vlist_unit_1 → b1-u1, vlist_unit_2 → b1-u2, etc.)
UPDATE english_units eu
SET vocab_list_id = 'vlist_unit_' || eu.unit
WHERE eu.book = 1
  AND EXISTS (SELECT 1 FROM vocab_lists vl WHERE vl.id = 'vlist_unit_' || eu.unit);

CREATE INDEX IF NOT EXISTS idx_english_units_vocab_list ON english_units(vocab_list_id);
