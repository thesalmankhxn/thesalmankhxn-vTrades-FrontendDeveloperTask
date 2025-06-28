'use client';

import { useAuthStatus } from '@/hooks/use-auth-status';
import { cn } from '@/lib/utils';

import SignOutButton, { DestructiveSignOutButton, GhostSignOutButton } from './sign-out-button';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

/**
 * Example component demonstrating authentication status and sign-out functionality
 * Shows different sign-out button variants and authentication method detection
 */
export default function AuthExample() {
    const { isAuthenticated, isNextAuthAuthenticated, isCustomAuthenticated, authMethod, isLoading } = useAuthStatus();

    if (isLoading) {
        return (
            <Card className='mx-auto w-full max-w-md'>
                <CardContent className='flex items-center justify-center p-6'>
                    <div className='flex items-center gap-2'>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                        Checking authentication...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!isAuthenticated) {
        return (
            <Card className='mx-auto w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Authentication Status</CardTitle>
                    <CardDescription>You are not currently authenticated</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground mb-4 text-sm'>Please sign in to access the dashboard.</p>
                    <Button asChild className='w-full'>
                        <a href='/sign-in'>Sign In</a>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Authentication Status Card */}
            <Card className='mx-auto w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Authentication Status</CardTitle>
                    <CardDescription>Current authentication information</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                            <span className='font-medium'>Status:</span>
                            <span
                                className={cn(
                                    'ml-2 rounded-full px-2 py-1 text-xs',
                                    isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                )}>
                                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                            </span>
                        </div>
                        <div>
                            <span className='font-medium'>Method:</span>
                            <span className='ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'>
                                {authMethod === 'nextauth'
                                    ? 'OAuth (NextAuth)'
                                    : authMethod === 'custom'
                                      ? 'Email/Password'
                                      : 'None'}
                            </span>
                        </div>
                    </div>

                    <div className='space-y-2 text-sm'>
                        <div className='flex items-center gap-2'>
                            <div
                                className={cn(
                                    'h-2 w-2 rounded-full',
                                    isNextAuthAuthenticated ? 'bg-green-500' : 'bg-gray-300'
                                )}
                            />
                            <span>NextAuth OAuth: {isNextAuthAuthenticated ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div
                                className={cn(
                                    'h-2 w-2 rounded-full',
                                    isCustomAuthenticated ? 'bg-green-500' : 'bg-gray-300'
                                )}
                            />
                            <span>Custom Auth: {isCustomAuthenticated ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sign Out Buttons Examples */}
            <Card className='mx-auto w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Sign Out Options</CardTitle>
                    <CardDescription>Different ways to sign out from the application</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {/* Default Sign Out Button */}
                    <div>
                        <h4 className='mb-2 text-sm font-medium'>Default Sign Out Button</h4>
                        <SignOutButton className='w-full'>Sign Out</SignOutButton>
                    </div>

                    {/* Destructive Sign Out Button */}
                    <div>
                        <h4 className='mb-2 text-sm font-medium'>Destructive Sign Out Button</h4>
                        <DestructiveSignOutButton className='w-full'>Sign Out (Destructive)</DestructiveSignOutButton>
                    </div>

                    {/* Ghost Sign Out Button */}
                    <div>
                        <h4 className='mb-2 text-sm font-medium'>Ghost Sign Out Button</h4>
                        <GhostSignOutButton className='w-full'>Sign Out (Ghost)</GhostSignOutButton>
                    </div>

                    {/* Custom Styled Button */}
                    <div>
                        <h4 className='mb-2 text-sm font-medium'>Custom Styled Button</h4>
                        <SignOutButton
                            variant='outline'
                            size='sm'
                            className='w-full border-orange-200 text-orange-700 hover:bg-orange-50'>
                            🚪 Sign Out
                        </SignOutButton>
                    </div>
                </CardContent>
            </Card>

            {/* Information Card */}
            <Card className='mx-auto w-full max-w-md'>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className='text-muted-foreground space-y-3 text-sm'>
                    <p>The sign-out process automatically detects your authentication method:</p>
                    <ul className='ml-4 list-inside list-disc space-y-1'>
                        <li>Checks for NextAuth session cookies first</li>
                        <li>Signs out from OAuth provider if detected</li>
                        <li>Clears local storage and Zustand stores</li>
                        <li>Redirects to sign-in page</li>
                    </ul>
                    <p className='rounded bg-blue-50 p-2 text-xs'>
                        💡 This handles both OAuth (Google/GitHub) and email/password authentication seamlessly.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
