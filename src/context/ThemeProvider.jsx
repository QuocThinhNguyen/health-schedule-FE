import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        console.log("Theme changed:", isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.body.classList.toggle('dark', isDark);
    }, [isDark]);

    const toggleTheme = () => {
        console.log("Toggling theme:", isDark);
        setIsDark(prev => {
            console.log("Toggle theme:", !prev);
            return !prev;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };
