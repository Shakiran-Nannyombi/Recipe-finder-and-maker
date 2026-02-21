import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeGrid from './RecipeGrid';
import { Recipe } from '../../types/recipe';

const mockRecipes: Recipe[] = [
    {
        id: '1',
        title: 'Spaghetti Carbonara',
        description: 'A classic Italian pasta dish',
        ingredients: [{ name: 'spaghetti', quantity: '400', unit: 'g' }],
        instructions: ['Boil pasta', 'Mix eggs and cheese'],
        cooking_time_minutes: 30,
        servings: 4,
        difficulty: 'medium',
        cuisine_type: 'Italian',
        dietary_tags: ['vegetarian'],
        image_url: 'https://example.com/image1.jpg',
        created_at: '2024-01-01T00:00:00Z',
    },
    {
        id: '2',
        title: 'Chicken Stir Fry',
        description: 'Quick and easy Asian-inspired dish',
        ingredients: [{ name: 'chicken', quantity: '500', unit: 'g' }],
        instructions: ['Cut chicken', 'Stir fry'],
        cooking_time_minutes: 20,
        servings: 2,
        difficulty: 'easy',
        cuisine_type: 'Asian',
        dietary_tags: [],
        created_at: '2024-01-02T00:00:00Z',
    },
    {
        id: '3',
        title: 'Beef Wellington',
        description: 'Elegant and sophisticated main course',
        ingredients: [{ name: 'beef', quantity: '1', unit: 'kg' }],
        instructions: ['Prepare beef', 'Wrap in pastry', 'Bake'],
        cooking_time_minutes: 90,
        servings: 6,
        difficulty: 'hard',
        cuisine_type: 'British',
        dietary_tags: [],
        created_at: '2024-01-03T00:00:00Z',
    },
];

