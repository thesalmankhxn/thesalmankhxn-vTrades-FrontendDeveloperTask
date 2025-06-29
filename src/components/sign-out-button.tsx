'use client';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { signOut } from 'next-auth/react';

interface SignOutButtonProps {
    /**
     * Custom className for styling
     */
    className?: string;
    /**
     * Button variant from the UI library
     */
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    /**
     * Button size
     */
    size?: 'default' | 'sm' | 'lg' | 'icon';
    /**
     * Custom text for the button
     */
    children?: React.ReactNode;
    /**
     * Whether to show loading state
     */
    showLoading?: boolean;
}

/**
 * SignOutButton component for handling user logout
 * Supports both NextAuth OAuth and custom email/password authentication
 * Checks for NextAuth session cookies first, then clears all local data
 */
export default function SignOutButton({
    className,
    variant = 'outline',
    size = 'default',
    children = 'Sign Out',
    showLoading = true
}: SignOutButtonProps) {
    const { logout, isLoading, hasNextAuthSession } = useAuth();
    const router = useRouter();
    /**
     * Handles the sign-out process
     * Checks for NextAuth session and performs comprehensive cleanup
     */
    const handleSignOut = async () => {
        try {
            // Check if NextAuth session exists for better UX
            const hasNextAuth = hasNextAuthSession();

            if (hasNextAuth) {
                console.log('NextAuth session detected, will sign out from OAuth provider');
            } else {
                console.log('No NextAuth session found, clearing local authentication only');
            }

            // Perform logout operations
            await logout();

            // Force redirect to sign-in page to prevent any navigation back to dashboard
            window.location.href = '/sign-in';
        } catch (error) {
            console.error('Sign-out failed:', error);
            // Force redirect even on error to ensure user is signed out
            window.location.href = '/sign-in';
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={cn('transition-colors duration-200', variant === 'destructive' && 'hover:bg-red-600', className)}
            onClick={handleSignOut}
            disabled={showLoading && isLoading}>
            {showLoading && isLoading ? (
                <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                    Signing out...
                </div>
            ) : (
                children
            )}
        </Button>
    );
}

/**
 * Quick sign-out button with destructive styling
 * Use this for prominent logout actions
 */
export const DestructiveSignOutButton = ({ className, ...props }: Omit<SignOutButtonProps, 'variant'>) => (
    <SignOutButton variant='destructive' className={cn('hover:bg-red-600', className)} {...props} />
);

/**
 * Ghost sign-out button for subtle logout actions
 * Use this in navigation menus or dropdowns
 */
export const GhostSignOutButton = ({ className, ...props }: Omit<SignOutButtonProps, 'variant'>) => (
    <SignOutButton variant='ghost' className={cn('hover:bg-gray-100 dark:hover:bg-gray-800', className)} {...props} />
);
