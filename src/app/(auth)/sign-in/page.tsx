'use client';

import Link from 'next/link';

import { Show } from '@/components/show';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

import { useForm } from 'react-hook-form';

interface SignInFormData {
    email: string;
    password: string;
}

const SignInPage = () => {
    const { isLoading, loginWithEmailPassword } = useAuth();

    /**
     * React Hook Form setup with validation
     */
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm<SignInFormData>({
        mode: 'onChange', // Validate on change for better UX
        defaultValues: {
            email: '',
            password: ''
        }
    });

    /**
     * Handles form submission for email/password login
     */
    const onSubmit = async (data: SignInFormData) => {
        try {
            await loginWithEmailPassword(data.email, data.password);

            // Reset form on successful login
            reset();

            // Redirect is handled in the useAuth hook
        } catch (error) {
            // Error handling is done in the hook
            console.error('Login failed:', error);
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
                            <div className='flex items-center'>
                                <Label htmlFor='password'>Password</Label>
                            </div>

                            <div className='flex gap-1'>
                                <Input
                                    id='password'
                                    type='password'
                                    placeholder='password'
                                    autoComplete='current-password'
                                    {...register('password', {
                                        required: 'Password is required'
                                    })}
                                    className={cn(errors.password && 'border-red-500')}
                                />
                            </div>
                            <Show when={!!errors.password} fallback={null}>
                                <span className='text-sm text-red-500'>{errors.password?.message}</span>
                            </Show>

                            <div className='mt-1 flex items-center'>
                                <div className='flex items-center gap-2'>
                                    <Checkbox id='remember-me' />
                                    <Label htmlFor='remember-me'>Remember me</Label>
                                </div>
                                <Link
                                    href='/forgot-password'
                                    className='ml-auto inline-block text-xs font-semibold text-[#8854C0] underline'
                                    tabIndex={-1}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            variant='default'
                            type='submit'
                            className='mt-4 w-full'
                            disabled={isLoading || !isValid}>
                            Sign In
                        </Button>
                    </div>

                    <div className='mt-6 flex items-center justify-center gap-2'>
                        <span className='text-xs text-white'>Don&apos;t have an account?</span>
                        <Link
                            href='/sign-up'
                            className={buttonVariants({
                                variant: 'link',
                                className: 'w-fit pl-0 text-left text-xs font-semibold'
                            })}>
                            Sign Up
                        </Link>
                    </div>
                </div>
            </form>
        </>
    );
};

export default SignInPage;
