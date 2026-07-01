-- Supabase Migration: Catholic Breviary Schema
-- Run this in the Supabase SQL Editor after creating your project.

-- 1. PRAYERS TABLE
CREATE TABLE IF NOT EXISTS prayers (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  date TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('morning', 'noon', 'evening', 'night', 'office')),
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_ta TEXT NOT NULL,
  scripture_ref_en TEXT,
  scripture_ref_ta TEXT,
  is_custom BOOLEAN DEFAULT false,
  UNIQUE(date, category)
);

-- 2. SAINTS TABLE
CREATE TABLE IF NOT EXISTS saints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name_en TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  feast_date TEXT NOT NULL,
  life_history_en TEXT NOT NULL,
  life_history_ta TEXT NOT NULL,
  image_url TEXT,
  is_custom BOOLEAN DEFAULT false
);

-- 3. LITURGICAL DAYS TABLE
CREATE TABLE IF NOT EXISTS liturgical_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  date TEXT NOT NULL UNIQUE,
  season_en TEXT NOT NULL,
  season_ta TEXT NOT NULL,
  color TEXT NOT NULL,
  feast_en TEXT NOT NULL,
  feast_ta TEXT NOT NULL,
  reading_first_ref_en TEXT NOT NULL,
  reading_first_ref_ta TEXT NOT NULL,
  reading_first_en TEXT NOT NULL,
  reading_first_ta TEXT NOT NULL,
  psalm_ref_en TEXT NOT NULL,
  psalm_ref_ta TEXT NOT NULL,
  psalm_en TEXT NOT NULL,
  psalm_ta TEXT NOT NULL,
  gospel_ref_en TEXT NOT NULL,
  gospel_ref_ta TEXT NOT NULL,
  gospel_en TEXT NOT NULL,
  gospel_ta TEXT NOT NULL,
  office_ref_en TEXT,
  office_ref_ta TEXT,
  office_en TEXT,
  office_ta TEXT,
  is_custom BOOLEAN DEFAULT false
);

-- 4. OFFICE READINGS TABLE
CREATE TABLE IF NOT EXISTS office_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  ref_en TEXT NOT NULL,
  ref_ta TEXT NOT NULL,
  text_en TEXT NOT NULL,
  text_ta TEXT NOT NULL,
  is_custom BOOLEAN DEFAULT false
);

-- 5. JOURNAL ENTRIES TABLE
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  reflection TEXT NOT NULL,
  associated_prayer_id TEXT
);

-- 6. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('prayer', 'saint', 'reading')),
  item_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL
);

-- 7. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL,
  desc_en TEXT NOT NULL,
  desc_ta TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  theme TEXT NOT NULL DEFAULT 'gold'
);

-- 8. PARISH USERS TABLE
CREATE TABLE IF NOT EXISTS parish_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  role TEXT NOT NULL DEFAULT 'parishioner' CHECK (role IN ('parishioner', 'catechist', 'choir_leader', 'pastor')),
  registered_date TEXT NOT NULL
);

-- 9. PDF DOCUMENTS TABLE (NEW) — datewise, language-specific
CREATE TABLE IF NOT EXISTS pdf_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  date TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('morning', 'noon', 'evening', 'night', 'office', 'saints', 'readings')),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ta')),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  content_type TEXT DEFAULT 'application/pdf',
  uploaded_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(date, category, language)
);

-- Enable Row Level Security
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE saints ENABLE ROW LEVEL SECURITY;
ALTER TABLE liturgical_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE parish_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_documents ENABLE ROW LEVEL SECURITY;

-- Grant table-level privileges to database roles (required before RLS policies work)
GRANT SELECT ON prayers TO anon;
GRANT ALL ON prayers TO authenticated;
GRANT SELECT ON saints TO anon;
GRANT ALL ON saints TO authenticated;
GRANT SELECT ON liturgical_days TO anon;
GRANT ALL ON liturgical_days TO authenticated;
GRANT SELECT ON office_readings TO anon;
GRANT ALL ON office_readings TO authenticated;
GRANT ALL ON journal_entries TO authenticated;
GRANT ALL ON bookmarks TO authenticated;
GRANT SELECT ON announcements TO anon;
GRANT ALL ON announcements TO authenticated;
GRANT SELECT ON parish_users TO anon;
GRANT ALL ON parish_users TO authenticated;
GRANT SELECT ON pdf_documents TO anon;
GRANT ALL ON pdf_documents TO authenticated;

