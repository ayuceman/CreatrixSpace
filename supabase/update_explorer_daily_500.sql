-- ============================================
-- Update Explorer (hot desk daily) to NPR 500/day
-- ============================================
-- Run in Supabase Dashboard: SQL Editor
-- Or: npx supabase db execute --file supabase/update_explorer_daily_500.sql

-- 1. Update plans table default
UPDATE public.plans
SET pricing = jsonb_set(COALESCE(pricing, '{}'::jsonb), '{daily}', '50000')
WHERE name = 'Explorer' AND type = 'day_pass';

-- 2. Update all location_plan_pricing rows for Explorer
UPDATE public.location_plan_pricing
SET pricing = jsonb_set(COALESCE(pricing, '{}'::jsonb), '{daily}', '50000')
WHERE plan_id = (SELECT id FROM public.plans WHERE name = 'Explorer' LIMIT 1);
