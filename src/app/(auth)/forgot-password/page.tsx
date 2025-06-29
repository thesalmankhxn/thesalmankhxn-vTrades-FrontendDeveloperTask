'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Show } from '@/components/show';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { EmailIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePasswordReset } from '@/hooks/use-password-reset';
import { cn } from '@/lib/utils';

import { useForm } from 'react-hook-form';

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPasswordPage = () => {
    const router = useRouter();
    const { isLoading, error, requestPasswordReset, clearError } = usePasswordReset();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    /**
     * React Hook Form setup with validation
     */
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm<ForgotPasswordFormData>({
        mode: 'onChange', // Validate on change for better UX
        defaultValues: {
            email: ''
        }
    });

    /**
     * Handles form submission for password reset request
     */
    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            const success = await requestPasswordReset(data.email);

            if (success) {
                // Reset form on successful request
                reset();
                // Show success modal
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Password reset request failed:', error);
        }
    };

    /**
     * Handle navigation to OTP verification
     */
    const handleNavigateToOTP = () => {
        setShowSuccessModal(false);
        router.push('/otp-verification');
    };

    return (
        <>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className='grid gap-6'>
                        <div className='grid gap-2'>
                            <Label htmlFor='email'>Email Address</Label>
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

                        {/* Show API error if any */}
                        <Show when={!!error} fallback={null}>
                            <div className='rounded-md border border-red-200 bg-red-50 p-3'>
                                <span className='text-sm text-red-600'>{error}</span>
                                <button
                                    type='button'
                                    onClick={clearError}
                                    className='ml-2 text-sm text-red-500 underline hover:text-red-700'>
                                    Dismiss
                                </button>
                            </div>
                        </Show>

                        <Button
                            variant='default'
                            type='submit'
                            className='mt-4 w-full'
                            disabled={isLoading || !isValid}>
                            {isLoading ? 'Sending...' : 'Submit'}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Success Modal - Controlled Dialog */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <div className='mb-8 flex items-center justify-center'>
                            <EmailIcon />
                        </div>
                        <DialogTitle className='mb-3'>Link Sent Successfully</DialogTitle>
                        <DialogDescription className='mb-3'>
                            Check your inbox! We've sent you an email with instructions to reset your password.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className='sm:justify-end'>
                        <DialogClose asChild>
                            <Button
                                type='button'
                                variant='default'
                                className='h-[50px] w-[116px] text-base text-white'
                                onClick={handleNavigateToOTP}>
                                Okay
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ForgotPasswordPage;
