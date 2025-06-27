import { useProfileStore } from '@/stores/use-profile-store';

/**
 * Custom hook for profile management
 * Provides easy access to profile data and actions
 */
export const useProfile = () => {
    const { admin, setProfile, setProfileFromFirebaseUser, clearProfile } = useProfileStore();

    return {
        // Profile data
        profile: admin,
        isAuthenticated: !!admin,

        // Profile actions
        setProfile,
        setProfileFromFirebaseUser,
        clearProfile,

        // Convenience getters
        userName: admin?.name || 'User',
        userEmail: admin?.email || '',
        userPhoto: admin?.profilePhoto,
        userId: admin?.uid
    };
};
