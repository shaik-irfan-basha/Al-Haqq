import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0E3B2E', // Deep Emerald Green
                    light: '#165241',
                    dark: '#09261E',
                },
                secondary: {
                    DEFAULT: '#C7A24D', // Muted Gold
                    light: '#D4B66E',
                    dark: '#A68538',
                },
                bg: {
                    DEFAULT: 'var(--color-bg)',
                    secondary: 'var(--color-bg-secondary)',
                    elevated: 'var(--color-bg-elevated)',
                },
                text: {
                    DEFAULT: 'var(--color-text)',
                    secondary: 'var(--color-text-secondary)',
                    muted: 'var(--color-text-muted)',
                },
                emerald: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                    950: '#022c22',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
                arabic: ['var(--font-amiri)', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 180ms ease-out forwards',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'slide-up': 'slideUp 220ms ease-out forwards',
                'breathe': 'breathe 6s ease-in-out infinite',
                'slow-pan': 'pan 20s linear infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                breathe: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.03)' },
                },
                pan: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '100% 50%' },
                },
                shimmer: {
                    'from': { backgroundPosition: '0 0' },
                    'to': { backgroundPosition: '-200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
        },
    },
    plugins: [],
};
export default config;
