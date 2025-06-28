import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Check if NextAuth session cookie exists
 * @returns boolean indicating if NextAuth session exists
 */
export const hasNextAuthSession = (): boolean => {
    if (typeof document === 'undefined') return false;

    // Check for NextAuth session cookie
    const cookies = document.cookie.split(';');
    const nextAuthCookie = cookies.find(
        (cookie) =>
            cookie.trim().startsWith('next-auth.session-token=') ||
            cookie.trim().startsWith('__Secure-next-auth.session-token=')
    );

    return !!nextAuthCookie;
};

/**
 * Get a specific cookie value by name
 * @param name - The name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));

    if (!cookie) return null;

    return cookie.split('=')[1]?.trim() || null;
};

/**
 * Set a cookie with optional parameters
 * @param name - The name of the cookie
 * @param value - The value of the cookie
 * @param options - Optional cookie parameters
 */
export const setCookie = (
    name: string,
    value: string,
    options: {
        expires?: Date;
        path?: string;
        domain?: string;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
    } = {}
): void => {
    if (typeof document === 'undefined') return;

    let cookieString = `${name}=${value}`;

    if (options.expires) {
        cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.path) {
        cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
        cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
        cookieString += '; secure';
    }

    if (options.sameSite) {
        cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
};

/**
 * Delete a cookie by setting its expiration to the past
 * @param name - The name of the cookie to delete
 * @param path - The path of the cookie (optional)
 * @param domain - The domain of the cookie (optional)
 */
export const deleteCookie = (name: string, path?: string, domain?: string): void => {
    if (typeof document === 'undefined') return;

    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    if (path) {
        cookieString += `; path=${path}`;
    }

    if (domain) {
        cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;
};
