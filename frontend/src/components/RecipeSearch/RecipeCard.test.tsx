import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeCard from './RecipeCard';
import { Recipe } from '../../types/recipe';

const mockRecipe: Recipe = {
    id: '1',
    title: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with eggs, cheese, and bacon',
    ingredients: [
        { name: 'spaghetti', quantity: '400', unit: 'g' },
        { name: 'eggs', quantity: '4' },
        { name: 'parmesan', quantity: '100', unit: 'g' },
    ],
    instructions: ['Boil pasta', 'Mix eggs and cheese', 'Combine'],
    cooking_time_minutes: 30,
    servings: 4,
    difficulty: 'medium',
    cuisine_type: 'Italian',
    dietary_tags: ['vegetarian'],
    image_url: 'https://example.com/image.jpg',
    created_at: '2024-01-01T00:00:00Z',
};

describe('RecipeCard', () => {
    it('renders recipe information correctly', () => {
        render(<RecipeCard recipe={mockRecipe} />);

        expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
        expect(
            screen.getByText('A classic Italian pasta dish with eggs, cheese, and bacon')
        ).toBeInTheDocument();
        expect(screen.getByText(/30/)).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('displays recipe image when image_url is provided', () => {
        render(<RecipeCard recipe={mockRecipe} />);

        const image = screen.getByAltText('Spaghetti Carbonara');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('displays placeholder when no image_url is provided', () => {
        const recipeWithoutImage = { ...mockRecipe, image_url: undefined };
        render(<RecipeCard recipe={recipeWithoutImage} />);

        expect(screen.queryByAltText('Spaghetti Carbonara')).not.toBeInTheDocument();
        // The card itself is a button with role="button"
        expect(screen.getByRole('button', { name: /view recipe: spaghetti carbonara/i })).toBeInTheDocument();
    });

    it('does not display dietary tags in card view', () => {
        render(<RecipeCard recipe={mockRecipe} />);

        // Dietary tags are not displayed in the card view
        expect(screen.queryByText('vegetarian')).not.toBeInTheDocument();
        expect(screen.queryByText('Vegetarian')).not.toBeInTheDocument();
    });

    it('calls onClick handler when card is clicked', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(<RecipeCard recipe={mockRecipe} onClick={handleClick} />);

        const card = screen.getByRole('button', { name: /view recipe: spaghetti carbonara/i });
        await user.click(card);

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith(mockRecipe);
    });

    it('calls onClick handler when Enter key is pressed', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(<RecipeCard recipe={mockRecipe} onClick={handleClick} />);

        const card = screen.getByRole('button', { name: /view recipe: spaghetti carbonara/i });
        card.focus();
        await user.keyboard('{Enter}');

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith(mockRecipe);
    });

    it('calls onClick handler when Space key is pressed', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(<RecipeCard recipe={mockRecipe} onClick={handleClick} />);

        const card = screen.getByRole('button', { name: /view recipe: spaghetti carbonara/i });
        card.focus();
        await user.keyboard(' ');

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith(mockRecipe);
    });

    it('does not crash when onClick is not provided', async () => {
        const user = userEvent.setup();
        render(<RecipeCard recipe={mockRecipe} />);

        const card = screen.getByRole('button', { name: /view recipe: spaghetti carbonara/i });
        await user.click(card);

        // Should not throw error
        expect(card).toBeInTheDocument();
    });

    it('displays correct difficulty badge for easy recipes', () => {
        const easyRecipe = { ...mockRecipe, difficulty: 'easy' as const };
        render(<RecipeCard recipe={easyRecipe} />);

        // Difficulty is capitalized
        expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    it('displays correct difficulty badge for hard recipes', () => {
        const hardRecipe = { ...mockRecipe, difficulty: 'hard' as const };
        render(<RecipeCard recipe={hardRecipe} />);

        // Difficulty is capitalized
        expect(screen.getByText('Hard')).toBeInTheDocument();
    });

    it('does not display dietary tags section when no tags are present', () => {
        const recipeWithoutTags = { ...mockRecipe, dietary_tags: [] };
        render(<RecipeCard recipe={recipeWithoutTags} />);

        expect(screen.queryByText('vegetarian')).not.toBeInTheDocument();
    });

    it('is keyboard accessible', () => {
        render(<RecipeCard recipe={mockRecipe} />);

        const card = screen.getByRole('button', { name: /view recipe: spaghetti carbonara/i });
        expect(card).toHaveAttribute('tabIndex', '0');
    });
});
