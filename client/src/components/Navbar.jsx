import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import ResumeLogo from './ResumeLogo';

const Navbar = ({ setView, currentView }) => {
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const publicLinks = [
        { id: 'landing', label: 'Home' },
        { id: 'features', label: 'Capabilities' },
        { id: 'showcase', label: 'Showcase' },
    ];

    const authLinks = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'templates', label: 'Templates' },
    ];

    // Admin users don't need navigation links (they're always on admin panel)
    // Regular users see Dashboard and Templates
    const navLinks = user?.isAdmin ? [] : authLinks;

    const handleNavClick = (id) => {
        if (!user && (id === 'features' || id === 'showcase')) {
            setView('landing');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            setView(id);
        }
    };

    const handleLogout = async () => {
        await logout();
        setView('landing');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: scrolled ? '10px 0' : '20px 0',
                zIndex: 2000,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
                transition: 'all 0.4s ease'
            }}
        >
            <div
                className="glass-pill"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px 10px 24px',
                    borderRadius: '50px',
                    width: '95%',
                    maxWidth: '1400px',
                    pointerEvents: 'auto',
                    transition: 'all 0.4s ease',
                    boxShadow: scrolled ? '0 10px 40px -10px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.05)'
                }}
            >
                {/* Logo Area */}
                <div
                    onClick={() => setView(user ? 'dashboard' : 'landing')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        marginRight: 'auto'
                    }}
                >
                    <ResumeLogo size={40} dark={true} />
                    <span style={{
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        letterSpacing: '-0.02em',
                        fontFamily: 'var(--font-display)',
                        color: 'var(--fg)'
                    }}>
                        resumate
                    </span>
                </div>

                {/* Conditional Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {(user ? navLinks : publicLinks).map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleNavClick(link.id)}
                            style={{
                                background: currentView === link.id ? 'var(--surface-active)' : 'transparent',
                                border: 'none',
                                color: currentView === link.id ? 'var(--fg)' : 'var(--fg-muted)',
                                padding: '8px 16px',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                borderRadius: '20px',
                                transition: 'all 0.2s',
                                fontFamily: 'var(--font-body)'
                            }}
                            onMouseEnter={(e) => {
                                if (currentView !== link.id) {
                                    e.currentTarget.style.color = 'var(--fg)';
                                    e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentView !== link.id) {
                                    e.currentTarget.style.color = 'var(--fg-muted)';
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Conditional Call to Action */}
                <div style={{ marginLeft: '24px' }}>
                    {user ? (
                        <button
                            className="btn-secondary"
                            style={{ padding: '10px 20px', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--border)' }}
                            onClick={handleLogout}
                        >
                            Sign Out
                        </button>
                    ) : (
                        <button
                            className="btn-primary"
                            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                            onClick={() => setView('auth')}
                        >
                            Start Building
                        </button>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
