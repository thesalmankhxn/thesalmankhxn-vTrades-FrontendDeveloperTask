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
}

interface Actions {
    setProfile: (admin: AdminType) => void;
    clearProfile: () => void;
}

export const useProfileStore = create<State & Actions>()(
    devtools(
        persist(
            (set) => ({
                admin: null,
                setProfile: (admin) => set({ admin }),
                clearProfile: () => set({ admin: null })
            }),
            {
                name: 'profile'
            }
        )
    )
);
