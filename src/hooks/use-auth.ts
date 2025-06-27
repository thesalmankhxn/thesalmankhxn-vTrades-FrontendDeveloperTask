'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { auth } from '@/lib/firebase.config';
import {
    clearAllAuthData,
    getAuthFromStorage,
    getProfileFromStorage,
    removeAuthFromStorage,
    removeProfileFromStorage,
    saveAuthToStorage,
    saveProfileToStorage
} from '@/lib/storage';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';

import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { toast } from 'sonner';

/**
 * Custom hook for handling authentication operations
 * Uses mock APIs for email/password authentication and Firebase for OAuth
 * Integrates with Zustand store and localStorage for token and profile management
 */
export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { token, setAuthenticated, logout: logoutFromStore } = useAuthStore();
    const { setProfile, clearProfile } = useProfileStore();
    const router = useRouter();

    // Initialize authentication providers
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

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
     * Handles Google OAuth authentication/signup
     * @returns Promise that resolves on successful login/signup
     */
    const loginWithGoogle = async () => {
        setIsLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);

            // Generate mock token for OAuth users
            const mockToken = `mock-jwt-token-${result.user.uid}-${Date.now()}`;

            // Prepare auth and profile data
            const authData = {
                token: mockToken
            };

            const profileData = {
                admin: {
                    uid: result.user.uid,
                    name: result.user.displayName || result.user.email?.split('@')[0] || 'User',
                    email: result.user.email || '',
                    profilePhoto: result.user.photoURL || undefined,
                    initialPasswordChangeAt: null,
                    profilePhotoThumbnail: result.user.photoURL ? { url: result.user.photoURL } : undefined
                }
            };

            // Save auth and profile data to localStorage
            saveAuthToStorage(authData);
            saveProfileToStorage(profileData);

            // Update Zustand stores
            setAuthenticated(authData.token);
            setProfile(profileData.admin);

            console.log('Google login successful:', result.user.email);
            toast.success('Login successful! Welcome back!');

            // Redirect to home page
            router.push('/');

            return result;
        } catch (error: unknown) {
            console.error('Google login error:', error);

            // Handle specific Google auth errors
            if (error && typeof error === 'object' && 'code' in error) {
                const errorCode = error.code as string;
                switch (errorCode) {
                    case 'auth/popup-closed-by-user':
                        toast.error('Login cancelled');
                        break;
                    case 'auth/popup-blocked':
                        toast.error('Popup blocked. Please allow popups for this site');
                        break;
                    case 'auth/cancelled-popup-request':
                        toast.error('Login cancelled');
                        break;
                    default:
                        toast.error('Google login failed. Please try again');
                }
            } else {
                toast.error('Google login failed. Please try again');
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles GitHub OAuth authentication/signup
     * @returns Promise that resolves on successful login/signup
     */
    const loginWithGithub = async () => {
        setIsLoading(true);

        try {
            const result = await signInWithPopup(auth, githubProvider);

            // Generate mock token for OAuth users
            const mockToken = `mock-jwt-token-${result.user.uid}-${Date.now()}`;

            // Prepare auth and profile data
            const authData = {
                token: mockToken
            };

            const profileData = {
                admin: {
                    uid: result.user.uid,
                    name: result.user.displayName || result.user.email?.split('@')[0] || 'User',
                    email: result.user.email || '',
                    profilePhoto: result.user.photoURL || undefined,
                    initialPasswordChangeAt: null,
                    profilePhotoThumbnail: result.user.photoURL ? { url: result.user.photoURL } : undefined
                }
            };

            // Save auth and profile data to localStorage
            saveAuthToStorage(authData);
            saveProfileToStorage(profileData);

            // Update Zustand stores
            setAuthenticated(authData.token);
            setProfile(profileData.admin);

            console.log('GitHub login successful:', result.user.email);
            toast.success('Login successful! Welcome back!');

            // Redirect to home page
            router.push('/');

            return result;
        } catch (error: unknown) {
            console.error('GitHub login error:', error);

            // Handle specific GitHub auth errors
            if (error && typeof error === 'object' && 'code' in error) {
                const errorCode = error.code as string;
                switch (errorCode) {
                    case 'auth/popup-closed-by-user':
                        toast.error('Login cancelled');
                        break;
                    case 'auth/popup-blocked':
                        toast.error('Popup blocked. Please allow popups for this site');
                        break;
                    case 'auth/cancelled-popup-request':
                        toast.error('Login cancelled');
                        break;
                    case 'auth/account-exists-with-different-credential':
                        toast.error('An account already exists with the same email but different sign-in credentials');
                        break;
                    default:
                        toast.error('GitHub login failed. Please try again');
                }
            } else {
                toast.error('GitHub login failed. Please try again');
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles user logout
     * Clears localStorage and Zustand stores
     */
    const logout = async () => {
        setIsLoading(true);

        try {
            console.log('Starting logout...');

            // Sign out from Firebase if user was authenticated via OAuth
            try {
                await signOut(auth);
            } catch (firebaseError) {
                console.log('Firebase signout error (expected for mock auth users):', firebaseError);
            }

            // Clear localStorage
            clearAllAuthData();

            // Clear Zustand stores
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
        loginWithGoogle,
        loginWithGithub,
        logout
    };
};
