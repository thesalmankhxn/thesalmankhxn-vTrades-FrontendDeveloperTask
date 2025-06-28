'use client';

import Link from 'next/link';

import { Show } from '@/components/show';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

import { useForm } from 'react-hook-form';

interface SignUpFormData {
    email: string;
    password: string;
    passwordConfirmation: string;
}

const SignUpPage = () => {
    const { isLoading, signupWithEmailPassword } = useAuth();

    /**
     * React Hook Form setup with validation
     */
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch
    } = useForm<SignUpFormData>({
        mode: 'onChange', // Validate on change for better UX
        defaultValues: {
            email: '',
            password: '',
            passwordConfirmation: ''
        }
    });

    // Watch password for confirmation validation
    const password = watch('password');

    /**
     * Handles form submission for email/password signup
     */
    const onSubmit = async (data: SignUpFormData) => {
        try {
            await signupWithEmailPassword(data.email, data.password);

            // Reset form on successful signup
            reset();

            // Redirect is handled in the useAuth hook
        } catch (error) {
            // Error handling is done in the hook
            console.error('Signup failed:', error);
        }
    };

    return (
        <>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className='grid gap-6'>
                        <div className='grid gap-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='tylerdurden@fightclub.com'
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                className={cn(errors.email && 'border-red-500')}
                            />
                            <Show when={!!errors.email} fallback={null}>
                                <span className='text-sm text-red-500'>{errors.email?.message}</span>
                            </Show>
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                autoComplete='new-password'
                                placeholder='Password'
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                className={cn(errors.password && 'border-red-500')}
                            />
                            <Show when={!!errors.password} fallback={null}>
                                <span className='text-sm text-red-500'>{errors.password?.message}</span>
                            </Show>
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor='passwordConfirmation'>Confirm Password</Label>
                            <Input
                                id='passwordConfirmation'
                                type='password'
                                autoComplete='new-password'
                                placeholder='Confirm Password'
                                {...register('passwordConfirmation', {
                                    required: 'Please confirm your password',
                                    validate: (value) => value === password || 'Passwords do not match'
                                })}
                                className={cn(errors.passwordConfirmation && 'border-red-500')}
                            />
                            <Show when={!!errors.passwordConfirmation} fallback={null}>
                                <span className='text-sm text-red-500'>{errors.passwordConfirmation?.message}</span>
                            </Show>
                        </div>

                        <Button
                            variant='default'
                            type='submit'
                            className='mt-4 w-full'
                            disabled={isLoading || !isValid}>
                            Sign Up
                        </Button>
                    </div>

                    <div className='mt-6 flex items-center justify-center gap-2'>
                        <span className='text-xs text-white'>Already have an account?</span>
                        <Link
                            href='/sign-in'
                            className={buttonVariants({
                                variant: 'link',
                                className: 'w-fit pl-0 text-left text-xs font-semibold'
                            })}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </>
    );
};

export default SignUpPage;
