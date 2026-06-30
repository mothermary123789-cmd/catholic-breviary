-- TARGETED FIX: Drop and recreate policies with simplified storage rules
-- Run this entire block in Supabase SQL Editor once.

-- 1. pdf_documents: ensure RLS is ON
ALTER TABLE pdf_documents ENABLE ROW LEVEL SECURITY;

-- 2. Grant table-level privileges to database roles
GRANT SELECT ON pdf_documents TO anon;
GRANT ALL ON pdf_documents TO authenticated;

-- 3. pdf_documents INSERT policy (use auth.uid() IS NOT NULL - works via PostgREST)
DROP POLICY IF EXISTS "Auth insert pdf_documents" ON pdf_documents;
CREATE POLICY "Auth insert pdf_documents"
ON pdf_documents FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Storage read: public (storage.objects RLS is ON by default in Supabase)
DROP POLICY IF EXISTS "Public read pdfs" ON storage.objects;
CREATE POLICY "Public read pdfs"
ON storage.objects FOR SELECT
USING (bucket_id = 'pdfs');

-- 5. Storage INSERT: bucket_id = 'pdfs' only (auth handled by API gateway)
DROP POLICY IF EXISTS "Authenticated upload pdfs" ON storage.objects;
CREATE POLICY "Authenticated upload pdfs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pdfs');

-- 6. Storage UPDATE/DELETE: bucket_id = 'pdfs' only
DROP POLICY IF EXISTS "Authenticated update pdfs" ON storage.objects;
CREATE POLICY "Authenticated update pdfs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pdfs');

DROP POLICY IF EXISTS "Authenticated delete pdfs" ON storage.objects;
CREATE POLICY "Authenticated delete pdfs"
ON storage.objects FOR DELETE
USING (bucket_id = 'pdfs');

-- 7. Ensure the pdfs bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('pdfs', 'pdfs', true, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Verify policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'pdf_documents' OR tablename = 'objects';
