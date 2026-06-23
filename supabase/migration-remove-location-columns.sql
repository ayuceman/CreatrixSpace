-- Migration: Remove address, city, latitude, longitude from locations table
-- Run this in Supabase SQL Editor after schema.sql to drop the unused columns

ALTER TABLE public.locations
  DROP COLUMN IF EXISTS address,
  DROP COLUMN IF EXISTS city,
  DROP COLUMN IF EXISTS latitude,
  DROP COLUMN IF EXISTS longitude;
