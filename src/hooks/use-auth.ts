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

import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

/**
 * Custom hook for handling authentication operations
 * Uses mock APIs for email/password authentication and NextAuth for OAuth
 * Integrates with Zustand store and localStorage for token and profile management
 */
export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { token, setAuthenticated, logout: logoutFromStore } = useAuthStore();
    const { setProfile, clearProfile } = useProfileStore();
    const router = useRouter();

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

            // Redirect to home page
            router.push('/');

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

            // Redirect to home page
            router.push('/');

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

            console.log('Logout completed successfully');
            toast.success('Logged out successfully');

            // Redirect to Sign In page
            router.push('/sign-in');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed. Please try again');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        token,
        signupWithEmailPassword,
        loginWithEmailPassword,
        logout,
        hasNextAuthSession
    };
};
