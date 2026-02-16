import { create } from 'zustand';
import { supabase } from '../supabase';
import { calculateATSScore } from '../utils/atsAnalyzer';
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

const useResumeStore = create((set, get) => ({
    resumes: safeParse('local_resumes', []),
    currentResume: null,

    fetchResumes: async () => {
        try {
            const token = useAuthStore.getState().token;
            if (!token) return;

            const res = await fetch(API_ENDPOINTS.GET_RESUMES, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch resumes');

            const data = await res.json();
            set({ resumes: data });
        } catch (err) {
            console.error('Fetch Error:', err);
        }
    },

    saveResume: async (resumeData) => {
        try {
            const token = useAuthStore.getState().token;
            if (!token) throw new Error('Not authenticated');

            const isUpdate = !!resumeData.id;
            const url = isUpdate
                ? API_ENDPOINTS.UPDATE_RESUME(resumeData.id)
                : API_ENDPOINTS.CREATE_RESUME;
            const method = isUpdate ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(resumeData)
            });

            if (!res.ok) {
                if (res.status === 401) {
                    useAuthStore.getState().logout();
                    window.location.href = '/';
                    throw new Error('Session expired. Please login again.');
                }
                const errorData = await res.json();
                throw new Error(errorData.error || 'Save failed');
            }

            const savedResume = await res.json();

            set((state) => {
                const updated = isUpdate
                    ? state.resumes.map(r => r.id === savedResume.id ? savedResume : r)
                    : [...state.resumes, savedResume];

                const current = state.currentResume?.id === savedResume.id ? savedResume : state.currentResume;

                return { resumes: updated, currentResume: current };
            });
            return savedResume;
        } catch (err) {
            console.error('Save Error:', err);
            throw err;
        }
    },

    deleteResume: async (id) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(API_ENDPOINTS.DELETE_RESUME(id), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Delete failed');

            set((state) => {
                const updated = state.resumes.filter(r => r.id !== id);
                return { resumes: updated };
            });
        } catch (err) {
            console.error('Delete Error:', err);
            throw err;
        }
    },
    setCurrentResume: (resume) => set({ currentResume: resume }),
    clearResumes: () => {
        set({ resumes: [], currentResume: null });
        localStorage.removeItem('local_resumes');
    }
}));

export default useResumeStore;
