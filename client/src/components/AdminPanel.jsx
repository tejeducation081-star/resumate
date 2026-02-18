import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Calendar, Mail, ArrowLeft, CheckCircle, XCircle, Upload, Loader2, FileSpreadsheet, Trash2 } from 'lucide-react';
import Papa from 'papaparse';
import useAuthStore from '../store/authStore';
import API_BASE_URL from '../config/api';

const AdminPanel = ({ setView }) => {
    const { token } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', email: '' });

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

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to permanently remove this user and all their data? This action cannot be undone.')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                showNotification('success', 'User removed from network');
                fetchUsers();
            } else {
                showNotification('error', data.error || 'Failed to remove user');
            }
        } catch (error) {
            showNotification('error', 'Network error');
        }
    };

    const formatDate = (user) => {
        let dateToFormat = user.premiumExpiresAt;

        // If premium but no expire date set, calculate 1 month from creation
        if (!dateToFormat && user.isPremium && user.createdAt) {
            const created = new Date(user.createdAt);
            created.setMonth(created.getMonth() + 1);
            dateToFormat = created;
        }

        if (!dateToFormat) return 'N/A';
        const date = new Date(dateToFormat);
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

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newUser.email || !newUser.password) {
            showNotification('error', 'Email and Password are required');
            return;
        }

        const userPayload = {
            ...newUser,
            username: newUser.email.split('@')[0]
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ users: [userPayload] })
            });

            const data = await res.json();
            if (res.ok && data.stats.success > 0) {
                showNotification('success', 'User created with full access!');
                setNewUser({ username: '', password: '', email: '' });
                setShowCreateForm(false);
                fetchUsers();
            } else {
                showNotification('error', data.stats?.errors?.[0] || 'Failed to create user');
            }
        } catch (error) {
            showNotification('error', 'Network error');
        }
    };

    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                // Map common column names
                const importedData = results.data.map(row => ({
                    username: row.username || row.ID || row.Id || row.User || row.username,
                    password: row.password || row.Password || row.Pass || row.password,
                    email: row.email || row.Email || row.email
                })).filter(u => u.username && u.password);

                if (importedData.length === 0) {
                    showNotification('error', 'No valid user data found. CSV must contain "username" and "password" columns.');
                    setIsImporting(false);
                    return;
                }

                try {
                    const res = await fetch(`${API_BASE_URL}/api/admin/import`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ users: importedData })
                    });

                    const data = await res.json();
                    if (res.ok) {
                        showNotification('success', `Import Finished: ${data.stats.success} users synced to network!`);
                        fetchUsers();
                    } else {
                        showNotification('error', data.error || 'Import failed');
                    }
                } catch (error) {
                    showNotification('error', 'Network error during import');
                } finally {
                    setIsImporting(false);
                    e.target.value = null; // Reset input
                }
            },
            error: (err) => {
                showNotification('error', 'Failed to parse CSV file');
                setIsImporting(false);
                e.target.value = null;
            }
        });
    };

    const handleDownloadSampleCSV = () => {
        const headers = ["username", "password", "email"];
        const rows = [
            ["candidate_alpha", "network_pass_1", "alpha@example.com"],
            ["candidate_beta", "secure_link_2", "beta@example.com"]
        ];

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "resumate_sample_import.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportUsers = () => {
        if (users.length === 0) {
            showNotification('error', 'No data to export');
            return;
        }

        const headers = ["ID", "Username", "Email", "Status", "Expires At", "Created At"];
        const rows = users.map(user => [
            user.id,
            user.username,
            user.email,
            isPremiumActive(user) ? "Premium" : "Free",
            user.premiumExpiresAt || formatDate(user),
            user.createdAt
        ]);

        const csvContent = [headers, ...rows].map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `resumate_users_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('success', 'User data exported successfully!');
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
                {/* Header - Simplified */}
                <div className="mobile-stack" style={{ marginBottom: '3rem', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Users size={32} />
                            Admin Panel
                        </h1>
                        <p style={{ color: 'var(--fg-muted)', fontSize: '1rem' }}>Active Architecture Network Intelligence</p>
                    </div>

                    <button
                        onClick={handleExportUsers}
                        className="btn-primary"
                        style={{
                            padding: '12px 24px',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            borderRadius: '14px',
                            background: 'var(--accent)',
                            boxShadow: '0 8px 20px -6px var(--accent-glow)',
                            width: '100%',
                            maxWidth: '280px'
                        }}
                    >
                        <FileSpreadsheet size={20} />
                        EXPORT ALL DATA
                    </button>
                </div>



                {/* Users Table */}
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fg)' }}>Active Network Node Access</h2>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="btn-secondary"
                                style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                            >
                                {showCreateForm ? 'Cancel' : 'Create User'}
                            </button>

                            <input
                                type="file"
                                id="csv-import"
                                hidden
                                accept=".csv"
                                onChange={handleImportCSV}
                                disabled={isImporting}
                            />
                            <label
                                htmlFor="csv-import"
                                className="btn-primary"
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '0.85rem',
                                    cursor: isImporting ? 'default' : 'pointer',
                                    background: isImporting ? 'var(--muted)' : 'var(--fg)',
                                    opacity: isImporting ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isImporting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FileSpreadsheet size={16} />
                                        Bulk Import Users (CSV)
                                    </>
                                )}
                            </label>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <button
                                    onClick={handleDownloadSampleCSV}
                                    className="btn-secondary"
                                    style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Upload size={16} />
                                    Download Sample
                                </button>
                                <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 500, textAlign: 'center' }}>
                                    Match sample CSV format for bulk import
                                </span>
                            </div>
                        </div>
                    </div>

                    {showCreateForm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            style={{ padding: '1.5rem', background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}
                        >
                            <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-muted)', display: 'block', marginBottom: '0.5rem' }}>Email ID</label>
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        required
                                        style={{ height: '40px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-muted)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        required
                                        style={{ height: '40px' }}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ padding: '0 24px', height: '40px', fontSize: '0.85rem' }}>
                                    Confirm Access
                                </button>
                            </form>
                        </motion.div>
                    )}

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
                                                {formatDate(user)}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    style={{
                                                        color: '#EF4444',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.background = '#FEE2E2'}
                                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
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
