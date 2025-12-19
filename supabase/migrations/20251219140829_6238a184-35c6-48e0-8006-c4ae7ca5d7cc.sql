-- Add date range columns to blog_posts for trip-related content
ALTER TABLE public.blog_posts
ADD COLUMN start_date timestamp with time zone DEFAULT NULL,
ADD COLUMN end_date timestamp with time zone DEFAULT NULL;