export interface Ingredient {
    name: string;
    quantity: string;
    unit?: string;
}

export interface Recipe {
    id: string;
    title: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string[];
    cooking_time_minutes: number;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    cuisine_type?: string;
    dietary_tags: string[];
    image_url?: string;
    created_at: string;
}

export interface InventoryItem {
    ingredient_name: string;
    quantity?: string;
    added_at: string;
}

export interface UserInventory {
    user_id: string;
    items: InventoryItem[];
    updated_at: string;
}

export interface RecipeMatches {
    exact_matches: Recipe[];
    partial_matches: Recipe[];
}
