CREATE TABLE IF NOT EXISTS english_units (
  id TEXT PRIMARY KEY,        -- e.g. 'b1-u1'
  book INTEGER NOT NULL,       -- 1-6
  unit INTEGER NOT NULL,       -- 1-30
  title TEXT DEFAULT ''        -- optional display name
);

-- Seed the 180 English units (6 books × 30 units)
INSERT INTO english_units (id, book, unit, title)
SELECT
  'b' || b.b || '-u' || LPAD(u.u::text, 2, '0'),
  b.b,
  u.u,
  'Book ' || b.b || ' - Unit ' || u.u
FROM generate_series(1, 6) AS b(b)
CROSS JOIN generate_series(1, 30) AS u(u)
ON CONFLICT (id) DO NOTHING;
