import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
    theme: 'dark',
    toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('hits_theme');
                if (saved === 'light' || saved === 'dark') {
                    return saved;
                }
            } catch (e) {
                // ignore localStorage exceptions
            }
            if (typeof window.matchMedia === 'function') {
                const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                if (prefersLight) {
                    return 'light';
                }
            }
        }
        return 'dark'; // default to dark
    });

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('hits_theme', theme);
            } catch (e) {
                // ignore
            }
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

export default ThemeContext;
