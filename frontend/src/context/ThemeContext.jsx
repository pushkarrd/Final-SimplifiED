import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  // Initialize dyslexic mode from localStorage
  const [isDyslexicMode, setIsDyslexicMode] = useState(() => {
    const savedMode = localStorage.getItem('dyslexicMode');
    return savedMode === 'true';
  });

  // Update localStorage and document class whenever theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Update document class for global styling
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Update localStorage and body class for dyslexic mode
  useEffect(() => {
    localStorage.setItem('dyslexicMode', isDyslexicMode.toString());
    
    if (isDyslexicMode) {
      document.body.classList.add('dyslexic-mode');
    } else {
      document.body.classList.remove('dyslexic-mode');
    }
  }, [isDyslexicMode]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleDyslexicMode = () => {
    setIsDyslexicMode(prev => !prev);
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isDyslexicMode,
    toggleDyslexicMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
