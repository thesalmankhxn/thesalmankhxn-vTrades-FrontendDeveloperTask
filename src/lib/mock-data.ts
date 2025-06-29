import { OTPStorage, User } from './types';

/**
 * Mock user database for authentication
 * In a real application, this would be a database
 */
export let mockUsers: User[] = [
    {
        email: 'tylerdurden@fightclub.com',
        password: 'password123',
        uid: 'on7zjqhpY7ZN64IuB63M47X8zrg2',
        name: 'Tyler Durden',
        initialPasswordChangeAt: null
    },
    {
        email: 'test@example.com',
        password: 'test123',
        uid: 'test-user-123',
        name: 'Test User',
        initialPasswordChangeAt: null
    }
];

/**
 * Mock OTP storage for password reset
 * In a real application, this would be stored in a database with expiration
 */
export let otpStorage: { [email: string]: OTPStorage } = {};

/**
 * Generate a 6-digit OTP code
 * @returns 6-digit OTP string
 */
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a unique user ID
 * In a real application, this would be handled by the database
 */
export const generateUID = (): string => {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a display name from email
 * @param email - User's email address
 * @returns Generated display name
 */
export const generateDisplayName = (email: string): string => {
    const username = email.split('@')[0];
    // Capitalize first letter and replace common separators with spaces
    return username
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .trim();
};
