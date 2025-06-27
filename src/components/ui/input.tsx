import * as React from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Eye, EyeOff } from 'lucide-react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='relative w-full'>
            {isPassword && (
                <div className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer'>
                    <button
                        type='button'
                        tabIndex={-1}
                        className='mt-1 px-2'
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                </div>
            )}
            <input
                type={isPassword && showPassword ? 'text' : type}
                data-slot='input'
                className={cn(
                    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-[50px] w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-semibold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    className
                )}
                {...props}
            />
        </div>
    );
}

export { Input };
