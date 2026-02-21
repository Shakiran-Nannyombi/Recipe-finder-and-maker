-- Recipe AI Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    ingredients JSONB NOT NULL,
    instructions JSONB NOT NULL,
    cooking_time_minutes INTEGER NOT NULL,
    servings INTEGER NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    cuisine_type TEXT,
    dietary_tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    embedding VECTOR(384),  -- For sentence-transformers embeddings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for recipes
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine_type ON recipes(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary_tags ON recipes USING GIN(dietary_tags);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'default_user',
    ingredient_name TEXT NOT NULL,
    quantity TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, ingredient_name)
);

-- Create indexes for inventory
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_ingredient_name ON inventory(ingredient_name);

-- Row Level Security (RLS) policies
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Allow public read access to recipes
CREATE POLICY "Allow public read access to recipes"
    ON recipes FOR SELECT
    USING (true);

-- Allow authenticated insert/update/delete for recipes
CREATE POLICY "Allow authenticated insert for recipes"
    ON recipes FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update for recipes"
    ON recipes FOR UPDATE
    USING (true);

CREATE POLICY "Allow authenticated delete for recipes"
    ON recipes FOR DELETE
    USING (true);

-- Allow users to manage their own inventory
CREATE POLICY "Users can view their own inventory"
    ON inventory FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own inventory"
    ON inventory FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own inventory"
    ON inventory FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete their own inventory"
    ON inventory FOR DELETE
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
