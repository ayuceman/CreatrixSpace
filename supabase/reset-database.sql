-- ============================================
-- RESET DATABASE (TRUNCATE)
-- Empties all tables + storage without dropping schema
-- Run this in Supabase SQL Editor, then re-run seed-data.sql
-- ============================================

-- Clean storage: delete all files in the 'images' bucket
-- Supabase blocks direct SQL deletion — use Dashboard instead:
-- Storage → images → Select all → Delete
-- Or run: curl -X DELETE https://fvbupnqmhgjqlexzcufn.supabase.co/storage/v1/object/images/...

-- Disable triggers temporarily for clean truncation
SET session_replication_role = 'replica';

-- Truncate all tables (order matters for FK constraints)
TRUNCATE TABLE public.spaces_content CASCADE;
TRUNCATE TABLE public.membership_content CASCADE;
TRUNCATE TABLE public.hero_content CASCADE;
TRUNCATE TABLE public.member_companies CASCADE;
TRUNCATE TABLE public.faqs CASCADE;
TRUNCATE TABLE public.testimonials CASCADE;
TRUNCATE TABLE public.amenities_content CASCADE;
TRUNCATE TABLE public.amenities CASCADE;
TRUNCATE TABLE public.site_stats CASCADE;
TRUNCATE TABLE public.payments CASCADE;
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.manual_admin_entries CASCADE;
TRUNCATE TABLE public.add_ons CASCADE;
TRUNCATE TABLE public.room_plan_pricing CASCADE;
TRUNCATE TABLE public.location_plan_pricing CASCADE;
TRUNCATE TABLE public.plans CASCADE;
TRUNCATE TABLE public.location_rooms CASCADE;
TRUNCATE TABLE public.locations CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Re-seed: copy and paste seed-data.sql here.
