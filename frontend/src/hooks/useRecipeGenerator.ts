import { useState } from 'react';
import { recipeApi, RecipeGenerationRequest } from '../services/recipeApi';
import { Recipe } from '../types/recipe';
import { APIClientError } from '../services/api';

interface UseRecipeGeneratorState {
    recipe: Recipe | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

interface UseRecipeGeneratorReturn extends UseRecipeGeneratorState {
    generateRecipe: (request: RecipeGenerationRequest) => Promise<void>;
    reset: () => void;
}

/**
 * Custom hook for recipe generation
 * Handles API calls, loading states, and error handling
 */
export function useRecipeGenerator(): UseRecipeGeneratorReturn {
    const [state, setState] = useState<UseRecipeGeneratorState>({
        recipe: null,
        loading: false,
        error: null,
        success: false,
    });

    const generateRecipe = async (request: RecipeGenerationRequest) => {
        // Validate request
        if (!request.ingredients || request.ingredients.length === 0) {
            setState(prev => ({
                ...prev,
                error: 'Please add at least one ingredient',
            }));
            return;
        }

        // Start loading
        setState({
            recipe: null,
            loading: true,
            error: null,
            success: false,
        });

        try {
            const response = await recipeApi.generateRecipe(request);

            setState({
                recipe: response.data,
                loading: false,
                error: null,
                success: true,
            });
        } catch (err) {
            let errorMessage = 'Failed to generate recipe. Please try again.';

            if (err instanceof APIClientError) {
                errorMessage = err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setState({
                recipe: null,
                loading: false,
                error: errorMessage,
                success: false,
            });
        }
    };

    const reset = () => {
        setState({
            recipe: null,
            loading: false,
            error: null,
            success: false,
        });
    };

    return {
        ...state,
        generateRecipe,
        reset,
    };
}

export default useRecipeGenerator;
