/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Colors
                primary: "#FF4A3D",        // Tomato AI Red
                secondary: "#FFA62B",      // Warm Orange
                accent: "#FFC857",         // Golden Node

                // Background Colors
                bg: {
                    DEFAULT: "#FFF6E8",    // Soft Cream
                    card: "#FFE8CC",       // Light Warm
                    dark: "#1F1A17",       // Deep Brown
                },

                // Text Colors
                text: {
                    primary: "#2B2B2B",    // Charcoal
                    secondary: "#6B4F3A",  // Soft Brown
                    light: "#F5F5F5",      // Off White
                },

                // UI Accent Colors
                success: "#4CAF50",
                warning: "#FFB703",
                error: "#E63946",
            },
            fontFamily: {
                heading: ['Poppins', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #FF4A3D, #FFA62B)',
                'gradient-accent': 'linear-gradient(135deg, #FFA62B, #FFC857)',
            },
        },
    },
    plugins: [],
}
