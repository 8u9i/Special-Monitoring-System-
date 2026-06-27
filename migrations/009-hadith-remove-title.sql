-- Remove the redundant title column from hadiths table
-- The category column already contains the same grouping information
ALTER TABLE hadiths DROP COLUMN IF EXISTS title;
