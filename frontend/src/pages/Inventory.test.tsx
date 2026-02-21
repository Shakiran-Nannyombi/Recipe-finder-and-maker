import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Inventory } from './Inventory';
import * as useInventoryHook from '../hooks/useInventory';
import { UserInventory, RecipeMatches } from '../types/recipe';

// Mock the useInventory hook
vi.mock('../hooks/useInventory');

describe('Inventory Page', () => {
    const mockInventory: UserInventory = {
        user_id: 'user-1',
        items: [
            { ingredient_name: 'tomatoes', quantity: '2 lbs', added_at: '2024-01-01T00:00:00Z' },
            { ingredient_name: 'chicken', added_at: '2024-01-01T00:00:00Z' },
        ],
        updated_at: '2024-01-01T00:00:00Z',
    };

    const mockMatches: RecipeMatches = {
        exact_matches: [],
        partial_matches: [],
    };

    const mockUseInventory = {
        inventory: mockInventory,
        matches: mockMatches,
        loading: false,
        error: null,
        addItem: vi.fn(),
        removeItem: vi.fn(),
        refreshInventory: vi.fn(),
        refreshMatches: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useInventoryHook.useInventory).mockReturnValue(mockUseInventory);
    });

    it('should render page header', () => {
        render(<Inventory />);

        expect(screen.getByText('My Inventory')).toBeInTheDocument();
        expect(screen.getByText(/manage your ingredients/i)).toBeInTheDocument();
    });

    it('should render add ingredient form', () => {
        render(<Inventory />);

        expect(screen.getByText('Add Ingredient')).toBeInTheDocument();
        expect(screen.getByLabelText(/ingredient name/i)).toBeInTheDocument();
    });

    it('should render inventory list', () => {
        render(<Inventory />);

        expect(screen.getByText('Current Inventory')).toBeInTheDocument();
        expect(screen.getByText('tomatoes')).toBeInTheDocument();
        expect(screen.getByText('chicken')).toBeInTheDocument();
    });

    it('should display item count', () => {
        render(<Inventory />);

        expect(screen.getByText('2 items')).toBeInTheDocument();
    });

    it('should render recipe matches section when inventory has items', () => {
        render(<Inventory />);

        expect(screen.getByText('Recipes You Can Make')).toBeInTheDocument();
        expect(screen.getByText(/based on your current inventory/i)).toBeInTheDocument();
    });

    it('should not render recipe matches when inventory is empty', () => {
        vi.mocked(useInventoryHook.useInventory).mockReturnValue({
            ...mockUseInventory,
            inventory: { ...mockInventory, items: [] },
        });

        render(<Inventory />);

        expect(screen.queryByText('Recipes You Can Make')).not.toBeInTheDocument();
    });

    it('should display loading state', () => {
        vi.mocked(useInventoryHook.useInventory).mockReturnValue({
            ...mockUseInventory,
            inventory: null,
            loading: true,
        });

        render(<Inventory />);

        expect(screen.getByText(/loading inventory/i)).toBeInTheDocument();
    });

    it('should display error message', () => {
        vi.mocked(useInventoryHook.useInventory).mockReturnValue({
            ...mockUseInventory,
            error: 'Failed to load inventory',
        });

        render(<Inventory />);

        expect(screen.getByText('Failed to load inventory')).toBeInTheDocument();
    });

    it('should call refreshMatches when refresh button is clicked', async () => {
        render(<Inventory />);

        const refreshButton = screen.getByRole('button', { name: /refresh/i });
        refreshButton.click();

        await waitFor(() => {
            expect(mockUseInventory.refreshMatches).toHaveBeenCalled();
        });
    });
});
