-- Fix RLS Policies for public read access
-- Run this if you're getting 500 errors when querying plans and add_ons

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.plans;
DROP POLICY IF EXISTS "Anyone can view active add-ons" ON public.add_ons;
DROP POLICY IF EXISTS "Anyone can view locations" ON public.locations;

-- Create more permissive policies for public read access
-- These allow anyone to read from the tables (even if empty)

-- Plans: Allow public to view all plans (not just active ones)
CREATE POLICY "Public can view plans"
  ON public.plans FOR SELECT
  TO public
  USING (true);

-- Add-ons: Allow public to view all add-ons (not just active ones)
CREATE POLICY "Public can view add-ons"
  ON public.add_ons FOR SELECT
  TO public
  USING (true);

-- Locations: Allow public to view all locations
CREATE POLICY "Public can view locations"
  ON public.locations FOR SELECT
  TO public
  USING (true);

-- Note: The service layer will filter by active=true, so this is safe
-- This just ensures the RLS doesn't block the query itself

