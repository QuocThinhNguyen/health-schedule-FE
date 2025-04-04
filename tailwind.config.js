import { text } from '@fortawesome/fontawesome-svg-core';
import { c } from 'vite/dist/node/types.d-aGj9QkWt';

export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                customGray: '#E4E8EC',
                customYellow: '#ffb54a',
                customBlue: '#2d87f3',
                customLightBlue: '#e3f2ff',
                customDeepNavyBlue: '#003553',
                custom262626: '#262626',
                custom404040: '#404040',
                custom8C8C8C: '#8C8C8C',
                custom284a75: '#284a75',
                customTitle: '#262626',
            },
            height: {
                'screen-minus-20': 'calc(100vh - 3.5rem)',
                'screen-admin': 'calc(100vh - 68px)',
            },
            minHeight: {
                'screen-minus-20': 'calc(100vh - 3.5rem)',
            },
            animation: {
                'rotate-fast': 'rotate-fast 1s ease-in-out', // Animation chạy trong 1 giây
            },
            keyframes: {
                'rotate-fast': {
                    '0%': { transform: 'rotate(0deg)' },
                    '12.5%': { transform: 'rotate(30deg)' }, // Tăng tần suất xoay
                    '25%': { transform: 'rotate(-30deg)' },
                    '37.5%': { transform: 'rotate(30deg)' },
                    '50%': { transform: 'rotate(-30deg)' },
                    '62.5%': { transform: 'rotate(30deg)' },
                    '75%': { transform: 'rotate(-30deg)' },
                    '87.5%': { transform: 'rotate(30deg)' },
                    '100%': { transform: 'rotate(0deg)' },
                },
            },
        },
    },
    plugins: [],
};
