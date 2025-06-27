'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import banner from '@/assets/images/banner.png';
import { AUTH_LAYOUT_INFO, AUTH_LAYOUT_TYPE } from '@/lib/constant';

/**
 * Features list for the banner section
 */
const FEATURES_LIST = [
    {
        id: 'employee-management',
        text: 'Employee Management: View detailed profiles, track performance, and manage attendance.'
    },
    {
        id: 'performance-insights',
        text: 'Performance Insights: Analyze team goals, progress, and achievements.'
    },
    {
        id: 'attendance-leaves',
        text: 'Attendance & Leaves: Track attendance patterns and manage leave requests effortlessly.'
    }
] as const;

/**
 * AuthLayout component for authentication pages
 * Provides a consistent layout with banner and form sections
 *
 * @returns JSX.Element - The authentication layout structure
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const currentPath = usePathname();
    const { title, subtext } = AUTH_LAYOUT_INFO(currentPath.replace(/^\//, '') as AUTH_LAYOUT_TYPE);
    return (
        <div className='m-auto grid h-dvh w-full max-w-[1440px] p-10'>
            <div className='flex flex-col items-center justify-center text-white md:flex-row'>
                {/* Banner Section */}
                <div className='relative flex min-h-[500px] w-full flex-col items-center justify-end overflow-hidden rounded-2xl bg-black p-6 sm:min-h-[600px] sm:p-8 md:min-h-[90vh] md:w-1/2 md:p-10'>
                    {/* Background Image using Next.js Image */}
                    <Image
                        src={banner}
                        alt='Workhive Banner Background'
                        fill
                        className='z-0 object-cover object-center'
                        priority
                        quality={100}
                    />
                    {/* Figma-style top shadow overlay for better text readability */}
                    <div
                        className='pointer-events-none absolute inset-0 z-10'
                        style={{
                            boxShadow: '0px -140px 250px 0px #000000',
                            borderRadius: 'inherit'
                        }}
                    />

                    {/* Content positioned above the image */}
                    <div className='relative z-20 w-full max-w-[635px]'>
                        <h2 className='mb-6 text-left text-3xl font-semibold sm:text-4xl md:text-5xl'>
                            Welcome to WORKHIVE!
                        </h2>
                        <ul className='list-disc space-y-2 pl-5 text-left text-sm text-white sm:text-base'>
                            {FEATURES_LIST.map((feature) => (
                                <li key={feature.id}>{feature.text}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Form Section */}
                <div className='flex w-full items-center justify-center py-10 sm:p-8 md:w-1/2 md:p-12 md:pt-0'>
                    <div className='mx-auto w-full max-w-[385px]'>
                        <h2 className='mb-2 text-2xl leading-snug font-semibold sm:text-3xl md:text-[32px] md:leading-[48px]'>
                            {title}
                        </h2>
                        <div className='text-gray-01 mb-8 text-sm font-normal'>{subtext}</div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
