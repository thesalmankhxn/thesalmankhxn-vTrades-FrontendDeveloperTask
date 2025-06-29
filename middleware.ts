import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Custom middleware to handle authentication and route protection
 * Protects dashboard routes and handles authentication redirects
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
        // Check for authentication tokens/cookies
        const hasAuthCookie =
            request.cookies.has('next-auth.session-token') || request.cookies.has('__Secure-next-auth.session-token');

        // Check for custom auth token in localStorage (we'll check this on client side)
        // For now, we'll rely on the client-side auth check in the dashboard layout

        // If no NextAuth session found, redirect to sign-in
        if (!hasAuthCookie) {
            const signInUrl = new URL('/sign-in', request.url);
            return NextResponse.redirect(signInUrl);
        }
    }

    // Allow all other requests to proceed
    return NextResponse.next();
}

/**
 * Configure which routes to run middleware on
 */
export const config = {
    matcher: ['/dashboard/:path*']
};
