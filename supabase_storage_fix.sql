-- Enable RLS (though usually enabled by default on storage.objects)
-- alter table storage.objects enable row level security;

-- 1. Create Buckets (if they don't exist)
insert into storage.buckets (id, name, public)
values ('bills', 'bills', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do update set public = true;

-- 2. Create Policies for 'bills'
-- Allow public read access to bills
create policy "Public Access to Bills"
  on storage.objects for select
  using ( bucket_id = 'bills' );

-- Allow public upload access to bills
create policy "Public Upload to Bills"
  on storage.objects for insert
  with check ( bucket_id = 'bills' );

-- 3. Create Policies for 'resumes'
-- Allow public read access to resumes
create policy "Public Access to Resumes"
  on storage.objects for select
  using ( bucket_id = 'resumes' );

-- Allow public upload access to resumes
create policy "Public Upload to Resumes"
  on storage.objects for insert
  with check ( bucket_id = 'resumes' );

-- Clean up duplicate policies if user ran this multiple times (optional, but good practice if supported)
-- (Supabase SQL Editor usually handles simple creates fine, but might error if policy exists. 
--  To be safe, we can drop first or just let user ignore 'already exists' errors, 
--  OR use 'do' blocks, but simple CREATE is easier for users to read).
