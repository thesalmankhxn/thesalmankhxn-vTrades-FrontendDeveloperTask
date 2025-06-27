import type { User } from 'firebase/auth';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AdminType {
    uid: string;
    name: string;
    email: string;
    profilePhoto?: string;
    initialPasswordChangeAt: string | null;
    profilePhotoThumbnail?: { url: string };
}

interface State {
    admin: AdminType | null;
    clearProfile: () => void;
}

interface Actions {
    setProfile: (admin: AdminType) => void;
    setProfileFromFirebaseUser: (user: User) => void;
}

export const useProfileStore = create<State & Actions>()(
    devtools(
        persist(
            (set) => ({
                admin: null,
                setProfile: (admin) => set({ admin }),
                setProfileFromFirebaseUser: (user) =>
                    set({
                        admin: {
                            uid: user.uid,
                            name: user.displayName || user.email?.split('@')[0] || 'User',
                            email: user.email || '',
                            profilePhoto: user.photoURL || undefined,
                            initialPasswordChangeAt: null, // Will be set when user changes password
                            profilePhotoThumbnail: user.photoURL ? { url: user.photoURL } : undefined
                        }
                    }),
                clearProfile: () => set({ admin: null })
            }),
            {
                name: 'profile'
            }
        )
    )
);
