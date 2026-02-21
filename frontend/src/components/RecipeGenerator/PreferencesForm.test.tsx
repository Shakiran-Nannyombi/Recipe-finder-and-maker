import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PreferencesForm, { RecipePreferences } from './PreferencesForm';

describe('PreferencesForm', () => {
    const defaultPreferences: RecipePreferences = {
        dietaryRestrictions: [],
        cuisineType: '',
        difficulty: '',
    };

    it('renders collapsed by default', () => {
        render(
            <PreferencesForm
                preferences={defaultPreferences}
                onChange={vi.fn()}
            />
        );

        expect(screen.getByText('Recipe Preferences')).toBeInTheDocument();
        expect(screen.queryByText('Dietary Restrictions')).not.toBeInTheDocument();
    });

    it('expands when clicked', () => {
        render(
            <PreferencesForm
                preferences={defaultPreferences}
                onChange={vi.fn()}
            />
        );

        const expandButton = screen.getByRole('button', { expanded: false });
        fireEvent.click(expandButton);

        expect(screen.getByText('Dietary Restrictions')).toBeInTheDocument();
        expect(screen.getByText('Cuisine Type')).toBeInTheDocument();
        expect(screen.getByText('Difficulty Level')).toBeInTheDocument();
    });

    it('selects dietary restriction', () => {
        const onChange = vi.fn();
        render(
            <PreferencesForm
                preferences={defaultPreferences}
                onChange={onChange}
            />
        );

        // Expand form
        fireEvent.click(screen.getByRole('button', { expanded: false }));

        // Click vegetarian option
        const vegetarianButton = screen.getByRole('button', { name: /vegetarian/i });
        fireEvent.click(vegetarianButton);

        expect(onChange).toHaveBeenCalledWith({
            ...defaultPreferences,
            dietaryRestrictions: ['vegetarian'],
        });
    });

    it('deselects dietary restriction', () => {
        const onChange = vi.fn();
        const preferences: RecipePreferences = {
            ...defaultPreferences,
            dietaryRestrictions: ['vegetarian'],
        };

        render(
            <PreferencesForm
                preferences={preferences}
                onChange={onChange}
            />
        );

        // Expand form
        fireEvent.click(screen.getByRole('button', { expanded: false }));

        // Click vegetarian option again to deselect
        const vegetarianButton = screen.getByRole('button', { name: /vegetarian/i });
        fireEvent.click(vegetarianButton);

        expect(onChange).toHaveBeenCalledWith({
            ...defaultPreferences,
            dietaryRestrictions: [],
        });
    });

    it('changes cuisine type', () => {
        const onChange = vi.fn();
        render(
            <PreferencesForm
                preferences={defaultPreferences}
                onChange={onChange}
            />
        );

        // Expand form
        fireEvent.click(screen.getByRole('button', { expanded: false }));

        // Select cuisine
        const cuisineSelect = screen.getByLabelText(/cuisine type/i);
        fireEvent.change(cuisineSelect, { target: { value: 'italian' } });

        expect(onChange).toHaveBeenCalledWith({
            ...defaultPreferences,
            cuisineType: 'italian',
        });
    });

    it('changes difficulty level', () => {
        const onChange = vi.fn();
        render(
            <PreferencesForm
                preferences={defaultPreferences}
                onChange={onChange}
            />
        );

        // Expand form
        fireEvent.click(screen.getByRole('button', { expanded: false }));

        // Click easy difficulty
        const easyButton = screen.getByRole('button', { name: /easy/i });
        fireEvent.click(easyButton);

        expect(onChange).toHaveBeenCalledWith({
            ...defaultPreferences,
            difficulty: 'easy',
        });
    });

    it('shows active preferences count', () => {
        const preferences: RecipePreferences = {
            dietaryRestrictions: ['vegetarian', 'gluten-free'],
            cuisineType: 'italian',
            difficulty: 'easy',
        };

        render(
            <PreferencesForm
                preferences={preferences}
                onChange={vi.fn()}
            />
        );

        expect(screen.getByText('4 active')).toBeInTheDocument();
    });

    it('clears all preferences', () => {
        const onChange = vi.fn();
        const preferences: RecipePreferences = {
            dietaryRestrictions: ['vegetarian'],
            cuisineType: 'italian',
            difficulty: 'easy',
        };

        render(
            <PreferencesForm
                preferences={preferences}
                onChange={onChange}
            />
        );

        // Expand form
        fireEvent.click(screen.getByRole('button', { expanded: false }));

        // Click clear all
        const clearButton = screen.getByText(/clear all preferences/i);
        fireEvent.click(clearButton);

        expect(onChange).toHaveBeenCalledWith(defaultPreferences);
    });
});
