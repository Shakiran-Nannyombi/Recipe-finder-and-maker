import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders the main heading', () => {
        render(<App />);
        const heading = screen.getByRole('heading', { name: /vite \+ react/i });
        expect(heading).toBeInTheDocument();
    });

    it('renders both logo links', () => {
        render(<App />);
        const viteLink = screen.getByRole('link', { name: /vite logo/i });
        const reactLink = screen.getByRole('link', { name: /react logo/i });

        expect(viteLink).toBeInTheDocument();
        expect(reactLink).toBeInTheDocument();
        expect(viteLink).toHaveAttribute('href', 'https://vite.dev');
        expect(reactLink).toHaveAttribute('href', 'https://react.dev');
    });

    it('displays initial count of 0', () => {
        render(<App />);
        const button = screen.getByRole('button', { name: /count is 0/i });
        expect(button).toBeInTheDocument();
    });

    it('increments count when button is clicked', () => {
        render(<App />);
        const button = screen.getByRole('button', { name: /count is 0/i });

        fireEvent.click(button);
        expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();

        fireEvent.click(button);
        expect(screen.getByRole('button', { name: /count is 2/i })).toBeInTheDocument();
    });

    it('renders HMR instruction text', () => {
        render(<App />);
        expect(screen.getByText(/edit/i)).toBeInTheDocument();
        expect(screen.getByText(/src\/App\.tsx/i)).toBeInTheDocument();
    });

    it('renders the documentation prompt', () => {
        render(<App />);
        expect(screen.getByText(/click on the vite and react logos to learn more/i)).toBeInTheDocument();
    });
});
