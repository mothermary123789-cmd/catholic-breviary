-- Add extracted text columns to pdf_documents
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

ALTER TABLE pdf_documents ADD COLUMN IF NOT EXISTS extracted_text TEXT;
ALTER TABLE pdf_documents ADD COLUMN IF NOT EXISTS page_count INTEGER DEFAULT 0;
