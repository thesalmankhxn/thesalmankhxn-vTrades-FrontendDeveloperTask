# Hybrid Authentication System

This project now includes a hybrid authentication system that combines mock APIs for email/password authentication with Firebase OAuth for Google and GitHub authentication.

## Features

### 🔐 Authentication Methods

- **Email/Password**: Mock API endpoints for sign-in and sign-up
- **Google OAuth**: Firebase Authentication
- **GitHub OAuth**: Firebase Authentication

### 💾 Local Storage Integration

- Auth tokens stored in localStorage with structure: `{"state":{"token":"mock-jwt-token-..."},"version":0}`
- Profile data stored in localStorage with structure: `{"state":{"admin":{"uid":"...","name":"...","email":"...","initialPasswordChangeAt":null}},"version":0}`

### 🔄 State Management

- Zustand stores for auth and profile data
- Automatic persistence across page refreshes
- SSR-compatible localStorage handling
- Unified data structure for both mock and OAuth users

## Mock API Endpoints

- **POST `/api/auth/sign-in`** - Email/password authentication
- **POST `/api/auth/sign-up`** - User registration

## Mock User Credentials

For testing purposes, the following mock users are available:

### Existing Users

1. **Tyler Durden**
    - Email: `tylerdurden@fightclub.com`
    - Password: `password123`
    - UID: `on7zjqhpY7ZN64IuB63M47X8zrg2`

2. **Test User**
    - Email: `test@example.com`
    - Password: `test123`
    - UID: `test-user-123`

### New User Registration

You can register new users through the sign-up form. The system will:

- Validate email format
- Ensure password is at least 6 characters
- Check for existing email addresses
- Generate unique UIDs for new users
- Generate display names from email addresses

## OAuth Integration

### Google OAuth

- Uses Firebase Authentication
- Stores user data in localStorage for consistency
- Handles popup blocking and cancellation errors
- Generates mock tokens for unified state management

### GitHub OAuth

- Uses Firebase Authentication
- Stores user data in localStorage for consistency
- Handles account conflicts and popup errors
- Generates mock tokens for unified state management

## API Response Format

### Successful Sign-in/Sign-up Response

```json
{
    "success": true,
    "message": "Login successful",
    "auth": {
        "token": "mock-jwt-token-user-123-1234567890"
    },
    "profile": {
        "admin": {
            "uid": "user-123",
            "name": "John Doe",
            "email": "john@example.com",
            "initialPasswordChangeAt": null
        }
    }
}
```

### Error Response

```json
{
    "error": "Invalid email or password"
}
```

## Implementation Details

### File Structure

```
src/
├── app/api/auth/
│   ├── sign-in/route.ts      # Mock sign-in API
│   └── sign-up/route.ts      # Mock sign-up API
├── lib/
│   ├── firebase.config.ts    # Firebase configuration
│   └── storage.ts            # LocalStorage utilities
├── hooks/
│   └── use-auth.ts           # Hybrid auth hook
├── stores/
│   ├── useAuthStore.ts       # Auth state management
│   └── useProfileStore.ts    # Profile state management
└── app/(auth)/
    ├── sign-in/page.tsx      # Sign-in page
    └── sign-up/page.tsx      # Sign-up page
```

### Key Features

1. **Hybrid Authentication**: Mock APIs for email/password, Firebase for OAuth
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Validation**: Client-side and server-side validation
5. **Persistence**: Auth state persists across browser sessions
6. **Loading States**: Proper loading indicators during API calls
7. **Toast Notifications**: User feedback using Sonner toast library
8. **Unified State**: Same data structure for all authentication methods

## Usage

### Email/Password Sign In

1. Navigate to `/sign-in`
2. Enter valid credentials (see mock users above)
3. Click "Sign In"

### Email/Password Sign Up

1. Navigate to `/sign-up`
2. Fill in email and password fields
3. Click "Sign Up" to create a new account

### OAuth Authentication

1. Click "Sign in with Google" or "Sign in with GitHub"
2. Complete OAuth flow in popup
3. User data is automatically saved to localStorage

### Logout

- Use the logout function from `useAuth` hook
- Clears both localStorage and Zustand stores
- Signs out from Firebase (if OAuth user)
- Redirects to sign-in page

## Firebase Configuration

Make sure your Firebase configuration is properly set up in `src/lib/firebase.config.ts`:

```typescript
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
```

## Security Notes

⚠️ **Important**: This is a hybrid implementation for development/testing purposes. In production:

- Use proper JWT tokens with expiration
- Implement password hashing for mock API
- Add rate limiting
- Use secure session management
- Implement proper OAuth flows
- Add CSRF protection
- Use HTTPS only
- Consider using a single authentication provider

## Testing

You can test the authentication flow by:

1. Starting the development server: `npm run dev`
2. Navigating to `/sign-in` or `/sign-up`
3. Using the provided mock credentials for email/password
4. Using OAuth buttons for Google/GitHub authentication
5. Checking browser localStorage to see stored data
6. Refreshing the page to verify persistence

The hybrid system provides a realistic authentication experience while allowing for both mock and real OAuth authentication methods.
