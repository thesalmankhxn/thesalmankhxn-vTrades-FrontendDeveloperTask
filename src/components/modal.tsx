import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';

export function Modal({
    icon,
    title,
    description,
    trigger,
    action
}: {
    icon?: React.ReactNode;
    title: string;
    description: string;
    trigger: React.ReactNode;
    action?: () => void;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <div className='mb-8 flex items-center justify-center'>{icon}</div>
                    <DialogTitle className='mb-3'>{title}</DialogTitle>
                    <DialogDescription className='mb-3'>{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className='sm:justify-end' onClick={action}>
                    <DialogClose asChild>
                        <Button type='button' variant='default' className='h-[50px] w-[116px] text-base text-white'>
                            Okay
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
