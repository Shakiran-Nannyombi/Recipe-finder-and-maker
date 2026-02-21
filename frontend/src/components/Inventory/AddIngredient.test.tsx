import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddIngredient } from './AddIngredient';

describe('AddIngredient', () => {
    it('should render form with inputs', () => {
        render(<AddIngredient onAdd={vi.fn()} />);

        expect(screen.getByLabelText(/ingredient name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add to inventory/i })).toBeInTheDocument();
    });

    it('should call onAdd with ingredient name and quantity', async () => {
        const onAdd = vi.fn().mockResolvedValue(undefined);
        render(<AddIngredient onAdd={onAdd} />);

        const nameInput = screen.getByLabelText(/ingredient name/i);
        const quantityInput = screen.getByLabelText(/quantity/i);
        const submitButton = screen.getByRole('button', { name: /add to inventory/i });

        fireEvent.change(nameInput, { target: { value: 'tomatoes' } });
        fireEvent.change(quantityInput, { target: { value: '2 lbs' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(onAdd).toHaveBeenCalledWith('tomatoes', '2 lbs');
        });
    });

    it('should call onAdd without quantity if not provided', async () => {
        const onAdd = vi.fn().mockResolvedValue(undefined);
        render(<AddIngredient onAdd={onAdd} />);

        const nameInput = screen.getByLabelText(/ingredient name/i);
        const submitButton = screen.getByRole('button', { name: /add to inventory/i });

        fireEvent.change(nameInput, { target: { value: 'chicken' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(onAdd).toHaveBeenCalledWith('chicken', undefined);
        });
    });

    it('should disable submit button when ingredient name is empty', () => {
        const onAdd = vi.fn();
        render(<AddIngredient onAdd={onAdd} />);

        const submitButton = screen.getByRole('button', { name: /add to inventory/i });

        // Button should be disabled when input is empty
        expect(submitButton).toBeDisabled();
    });

    it('should clear form after successful submission', async () => {
        const onAdd = vi.fn().mockResolvedValue(undefined);
        render(<AddIngredient onAdd={onAdd} />);

        const nameInput = screen.getByLabelText(/ingredient name/i) as HTMLInputElement;
        const quantityInput = screen.getByLabelText(/quantity/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /add to inventory/i });

        fireEvent.change(nameInput, { target: { value: 'rice' } });
        fireEvent.change(quantityInput, { target: { value: '1 cup' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(nameInput.value).toBe('');
            expect(quantityInput.value).toBe('');
        });
    });

    it('should disable inputs when loading', () => {
        render(<AddIngredient onAdd={vi.fn()} loading={true} />);

        expect(screen.getByLabelText(/ingredient name/i)).toBeDisabled();
        expect(screen.getByLabelText(/quantity/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /add to inventory/i })).toBeDisabled();
    });
});
