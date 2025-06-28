import { type ReactNode } from 'react';

import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';

import { ThemeProvider } from 'next-themes';

import '@/app/globals.css';
import SessionProviders from '@/providers/session-providers';

// Import Source Sans Pro from Google Fonts with proper configuration
const sourceSansPro = Source_Sans_3({
    subsets: ['latin'],
    variable: '--font-source-sans-pro',
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    display: 'swap'
});

export const metadata: Metadata = {
    title: 'vTrades - Employee Management Platform',
    description: 'Comprehensive employee management system with performance tracking and attendance management',
    keywords: 'employee management, HR, performance tracking, attendance, workforce',
    authors: [{ name: 'vTrades Team' }],
    robots: 'index, follow'
};

/**
 * Root layout component that wraps the entire application
 * Provides theme context, global styling, error boundary, and React provider
 *
 * @param children - React components to be rendered
 * @returns JSX.Element - The root layout structure
 */
const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html suppressHydrationWarning lang='en'>
            <body className={`${sourceSansPro.variable} bg-primary-bg text-foreground antialiased`}>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    <SessionProviders>{children}</SessionProviders>
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
