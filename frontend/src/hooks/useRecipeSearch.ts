import { useState, useEffect, useRef, useCallback } from 'react';
import { recipeApi, SearchRequest } from '../services/recipeApi';
import { Recipe } from '../types/recipe';
import { APIClientError } from '../services/api';

interface UseRecipeSearchState {
    results: Recipe[];
    loading: boolean;
    error: string | null;
    query: string;
}

interface UseRecipeSearchReturn extends UseRecipeSearchState {
    search: (request: SearchRequest) => Promise<void>;
    debouncedSearch: (request: SearchRequest, delay?: number) => void;
    reset: () => void;
}

/**
 * Custom hook for recipe search
 * Handles API calls to /api/recipes/search endpoint
 * Manages search state (query, results, loading, error)
 * Includes debouncing functionality to prevent excessive API requests
 */
export function useRecipeSearch(): UseRecipeSearchReturn {
    const [state, setState] = useState<UseRecipeSearchState>({
        results: [],
        loading: false,
        error: null,
        query: '',
    });

    // Ref to store the timeout ID for debouncing
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const search = async (request: SearchRequest) => {
        // Validate request
        if (!request.query || request.query.trim().length === 0) {
            setState(prev => ({
                ...prev,
                error: 'Please enter a search query',
            }));
            return;
        }

        // Start loading
        setState(prev => ({
            ...prev,
            loading: true,
            error: null,
            query: request.query,
        }));

        try {
            const response = await recipeApi.searchRecipes(request);

            setState({
                results: response.data,
                loading: false,
                error: null,
                query: request.query,
            });
        } catch (err) {
            let errorMessage = 'Failed to search recipes. Please try again.';

            if (err instanceof APIClientError) {
                errorMessage = err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setState(prev => ({
                ...prev,
                results: [],
                loading: false,
                error: errorMessage,
            }));
        }
    };

    const reset = () => {
        setState({
            results: [],
            loading: false,
            error: null,
            query: '',
        });
    };

    /**
     * Debounced search function
     * Delays API calls until user stops typing
     * @param request - Search request parameters
     * @param delay - Debounce delay in milliseconds (default: 400ms)
     */
    const debouncedSearch = useCallback((request: SearchRequest, delay: number = 400) => {
        // Clear any existing timeout
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set the query immediately for UI feedback
        setState(prev => ({
            ...prev,
            query: request.query,
        }));

        // Set new timeout
        debounceTimerRef.current = setTimeout(() => {
            void search(request);
        }, delay);
    }, [search]);

    return {
        ...state,
        search,
        debouncedSearch,
        reset,
    };
}

export default useRecipeSearch;
