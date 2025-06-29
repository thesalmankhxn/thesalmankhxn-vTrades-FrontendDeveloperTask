import { NextRequest, NextResponse } from 'next/server';

import { generateOTP, mockUsers, otpStorage } from '@/lib/mock-data';

/**
 * Mock forgot password API endpoint
 * Generates and stores OTP for password reset
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate request body
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
        }

        // Check if user exists
        const user = mockUsers.find((u) => u.email === email);
        if (!user) {
            // For security reasons, don't reveal if email exists or not
            // In a real app, you might want to always return success
            return NextResponse.json({
                success: true,
                message: 'If an account with this email exists, a password reset code has been sent'
            });
        }

        // Generate OTP and set expiration (15 minutes from now)
        const otp = generateOTP();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Store OTP with expiration
        otpStorage[email] = {
            otp,
            expiresAt
        };

        // In a real application, you would send this OTP via email/SMS
        console.log(`Password reset OTP for ${email}: ${otp}`);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return NextResponse.json({
            success: true,
            message: 'Password reset code has been sent to your email',
            data: {
                email: email,
                expiresIn: '15 minutes'
            }
        });
    } catch (error) {
        console.error('Forgot password API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
