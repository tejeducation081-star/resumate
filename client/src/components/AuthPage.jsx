import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';
import ResumeLogo from './ResumeLogo';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

const AuthPage = ({ setView }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, register } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = isLogin
                ? await login(formData.email, formData.password)
                : await register(formData.email, formData.password);

            if (!res.success) {
                setError(res.error);
            } else {
                if (res.user?.isAdmin) {
                    setView('admin');
                } else {
                    setView('dashboard');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-soft)', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: 'clamp(1.5rem, 5vw, 3rem)',
                    borderRadius: '24px',
                    border: '1px solid var(--border)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <ResumeLogo size={56} />
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
                        {isLogin ? 'Resumate' : 'Join Resumate'}
                    </h1>
                    <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {isLogin ? 'Access your career infrastructure.' : 'Begin your journey to the top 1%.'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label><Mail size={14} style={{ marginRight: '8px' }} /> Email Address</label>
                        <input
                            type="text"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label><Lock size={14} style={{ marginRight: '8px' }} /> Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                <span>{isLogin ? 'Authorize' : 'Initialize Account'}</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        onClick={() => setView('landing')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', background: 'none', border: 'none', color: 'var(--fg-muted)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, opacity: 0.7 }}
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
