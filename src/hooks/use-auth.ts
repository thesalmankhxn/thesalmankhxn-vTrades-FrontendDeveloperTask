'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { auth, githubProvider, googleProvider } from '@/lib/firebase.config';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import { toast } from 'sonner';

/**
 * Custom hook for handling authentication operations
 * Provides email/password, Google, and GitHub login/signup functionality
 * Integrates with Zustand store for token and profile management
 */
export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { token, setAuthenticated, logout: logoutFromStore } = useAuthStore();
    const { setProfileFromFirebaseUser, clearProfile } = useProfileStore();
    const router = useRouter();

    /**
     * Sync Firebase auth state with Zustand store
     * This ensures the store is updated when Firebase auth state changes
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Get the user's ID token
                    const idToken = await user.getIdToken();
                    setAuthenticated(idToken);

                    // Save profile data to store
                    setProfileFromFirebaseUser(user);
                } catch (error) {
                    console.error('Error getting user token:', error);
                    logoutFromStore();
                    clearProfile();
                }
            } else {
                // User is signed out
                logoutFromStore();
                clearProfile();
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [setAuthenticated, logoutFromStore, setProfileFromFirebaseUser, clearProfile]);

    /**
     * Handles email/password signup using Firebase
     * @param email - User's email address
     * @param password - User's password
     * @param firstName - User's first name
     * @param lastName - User's last name
     * @returns Promise that resolves on successful signup
     */
    const signupWithEmailPassword = async (email: string, password: string, firstName: string, lastName: string) => {
        // Validate input fields
        if (!email || !password || !firstName || !lastName) {
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
            // Create user with email and password
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update user profile with display name
            await updateProfile(result.user, {
                displayName: `${firstName} ${lastName}`
            });

            console.log('Signup successful:', result.user.email);
            toast.success('Account created successfully! Welcome!');

            // Redirect to home page
            router.push('/');

            return result;
        } catch (error: unknown) {
            console.error('Signup error:', error);

            // Handle specific Firebase auth errors
            if (error && typeof error === 'object' && 'code' in error) {
                const errorCode = error.code as string;
                switch (errorCode) {
                    case 'auth/email-already-in-use':
                        toast.error('An account with this email already exists');
                        break;
                    case 'auth/invalid-email':
                        toast.error('Invalid email address');
                        break;
                    case 'auth/operation-not-allowed':
                        toast.error('Email/password accounts are not enabled. Please contact support');
                        break;
                    case 'auth/weak-password':
                        toast.error('Password is too weak. Please choose a stronger password');
                        break;
                    case 'auth/too-many-requests':
                        toast.error('Too many failed attempts. Please try again later');
                        break;
                    default:
                        toast.error('Signup failed. Please try again');
                }
            } else {
                toast.error('Signup failed. Please try again');
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles email/password authentication using Firebase
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
            // Attempt to sign in with email and password
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful:', result.user.email);
            toast.success('Login successful! Welcome back!');

            // Redirect to home page
            router.push('/');

            return result;
        } catch (error: unknown) {
            console.error('Login error:', error);

            // Handle specific Firebase auth errors
            if (error && typeof error === 'object' && 'code' in error) {
                const errorCode = error.code as string;
                switch (errorCode) {
                    case 'auth/user-not-found':
                        toast.error('No account found with this email address');
                        break;
                    case 'auth/wrong-password':
                        toast.error('Incorrect password. Please try again');
                        break;
                    case 'auth/invalid-email':
                        toast.error('Invalid email address');
                        break;
                    case 'auth/user-disabled':
                        toast.error('This account has been disabled');
                        break;
                    case 'auth/too-many-requests':
                        toast.error('Too many failed attempts. Please try again later');
                        break;
                    default:
                        toast.error('Login failed. Please check your credentials and try again');
                }
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
     * Signs out from Firebase and clears the store
     */
    const logout = async () => {
        setIsLoading(true);

        try {
            console.log('Starting Firebase logout...');
            await signOut(auth);
            console.log('Firebase signOut completed successfully');

            // Store will be automatically cleared by onAuthStateChanged listener
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
