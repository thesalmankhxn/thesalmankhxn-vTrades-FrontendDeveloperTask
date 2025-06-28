'use client';

import { cn } from '@/lib/utils';

import { Show } from './show';
import { Button } from './ui/button';
import { GithubIcon, GoogleIcon } from './ui/icons';
import { signIn } from 'next-auth/react';

export default function SignIn({ provider }: { provider: string }) {
    return (
        <div className='w-full'>
            <Show when={provider === 'github'}>
                <GithubSignInButton />
            </Show>
            <Show when={provider === 'google'}>
                <GoogleSignInButton />
            </Show>
        </div>
    );
}

const GithubSignInButton = () => {
    /**
     * Handles GitHub OAuth sign-in
     */
    const handleGithubSignIn = async () => {
        try {
            await signIn('github', { callbackUrl: '/dashboard' });
        } catch (error) {
            console.error('Failed to sign in with GitHub:', error);
        }
    };

    return (
        <Button
            variant='outline'
            className={cn('w-full gap-2 !border-[#30303D] !bg-[#1D1E26] text-sm !font-normal !text-white')}
            type='button'
            onClick={handleGithubSignIn}>
            <GithubIcon />
            Sign in with Github
        </Button>
    );
};

const GoogleSignInButton = () => {
    /**
     * Handles Google OAuth sign-in
     */
    const handleGoogleSignIn = async () => {
        try {
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch (error) {
            console.error('Failed to sign in with Google:', error);
        }
    };

    return (
        <Button
            variant='outline'
            className={cn('w-full gap-2 !border-[#30303D] !bg-[#1D1E26] text-sm !font-normal !text-white')}
            type='button'
            onClick={handleGoogleSignIn}>
            <GoogleIcon />
            Sign in with Google
        </Button>
    );
};

export { GithubSignInButton, GoogleSignInButton };
