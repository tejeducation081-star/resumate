import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Calendar, Mail, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import API_BASE_URL from '../config/api';

const AdminPanel = ({ setView }) => {
    const { token } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
            } else {
                showNotification('error', data.error || 'Failed to fetch users');
            }
        } catch (error) {
            showNotification('error', 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleGrantPremium = async (userId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/premium`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                showNotification('success', 'Premium access granted successfully!');
                fetchUsers(); // Refresh user list
            } else {
                showNotification('error', data.error || 'Failed to grant premium');
            }
        } catch (error) {
            showNotification('error', 'Failed to grant premium');
        }
    };

    const handleRevokePremium = async (userId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/premium`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                showNotification('success', 'Premium access revoked successfully!');
                fetchUsers(); // Refresh user list
            } else {
                showNotification('error', data.error || 'Failed to revoke premium');
            }
        } catch (error) {
            showNotification('error', 'Failed to revoke premium');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isPremiumActive = (user) => {
        if (!user.isPremium) return false;
        if (!user.premiumExpiresAt) return true; // Permanent premium (like admin)
        return new Date(user.premiumExpiresAt) > new Date();
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem' }}>
            {/* Notification */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    style={{
                        position: 'fixed',
                        top: '100px',
                        right: '20px',
                        zIndex: 1000,
                        background: notification.type === 'success' ? '#10B981' : '#EF4444',
                        color: 'white',
                        padding: '1rem 1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}
                >
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    {notification.message}
                </motion.div>
            )}

            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <button
                        onClick={() => setView('dashboard')}
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'white',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--fg)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Users size={40} />
                            Admin Panel
                        </h1>
                        <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Manage users and premium subscriptions</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Total Users</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--fg)' }}>{users.length}</div>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Premium Users</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10B981' }}>{users.filter(u => isPremiumActive(u)).length}</div>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Free Users</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6B7280' }}>{users.filter(u => !isPremiumActive(u)).length}</div>
                    </div>
                </div>

                {/* Users Table */}
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fg)' }}>All Users</h2>
                    </div>

                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                            Loading users...
                        </div>
                    ) : users.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                            No users found
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#F9FAFB', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Mail size={16} />
                                                Email
                                            </div>
                                        </th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Username</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <Crown size={16} />
                                                Status
                                            </div>
                                        </th>
                                        <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <Calendar size={16} />
                                                Expires At
                                            </div>
                                        </th>
                                        <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {user.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: 'var(--fg)' }}>{user.email}</div>
                                                        {user.isAdmin && (
                                                            <span style={{ fontSize: '0.75rem', color: '#7C3AED', fontWeight: 600 }}>Admin</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', color: 'var(--fg)' }}>{user.username}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                {isPremiumActive(user) ? (
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.375rem 0.75rem',
                                                        borderRadius: '9999px',
                                                        background: '#D1FAE5',
                                                        color: '#065F46',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600
                                                    }}>
                                                        <Crown size={14} />
                                                        Premium
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        padding: '0.375rem 0.75rem',
                                                        borderRadius: '9999px',
                                                        background: '#F3F4F6',
                                                        color: '#6B7280',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600
                                                    }}>
                                                        Free
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>
                                                {formatDate(user.premiumExpiresAt)}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                {!user.isAdmin && (
                                                    isPremiumActive(user) ? (
                                                        <button
                                                            onClick={() => handleRevokePremium(user.id)}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                borderRadius: '8px',
                                                                background: '#FEE2E2',
                                                                color: '#991B1B',
                                                                border: 'none',
                                                                fontSize: '0.875rem',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = '#FEE2E2'}
                                                        >
                                                            Revoke Premium
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleGrantPremium(user.id)}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                borderRadius: '8px',
                                                                background: '#111827',
                                                                color: 'white',
                                                                border: 'none',
                                                                fontSize: '0.875rem',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = '#111827'}
                                                        >
                                                            Grant Premium
                                                        </button>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
