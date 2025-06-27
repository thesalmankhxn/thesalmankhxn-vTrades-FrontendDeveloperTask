'use client';

import { type ReactNode, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/use-auth';

/**
 * Interface for DashboardLayout component props
 */
interface DashboardLayoutProps {
    /** The main content/children to be rendered */
    children: ReactNode;
}

/**
 * DashboardLayout component for the protected dashboard area
 * Provides navigation and structure for authenticated users
 *
 * @param props - DashboardLayoutProps containing children
 * @returns JSX.Element - The dashboard layout structure
 */
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { logout, token, isLoading } = useAuth();
    const router = useRouter();

    /**
     * Check authentication status and redirect if no token
     * Runs on component mount and when token changes
     */
    useEffect(() => {
        if (!window || !token || isLoading) return;
        // If no token is present, redirect to sign-in page
        if (!token) {
            console.log('No authentication token found, redirecting to sign-in');
            router.push('/sign-in');
        }
    }, [token]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className='relative grid h-screen w-full place-items-center'>
                <div className='flex flex-col items-center gap-2'>
                    <Spinner size='lg' />
                    <p className='text-muted-foreground'>Checking authentication...</p>
                </div>
            </div>
        );
    }
    return (
        <div className='bg-background min-h-screen'>
            {/* Navigation Header */}
            <header className='bg-card border-b'>
                <div className='mx-auto w-full max-w-[1440px] px-4 py-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4'>
                            <h1 className='text-card-foreground text-xl font-bold'>vTrades</h1>
                            <nav className='hidden space-x-6 md:flex'>
                                <a href='/dashboard' className='text-muted-foreground hover:text-foreground text-sm'>
                                    Dashboard
                                </a>
                                <a href='/employees' className='text-muted-foreground hover:text-foreground text-sm'>
                                    Employees
                                </a>
                                <a href='/analytics' className='text-muted-foreground hover:text-foreground text-sm'>
                                    Analytics
                                </a>
                                <a href='/attendance' className='text-muted-foreground hover:text-foreground text-sm'>
                                    Attendance
                                </a>
                            </nav>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <button className='text-muted-foreground hover:text-foreground text-sm'>Profile</button>
                            <button
                                className='text-muted-foreground hover:text-foreground text-sm'
                                onClick={() => logout()}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className='flex-1'>{children}</main>
        </div>
    );
};

export default DashboardLayout;
