import { redirect } from 'next/navigation';

/**
 * Home page component that serves as the main entry point
 * Redirects users to the appropriate section based on authentication status
 *
 * @returns JSX.Element - Redirect component (will redirect before rendering)
 */
const HomePage = () => {
    // For now, redirect to the protected dashboard
    // In a real app, you would check authentication status here
    redirect('/dashboard');
};

export default HomePage;
