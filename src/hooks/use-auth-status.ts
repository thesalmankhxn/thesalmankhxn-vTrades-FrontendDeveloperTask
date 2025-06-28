import { useEffect, useState } from 'react';

import { hasNextAuthSession } from '@/lib/utils';
import { useAuthStore } from '@/stores/use-auth-store';

import { useSession } from 'next-auth/react';

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
 * Custom hook to check authentication status
 * Determines whether user is authenticated via NextAuth or custom auth
 * @returns AuthStatus object with authentication information
 */
export const useAuthStatus = (): AuthStatus => {
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuthStore();
    const { data: session, status: sessionStatus } = useSession();

    useEffect(() => {
        // Check both NextAuth and custom authentication
        const checkAuthStatus = () => {
            const hasNextAuth = hasNextAuthSession();
            const hasCustomAuth = !!token;

            setIsLoading(false);
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

    return {
        isAuthenticated,
        isNextAuthAuthenticated,
        isCustomAuthenticated,
        authMethod,
        isLoading: isLoading || sessionStatus === 'loading'
    };
};

/**
 * Quick hook to check if user is authenticated
 * @returns boolean indicating if user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
    const { isAuthenticated } = useAuthStatus();
    return isAuthenticated;
};

/**
 * Hook to get the current authentication method
 * @returns string indicating the authentication method
 */
export const useAuthMethod = (): 'nextauth' | 'custom' | 'none' => {
    const { authMethod } = useAuthStatus();
    return authMethod;
};
