import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecipeMatches } from './RecipeMatches';
import { RecipeMatches as RecipeMatchesType, Recipe } from '../../types/recipe';

describe('RecipeMatches', () => {
    const mockRecipe: Recipe = {
        id: '1',
        title: 'Tomato Chicken',
        description: 'A delicious recipe',
        ingredients: [
            { name: 'tomatoes', quantity: '2', unit: 'lbs' },
            { name: 'chicken', quantity: '1', unit: 'lb' },
        ],
        instructions: ['Step 1', 'Step 2'],
        cooking_time_minutes: 30,
        servings: 4,
        difficulty: 'easy',
        dietary_tags: ['gluten-free'],
        created_at: '2024-01-01T00:00:00Z',
    };

    const mockMatches: RecipeMatchesType = {
        exact_matches: [mockRecipe],
        partial_matches: [],
    };

    it('should render loading state', () => {
        render(<RecipeMatches matches={null} loading={true} />);

        expect(screen.getByText(/finding matching recipes/i)).toBeInTheDocument();
    });

    it('should render empty state when no matches', () => {
        const emptyMatches: RecipeMatchesType = {
            exact_matches: [],
            partial_matches: [],
        };

        render(<RecipeMatches matches={emptyMatches} loading={false} />);

        expect(screen.getByText(/no matching recipes found/i)).toBeInTheDocument();
    });

    it('should render exact matches', () => {
        render(<RecipeMatches matches={mockMatches} loading={false} />);

        expect(screen.getByText(/perfect matches/i)).toBeInTheDocument();
        expect(screen.getByText('Tomato Chicken')).toBeInTheDocument();
        expect(screen.getByText('A delicious recipe')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should render partial matches', () => {
        const partialMatches: RecipeMatchesType = {
            exact_matches: [],
            partial_matches: [mockRecipe],
        };

        render(<RecipeMatches matches={partialMatches} loading={false} />);

        expect(screen.getByText(/partial matches/i)).toBeInTheDocument();
        expect(screen.getByText('Tomato Chicken')).toBeInTheDocument();
        expect(screen.queryByText('100%')).not.toBeInTheDocument();
    });

    it('should display recipe details', () => {
        render(<RecipeMatches matches={mockMatches} loading={false} />);

        expect(screen.getByText('30 min')).toBeInTheDocument();
        expect(screen.getByText('easy')).toBeInTheDocument();
        expect(screen.getByText('4 servings')).toBeInTheDocument();
        expect(screen.getByText('gluten-free')).toBeInTheDocument();
    });

    it('should render both exact and partial matches', () => {
        const mixedMatches: RecipeMatchesType = {
            exact_matches: [mockRecipe],
            partial_matches: [{ ...mockRecipe, id: '2', title: 'Another Recipe' }],
        };

        render(<RecipeMatches matches={mixedMatches} loading={false} />);

        expect(screen.getByText(/perfect matches/i)).toBeInTheDocument();
        expect(screen.getByText(/partial matches/i)).toBeInTheDocument();
        expect(screen.getByText('Tomato Chicken')).toBeInTheDocument();
        expect(screen.getByText('Another Recipe')).toBeInTheDocument();
    });
});
