import { create } from 'zustand';
import { API_ENDPOINTS } from '../config/api';
import useAuthStore from './authStore';

const safeParse = (key, fallback) => {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch (e) {
        return fallback;
    }
};

const useProfileStore = create((set, get) => ({
    profile: safeParse('user_profile', {
        title: '',
        targetTitle: '',
        skills: [],
        location: '',
        salary: '',
        industry: '',
        bio: ''
    }),

    fetchProfile: async () => {
        try {
            const token = useAuthStore.getState().token;
            if (!token) return;

            const res = await fetch(`${API_ENDPOINTS.AUTH_BASE}/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch profile');

            const data = await res.json();
            set({ profile: data });
            localStorage.setItem('user_profile', JSON.stringify(data));
        } catch (err) {
            console.error('Fetch Profile Error:', err);
        }
    },

    updateProfile: async (profileData) => {
        try {
            const token = useAuthStore.getState().token;
            if (!token) throw new Error('Not authenticated');

            const res = await fetch(`${API_ENDPOINTS.AUTH_BASE}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Update failed');
            }

            const updatedProfile = await res.json();
            set({ profile: updatedProfile });
            localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
            return updatedProfile;
        } catch (err) {
            console.error('Update Profile Error:', err);
            throw err;
        }
    }
}));

export default useProfileStore;
