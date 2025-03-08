'use client';

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-all duration-200
        focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500 hover:rotate-12 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
} 