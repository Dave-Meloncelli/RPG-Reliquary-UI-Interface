/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'indigo': {
                    900: '#312e81',
                },
                'slate': {
                    900: '#0f172a',
                },
                'purple': {
                    900: '#581c87',
                },
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
} 