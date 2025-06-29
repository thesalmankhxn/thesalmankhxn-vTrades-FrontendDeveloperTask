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
import { CheckedIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePasswordReset } from '@/hooks/use-password-reset';
import { cn } from '@/lib/utils';

import { Controller, useForm } from 'react-hook-form';

interface CreateNewPasswordFormData {
    password: string;
    confirmPassword: string;
}

const CreateNewPasswordPage = () => {
    const router = useRouter();
    const { isLoading, error, resetPassword, clearError } = usePasswordReset();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    /**
     * React Hook Form setup with validation using Controller
     */
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch
    } = useForm<CreateNewPasswordFormData>({
        mode: 'onChange',
        reValidateMode: 'onSubmit',
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    /**
     * Handles form submission for password creation
     */
    const onSubmit = async (data: CreateNewPasswordFormData) => {
        try {
            const success = await resetPassword(data.password, data.confirmPassword);

            if (success) {
                // Reset form on successful password reset
                reset();
                // Show success modal
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Password reset failed:', error);
        }
    };

    /**
     * Handle navigation to dashboard
     */
    const handleNavigateToDashboard = () => {
        setShowSuccessModal(false);
        router.push('/dashboard');
    };

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    return (
        <>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className='grid gap-6'>
                        <div className='grid gap-2'>
                            <Label htmlFor='password'>New Password</Label>
                            <Controller
                                name='password'
                                control={control}
                                rules={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters long'
                                    }
                                }}
                                render={({ field }) => (
                                    <Input
                                        id='password'
                                        type='password'
                                        placeholder='********'
                                        {...field}
                                        className={cn(errors.password && 'border-red-500')}
                                    />
                                )}
                            />
                            <Show when={!!errors.password} fallback={null}>
                                <span className='text-sm text-red-500'>{errors.password?.message}</span>
                            </Show>
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor='confirmPassword'>Re-enter your new password</Label>
                            <Controller
                                name='confirmPassword'
                                control={control}
                                rules={{
                                    required: 'Confirm Password is required',
                                    validate: (value) => {
                                        if (value !== password) {
                                            return "Oops! Passwords Don't Match";
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field }) => (
                                    <Input
                                        id='confirmPassword'
                                        type='password'
                                        placeholder='********'
                                        {...field}
                                        className={cn(errors.confirmPassword && 'border-red-500')}
                                    />
                                )}
                            />
                            <Show when={!!errors.confirmPassword} fallback={null}>
                                <span className='text-sm text-red-500'>{errors.confirmPassword?.message}</span>
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
                            {isLoading ? 'Updating...' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Success Modal - Controlled Dialog */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <div className='mb-8 flex items-center justify-center'>
                            <CheckedIcon />
                        </div>
                        <DialogTitle className='mb-3'>Password Created!</DialogTitle>
                        <DialogDescription className='mb-3'>
                            Your password has been successfully updated. You can now use your new password to log in.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className='sm:justify-end'>
                        <DialogClose asChild>
                            <Button
                                type='button'
                                variant='default'
                                className='h-[50px] w-[116px] text-base text-white'
                                onClick={handleNavigateToDashboard}>
                                Okay
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateNewPasswordPage;
