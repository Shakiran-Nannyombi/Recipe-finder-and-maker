import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GeneratedRecipe from './GeneratedRecipe';
import { Recipe } from '../../types/recipe';

describe('GeneratedRecipe', () => {
    const mockRecipe: Recipe = {
        id: '1',
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        ingredients: [
            { name: 'chicken', quantity: '500', unit: 'g' },
            { name: 'rice', quantity: '2', unit: 'cups' },
        ],
        instructions: [
            'Cook the chicken',
            'Prepare the rice',
            'Combine and serve',
        ],
        cooking_time_minutes: 30,
        servings: 4,
        difficulty: 'easy',
        cuisine_type: 'italian',
        dietary_tags: ['gluten-free'],
        created_at: '2024-01-01T00:00:00Z',
    };

    it('renders recipe title and description', () => {
        render(<GeneratedRecipe recipe={mockRecipe} />);

        expect(screen.getByText('Test Recipe')).toBeInTheDocument();
        expect(screen.getByText('A delicious test recipe')).toBeInTheDocument();
    });

    it('displays cooking time and servings', () => {
        render(<GeneratedRecipe recipe={mockRecipe} />);

        expect(screen.getByText('30 mins')).toBeInTheDocument();
        expect(screen.getByText('4 servings')).toBeInTheDocument();
    });

    it('displays difficulty level', () => {
        render(<GeneratedRecipe recipe={mockRecipe} />);

        expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    it('displays cuisine type', () => {
        render(<GeneratedRecipe recipe={mockRecipe} />);

        expect(screen.getByText('Italian')).toBeInTheDocument();
    });

    it('displays dietary tags', () => {
        render(<GeneratedRecipe recipe={mockRecipe} />);

        expect(screen.getByText('Gluten Free')).toBeInTheDocument();
    });

    it('displays all ingredients', () => {
        render(<GeneratedRecipe recipe={mockRecipe} />);

        expect(screen.getByText(/500.*g.*chicken/i)).toBeInTheDocument();
        expect(screen.getByText(/2.*cups.*rice/i)).toBeInTheDocument();
    });

    it('displays all instructions in order', () => {
        render(<GeneratedRecipe recipe={mockRecipe} />);

        expect(screen.getByText('Cook the chicken')).toBeInTheDocument();
        expect(screen.getByText('Prepare the rice')).toBeInTheDocument();
        expect(screen.getByText('Combine and serve')).toBeInTheDocument();
    });

    it('shows save button when onSave is provided', () => {
        const onSave = vi.fn();
        render(<GeneratedRecipe recipe={mockRecipe} onSave={onSave} />);

        const saveButton = screen.getByRole('button', { name: /save recipe/i });
        expect(saveButton).toBeInTheDocument();
    });

    it('calls onSave when save button is clicked', () => {
        const onSave = vi.fn();
        render(<GeneratedRecipe recipe={mockRecipe} onSave={onSave} />);

        const saveButton = screen.getByRole('button', { name: /save recipe/i });
        fireEvent.click(saveButton);

        expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('disables save button when saving', () => {
        render(<GeneratedRecipe recipe={mockRecipe} onSave={vi.fn()} isSaving={true} />);

        const saveButton = screen.getByRole('button', { name: /saving/i });
        expect(saveButton).toBeDisabled();
    });

    it('does not show save button when onSave is not provided', () => {
        render(<GeneratedRecipe recipe={mockRecipe} />);

        expect(screen.queryByRole('button', { name: /save recipe/i })).not.toBeInTheDocument();
    });
});
