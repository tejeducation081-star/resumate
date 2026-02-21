import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, User, Briefcase, Menu, X } from 'lucide-react';
import useAuthStore from '../store/authStore';
import ResumeLogo from './ResumeLogo';

const Navbar = ({ setView, currentView }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('landing');
    const { user, logout } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll Spy Logic
    useEffect(() => {
        if (currentView !== 'landing') return;

        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -40% 0px', // More sensitive to top of section
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        // Fallback for the very top of the page
        const handleTopScroll = () => {
            if (window.scrollY < 100) {
                setActiveSection('landing');
            }
        };
        window.addEventListener('scroll', handleTopScroll);

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = ['landing', 'workflow', 'faq', 'contact'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleTopScroll);
        };
    }, [currentView]);

    const isLanding = currentView === 'landing';
    const isActive = (id) => {
        if (isLanding && ['landing', 'workflow', 'faq', 'contact'].includes(id)) {
            return activeSection === id;
        }
        return currentView === id;
    };

    const publicLinks = [
        { id: 'landing', label: 'Home' },
        { id: 'workflow', label: 'Workflow' },
        { id: 'faq', label: 'FAQ' },
        { id: 'contact', label: 'Support' },
        { id: 'templates', label: 'Templates' },
        { id: 'editor', label: 'Build' },
    ];

    const navLinks = user?.isAdmin
        ? [{ id: 'admin', label: 'Admin Panel' }]
        : [
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'profile', label: 'Master Profile' },
            { id: 'jobs', label: 'Job Hub' },
        ];

    const scrollableIds = ['landing', 'workflow', 'faq', 'contact'];

    const handleNavClick = (id) => {
        setIsMobileMenuOpen(false);
        if (id === 'landing') {
            if (currentView === 'landing') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setView('landing');
                window.scrollTo({ top: 0 });
            }
            return;
        }

        if (scrollableIds.includes(id)) {
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
                    padding: scrolled ? '8px 0' : '12px 0',
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
                        maxWidth: scrolled ? '1200px' : '1400px', // Slightly shrink when scrolled for focus
                        pointerEvents: 'auto',
                        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
                        background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--border)'
                    }}
                >
                    {/* Logo Area */}
                    <div
                        onClick={() => handleNavClick(user ? 'dashboard' : 'landing')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        <ResumeLogo size={32} dark={true} />
                        <span style={{
                            fontWeight: 800,
                            fontSize: '1.4rem',
                            fontFamily: 'var(--font-display)',
                            color: '#0091FF',
                            letterSpacing: '-0.03em',
                            transition: 'all 0.3s'
                        }}>
                            resumate
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {(user ? navLinks : publicLinks).map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavClick(link.id)}
                                style={{
                                    background: isActive(link.id) ? 'var(--accent-glow)' : 'transparent',
                                    border: 'none',
                                    color: isActive(link.id) ? 'var(--accent)' : 'var(--fg-muted)',
                                    padding: '6px 12px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    borderRadius: '20px',
                                    fontFamily: 'var(--font-body)',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive(link.id)) e.target.style.color = 'var(--fg)';
                                    e.target.style.background = 'var(--surface-active)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive(link.id)) {
                                        e.target.style.color = 'var(--fg-muted)';
                                        e.target.style.background = 'transparent';
                                    }
                                }}
                            >
                                {link.id === 'jobs' && <Sparkles size={14} style={{ color: 'var(--accent)' }} />}
                                {link.label}
                            </button>
                        ))}

                        <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }}></div>

                        {user ? (
                            <button
                                className="btn-secondary"
                                style={{ padding: scrolled ? '8px 16px' : '10px 20px', fontSize: '0.85rem', borderRadius: '20px' }}
                                onClick={handleLogout}
                            >
                                Sign Out
                            </button>
                        ) : (
                            <button
                                className="btn-primary"
                                style={{ padding: scrolled ? '8px 16px' : '10px 20px', fontSize: '0.85rem', borderRadius: '30px' }}
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
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 1999,
                            padding: '120px 2rem 2rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            overflowY: 'auto'
                        }}
                    >
                        {(user ? navLinks : publicLinks).map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavClick(link.id)}
                                style={{
                                    textAlign: 'left',
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                    background: isActive(link.id) ? 'var(--surface-active)' : 'none',
                                    border: 'none',
                                    color: isActive(link.id) ? 'var(--accent)' : 'var(--fg)',
                                    padding: '12px 20px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span>{link.label}</span>
                                {isActive(link.id) && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}></div>}
                            </button>
                        ))}

                        <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>

                        {user ? (
                            <button className="btn-secondary" onClick={handleLogout} style={{ width: '100%', padding: '16px', borderRadius: '16px' }}>Sign Out</button>
                        ) : (
                            <button className="btn-primary" onClick={() => setView('auth')} style={{ width: '100%', padding: '16px', borderRadius: '16px' }}>Sign In</button>
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
