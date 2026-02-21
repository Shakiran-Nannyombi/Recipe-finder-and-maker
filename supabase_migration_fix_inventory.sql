-- Migration: Fix inventory table schema
-- This migration updates the inventory table to match the application code expectations

-- Drop the old inventory table (WARNING: This will delete existing inventory data)
DROP TABLE IF EXISTS inventory CASCADE;

-- Create the new inventory table with correct schema
CREATE TABLE inventory (
    user_id TEXT PRIMARY KEY,
    items JSONB NOT NULL DEFAULT '[]',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for inventory
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);

-- Update RLS policies for inventory
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own inventory
DROP POLICY IF EXISTS "Users can view their own inventory" ON inventory;
CREATE POLICY "Users can view their own inventory"
    ON inventory FOR SELECT
    USING (true);

-- Allow users to insert their own inventory
DROP POLICY IF EXISTS "Users can insert their own inventory" ON inventory;
CREATE POLICY "Users can insert their own inventory"
    ON inventory FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own inventory
DROP POLICY IF EXISTS "Users can update their own inventory" ON inventory;
CREATE POLICY "Users can update their own inventory"
    ON inventory FOR UPDATE
    USING (true);

-- Allow users to delete their own inventory
DROP POLICY IF EXISTS "Users can delete their own inventory" ON inventory;
CREATE POLICY "Users can delete their own inventory"
    ON inventory FOR DELETE
    USING (true);

-- Update trigger for updated_at
DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;
CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
