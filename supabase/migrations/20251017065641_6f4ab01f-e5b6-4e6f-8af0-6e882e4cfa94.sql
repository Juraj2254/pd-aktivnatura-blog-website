-- Add subtitle column to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS subtitle text;

-- Update featured_image column comment to indicate it can store JSON array for gallery
COMMENT ON COLUMN trips.featured_image IS 'Can store single image URL or JSON array of image URLs for gallery';