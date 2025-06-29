'use client';

import { useAuth } from '@/hooks/use-auth';

/**
 * Dashboard page component
 * Displays main dashboard content for authenticated users
 */
export default function DashboardPage() {
    const { isAuthenticated, authMethod, session, token } = useAuth();

    return (
        <div className='mx-auto w-full max-w-[1440px] px-4 py-8'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold'>Dashboard</h1>
                <p className='text-muted-foreground mt-2'>Welcome to your vTrades dashboard</p>
            </div>

            {/* Debug information - remove in production */}
            <div className='bg-card mb-6 rounded-lg border p-4'>
                <h3 className='mb-2 font-semibold'>Authentication Status (Debug)</h3>
                <div className='space-y-1 text-sm'>
                    <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
                    <p>Auth Method: {authMethod}</p>
                    <p>Has Token: {token ? 'Yes' : 'No'}</p>
                    <p>Has Session: {session ? 'Yes' : 'No'}</p>
                </div>
            </div>

            {/* Main dashboard content */}
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                <div className='bg-card rounded-lg border p-6'>
                    <h3 className='mb-2 font-semibold'>Quick Stats</h3>
                    <p className='text-muted-foreground'>Your dashboard statistics will appear here</p>
                </div>
                <div className='bg-card rounded-lg border p-6'>
                    <h3 className='mb-2 font-semibold'>Recent Activity</h3>
                    <p className='text-muted-foreground'>Recent activities will be displayed here</p>
                </div>
                <div className='bg-card rounded-lg border p-6'>
                    <h3 className='mb-2 font-semibold'>Notifications</h3>
                    <p className='text-muted-foreground'>Important notifications will appear here</p>
                </div>
            </div>
        </div>
    );
}
