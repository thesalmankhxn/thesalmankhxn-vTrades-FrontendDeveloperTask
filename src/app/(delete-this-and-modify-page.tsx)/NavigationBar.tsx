import Link from 'next/link';

import ThemeSwitch from '@/app/(delete-this-and-modify-page.tsx)/ThemeSwitch';

const NavigationBar = () => {
    return (
        <div className='flex w-full items-center justify-between gap-6 sm:justify-end sm:px-6'>
            <ThemeSwitch />
        </div>
    );
};

export default NavigationBar;
