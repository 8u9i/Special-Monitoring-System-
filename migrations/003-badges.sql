-- migrations/003-badges.sql
-- Cross-trail badge system: definitions + student earned badges

CREATE TABLE IF NOT EXISTS badge_definitions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'emoji_events',
  trail TEXT NOT NULL CHECK (trail IN ('hadith', 'quran', 'english', 'vocab', 'xp', 'pages')),
  threshold INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_badges (
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES badge_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (student_id, badge_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_student_badges_student ON student_badges(student_id);
CREATE INDEX IF NOT EXISTS idx_badge_definitions_trail ON badge_definitions(trail);

-- ═══════════════════════════════════════════════
-- Seed badge definitions for all trails
-- ═══════════════════════════════════════════════

-- ── Hadith badges ──
INSERT INTO badge_definitions (name, description, icon, trail, threshold, points) VALUES
('حافظ أول حديث',   'حفظ أول حديث نبوي',                          'favorite',          'hadith', 1,   50),
('حافظ 5 أحاديث',   'حفظ خمسة أحاديث نبوية',                      'record_voice_over', 'hadith', 5,   100),
('حافظ 10 أحاديث',  'حفظ عشرة أحاديث نبوية',                      'menu_book',         'hadith', 10,  200),
('حافظ 20 حديث',     'حفظ عشرين حديثاً نبوياً',                    'auto_stories',      'hadith', 20,  300),
('حافظ 30 حديث',     'حفظ ثلاثين حديثاً نبوياً',                    'workspace_premium', 'hadith', 30,  400),
('حافظ الأربعين',    'أتم حفظ أربعين حديثاً نبوياً',               'military_tech',     'hadith', 40,  500)
ON CONFLICT DO NOTHING;

-- ── Quran surah badges ──
INSERT INTO badge_definitions (name, description, icon, trail, threshold, points) VALUES
('حافظ أول سورة',    'حفظ أول سورة من القرآن الكريم',               'auto_awesome',      'quran', 1,   50),
('حافظ 5 سور',       'حفظ خمس سور من القرآن الكريم',                'wb_sunny',          'quran', 5,   100),
('حافظ 10 سور',      'حفظ عشر سور من القرآن الكريم',                'star',              'quran', 10,  200),
('حافظ 20 سورة',     'حفظ عشرين سورة من القرآن الكريم',             'local_florist',     'quran', 20,  300),
('حافظ 30 سورة',     'حفظ ثلاثين سورة من القرآن الكريم',             'park',              'quran', 30,  400),
('حافظ 50 سورة',     'حفظ خمسين سورة من القرآن الكريم',              'eco',               'quran', 50,  500),
('حافظ 100 سورة',    'حفظ مئة سورة من القرآن الكريم',                'verified_user',     'quran', 100, 1000),
('حافظ القرآن كاملاً', 'أتم حفظ القرآن الكريم كاملاً',              'workspace_premium', 'quran', 114, 2000)
ON CONFLICT DO NOTHING;

-- ── Quran page badges ──
INSERT INTO badge_definitions (name, description, icon, trail, threshold, points) VALUES
('حافظ صفحة واحدة',  'حفظ صفحة واحدة من المصحف',                    'description',       'pages', 1,   20),
('حافظ 10 صفحات',    'حفظ عشر صفحات من المصحف',                     'collections',       'pages', 10,  100),
('حافظ 50 صفحة',     'حفظ خمسين صفحة من المصحف',                     'folder',            'pages', 50,  300),
('حافظ 100 صفحة',    'حفظ مئة صفحة من المصحف',                       'library_books',     'pages', 100, 500)
ON CONFLICT DO NOTHING;

-- ── English badges ──
INSERT INTO badge_definitions (name, description, icon, trail, threshold, points) VALUES
('أول وحدة إنجليزية',  'إكمال أول وحدة في اللغة الإنجليزية',          'translate',         'english', 1,   50),
('5 وحدات إنجليزية',   'إكمال خمس وحدات في اللغة الإنجليزية',         'globe_uk',          'english', 5,   100),
('10 وحدات إنجليزية',  'إكمال عشر وحدات في اللغة الإنجليزية',         'school',            'english', 10,  200),
('30 وحدة إنجليزية',   'إكمال ثلاثين وحدة في اللغة الإنجليزية',       'language',          'english', 30,  400),
('الكتاب الأول',       'إكمال جميع وحدات الكتاب الأول',               'menu_book',         'english', 60,  600)
ON CONFLICT DO NOTHING;

-- ── Vocab badges ──
INSERT INTO badge_definitions (name, description, icon, trail, threshold, points) VALUES
('أول مفردة',         'حفظ أول مفردة إنجليزية',                      'translate',         'vocab', 1,   10),
('25 مفردة',          'حفظ خمس وعشرين مفردة إنجليزية',               'spellcheck',        'vocab', 25,  50),
('50 مفردة',          'حفظ خمسين مفردة إنجليزية',                     'dictionary',        'vocab', 50,  100),
('100 مفردة',         'حفظ مئة مفردة إنجليزية',                       'school',            'vocab', 100, 200)
ON CONFLICT DO NOTHING;

-- ── XP milestone badges ──
INSERT INTO badge_definitions (name, description, icon, trail, threshold, points) VALUES
('البذرة',            'بداية رحلة العلم — 1000 نقطة',                 'eco',               'xp', 1000,   0),
('الشتلة',            'نمو مستمر — 3000 نقطة',                        'yard',              'xp', 3000,   0),
('الغصن',             'إصرار وعزيمة — 6000 نقطة',                     'nature',            'xp', 6000,   0),
('الشجرة المثمرة',    'ثمر الجد والاجتهاد — 10000 نقطة',              'local_florist',     'xp', 10000,  0),
('تاج الحافظين',      'قمة التميز — 20000 نقطة',                      'park',              'xp', 20000,  0)
ON CONFLICT DO NOTHING;
