'use client';

import { useRouter } from 'next/navigation';

import { Modal } from '@/components/modal';
import { Show } from '@/components/show';
import { Button } from '@/components/ui/button';
import { CheckedIcon, EmailIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

import { useForm } from 'react-hook-form';

interface CreateNewPasswordFormData {
    password: string;
    confirmPassword: string;
}

const CreateNewPasswordPage = () => {
    const { isLoading } = useAuth();
    const router = useRouter();
    /**
     * React Hook Form setup with validation
     */
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch
    } = useForm<CreateNewPasswordFormData>({
        mode: 'onChange', // Validate on change for better UX
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    /**
     * Handles form submission for email/password login
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
                            <Input
                                id='password'
                                type='password'
                                placeholder='********'
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters long'
                                    },
                                    validate: (value) => {
                                        if (value !== confirmPassword) {
                                            return 'Oops! Passwords Don’t Match';
                                        }
                                        return true;
                                    }
                                })}
                                className={cn(errors.password && 'border-red-500')}
                            />
                            <Show when={!!errors.password} fallback={null}>
                                <span className='text-sm text-red-500'>{errors.password?.message}</span>
                            </Show>
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor='confirmPassword'>Re-enter your new password</Label>
                            <Input
                                id='confirmPassword'
                                type='password'
                                placeholder='********'
                                {...register('confirmPassword', {
                                    required: 'Confirm Password is required',
                                    validate: (value) => {
                                        if (value !== password) {
                                            return 'Oops! Passwords Don’t Match';
                                        }
                                        return true;
                                    }
                                })}
                                className={cn(errors.confirmPassword && 'border-red-500')}
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
