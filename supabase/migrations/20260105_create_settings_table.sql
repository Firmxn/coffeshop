-- Migration: Create settings table for store information
-- This table stores dynamic store settings that can be managed from admin panel

CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Store Information
    store_name TEXT NOT NULL DEFAULT 'ARCoffee',
    store_tagline TEXT DEFAULT 'Kopi Premium, Sesuai Seleramu',
    store_description TEXT DEFAULT 'Nikmati pengalaman kopi premium dengan kustomisasi sesuai selera Anda.',
    
    -- Contact Information
    phone TEXT NOT NULL DEFAULT '+62 812-3456-7890',
    email TEXT NOT NULL DEFAULT 'hello@arcoffee.com',
    address TEXT NOT NULL DEFAULT 'Jl. Kopi Nikmat No. 123',
    city TEXT NOT NULL DEFAULT 'Jakarta Selatan',
    postal_code TEXT DEFAULT '12345',
    
    -- Operating Hours
    operating_hours JSONB DEFAULT '{"monday": "08:00-22:00", "tuesday": "08:00-22:00", "wednesday": "08:00-22:00", "thursday": "08:00-22:00", "friday": "08:00-22:00", "saturday": "08:00-22:00", "sunday": "08:00-22:00"}'::jsonb,
    operating_hours_text TEXT DEFAULT 'Setiap hari, 08:00 - 22:00 WIB',
    
    -- Social Media
    instagram_url TEXT DEFAULT 'https://instagram.com/arcoffee',
    facebook_url TEXT DEFAULT 'https://facebook.com/arcoffee',
    twitter_url TEXT DEFAULT 'https://twitter.com/arcoffee',
    
    -- Additional Info
    google_maps_url TEXT,
    whatsapp_number TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_settings_updated_at ON settings(updated_at DESC);

-- Insert default settings (only one row should exist)
INSERT INTO settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read settings
CREATE POLICY "Settings are viewable by everyone"
    ON settings FOR SELECT
    USING (true);

-- Policy: Only authenticated users can update settings (admin only in practice)
CREATE POLICY "Settings are updatable by authenticated users"
    ON settings FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_settings_updated_at();

-- Comment
COMMENT ON TABLE settings IS 'Store settings and information managed from admin panel';
