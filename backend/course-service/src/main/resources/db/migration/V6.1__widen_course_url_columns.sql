-- Widen URL columns to prevent DataIntegrityViolationException with long CDN URLs
ALTER TABLE course.courses 
  ALTER COLUMN icon TYPE TEXT,
  ALTER COLUMN thumbnail_image_url TYPE TEXT,
  ALTER COLUMN banner_image TYPE TEXT,
  ALTER COLUMN preview_video_url TYPE TEXT;
