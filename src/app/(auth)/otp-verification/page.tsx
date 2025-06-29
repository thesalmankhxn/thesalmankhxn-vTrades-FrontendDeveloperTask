'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Show } from '@/components/show';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePasswordReset } from '@/hooks/use-password-reset';
import { cn } from '@/lib/utils';

import { TimerIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import OtpInput from 'react-otp-input';

/**
 * Form data interface for OTP verification
 */
interface OTPFormData {
    otp: string;
}

const OTPVerificationPage = () => {
    const router = useRouter();
    const { isLoading, error, verifyOTP, clearError, requestPasswordReset } = usePasswordReset();

    // Timer state
    const [timeLeft, setTimeLeft] = useState(30);
    const [canResend, setCanResend] = useState(false);

    /**
     * React Hook Form setup with validation for OTP
     */
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch
    } = useForm<OTPFormData>({
        mode: 'onChange', // Validate on change for better UX
        defaultValues: {
            otp: ''
        }
    });

    // Watch the OTP value for validation
    const otpValue = watch('otp');

    /**
     * Timer effect for countdown
     */
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    /**
     * Format time for display
     */
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    /**
     * Handle resend OTP
     */
    const handleResendOTP = async () => {
        const email = localStorage.getItem('password-reset-email');
        if (!email) {
            clearError();
            // Show error message in the existing error display
            return;
        }

        try {
            const success = await requestPasswordReset(email);
            if (success) {
                // Reset timer
                setTimeLeft(30);
                setCanResend(false);
                clearError();
            }
        } catch (error) {
            console.error('Resend OTP failed:', error);
        }
    };

    /**
     * Handles OTP verification form submission
     */
    const onSubmit = async (data: OTPFormData) => {
        try {
            const success = await verifyOTP(data.otp);

            if (success) {
                // Reset form on successful verification
                reset();
                // Redirect to create new password page
                router.push('/create-new-password');
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
        }
    };

    /**
     * Custom render function for OTP input fields
     */
    const renderInput = (inputProps: any, state: any) => {
        return (
            <Input
                {...inputProps}
                className={cn(
                    // Base styles
                    '!h-12 !w-12 rounded-lg text-center !text-2xl font-medium',
                    'border border-[#30303D] bg-[#1D1E26] text-white',
                    'focus:ring-opacity-20 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
                    'transition-all duration-200',

                    // State-based styling
                    state.isActive && 'border-blue-500 bg-[#1D1E26]',
                    state.isFilled && 'border-green-500 bg-[#1D1E26]',

                    // Responsive design for small screens
                    'sm:h-12 sm:w-12 sm:text-lg',
                    'max-sm:mx-1 max-sm:h-10 max-sm:w-10 max-sm:text-base',

                    // Remove default input styling
                    'appearance-none',
                    'placeholder:text-gray-400'
                )}
                maxLength={1}
                placeholder='0'
            />
        );
    };

    return (
        <>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className='grid gap-6'>
                        <button
                            onClick={() => router.push('/forgot-password')}
                            className='text-primary mr-auto text-base font-normal'>
                            Change Email Address
                        </button>
                        <div className='grid gap-2'>
                            <Controller
                                name='otp'
                                control={control}
                                rules={{
                                    required: 'OTP is required',
                                    minLength: {
                                        value: 6,
                                        message: 'OTP must be 6 digits'
                                    },
                                    maxLength: {
                                        value: 6,
                                        message: 'OTP must be 6 digits'
                                    },
                                    pattern: {
                                        value: /^\d{6}$/,
                                        message: 'OTP must contain only numbers'
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <OtpInput
                                        value={value}
                                        onChange={onChange}
                                        shouldAutoFocus={true}
                                        numInputs={6}
                                        renderInput={renderInput}
                                        containerStyle={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '10px'
                                        }}
                                    />
                                )}
                            />
                            <Show when={!!errors.otp} fallback={null}>
                                <span className='text-sm text-red-500'>{errors.otp?.message}</span>
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

                        {/* Timer and Resend Section */}
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 text-[#A0A0A0]'>
                                <TimerIcon className='size-3.5' />
                                <span className='text-sm'>{canResend ? 'Resend available' : formatTime(timeLeft)}</span>
                            </div>

                            {canResend && (
                                <button
                                    type='button'
                                    onClick={handleResendOTP}
                                    disabled={isLoading}
                                    className='text-sm text-blue-500 underline hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50'>
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <Button
                            variant='default'
                            type='submit'
                            className='mt-4 w-full'
                            disabled={isLoading || !isValid || otpValue.length !== 6}>
                            {isLoading ? 'Verifying...' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default OTPVerificationPage;
