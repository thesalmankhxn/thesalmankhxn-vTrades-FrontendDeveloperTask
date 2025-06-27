'use client';

import { useRouter } from 'next/navigation';

import { Show } from '@/components/show';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
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
    const { isLoading } = useAuth();
    const router = useRouter();

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
     * Handles OTP verification form submission
     */
    const onSubmit = async (data: OTPFormData) => {
        try {
            console.log('OTP submitted:', data.otp);
            // TODO: Implement OTP verification logic here
            // await verifyOTP(data.otp);

            // Reset form on successful verification
            reset();

            // Redirect to create new password page
            router.push('/create-new-password');
        } catch (error) {
            // Error handling is done in the hook
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
                        <Label className='text-primary text-base font-normal'>Change Email Address</Label>
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

                        <div className='my-2 flex items-center gap-2 text-[#A0A0A0]'>
                            <TimerIcon className='size-3.5' />
                            <span className='text-sm'>30 Sec</span>
                        </div>

                        <Button
                            variant='default'
                            type='submit'
                            className='mt-4 w-full'
                            disabled={isLoading || !isValid || otpValue.length !== 6}>
                            Continue
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default OTPVerificationPage;
