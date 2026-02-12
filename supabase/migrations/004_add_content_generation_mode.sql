-- Add content_generation_mode to standard_tracks
-- Allowed values: 'static' (cached/fixed seed) vs 'dynamic' (random variation)

ALTER TABLE standard_tracks 
ADD COLUMN content_generation_mode TEXT DEFAULT 'dynamic';

-- Add check constraint to ensure valid values
ALTER TABLE standard_tracks
ADD CONSTRAINT check_content_generation_mode 
CHECK (content_generation_mode IN ('static', 'dynamic'));

-- Update existing tracks to 'dynamic' by default (as per current logic)
UPDATE standard_tracks SET content_generation_mode = 'dynamic';
