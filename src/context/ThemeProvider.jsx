import  { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const location = useLocation();
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const body = document.body;
        const isAdminPage = location.pathname.includes('/admin') || location.pathname.includes('/clinic');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (isAdminPage) {
            body.classList.toggle('dark', isDark);
        } else {
            body.classList.remove('dark');
        }
    }, [isDark, location.pathname]);

    const toggleTheme = () => {
        setIsDark((prev) => {
            return !prev;
        });
    };

    return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export { ThemeContext, ThemeProvider };
