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
