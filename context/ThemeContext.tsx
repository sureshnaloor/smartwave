'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { getThemePreference, saveThemePreference } from '@/app/_actions/theme';

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
    isLoading: true
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize client-side rendering state and get initial theme from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Set mounted state to true
        setMounted(true);

        try {
            // Get theme from localStorage as initial value
            const savedTheme = localStorage.getItem('theme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

            setTheme(savedTheme as 'light' | 'dark');
            applyTheme(savedTheme as 'light' | 'dark');
        } catch (error) {
            // console.error('Error reading theme from localStorage:', error);
            // Use system preference as fallback
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setTheme(systemTheme);
            applyTheme(systemTheme);
        }

        // For non-authenticated users or completed auth check, we can stop loading
        if (status !== 'loading') {
            setIsLoading(false);
        }
    }, []);

    // Separate effect for authentication status changes
    useEffect(() => {
        // If status changes to authenticated, we should try to load the theme from DB
        // If status changes to unauthenticated, we're done loading
        if (status === 'unauthenticated') {
            setIsLoading(false);
        }
    }, [status]);

    // Load theme from database when user is authenticated
    useEffect(() => {
        const loadThemeFromDB = async () => {
            // Only proceed if we're mounted and authenticated with an email
            if (!mounted || status !== 'authenticated' || !session?.user?.email) {
                return;
            }

            try {
                setIsLoading(true);
                const result = await getThemePreference();

                if (result.success) {
                    const dbTheme = result.theme === 'system'
                        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                        : result.theme;

                    setTheme(dbTheme as 'light' | 'dark');
                    applyTheme(dbTheme as 'light' | 'dark');

                    // Save to localStorage as backup
                    localStorage.setItem('theme', dbTheme);
                } else if (result.error && result.error !== 'User not authenticated') {
                    // Handle other errors, but not authentication errors which are expected sometimes
                    // console.error('Error getting theme preference:', result.error);
                }
            } catch (error) {
                // console.error('Failed to load theme from database:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Only attempt to load from DB if we're authenticated
        if (mounted && status === 'authenticated' && session?.user?.email) {
            loadThemeFromDB();
        }
    }, [mounted, status, session?.user?.email]);

    const applyTheme = (newTheme: 'light' | 'dark') => {
        if (typeof window === 'undefined') return;

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
        document.documentElement.style.colorScheme = newTheme;
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';

        // Apply theme immediately for better UX
        setTheme(newTheme);
        applyTheme(newTheme);

        // Always save to localStorage regardless of auth state
        localStorage.setItem('theme', newTheme);

        // Only save to database if authenticated
        if (status === 'authenticated' && session?.user?.email) {
            try {
                // Create FormData and set the theme
                const formData = new FormData();
                formData.set('theme', newTheme);
                const result = await saveThemePreference(formData);

                if (!result.success) {
                    // Don't show error for auth issues - just log them
                    if (result.error !== 'User not authenticated') {
                        // console.error('Failed to save theme preference:', result.error);
                    }
                }
            } catch (error) {
                // console.error('Error saving theme preference to database:', error);
            }
        }
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
