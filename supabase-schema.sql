-- ============================================================
-- STYLE PLATFORM — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: outfits
-- ============================================================
CREATE TABLE outfits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  main_image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: products (Affiliate Items)
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('top', 'bottom', 'shoes', 'accessory')),
  title TEXT NOT NULL,
  image_url TEXT,
  affiliate_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEX: speed up lookups
-- ============================================================
CREATE INDEX idx_outfits_category ON outfits(category_id);
CREATE INDEX idx_outfits_published ON outfits(is_published);
CREATE INDEX idx_products_outfit ON products(outfit_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public can read published outfits"
  ON outfits FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (true);

-- ADMIN WRITE policies (authenticated users only)
CREATE POLICY "Admin can insert categories"
  ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update categories"
  ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete categories"
  ON categories FOR DELETE
  TO authenticated USING (true);

CREATE POLICY "Admin can insert outfits"
  ON outfits FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update outfits"
  ON outfits FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete outfits"
  ON outfits FOR DELETE
  TO authenticated USING (true);

-- Admin needs to read ALL outfits (including unpublished)
CREATE POLICY "Admin can read all outfits"
  ON outfits FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin can insert products"
  ON products FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update products"
  ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete products"
  ON products FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- STORAGE: Create bucket and policies
-- Run this AFTER the tables are created
-- ============================================================

-- Create the storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('style-images', 'style-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'style-images');

-- Allow authenticated users to upload images
CREATE POLICY "Admin can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'style-images');

-- Allow authenticated users to update images
CREATE POLICY "Admin can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'style-images');

-- Allow authenticated users to delete images
CREATE POLICY "Admin can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'style-images');
