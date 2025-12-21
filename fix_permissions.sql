-- FIX: Allow Admin Dashboard to Update Status
-- Run this in your Supabase SQL Editor

-- 1. Enable RLS (Status Quo)
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;

-- 2. Allow Updates to Leads for Authenticated Users (Admins)
-- We use DO NOTHING on conflict to avoid errors if policy exists, but standard SQL doesn't support that easily for policies.
-- So we just drop if exists then create to be safe.
DROP POLICY IF EXISTS "Enable update for users based on email" ON "leads";
CREATE POLICY "Enable update for users based on email" 
ON "leads" FOR UPDATE 
USING ( auth.role() = 'authenticated' )
WITH CHECK ( auth.role() = 'authenticated' );

-- 3. Also ensure users can SEE the leads (Select)
DROP POLICY IF EXISTS "Enable read access for all users" ON "leads";
CREATE POLICY "Enable read access for all users" 
ON "leads" FOR SELECT 
USING ( true );

-- 4. Allow Insert (already working likely, but just in case)
DROP POLICY IF EXISTS "Enable insert for all users" ON "leads";
CREATE POLICY "Enable insert for all users" 
ON "leads" FOR INSERT 
WITH CHECK ( true );

-- 5. Fix for 'admin_whitelist' if you want that table
CREATE TABLE IF NOT EXISTS admin_whitelist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT
);
ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read admin whitelist" ON admin_whitelist;
CREATE POLICY "Public read admin whitelist" ON admin_whitelist FOR SELECT USING (true);
