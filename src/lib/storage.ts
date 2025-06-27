/**
 * Local storage utility functions for auth and profile data
 * Provides type-safe operations with error handling
 */

// Storage keys
const AUTH_STORAGE_KEY = 'auth';
const PROFILE_STORAGE_KEY = 'profile';

/**
 * Auth data structure for local storage
 */
interface AuthData {
    token: string;
}

/**
 * Profile data structure for local storage
 */
interface ProfileData {
    admin: {
        uid: string;
        name: string;
        email: string;
        initialPasswordChangeAt: string | null;
    };
}

/**
 * Check if localStorage is available (for SSR compatibility)
 */
const isLocalStorageAvailable = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
};

/**
 * Save auth data to localStorage
 * @param authData - The auth data to store
 */
export const saveAuthToStorage = (authData: AuthData): void => {
    if (!isLocalStorageAvailable()) {
        console.warn('localStorage is not available');
        return;
    }

    try {
        const storageData = {
            state: authData,
            version: 0
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
        console.error('Failed to save auth data to localStorage:', error);
    }
};

/**
 * Get auth data from localStorage
 * @returns Auth data or null if not found/invalid
 */
export const getAuthFromStorage = (): AuthData | null => {
    if (!isLocalStorageAvailable()) {
        return null;
    }

    try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!stored) return null;

        const parsed = JSON.parse(stored);
        return parsed.state || null;
    } catch (error) {
        console.error('Failed to get auth data from localStorage:', error);
        return null;
    }
};

/**
 * Remove auth data from localStorage
 */
export const removeAuthFromStorage = (): void => {
    if (!isLocalStorageAvailable()) {
        return;
    }

    try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to remove auth data from localStorage:', error);
    }
};

/**
 * Save profile data to localStorage
 * @param profileData - The profile data to store
 */
export const saveProfileToStorage = (profileData: ProfileData): void => {
    if (!isLocalStorageAvailable()) {
        console.warn('localStorage is not available');
        return;
    }

    try {
        const storageData = {
            state: profileData,
            version: 0
        };
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
        console.error('Failed to save profile data to localStorage:', error);
    }
};

/**
 * Get profile data from localStorage
 * @returns Profile data or null if not found/invalid
 */
export const getProfileFromStorage = (): ProfileData | null => {
    if (!isLocalStorageAvailable()) {
        return null;
    }

    try {
        const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (!stored) return null;

        const parsed = JSON.parse(stored);
        return parsed.state || null;
    } catch (error) {
        console.error('Failed to get profile data from localStorage:', error);
        return null;
    }
};

/**
 * Remove profile data from localStorage
 */
export const removeProfileFromStorage = (): void => {
    if (!isLocalStorageAvailable()) {
        return;
    }

    try {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to remove profile data from localStorage:', error);
    }
};

/**
 * Clear all auth and profile data from localStorage
 */
export const clearAllAuthData = (): void => {
    removeAuthFromStorage();
    removeProfileFromStorage();
};
