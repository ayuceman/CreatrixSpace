-- ============================================
-- CLEAN DATABASE
-- Drops all tables + storage objects and recreates
-- Run this in Supabase SQL Editor
-- ============================================

-- Clean storage: use Supabase Dashboard instead (SQL deletions blocked)
-- Storage → images → Select all → Delete
-- Then: Storage → Buckets → images → Delete bucket (optional, schema.sql recreates it)

-- Drop storage bucket policies (these are safe via SQL)
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;

-- Drop all tables (reverse dependency order)
DROP TABLE IF EXISTS public.spaces_content CASCADE;
DROP TABLE IF EXISTS public.membership_content CASCADE;
DROP TABLE IF EXISTS public.hero_content CASCADE;
DROP TABLE IF EXISTS public.member_companies CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.amenities_content CASCADE;
DROP TABLE IF EXISTS public.amenities CASCADE;
DROP TABLE IF EXISTS public.site_stats CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.manual_admin_entries CASCADE;
DROP TABLE IF EXISTS public.add_ons CASCADE;
DROP TABLE IF EXISTS public.room_plan_pricing CASCADE;
DROP TABLE IF EXISTS public.location_plan_pricing CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;
DROP TABLE IF EXISTS public.location_rooms CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Recreate: copy and paste schema.sql here, then seed-data.sql after it.
