'use client';

import { useRouter } from 'next/navigation';

import { Modal } from '@/components/modal';
import { Show } from '@/components/show';
import { Button } from '@/components/ui/button';
import { CheckedIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

import { Controller, useForm } from 'react-hook-form';

interface CreateNewPasswordFormData {
    password: string;
    confirmPassword: string;
}

const CreateNewPasswordPage = () => {
    const { isLoading } = useAuth();
    const router = useRouter();

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
            // await sendPasswordResetEmail(auth, data.email);

            // Reset form on successful login
            reset();

            // Redirect is handled in the useAuth hook
        } catch (error) {
            // Error handling is done in the hook
            console.error('Login failed:', error);
        }
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
                                        value: 8,
                                        message: 'Password must be at least 8 characters long'
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

                        <Modal
                            icon={<CheckedIcon />}
                            title='Password Created!'
                            description='Your password has been successfully updated. You can now use your new password to log in.'
                            action={() => router.push('/dashboard')}
                            trigger={
                                <Button
                                    variant='default'
                                    type='submit'
                                    className='mt-4 w-full'
                                    disabled={isLoading || !isValid}>
                                    Continue
                                </Button>
                            }
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default CreateNewPasswordPage;
