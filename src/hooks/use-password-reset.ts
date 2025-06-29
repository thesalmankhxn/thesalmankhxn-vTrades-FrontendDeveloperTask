import { useState } from 'react';

import { toast } from 'sonner';

/**
 * Custom hook for handling password reset functionality
 * Manages API calls for forgot password, OTP verification, and password reset
 */
export const usePasswordReset = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Get email from localStorage
     */
    const getEmail = (): string => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('password-reset-email') || '';
        }
        return '';
    };

    /**
     * Set email in localStorage
     */
    const setEmail = (email: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('password-reset-email', email);
        }
    };

    /**
     * Clear email from localStorage
     */
    const clearEmail = (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('password-reset-email');
        }
    };

    /**
     * Request password reset OTP
     * @param email - User's email address
     */
    const requestPasswordReset = async (email: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        setEmail(email);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to request password reset');
            }

            toast.success('Password reset code sent to your email!');
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Verify OTP code
     * @param otp - 6-digit OTP code
     */
    const verifyOTP = async (otp: string): Promise<boolean> => {
        const email = getEmail();
        if (!email) {
            const errorMsg = 'Email not found. Please request password reset again.';
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to verify OTP');
            }

            toast.success('OTP verified successfully!');
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Reset password with new password
     * @param newPassword - New password
     * @param confirmPassword - Password confirmation
     */
    const resetPassword = async (newPassword: string, confirmPassword: string): Promise<boolean> => {
        const email = getEmail();
        if (!email) {
            const errorMsg = 'Email not found. Please request password reset again.';
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    newPassword,
                    confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            // Clear email after successful password reset
            clearEmail();
            toast.success('Password reset successfully!');
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Clear error state
     */
    const clearError = () => {
        setError(null);
    };

    return {
        isLoading,
        error,
        email: getEmail(),
        requestPasswordReset,
        verifyOTP,
        resetPassword,
        clearError
    };
};
