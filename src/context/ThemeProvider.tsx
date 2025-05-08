'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>(() => {
    // Initial theme will be set in useEffect
    return 'light';
  });

  useEffect(() => {
    // Initialize theme on client side
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = savedTheme || systemTheme;
      setTheme(initialTheme);
      document.documentElement.classList.add(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    };

    initializeTheme();
  }, []);

  useEffect(() => {
    // Apply theme to root element
    document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.add(theme);
    
    // Update localStorage
    localStorage.setItem('theme', theme);

    // Update global dark class
    document.documentElement.classList.toggle('dark-mode', theme === 'dark'); // Renamed class to 'dark-mode'
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};