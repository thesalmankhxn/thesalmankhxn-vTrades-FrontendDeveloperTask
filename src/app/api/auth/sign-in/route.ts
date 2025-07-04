import { NextRequest, NextResponse } from 'next/server';

import { mockUsers } from '@/lib/mock-data';

/**
 * Mock sign-in API endpoint
 * Handles email/password authentication and returns mock token and profile data
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate request body
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Find user in mock database
        const user = mockUsers.find((u) => u.email === email);

        console.log('user', user);

        // Check if user exists and password matches
        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Generate mock JWT token (in real app, this would be a proper JWT)
        const mockToken = `mock-jwt-token-${user.uid}-${Date.now()}`;

        // Prepare response data
        const authData = {
            token: mockToken
        };

        const profileData = {
            admin: {
                uid: user.uid,
                name: user.name,
                email: user.email,
                initialPasswordChangeAt: user.initialPasswordChangeAt
            }
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            auth: authData,
            profile: profileData
        });
    } catch (error) {
        console.error('Sign-in API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
