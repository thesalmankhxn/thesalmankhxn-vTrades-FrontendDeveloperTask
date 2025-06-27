import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

const spinnerVariants = cva('relative block', {
    variants: {
        size: {
            sm: 'w-4 h-4',
            md: 'w-6 h-6',
            lg: 'w-8 h-8'
        }
    },
    defaultVariants: {
        size: 'sm'
    }
});

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {
    asChild?: boolean;
    children?: React.ReactNode;
}

const Spinner = ({
    ref,
    size,
    asChild = false,
    children,
    ...props
}: SpinnerProps & {
    ref?: React.RefObject<HTMLSpanElement>;
}) => {
    const Comp = asChild ? Slot : 'span';

    const renderSpinnerIcon = (
        <Comp className={cn(spinnerVariants({ size }))} ref={ref} {...props}>
            {Array.from({ length: 8 }).map((_, i) => (
                <span
                    key={i}
                    className='animate-spinner-leaf-fade absolute top-0 left-1/2 h-full w-[12.5%]'
                    style={{
                        transform: `rotate(${i * 45}deg)`,
                        animationDelay: `${-(7 - i) * 100}ms`
                    }}>
                    <span className={cn('block h-[30%] w-full rounded-full bg-current')}></span>
                </span>
            ))}
        </Comp>
    );

    if (children) {
        <span className='flex items-center gap-2'>
            {renderSpinnerIcon}
            {children}
        </span>;
    }

    return renderSpinnerIcon;
};

Spinner.displayName = 'Spinner';

export { Spinner };