describe('RecipeGrid', () => {
    it('renders multiple recipe cards in a grid', () => {
        render(<RecipeGrid recipes={mockRecipes} />);

        expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
        expect(screen.getByText('Chicken Stir Fry')).toBeInTheDocument();
        expect(screen.getByText('Beef Wellington')).toBeInTheDocument();
    });

    it('displays empty state when no recipes are provided', () => {
        render(<RecipeGrid recipes={[]} />);

        expect(
            screen.getByText('No recipes found. Try adjusting your search criteria.')
        ).toBeInTheDocument();
    });

    it('displays custom empty message when provided', () => {
        const customMessage = 'Start searching for delicious recipes!';
        render(<RecipeGrid recipes={[]} emptyMessage={customMessage} />);

        expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('displays loading skeleton when isLoading is true', () => {
        render(<RecipeGrid recipes={[]} isLoading={true} />);

        const loadingElements = screen.getAllByLabelText('Loading recipe');
        expect(loadingElements).toHaveLength(6);
    });

    it('calls onRecipeClick handler when a recipe card is clicked', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(<RecipeGrid recipes={mockRecipes} onRecipeClick={handleClick} />);

        const firstCard = screen.getByRole('button', { name: /view recipe: spaghetti carbonara/i });
        await user.click(firstCard);

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith(mockRecipes[0]);
    });

    it('renders with correct grid layout classes', () => {
        const { container } = render(<RecipeGrid recipes={mockRecipes} />);

        const grid = container.querySelector('.grid');
        expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
    });

    it('renders correct number of recipe cards', () => {
        render(<RecipeGrid recipes={mockRecipes} />);

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
    });

    it('has proper ARIA labels for accessibility', () => {
        render(<RecipeGrid recipes={mockRecipes} />);

        expect(screen.getByRole('list', { name: 'Recipe results' })).toBeInTheDocument();
    });

    it('does not render recipe cards when loading', () => {
        render(<RecipeGrid recipes={mockRecipes} isLoading={true} />);

        expect(screen.queryByText('Spaghetti Carbonara')).not.toBeInTheDocument();
        expect(screen.queryByText('Chicken Stir Fry')).not.toBeInTheDocument();
    });

    it('renders single recipe correctly', () => {
        render(<RecipeGrid recipes={[mockRecipes[0]]} />);

        expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
        expect(screen.queryByText('Chicken Stir Fry')).not.toBeInTheDocument();
    });

    it('handles missing onRecipeClick gracefully', async () => {
        const user = userEvent.setup();
        render(<RecipeGrid recipes={mockRecipes} />);

        const firstCard = screen.getByRole('button', { name: /view recipe: spaghetti carbonara/i });
        await user.click(firstCard);

        // Should not throw error
        expect(firstCard).toBeInTheDocument();
    });

    describe('Pagination', () => {
        it('does not render pagination when totalPages is 1', () => {
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={1}
                    totalPages={1}
                    onPageChange={vi.fn()}
                />
            );

            expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
        });

        it('does not render pagination when onPageChange is not provided', () => {
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={1}
                    totalPages={5}
                />
            );

            expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
        });

        it('renders pagination controls when totalPages > 1 and onPageChange is provided', () => {
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={2}
                    totalPages={5}
                    onPageChange={vi.fn()}
                />
            );

            expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
            expect(screen.getByLabelText('Next page')).toBeInTheDocument();
            expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
        });

        it('disables Previous button on first page', () => {
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={1}
                    totalPages={5}
                    onPageChange={vi.fn()}
                />
            );

            const prevButton = screen.getByLabelText('Previous page');
            expect(prevButton).toBeDisabled();
        });

        it('disables Next button on last page', () => {
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={5}
                    totalPages={5}
                    onPageChange={vi.fn()}
                />
            );

            const nextButton = screen.getByLabelText('Next page');
            expect(nextButton).toBeDisabled();
        });

        it('calls onPageChange with correct page when Previous is clicked', async () => {
            const user = userEvent.setup();
            const handlePageChange = vi.fn();
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={3}
                    totalPages={5}
                    onPageChange={handlePageChange}
                />
            );

            const prevButton = screen.getByLabelText('Previous page');
            await user.click(prevButton);

            expect(handlePageChange).toHaveBeenCalledWith(2);
        });

        it('calls onPageChange with correct page when Next is clicked', async () => {
            const user = userEvent.setup();
            const handlePageChange = vi.fn();
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={3}
                    totalPages={5}
                    onPageChange={handlePageChange}
                />
            );

            const nextButton = screen.getByLabelText('Next page');
            await user.click(nextButton);

            expect(handlePageChange).toHaveBeenCalledWith(4);
        });

        it('calls onPageChange when a page number is clicked', async () => {
            const user = userEvent.setup();
            const handlePageChange = vi.fn();
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={1}
                    totalPages={5}
                    onPageChange={handlePageChange}
                />
            );

            const page3Button = screen.getByLabelText('Page 3');
            await user.click(page3Button);

            expect(handlePageChange).toHaveBeenCalledWith(3);
        });

        it('highlights current page button', () => {
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={3}
                    totalPages={5}
                    onPageChange={vi.fn()}
                />
            );

            const currentPageButton = screen.getByLabelText('Page 3');
            expect(currentPageButton).toHaveClass('bg-primary', 'text-white');
            expect(currentPageButton).toHaveAttribute('aria-current', 'page');
        });

        it('renders all page numbers when totalPages <= 5', () => {
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={2}
                    totalPages={4}
                    onPageChange={vi.fn()}
                />
            );

            expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
            expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
            expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
            expect(screen.getByLabelText('Page 4')).toBeInTheDocument();
        });

        it('renders ellipsis for large page counts', () => {
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={5}
                    totalPages={10}
                    onPageChange={vi.fn()}
                />
            );

            const ellipsis = screen.getAllByText('...');
            expect(ellipsis.length).toBeGreaterThan(0);
        });

        it('shows first and last page with ellipsis in between for middle pages', () => {
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={5}
                    totalPages={10}
                    onPageChange={vi.fn()}
                />
            );

            expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
            expect(screen.getByLabelText('Page 10')).toBeInTheDocument();
            expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
        });

        it('has proper accessibility attributes', () => {
            render(
                <RecipeGrid
                    recipes={mockRecipes}
                    currentPage={2}
                    totalPages={5}
                    onPageChange={vi.fn()}
                />
            );

            const prevButton = screen.getByLabelText('Previous page');
            const nextButton = screen.getByLabelText('Next page');
            const page2Button = screen.getByLabelText('Page 2');

            expect(prevButton).toHaveAttribute('aria-label', 'Previous page');
            expect(nextButton).toHaveAttribute('aria-label', 'Next page');
            expect(page2Button).toHaveAttribute('aria-label', 'Page 2');
            expect(page2Button).toHaveAttribute('aria-current', 'page');
        });
    });
});
