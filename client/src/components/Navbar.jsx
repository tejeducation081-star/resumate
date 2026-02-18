import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, User, Briefcase, Menu, X } from 'lucide-react';
import useAuthStore from '../store/authStore';
import ResumeLogo from './ResumeLogo';

const Navbar = ({ setView, currentView }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const publicLinks = [
        { id: 'landing', label: 'Home' },
        { id: 'templates', label: 'Templates' },
        { id: 'editor', label: 'Build' },
    ];

    const navLinks = user?.isAdmin
        ? [{ id: 'admin', label: 'Admin Panel' }]
        : [{ id: 'dashboard', label: 'Dashboard' }];

    const handleNavClick = (id) => {
        setIsMobileMenuOpen(false);
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
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
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
                        boxShadow: scrolled ? 'var(--shadow-md)' : 'none'
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
                        }}
                    >
                        <ResumeLogo size={32} dark={true} />
                        <span style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            fontFamily: 'var(--font-display)',
                            color: 'var(--fg)',
                            display: 'block',
                            transition: 'all 0.3s'
                        }}>
                            resumate
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                    fontFamily: 'var(--font-body)',
                                }}
                            >
                                {link.label}
                            </button>
                        ))}

                        {user && !user.isAdmin && (
                            <button
                                className="btn-primary"
                                onClick={() => setView('jobs')}
                                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                            >
                                <Briefcase size={14} /> Get Job
                            </button>
                        )}

                        {user ? (
                            <button
                                className="btn-secondary"
                                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                                onClick={handleLogout}
                            >
                                Sign Out
                            </button>
                        ) : (
                            <button
                                className="btn-primary"
                                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                                onClick={() => setView('auth')}
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-only"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ background: 'none', border: 'none', color: 'var(--fg)', cursor: 'pointer' }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Overlay Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'var(--bg)',
                            zIndex: 1999,
                            padding: '100px 2rem 2rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}
                    >
                        {(user ? navLinks : publicLinks).map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavClick(link.id)}
                                style={{
                                    textAlign: 'left',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    background: 'none',
                                    border: 'none',
                                    color: currentView === link.id ? 'var(--accent)' : 'var(--fg)',
                                    padding: '10px 0'
                                }}
                            >
                                {link.label}
                            </button>
                        ))}

                        {user && !user.isAdmin && (
                            <button
                                className="btn-primary"
                                onClick={() => setView('jobs')}
                                style={{ justifyContent: 'center', width: '100%' }}
                            >
                                <Briefcase size={20} /> Get Job
                            </button>
                        )}

                        {user ? (
                            <button className="btn-secondary" onClick={handleLogout} style={{ width: '100%' }}>Sign Out</button>
                        ) : (
                            <button className="btn-primary" onClick={() => setView('auth')} style={{ width: '100%' }}>Sign In</button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                    .mobile-only { display: block !important; }
                }
                @media (min-width: 769px) {
                    .desktop-only { display: flex !important; }
                    .mobile-only { display: none !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;
