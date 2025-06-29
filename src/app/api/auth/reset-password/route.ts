import { NextRequest, NextResponse } from 'next/server';

import { mockUsers } from '@/lib/mock-data';

/**
 * Mock reset password API endpoint
 * Updates user password after OTP verification
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, newPassword, confirmPassword } = body;

        // Validate request body
        if (!email || !newPassword || !confirmPassword) {
            return NextResponse.json(
                {
                    error: 'Email, new password, and confirm password are required'
                },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
        }

        // Password validation
        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
        }

        // Check if user exists
        const userIndex = mockUsers.findIndex((u) => u.email === email);
        if (userIndex === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user password
        mockUsers[userIndex].password = newPassword; // In real app, this would be hashed
        mockUsers[userIndex].initialPasswordChangeAt = new Date().toISOString();

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
