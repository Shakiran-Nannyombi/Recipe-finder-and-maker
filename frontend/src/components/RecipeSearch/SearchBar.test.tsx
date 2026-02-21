import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
    it('renders with default placeholder', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value=""
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );

        const input = screen.getByLabelText('Recipe search input');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Search for recipes...');
    });

    it('renders with custom placeholder', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value=""
                onChange={mockOnChange}
                onSearch={mockOnSearch}
                placeholder="Find your recipe"
            />
        );

        const input = screen.getByLabelText('Recipe search input');
        expect(input).toHaveAttribute('placeholder', 'Find your recipe');
    });

    it('calls onChange when input value changes', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value=""
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );

        const input = screen.getByLabelText('Recipe search input');
        fireEvent.change(input, { target: { value: 'pasta' } });

        expect(mockOnChange).toHaveBeenCalledWith('pasta');
    });

    it('calls onSearch when search button is clicked with non-empty value', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value="chicken"
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );

        const button = screen.getByLabelText('Search recipes');
        fireEvent.click(button);

        expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    it('does not call onSearch when search button is clicked with empty value', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value=""
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );

        const button = screen.getByLabelText('Search recipes');
        fireEvent.click(button);

        expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('calls onSearch when Enter key is pressed with non-empty value', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value="pizza"
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );

        const input = screen.getByLabelText('Recipe search input');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    it('does not call onSearch when Enter key is pressed with empty value', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value=""
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );

        const input = screen.getByLabelText('Recipe search input');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('disables input and button when disabled prop is true', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value="test"
                onChange={mockOnChange}
                onSearch={mockOnSearch}
                disabled={true}
            />
        );

        const input = screen.getByLabelText('Recipe search input');
        const button = screen.getByLabelText('Search recipes');

        expect(input).toBeDisabled();
        expect(button).toBeDisabled();
    });

    it('disables button when value is only whitespace', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value="   "
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );

        const button = screen.getByLabelText('Search recipes');
        expect(button).toBeDisabled();
    });

    it('displays the current value in the input', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value="spaghetti"
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );

        const input = screen.getByLabelText('Recipe search input') as HTMLInputElement;
        expect(input.value).toBe('spaghetti');
    });

    it('displays ingredient filter chips when selectedIngredients is provided', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();
        const mockOnIngredientRemove = vi.fn();

        render(
            <SearchBar
                value=""
                onChange={mockOnChange}
                onSearch={mockOnSearch}
                selectedIngredients={['chicken', 'tomatoes', 'garlic']}
                onIngredientRemove={mockOnIngredientRemove}
            />
        );

        expect(screen.getByText('Filters:')).toBeInTheDocument();
        expect(screen.getByText('chicken')).toBeInTheDocument();
        expect(screen.getByText('tomatoes')).toBeInTheDocument();
        expect(screen.getByText('garlic')).toBeInTheDocument();
    });

    it('does not display filter chips when selectedIngredients is empty', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value=""
                onChange={mockOnChange}
                onSearch={mockOnSearch}
                selectedIngredients={[]}
            />
        );

        expect(screen.queryByText('Filters:')).not.toBeInTheDocument();
    });

    it('calls onIngredientRemove when remove button is clicked on a chip', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();
        const mockOnIngredientRemove = vi.fn();

        render(
            <SearchBar
                value=""
                onChange={mockOnChange}
                onSearch={mockOnSearch}
                selectedIngredients={['chicken', 'tomatoes']}
                onIngredientRemove={mockOnIngredientRemove}
            />
        );

        const removeButton = screen.getByLabelText('Remove chicken filter');
        fireEvent.click(removeButton);

        expect(mockOnIngredientRemove).toHaveBeenCalledWith('chicken');
    });

    it('does not display remove buttons when onIngredientRemove is not provided', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value=""
                onChange={mockOnChange}
                onSearch={mockOnSearch}
                selectedIngredients={['chicken']}
            />
        );

        expect(screen.getByText('chicken')).toBeInTheDocument();
        expect(screen.queryByLabelText('Remove chicken filter')).not.toBeInTheDocument();
    });

    it('capitalizes ingredient names in filter chips', () => {
        const mockOnChange = vi.fn();
        const mockOnSearch = vi.fn();

        render(
            <SearchBar
                value=""
                onChange={mockOnChange}
                onSearch={mockOnSearch}
                selectedIngredients={['chicken', 'tomatoes']}
            />
        );

        const chickenChip = screen.getByText('chicken');
        const tomatoesChip = screen.getByText('tomatoes');

        expect(chickenChip).toHaveClass('capitalize');
        expect(tomatoesChip).toHaveClass('capitalize');
    });
});
