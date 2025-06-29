import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
    clearAllAuthData,
    getAuthFromStorage,
    getProfileFromStorage,
    saveAuthToStorage,
    saveProfileToStorage
} from '@/lib/storage';
import { hasNextAuthSession } from '@/lib/utils';
import { useAuthStore } from '@/stores/use-auth-store';
import { useProfileStore } from '@/stores/use-profile-store';

import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';

/**
 * Authentication status information
 */
interface AuthStatus {
    /** Whether the user is authenticated via any method */
    isAuthenticated: boolean;
    /** Whether the user is authenticated via NextAuth OAuth */
    isNextAuthAuthenticated: boolean;
    /** Whether the user is authenticated via custom email/password */
    isCustomAuthenticated: boolean;
    /** The authentication method being used */
    authMethod: 'nextauth' | 'custom' | 'none';
    /** Whether the authentication status is being checked */
    isLoading: boolean;
}

/**
 * Custom hook for handling authentication operations
 * Uses mock APIs for email/password authentication and NextAuth for OAuth
 * Integrates with Zustand store and localStorage for token and profile management
 */
export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [authStatusLoading, setAuthStatusLoading] = useState(true);
    const { token, setAuthenticated, logout: logoutFromStore } = useAuthStore();
    const { setProfile, clearProfile } = useProfileStore();
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    /**
     * Initialize auth state from localStorage on mount
     * This ensures persistence across page refreshes
     */
    useEffect(() => {
        const initializeAuth = () => {
            try {
                // Check for existing auth data in localStorage
                const storedAuth = getAuthFromStorage();
                const storedProfile = getProfileFromStorage();

                if (storedAuth?.token && storedProfile?.admin) {
                    // Restore auth state from localStorage
                    setAuthenticated(storedAuth.token);
                    setProfile(storedProfile.admin);
                }
            } catch (error) {
                console.error('Error initializing auth state:', error);
                // Clear any corrupted data
                clearAllAuthData();
            }
        };

        initializeAuth();
    }, [setAuthenticated, setProfile]);

    /**
     * Check authentication status on mount and when dependencies change
     */
    useEffect(() => {
        // Check both NextAuth and custom authentication
        const checkAuthStatus = () => {
            const hasNextAuth = hasNextAuthSession();
            const hasCustomAuth = !!token;

            setAuthStatusLoading(false);
        };

        // Small delay to ensure all auth systems are initialized
        const timer = setTimeout(checkAuthStatus, 100);
        return () => clearTimeout(timer);
    }, [token, sessionStatus]);

    // Determine authentication method
    const isNextAuthAuthenticated = sessionStatus === 'authenticated' || hasNextAuthSession();
    const isCustomAuthenticated = !!token;
    const isAuthenticated = isNextAuthAuthenticated || isCustomAuthenticated;

    let authMethod: 'nextauth' | 'custom' | 'none' = 'none';
    if (isNextAuthAuthenticated) {
        authMethod = 'nextauth';
    } else if (isCustomAuthenticated) {
        authMethod = 'custom';
    }

    /**
     * Handles email/password signup using mock API
     * @param email - User's email address
     * @param password - User's password
     * @returns Promise that resolves on successful signup
     */
    const signupWithEmailPassword = async (email: string, password: string) => {
        // Validate input fields
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // Password validation
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            // Call mock signup API
            const response = await fetch('/api/auth/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // Save auth and profile data to localStorage
            saveAuthToStorage(data.auth);
            saveProfileToStorage(data.profile);

            // Update Zustand stores
            setAuthenticated(data.auth.token);
            setProfile(data.profile.admin);

            console.log('Signup successful:', data.profile.admin.email);
            toast.success('Account created successfully! Welcome!');

            // Redirect to dashboard page
            router.push('/dashboard');

            return data;
        } catch (error: unknown) {
            console.error('Signup error:', error);

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Signup failed. Please try again');
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles email/password authentication using mock API
     * @param email - User's email address
     * @param password - User's password
     * @returns Promise that resolves on successful login
     */
    const loginWithEmailPassword = async (email: string, password: string) => {
        // Validate input fields
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            // Call mock signin API
            const response = await fetch('/api/auth/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Save auth and profile data to localStorage
            saveAuthToStorage(data.auth);
            saveProfileToStorage(data.profile);

            // Update Zustand stores
            setAuthenticated(data.auth.token);
            setProfile(data.profile.admin);

            console.log('Login successful:', data.profile.admin.email);
            toast.success('Login successful! Welcome back!');

            // Redirect to dashboard page
            router.push('/dashboard');

            return data;
        } catch (error: unknown) {
            console.error('Login error:', error);

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Login failed. Please check your credentials and try again');
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles user logout with comprehensive cleanup
     * Checks for NextAuth session first, then clears all local data
     */
    const logout = async () => {
        setIsLoading(true);

        try {
            console.log('Starting logout process...');

            // Check if NextAuth session exists
            const hasNextAuth = hasNextAuthSession();

            if (hasNextAuth) {
                console.log('NextAuth session detected, signing out from NextAuth...');
                try {
                    // Sign out from NextAuth with callback URL
                    await signOut({
                        callbackUrl: '/sign-in',
                        redirect: false // Handle redirect manually
                    });
                    console.log('NextAuth sign-out completed');
                } catch (nextAuthError) {
                    console.error('NextAuth sign-out error:', nextAuthError);
                    // Continue with local cleanup even if NextAuth fails
                }
            }

            // Clear localStorage (for custom auth)
            console.log('Clearing local storage...');
            clearAllAuthData();

            // Clear Zustand stores
            console.log('Clearing Zustand stores...');
            logoutFromStore();
            clearProfile();

            // Clear any remaining cookies that might cause issues
            if (typeof document !== 'undefined') {
                // Clear any custom auth cookies if they exist
                document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                document.cookie = 'profile=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            }

            console.log('Logout completed successfully');
            toast.success('Logged out successfully');

            // Force redirect to Sign In page to prevent navigation back to dashboard
            window.location.href = '/sign-in';
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed. Please try again');
            // Force redirect even on error to ensure user is signed out
            window.location.href = '/sign-in';
        } finally {
            setIsLoading(false);
        }
    };

    return {
        token,
        signupWithEmailPassword,
        loginWithEmailPassword,
        logout,
        hasNextAuthSession,
        // Auth status properties
        session,
        isAuthenticated,
        isNextAuthAuthenticated,
        isCustomAuthenticated,
        authMethod,
        isLoading: isLoading || authStatusLoading || sessionStatus === 'loading'
    };
};
