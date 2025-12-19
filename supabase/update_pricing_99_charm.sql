-- ============================================
-- MIGRATION: 99 CHARM PRICING UPDATE
-- ============================================
-- This script updates the pricing for Professional and Enterprise plans
-- to match the new "99 Charm" strategy (ending in 99).

-- 1. Update Base Plan Pricing
-- Professional: Weekly 1,999 / Monthly 8,999
UPDATE public.plans
SET pricing = '{"weekly": 199900, "monthly": 899900, "annual": 6000000}'::jsonb
WHERE name = 'Professional';

-- Enterprise: Weekly 2,999 / Monthly 10,999
UPDATE public.plans
SET pricing = '{"weekly": 299900, "monthly": 1099900, "annual": 10800000}'::jsonb
WHERE name = 'Enterprise';

-- 2. Update Location Specific Pricing
-- This updates ALL locations to use the new standard pricing.
-- If you have specific pricing for certain locations, you may need to adjust this.

-- Professional Plan Location Pricing
UPDATE public.location_plan_pricing
SET pricing = '{"weekly": 199900, "monthly": 899900, "annual": 6000000}'::jsonb
WHERE plan_id IN (SELECT id FROM public.plans WHERE name = 'Professional');

-- Enterprise Plan Location Pricing
UPDATE public.location_plan_pricing
SET pricing = '{"weekly": 299900, "monthly": 1099900, "annual": 10800000}'::jsonb
WHERE plan_id IN (SELECT id FROM public.plans WHERE name = 'Enterprise');

-- 3. Verify Updates
SELECT p.name, p.pricing 
FROM public.plans p 
WHERE p.name IN ('Professional', 'Enterprise');
