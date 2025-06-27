'use client';

import { useRouter } from 'next/navigation';

import { Modal } from '@/components/modal';
import { Show } from '@/components/show';
import { Button } from '@/components/ui/button';
import { EmailIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

import { useForm } from 'react-hook-form';

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPasswordPage = () => {
    const { isLoading } = useAuth();
    const router = useRouter();
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
     * Handles form submission for email/password login
     */
    const onSubmit = async (data: ForgotPasswordFormData) => {
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

                        <Modal
                            icon={<EmailIcon />}
                            title='Link Sent Successfully'
                            description='Check your inbox! We’ve sent you an email with instructions to reset your password.'
                            action={() => router.push('/otp-verification')}
                            trigger={
                                <Button
                                    variant='default'
                                    type='submit'
                                    className='mt-4 w-full'
                                    disabled={isLoading || !isValid}>
                                    Submit
                                </Button>
                            }
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default ForgotPasswordPage;
