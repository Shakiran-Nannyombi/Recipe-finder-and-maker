import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders the main heading', () => {
        render(<App />);
        const heading = screen.getByRole('heading', { name: /ai recipe generator/i });
        expect(heading).toBeInTheDocument();
    });

    it('renders the ingredient input section', () => {
        render(<App />);
        expect(screen.getByLabelText(/ingredient input/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add ingredient/i })).toBeInTheDocument();
    });

    it('renders the generate recipe button', () => {
        render(<App />);
        const generateButton = screen.getByRole('button', { name: /generate recipe/i });
        expect(generateButton).toBeInTheDocument();
        expect(generateButton).toBeDisabled(); // Should be disabled when no ingredients
    });

    it('displays empty state message', () => {
        render(<App />);
        expect(screen.getByText(/no ingredients added yet/i)).toBeInTheDocument();
    });

    it('renders recipe preferences section', () => {
        render(<App />);
        expect(screen.getByText(/recipe preferences/i)).toBeInTheDocument();
    });

    it('displays the ready to cook message', () => {
        render(<App />);
        expect(screen.getByText(/ready to cook/i)).toBeInTheDocument();
        expect(screen.getByText(/add your ingredients and click "generate recipe" to get started!/i)).toBeInTheDocument();
    });
});
