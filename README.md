# Existing Users/Credentials
1. **Tyler Durden**
    - Email: `tylerdurden@fightclub.com`
    - Password: `password123`
    - UID: `on7zjqhpY7ZN64IuB63M47X8zrg2`

2. **Test User**
    - Email: `test@example.com`
    - Password: `test123`
    - UID: `test-user-123`

# App Flow

## Authentication Flow

### Unauthenticated Users
- Users are automatically redirected to the `/sign-in` page when accessing protected routes
- Users can authenticate using email/password
- Successful authentication redirects users to the `/dashboard`

### Authenticated Users
- Users are automatically redirected to the `/dashboard` when accessing auth pages
- Protected routes are accessible only to authenticated users
- Session persistence across browser refreshes using localStorage

### Navigation Structure
- **Public Routes**: `/sign-in`, `/sign-up`, `/forgot-password`, `/otp-verification`, `/create-new-password`
- **Protected Routes**: `/dashboard` and all dashboard sub-routes
- **Fallback**: Unauthorized access attempts redirect to `/sign-in`

### App Flow
- `/sign-in` > `/dashboard`
- `/sign-up` > `/sign-in` > `/dashboard`
- `/forgot-password` > `/otp-verification` > `/create-new-password` > `/dashboard`

### State Management
- Authentication state is managed globally using Zustand stores
- Profile data is synchronized across all components
- Automatic logout on token expiration or manual logout action

## 🚀 What's Included

- **Next.js 15**
- **React 19**
- **TypeScript 5**
- **ESLint 9**
- **Prettier 3**
- **Tailwind CSS 4**
- **App Directory**
- **System, Light & Dark Mode**
- **Next.js Bundle Analyzer**
- **Dockerfile** with Node.js 22.16.0 (Alpine)
- **Dockerfile.bun** with Bun 1.2.17 (Alpine)

## 🏁 Getting Started

### Prerequisites

- **Bun**: Version 1.2.17 or higher OR
- **Node.js**: Version 20.18.0 or higher
- **Docker**: For containerized deployment (optional but recommended)

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/siddharthamaity/thesalmankhxn/vTrades/FrontendDeveloperTask.git
    cd thesalmankhxn/vTrades/FrontendDeveloperTask
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    # or with Yarn
    yarn install
    # or with pnpm
    pnpm install
    # or with Bun
    bun install
    ```

3. **Run Development Server**:
    ```bash
    npm run dev
    # or with Yarn
    yarn dev
    # or with pnpm
    pnpm dev
    # or with Bun
    bun dev
    ```

4. **Build for Production**:
    ```bash
    npm run build
    # or with Yarn
    yarn build
    # or with pnpm
    pnpm build
    # or with Bun
    bun run build
    ```

### ☁ Try it in the Cloud

[![Open in VS Code](https://img.shields.io/badge/Open%20in-VS%20Code-blue?logo=visualstudiocode)](https://vscode.dev/github/SiddharthaMaity/thesalmankhxn/vTrades/FrontendDeveloperTask)

# Hybrid Authentication System

This project now includes a hybrid authentication system that combines mock APIs for email/password authentication with NextAuth OAuth for Google and GitHub authentication.

## Features

### 🔐 Authentication Methods

- **Email/Password**: Mock API endpoints for sign-in and sign-up
- **Google OAuth**: NextAuth Authentication
- **GitHub OAuth**: NextAuth Authentication

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

- Uses NextAuth Authentication
- Stores user data in localStorage for consistency
- Handles popup blocking and cancellation errors
- Generates mock tokens for unified state management

### GitHub OAuth

- Uses NextAuth Authentication
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
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                    # Auth layout wrapper
│   │   ├── sign-in/page.tsx              # Sign-in page
│   │   ├── sign-up/page.tsx              # Sign-up page
│   │   ├── forgot-password/page.tsx      # Forgot password page
│   │   ├── otp-verification/page.tsx     # OTP verification page
│   │   └── create-new-password/page.tsx  # Create new password page
│   ├── api/auth/
│   │   ├── sign-in/route.ts              # Mock sign-in API
│   │   └── sign-up/route.ts              # Mock sign-up API
│   ├── dashboard/
│   │   ├── layout.tsx                    # Dashboard layout
│   │   └── page.tsx                      # Dashboard page
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx                          # Home page
│   ├── globals.css                       # Global styles
│   └── fonts/                            # Font files
├── components/
│   ├── ui/                               # Reusable UI components
│   │   ├── avatar.tsx                    # Avatar component
│   │   ├── button.tsx                    # Button component
│   │   ├── card.tsx                      # Card component
│   │   ├── checkbox.tsx                  # Checkbox component
│   │   ├── dialog.tsx                    # Dialog component
│   │   ├── dropdown-menu.tsx             # Dropdown menu component
│   │   ├── form.tsx                      # Form component
│   │   ├── icons.tsx                     # Icon components
│   │   ├── input.tsx                     # Input component
│   │   ├── label.tsx                     # Label component
│   │   ├── separator.tsx                 # Separator component
│   │   ├── sheet.tsx                     # Sheet component
│   │   ├── skeleton.tsx                  # Skeleton component
│   │   ├── spinner.tsx                   # Spinner component
│   │   └── tooltip.tsx                   # Tooltip component
│   ├── modal.tsx                         # Modal component
│   └── show.tsx                          # Show component
├── hooks/
│   ├── use-auth.ts                       # Auth hook
│   ├── use-profile.ts                    # Profile management hook
│   └── use-mobile.ts                     # Mobile detection hook
├── lib/
│   ├── storage.ts                        # LocalStorage utilities
│   ├── constant.ts                       # Application constants
│   └── utils.ts                          # Utility functions
├── stores/
│   ├── use-auth-store.ts                 # Auth state management
│   └── use-profile-store.ts              # Profile state management
└── assets/
    └── images/
        └── banner.png                    # Banner image
```

### Key Features

1. **Hybrid Authentication**: Mock APIs for email/password, NextAuth for OAuth
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Validation**: Client-side and server-side validation
5. **Persistence**: Auth state persists across browser sessions
6. **Loading States**: Proper loading indicators during API calls
7. **Toast Notifications**: User feedback using Sonner toast library
8. **Unified State**: Consistent data structure for all users

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
- Signs out from NextAuth (if OAuth user)
- Redirects to sign-in page

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

The mock system provides a realistic authentication experience for development and testing purposes.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p style="text-align: center;"> With ❤️ from 🇮🇳 </p>
