-- Add gallery_images column to trips table for storing multiple image URLs
ALTER TABLE public.trips ADD COLUMN gallery_images text[];