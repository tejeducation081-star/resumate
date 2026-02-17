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
                : await register(formData.username, formData.email, formData.password);

            if (!res.success) {
                setError(res.error);
            } else {
                setView('dashboard');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', padding: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                    border: '1px solid var(--border)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>


                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <ResumeLogo size={56} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {!isLogin && (
                        <div>
                            <label><User size={14} style={{ marginRight: '8px' }} /> Full Name</label>
                            <input
                                type="text"
                                placeholder="Julian Bourne"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label><Mail size={14} style={{ marginRight: '8px' }} /> Email Address</label>
                        <input
                            type="email"
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
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--fg-muted)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
