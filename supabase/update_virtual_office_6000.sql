-- ============================================
-- Update Virtual Office add-on to NPR 6,000/month
-- ============================================

UPDATE public.add_ons
SET price = 600000
WHERE type = 'virtual_office'
  AND active = true;
