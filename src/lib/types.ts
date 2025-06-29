/**
 * User interface for authentication
 */
export interface User {
    email: string;
    password: string;
    uid: string;
    name: string;
    initialPasswordChangeAt: string | null;
}

/**
 * OTP storage interface
 */
export interface OTPStorage {
    otp: string;
    expiresAt: number;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
    token: string;
}

/**
 * Profile response interface
 */
export interface ProfileResponse {
    admin: {
        uid: string;
        name: string;
        email: string;
        initialPasswordChangeAt: string | null;
    };
}

/**
 * API response interface
 */
export interface APIResponse {
    success: boolean;
    message: string;
    auth?: AuthResponse;
    profile?: ProfileResponse;
    data?: any;
    error?: string;
}
