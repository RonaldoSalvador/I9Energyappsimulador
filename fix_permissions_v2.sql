-- FIX: Allow Admin Dashboard to DELETE Leads and Candidates
-- Run this in your Supabase SQL Editor

-- 1. LEADS TABLE
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;

-- Allow Authenticated Users (Admins) to DELETE leads
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON "leads";
CREATE POLICY "Enable delete for authenticated users" 
ON "leads" FOR DELETE 
USING ( auth.role() = 'authenticated' );

-- Ensure they can also Update
DROP POLICY IF EXISTS "Enable update for users based on email" ON "leads";
CREATE POLICY "Enable update for users based on email" 
ON "leads" FOR UPDATE 
USING ( auth.role() = 'authenticated' )
WITH CHECK ( auth.role() = 'authenticated' );

-- Ensure Select works
DROP POLICY IF EXISTS "Enable read access for all users" ON "leads";
CREATE POLICY "Enable read access for all users" ON "leads" FOR SELECT USING (true);


-- 2. CANDIDATES TABLE (Repeat the same logic)
CREATE TABLE IF NOT EXISTS "candidates" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT,
  email TEXT,
  whatsapp TEXT,
  message TEXT,
  resume_url TEXT
);

ALTER TABLE "candidates" ENABLE ROW LEVEL SECURITY;

-- Allow Delete
DROP POLICY IF EXISTS "Enable delete for candidates" ON "candidates";
CREATE POLICY "Enable delete for candidates" 
ON "candidates" FOR DELETE 
USING ( auth.role() = 'authenticated' );

-- Allow Select
DROP POLICY IF EXISTS "Enable read for candidates" ON "candidates";
CREATE POLICY "Enable read for candidates" ON "candidates" FOR SELECT USING (true);

-- Allow Insert (Public)
DROP POLICY IF EXISTS "Enable insert for candidates" ON "candidates";
CREATE POLICY "Enable insert for candidates" ON "candidates" FOR INSERT WITH CHECK (true);
