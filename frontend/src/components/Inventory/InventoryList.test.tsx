import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryList } from './InventoryList';
import { InventoryItem } from '../../types/recipe';

describe('InventoryList', () => {
    const mockItems: InventoryItem[] = [
        { ingredient_name: 'tomatoes', quantity: '2 lbs', added_at: '2024-01-01T00:00:00Z' },
        { ingredient_name: 'chicken', added_at: '2024-01-01T00:00:00Z' },
    ];

    it('should render empty state when no items', () => {
        render(<InventoryList items={[]} onRemove={vi.fn()} />);

        expect(screen.getByText(/your inventory is empty/i)).toBeInTheDocument();
    });

    it('should render list of items', () => {
        render(<InventoryList items={mockItems} onRemove={vi.fn()} />);

        expect(screen.getByText('tomatoes')).toBeInTheDocument();
        expect(screen.getByText('chicken')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2 lbs')).toBeInTheDocument();
    });

    it('should call onRemove when remove button is clicked', () => {
        const onRemove = vi.fn();
        render(<InventoryList items={mockItems} onRemove={onRemove} />);

        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[0]);

        expect(onRemove).toHaveBeenCalledWith('tomatoes');
    });

    it('should disable remove buttons when loading', () => {
        render(<InventoryList items={mockItems} onRemove={vi.fn()} loading={true} />);

        const removeButtons = screen.getAllByText('Remove');
        removeButtons.forEach(button => {
            expect(button).toBeDisabled();
        });
    });
});