-- RLS: Public read for public collections
DROP POLICY IF EXISTS "Public read prayers" ON prayers; CREATE POLICY "Public read prayers" ON prayers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read saints" ON saints; CREATE POLICY "Public read saints" ON saints FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read liturgical_days" ON liturgical_days; CREATE POLICY "Public read liturgical_days" ON liturgical_days FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read office_readings" ON office_readings; CREATE POLICY "Public read office_readings" ON office_readings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read announcements" ON announcements; CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read parish_users" ON parish_users; CREATE POLICY "Public read parish_users" ON parish_users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read pdf_documents" ON pdf_documents; CREATE POLICY "Public read pdf_documents" ON pdf_documents FOR SELECT USING (true);

-- RLS: Authenticated users can create/update/delete public collections
DROP POLICY IF EXISTS "Auth insert prayers" ON prayers; CREATE POLICY "Auth insert prayers" ON prayers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth update prayers" ON prayers; CREATE POLICY "Auth update prayers" ON prayers FOR UPDATE USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth delete prayers" ON prayers; CREATE POLICY "Auth delete prayers" ON prayers FOR DELETE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth insert saints" ON saints; CREATE POLICY "Auth insert saints" ON saints FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth update saints" ON saints; CREATE POLICY "Auth update saints" ON saints FOR UPDATE USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth delete saints" ON saints; CREATE POLICY "Auth delete saints" ON saints FOR DELETE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth insert liturgical_days" ON liturgical_days; CREATE POLICY "Auth insert liturgical_days" ON liturgical_days FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth update liturgical_days" ON liturgical_days; CREATE POLICY "Auth update liturgical_days" ON liturgical_days FOR UPDATE USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth delete liturgical_days" ON liturgical_days; CREATE POLICY "Auth delete liturgical_days" ON liturgical_days FOR DELETE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth insert office_readings" ON office_readings; CREATE POLICY "Auth insert office_readings" ON office_readings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth update office_readings" ON office_readings; CREATE POLICY "Auth update office_readings" ON office_readings FOR UPDATE USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth delete office_readings" ON office_readings; CREATE POLICY "Auth delete office_readings" ON office_readings FOR DELETE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth insert announcements" ON announcements; CREATE POLICY "Auth insert announcements" ON announcements FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth update announcements" ON announcements; CREATE POLICY "Auth update announcements" ON announcements FOR UPDATE USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth delete announcements" ON announcements; CREATE POLICY "Auth delete announcements" ON announcements FOR DELETE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth insert parish_users" ON parish_users; CREATE POLICY "Auth insert parish_users" ON parish_users FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth update parish_users" ON parish_users; CREATE POLICY "Auth update parish_users" ON parish_users FOR UPDATE USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth delete parish_users" ON parish_users; CREATE POLICY "Auth delete parish_users" ON parish_users FOR DELETE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth insert pdf_documents" ON pdf_documents; CREATE POLICY "Auth insert pdf_documents" ON pdf_documents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth update pdf_documents" ON pdf_documents; CREATE POLICY "Auth update pdf_documents" ON pdf_documents FOR UPDATE USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth delete pdf_documents" ON pdf_documents; CREATE POLICY "Auth delete pdf_documents" ON pdf_documents FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS: User-scoped policies for journal_entries and bookmarks
DROP POLICY IF EXISTS "User journal entries select" ON journal_entries; CREATE POLICY "User journal entries select" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "User journal entries insert" ON journal_entries; CREATE POLICY "User journal entries insert" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "User journal entries update" ON journal_entries; CREATE POLICY "User journal entries update" ON journal_entries FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "User journal entries delete" ON journal_entries; CREATE POLICY "User journal entries delete" ON journal_entries FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User bookmarks select" ON bookmarks; CREATE POLICY "User bookmarks select" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "User bookmarks insert" ON bookmarks; CREATE POLICY "User bookmarks insert" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "User bookmarks update" ON bookmarks; CREATE POLICY "User bookmarks update" ON bookmarks FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "User bookmarks delete" ON bookmarks; CREATE POLICY "User bookmarks delete" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prayers_category ON prayers(category);
CREATE INDEX IF NOT EXISTS idx_saints_feast_date ON saints(feast_date);
CREATE INDEX IF NOT EXISTS idx_liturgical_days_date ON liturgical_days(date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_documents_category ON pdf_documents(category);
CREATE INDEX IF NOT EXISTS idx_pdf_documents_created_at ON pdf_documents(created_at DESC);

-- Migrate existing pdf_documents table if already created with old schema
ALTER TABLE pdf_documents ADD COLUMN IF NOT EXISTS date TEXT NOT NULL DEFAULT '';
ALTER TABLE pdf_documents ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ta'));
ALTER TABLE pdf_documents ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
ALTER TABLE pdf_documents DROP CONSTRAINT IF EXISTS pdf_documents_date_category_language_key;
ALTER TABLE pdf_documents ADD CONSTRAINT pdf_documents_date_category_language_key UNIQUE (date, category, language);
-- Drop old columns if they exist from previous schema
ALTER TABLE pdf_documents DROP COLUMN IF EXISTS title_en;
ALTER TABLE pdf_documents DROP COLUMN IF EXISTS title_ta;

-- Migrate existing prayers table to fix id type and add date column
ALTER TABLE prayers ALTER COLUMN id TYPE TEXT;
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS date TEXT NOT NULL DEFAULT '';
ALTER TABLE prayers DROP CONSTRAINT IF EXISTS prayers_date_category_key;
ALTER TABLE prayers ADD CONSTRAINT prayers_date_category_key UNIQUE (date, category);

-- Create index for date-based prayer lookups
CREATE INDEX IF NOT EXISTS idx_prayers_date ON prayers(date);

-- Realtime for pdf_documents (so users see new PDFs instantly)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'pdf_documents' AND schemaname = 'public') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE pdf_documents;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'announcements' AND schemaname = 'public') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'prayers' AND schemaname = 'public') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE prayers;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'saints' AND schemaname = 'public') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE saints;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'liturgical_days' AND schemaname = 'public') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE liturgical_days;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'office_readings' AND schemaname = 'public') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE office_readings;
  END IF;
