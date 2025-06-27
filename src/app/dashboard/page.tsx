import React from 'react';

/**
 * Dashboard page component
 * Main dashboard interface for authenticated users
 *
 * @returns JSX.Element - The dashboard page content
 */
const DashboardPage = () => {
    return (
        <div className='mx-auto w-full max-w-[1440px] px-4 py-8'>
            <div className='mb-8'>
                <h2 className='text-foreground text-2xl font-bold'>Overview</h2>
                <p className='text-muted-foreground mt-2'>Get a quick overview of your workforce management</p>
            </div>

            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {/* Employee Management Card */}
                <div className='bg-card rounded-lg border p-6 shadow-sm'>
                    <h3 className='text-card-foreground mb-2 text-lg font-semibold'>Employee Management</h3>
                    <p className='text-muted-foreground mb-4 text-sm'>
                        View detailed profiles, track performance, and manage attendance
                    </p>
                    <button className='text-primary text-sm hover:underline'>View Employees →</button>
                </div>

                {/* Performance Insights Card */}
                <div className='bg-card rounded-lg border p-6 shadow-sm'>
                    <h3 className='text-card-foreground mb-2 text-lg font-semibold'>Performance Insights</h3>
                    <p className='text-muted-foreground mb-4 text-sm'>Analyze team goals, progress, and achievements</p>
                    <button className='text-primary text-sm hover:underline'>View Analytics →</button>
                </div>

                {/* Attendance & Leaves Card */}
                <div className='bg-card rounded-lg border p-6 shadow-sm'>
                    <h3 className='text-card-foreground mb-2 text-lg font-semibold'>Attendance & Leaves</h3>
                    <p className='text-muted-foreground mb-4 text-sm'>
                        Track attendance patterns and manage leave requests
                    </p>
                    <button className='text-primary text-sm hover:underline'>Manage Attendance →</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
