import { create } from 'zustand';
import { supabase } from '../supabase';
import { API_ENDPOINTS } from '../config/api';

const safeParse = (key, fallback) => {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch (e) {
        return fallback;
    }
};

const useAuthStore = create((set) => ({
    user: safeParse('user', null),
    token: localStorage.getItem('token') || null,

    login: async (email, password) => {
        try {
            const res = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            set({ user: data.user, token: data.token });
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return { success: true, user: data.user };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    register: async (email, password) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email.split('@')[0], email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            set({ user: data.user, token: data.token });
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    logout: async () => {
        try {
            await fetch(API_ENDPOINTS.LOGOUT, { method: 'POST' });
        } catch (err) {
            console.error('Logout error:', err);
        }
        set({ user: null, token: null });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('local_resumes');
    },

    getProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_ENDPOINTS.AUTH_BASE}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                set({ user: data.user });
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
        }
    },

    checkSession: async () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            set({ token, user: JSON.parse(user) });
            useAuthStore.getState().getProfile();
        }
    },

    checkPremiumStatus: () => {
        const state = useAuthStore.getState();
        const user = state.user;

        if (!user || !user.isPremium) {
            return false;
        }

        // Check if premium has expired
        if (user.premiumExpiresAt) {
            const now = new Date();
            const expiresAt = new Date(user.premiumExpiresAt);

            if (now > expiresAt) {
                // Premium expired, update local state
                const updatedUser = { ...user, isPremium: false, premiumExpiresAt: null };
                set({ user: updatedUser });
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return false;
            }
        }

        return true;
    },
}));

export default useAuthStore;