END;
$$;

-- =============================================================================
-- STORAGE: Create the 'pdfs' bucket and set RLS policies
-- Run this AFTER creating the bucket via SQL below or via the Dashboard.
-- =============================================================================
-- First, create the storage bucket (if not already created via Dashboard)
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('pdfs', 'pdfs', true, false, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read access for pdfs
DROP POLICY IF EXISTS "Public read pdfs" ON storage.objects;
CREATE POLICY "Public read pdfs"
ON storage.objects FOR SELECT
USING (bucket_id = 'pdfs');

-- Storage RLS: Authenticated users can upload pdfs
DROP POLICY IF EXISTS "Authenticated upload pdfs" ON storage.objects;
CREATE POLICY "Authenticated upload pdfs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pdfs' AND auth.uid() IS NOT NULL);

-- Storage RLS: Authenticated users can update pdfs
DROP POLICY IF EXISTS "Authenticated update pdfs" ON storage.objects;
CREATE POLICY "Authenticated update pdfs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pdfs' AND auth.uid() IS NOT NULL);

-- Storage RLS: Authenticated users can delete pdfs
DROP POLICY IF EXISTS "Authenticated delete pdfs" ON storage.objects;
CREATE POLICY "Authenticated delete pdfs"
ON storage.objects FOR DELETE
USING (bucket_id = 'pdfs' AND auth.uid() IS NOT NULL);
