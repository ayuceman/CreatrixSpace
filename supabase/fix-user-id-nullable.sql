-- ============================================
-- QUICK FIX: Make user_id nullable for guest bookings
-- ============================================
-- Run this in Supabase SQL Editor to fix the "null value in column user_id" error
-- This allows guest bookings without requiring authentication

-- Make user_id nullable in bookings table
ALTER TABLE public.bookings ALTER COLUMN user_id DROP NOT NULL;

-- Verify the change
SELECT 
  column_name, 
  is_nullable, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
  AND column_name = 'user_id';

-- Expected result: is_nullable should be 'YES'

