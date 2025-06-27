'use client';

import React, { type ReactNode } from 'react';

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
    const { logout } = useAuth();
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
