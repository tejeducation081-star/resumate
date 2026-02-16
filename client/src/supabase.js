
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
    try {
        return url && url.startsWith('http') && !url.includes('YOUR_SUPABASE_URL');
    } catch {
        return false;
    }
};

export const supabase = isValidUrl(supabaseUrl) && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : {
        // Mock client to prevent crash when keys are missing AND simulate success for Demo Mode
        auth: {
            signInWithPassword: ({ email }) => {
                const username = email.split('@')[0];
                const user = { id: 'demo-user-123', email, username };
                return Promise.resolve({
                    data: { user, session: { access_token: 'demo-token-123' } },
                    error: null
                });
            },
            signUp: ({ email, options }) => {
                const username = options?.data?.username || email.split('@')[0];
                const user = { id: 'demo-user-123', email, username };
                return Promise.resolve({
                    data: { user, session: { access_token: 'demo-token-123' } },
                    error: null
                });
            },
            signOut: () => Promise.resolve({ error: null }),
            getSession: () => {
                const localUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
                const user = localUser || { id: 'demo-user-123', username: 'Harshvi Vora' }; // Fallback for immediate fix
                return Promise.resolve({
                    data: {
                        session: { access_token: 'demo-token-123', user }
                    },
                    error: null
                });
            },
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        },
        from: () => ({
            select: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'MISSING DATABASE KEYS: Cannot fetch data.' } }) }),
            upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'MISSING DATABASE KEYS: Please provide Supabase credentials.' } }) }) }),
            delete: () => ({ eq: () => Promise.resolve({ error: { message: 'MISSING DATABASE KEYS: Cannot delete data.' } }) }),
        })
    };
