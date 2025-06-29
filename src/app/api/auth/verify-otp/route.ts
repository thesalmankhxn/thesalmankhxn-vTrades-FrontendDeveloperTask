import { NextRequest, NextResponse } from 'next/server';

import { mockUsers, otpStorage } from '@/lib/mock-data';

/**
 * Mock OTP verification API endpoint
 * Validates OTP for password reset
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        // Validate request body
        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return NextResponse.json({ error: 'Please enter a valid 6-digit code' }, { status: 400 });
        }

        // Check if user exists
        const user = mockUsers.find((u) => u.email === email);
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or OTP' }, { status: 401 });
        }

        // For testing: Accept any 6-digit OTP
        // In production, you would verify against stored OTP
        console.log(`OTP verification for ${email}: ${otp} (accepted for testing)`);

        // Remove any existing OTP for this email
        delete otpStorage[email];

        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('OTP verification API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
