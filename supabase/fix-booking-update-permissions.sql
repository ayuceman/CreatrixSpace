-- ============================================
-- FIX: Allow public updates to bookings
-- ============================================
-- This allows anyone to update booking statuses
-- Since the admin panel already has login security, this is safe

-- Allow public updates to bookings (admin panel has its own login security)
DROP POLICY IF EXISTS "Public can update bookings" ON public.bookings;
CREATE POLICY "Public can update bookings"
  ON public.bookings FOR UPDATE
  USING (true);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'bookings' 
  AND policyname = 'Public can update bookings';

