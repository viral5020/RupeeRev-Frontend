/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1', // Vibrant Indigo
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                secondary: {
                    DEFAULT: '#ec4899', // Vibrant Pink
                    light: '#f472b6',
                    dark: '#db2777',
                },
                success: {
                    DEFAULT: '#10b981', // Vibrant Green
                },
                background: {
                    DEFAULT: '#f8fafc',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#1e293b',
                    secondary: '#64748b',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
