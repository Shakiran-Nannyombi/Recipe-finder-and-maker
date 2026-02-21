import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IngredientInput from './IngredientInput';

describe('IngredientInput', () => {
    it('renders input field', () => {
        render(
            <IngredientInput
                ingredients={[]}
                onAdd={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        expect(screen.getByPlaceholderText(/e.g., chicken/i)).toBeInTheDocument();
    });

    it('adds ingredient when Add button is clicked', () => {
        const onAdd = vi.fn();
        render(
            <IngredientInput
                ingredients={[]}
                onAdd={onAdd}
                onRemove={vi.fn()}
            />
        );

        const input = screen.getByPlaceholderText(/e.g., chicken/i);
        const addButton = screen.getByRole('button', { name: /add ingredient/i });

        fireEvent.change(input, { target: { value: 'tomato' } });
        fireEvent.click(addButton);

        expect(onAdd).toHaveBeenCalledWith('tomato');
    });

    it('adds ingredient when Enter key is pressed', () => {
        const onAdd = vi.fn();
        render(
            <IngredientInput
                ingredients={[]}
                onAdd={onAdd}
                onRemove={vi.fn()}
            />
        );

        const input = screen.getByPlaceholderText(/e.g., chicken/i);

        fireEvent.change(input, { target: { value: 'chicken' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(onAdd).toHaveBeenCalledWith('chicken');
    });

    it('displays added ingredients', () => {
        render(
            <IngredientInput
                ingredients={['chicken', 'rice']}
                onAdd={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        expect(screen.getByText('chicken')).toBeInTheDocument();
        expect(screen.getByText('rice')).toBeInTheDocument();
    });

    it('removes ingredient when remove button is clicked', () => {
        const onRemove = vi.fn();
        render(
            <IngredientInput
                ingredients={['chicken', 'rice']}
                onAdd={vi.fn()}
                onRemove={onRemove}
            />
        );

        const removeButtons = screen.getAllByRole('button', { name: /remove/i });
        fireEvent.click(removeButtons[0]);

        expect(onRemove).toHaveBeenCalledWith(0);
    });

    it('shows empty state when no ingredients', () => {
        render(
            <IngredientInput
                ingredients={[]}
                onAdd={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        expect(screen.getByText(/no ingredients added yet/i)).toBeInTheDocument();
    });

    it('disables Add button when input is empty', () => {
        render(
            <IngredientInput
                ingredients={[]}
                onAdd={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        const addButton = screen.getByRole('button', { name: /add ingredient/i });
        expect(addButton).toBeDisabled();
    });

    it('shows autocomplete suggestions when typing', () => {
        render(
            <IngredientInput
                ingredients={[]}
                onAdd={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        const input = screen.getByPlaceholderText(/e.g., chicken/i);
        fireEvent.change(input, { target: { value: 'chi' } });

        expect(screen.getByText('chicken')).toBeInTheDocument();
    });

    it('filters suggestions based on input', () => {
        render(
            <IngredientInput
                ingredients={[]}
                onAdd={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        const input = screen.getByPlaceholderText(/e.g., chicken/i);
        fireEvent.change(input, { target: { value: 'ric' } });

        expect(screen.getByText('rice')).toBeInTheDocument();
        expect(screen.queryByText('chicken')).not.toBeInTheDocument();
    });

    it('adds ingredient when suggestion is clicked', async () => {
        const onAdd = vi.fn();
        render(
            <IngredientInput
                ingredients={[]}
                onAdd={onAdd}
                onRemove={vi.fn()}
            />
        );

        const input = screen.getByPlaceholderText(/e.g., chicken/i);
        fireEvent.change(input, { target: { value: 'chi' } });

        const suggestion = screen.getByText('chicken');
        fireEvent.click(suggestion);

        expect(onAdd).toHaveBeenCalledWith('chicken');
    });

    it('hides suggestions after adding ingredient', async () => {
        const onAdd = vi.fn();
        render(
            <IngredientInput
                ingredients={[]}
                onAdd={onAdd}
                onRemove={vi.fn()}
            />
        );

        const input = screen.getByPlaceholderText(/e.g., chicken/i);
        fireEvent.change(input, { target: { value: 'chi' } });

        const suggestion = screen.getByText('chicken');
        fireEvent.click(suggestion);

        await waitFor(() => {
            expect(screen.queryByText('chicken')).not.toBeInTheDocument();
        });
    });

    it('does not show already added ingredients in suggestions', () => {
        render(
            <IngredientInput
                ingredients={['chicken']}
                onAdd={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        const input = screen.getByPlaceholderText(/e.g., chicken/i);
        fireEvent.change(input, { target: { value: 'chi' } });

        const suggestions = screen.queryAllByText('chicken');
        expect(suggestions.length).toBe(1); // Only in the ingredients list, not in suggestions
    });

    it('prevents duplicate ingredients from being added', () => {
        const onAdd = vi.fn();
        render(
            <IngredientInput
                ingredients={['chicken']}
                onAdd={onAdd}
                onRemove={vi.fn()}
            />
        );

        const input = screen.getByPlaceholderText(/e.g., chicken/i);
        const addButton = screen.getByRole('button', { name: /add ingredient/i });

        fireEvent.change(input, { target: { value: 'chicken' } });
        fireEvent.click(addButton);

        expect(onAdd).not.toHaveBeenCalled();
    });

    it('clears input after adding ingredient', () => {
        const onAdd = vi.fn();
        render(
            <IngredientInput
                ingredients={[]}
                onAdd={onAdd}
                onRemove={vi.fn()}
            />
        );

        const input = screen.getByPlaceholderText(/e.g., chicken/i) as HTMLInputElement;
        const addButton = screen.getByRole('button', { name: /add ingredient/i });

        fireEvent.change(input, { target: { value: 'tomato' } });
        fireEvent.click(addButton);

        expect(input.value).toBe('');
    });

    it('displays ingredient count', () => {
        render(
            <IngredientInput
                ingredients={['chicken', 'rice', 'tomatoes']}
                onAdd={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        expect(screen.getByText(/your ingredients \(3\)/i)).toBeInTheDocument();
    });
});
