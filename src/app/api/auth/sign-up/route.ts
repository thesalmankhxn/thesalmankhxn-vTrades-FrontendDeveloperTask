import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock user database for authentication
 * In a real application, this would be a database
 */
let mockUsers = [
    {
        email: 'tylerdurden@fightclub.com',
        password: 'password123',
        uid: 'on7zjqhpY7ZN64IuB63M47X8zrg2',
        name: 'Tyler Durden',
        initialPasswordChangeAt: null
    },
    {
        email: 'test@example.com',
        password: 'test123',
        uid: 'test-user-123',
        name: 'Test User',
        initialPasswordChangeAt: null
    }
];

/**
 * Generate a unique user ID
 * In a real application, this would be handled by the database
 */
const generateUID = (): string => {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a display name from email
 * @param email - User's email address
 * @returns Generated display name
 */
const generateDisplayName = (email: string): string => {
    const username = email.split('@')[0];
    // Capitalize first letter and replace common separators with spaces
    return username
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .trim();
};

/**
 * Mock sign-up API endpoint
 * Handles user registration and returns mock token and profile data
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate request body
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
        }

        // Password validation
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = mockUsers.find((u) => u.email === email);
        if (existingUser) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
        }

        // Create new user with generated display name
        const newUser = {
            email,
            password, // In real app, this would be hashed
            uid: generateUID(),
            name: generateDisplayName(email),
            initialPasswordChangeAt: null
        };

        // Add user to mock database
        mockUsers.push(newUser);

        // Generate mock JWT token
        const mockToken = `mock-jwt-token-${newUser.uid}-${Date.now()}`;

        // Prepare response data
        const authData = {
            token: mockToken
        };

        const profileData = {
            admin: {
                uid: newUser.uid,
                name: newUser.name,
                email: newUser.email,
                initialPasswordChangeAt: newUser.initialPasswordChangeAt
            }
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            auth: authData,
            profile: profileData
        });
    } catch (error) {
        console.error('Sign-up API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
