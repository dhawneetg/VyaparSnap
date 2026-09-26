-- ==============================================================================
-- VyaparSnap: Supabase Multi-Device Cloud Sync Schema
-- Run this script in your Supabase project's SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Stores Profile Table
CREATE TABLE IF NOT EXISTS public.stores (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT,
  upi_vpa TEXT,
  business_type TEXT DEFAULT 'kirana',
  custom_type_name TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Products Catalog Table
CREATE TABLE IF NOT EXISTS public.products (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'General Items',
  icon TEXT DEFAULT '📦',
  is_frequent BOOLEAN DEFAULT false,
  unit TEXT DEFAULT 'pack',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, product_id)
);

-- 3. Daily Ledger Entries Table
CREATE TABLE IF NOT EXISTS public.daily_entries (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date TEXT NOT NULL, -- 'YYYY-MM-DD'
  sales NUMERIC NOT NULL DEFAULT 0,
  expenses NUMERIC NOT NULL DEFAULT 0,
  cash_sales NUMERIC DEFAULT 0,
  upi_sales NUMERIC DEFAULT 0,
  khata_sales NUMERIC DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, entry_date)
);

-- 4. Customer Khata Credit Records Table
CREATE TABLE IF NOT EXISTS public.khata_records (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  record_date TEXT NOT NULL,
  notes TEXT,
  is_settled BOOLEAN DEFAULT false,
  settled_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, record_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures merchants can strictly only access and modify their own store's data
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khata_records ENABLE ROW LEVEL SECURITY;

-- Stores policies
CREATE POLICY "Merchants can view their own store" 
  ON public.stores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Merchants can insert/update their own store" 
  ON public.stores FOR ALL USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Merchants can view their own products" 
  ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Merchants can insert/update their own products" 
  ON public.products FOR ALL USING (auth.uid() = user_id);

-- Daily Entries policies
CREATE POLICY "Merchants can view their own entries" 
  ON public.daily_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Merchants can insert/update their own entries" 
  ON public.daily_entries FOR ALL USING (auth.uid() = user_id);

-- Khata Records policies
CREATE POLICY "Merchants can view their own khata" 
  ON public.khata_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Merchants can insert/update their own khata" 
  ON public.khata_records FOR ALL USING (auth.uid() = user_id);
