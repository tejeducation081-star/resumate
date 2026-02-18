import React, { useEffect, useState } from 'react';
import useResumeStore from '../store/resumeStore';
import useAuthStore from '../store/authStore';
import { Plus, Search, FileText, Zap, TrendingUp, Briefcase, Trash2, Layout, MoreVertical, ExternalLink, Globe } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import TemplatePreview from './TemplatePreview';
import { calculateATSScore } from '../utils/atsAnalyzer';
import JobSearch from './JobSearch';


const Dashboard = ({ setView }) => {
    const { resumes, fetchResumes, setCurrentResume, deleteResume, isPreviewing, setIsPreviewing } = useResumeStore();
    const [searchQuery, setSearchQuery] = useState('');
    const { user, getProfile } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Preview Modal State
    const [previewResume, setPreviewResume] = useState(null);
    const [isJobSearchOpen, setIsJobSearchOpen] = useState(false);

    useEffect(() => {
        if (isPreviewing) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isPreviewing]);

    useEffect(() => {
        fetchResumes();
        getProfile();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, [fetchResumes, getProfile]);

    const handleEdit = (e, resume) => {
        e.stopPropagation();
        setIsPreviewing(false);
        setCurrentResume(resume);
        setView('editor');
    };

    const handlePreview = (resume) => {
        setPreviewResume(resume);
        setIsPreviewing(true);
    };

    const handleExportPDF = (e, resume) => {
        e.stopPropagation();
        const element = document.getElementById(`resume-render-${resume.id}`);
        if (element) {
            const printWindow = window.open('', '_blank');
            // Empty title prevents the title from appearing in the header
            printWindow.document.write('<html><head><title> </title>');

            // Clone style tags
            Array.from(document.getElementsByTagName('style')).forEach(style => {
                printWindow.document.write(style.outerHTML);
            });

            // CRITICAL: CSS to remove browser headers/footers
            printWindow.document.write(`
                <style>
                    @page { 
                        margin: 0mm; 
                        size: auto;
                    }
                    body { 
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Remove any potential browser-added bits */
                    header, footer { display: none !important; }
                </style>
            `);

            printWindow.document.write('</head><body>');
            printWindow.document.write(element.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();

            // Wait for styles and images to load
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 800);
        }
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return date.toLocaleDateString();
    };


    const filteredResumes = (resumes || []).filter(r =>
        (r.personalDetails?.fullName || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const stats = [
        {
            label: 'Active Archives',
            value: user?.isPremium ? resumes.length : `${resumes.length}/2`,
            icon: FileText,
            color: 'var(--accent)',
            progress: user?.isPremium ? 100 : Math.min((resumes.length / 2) * 100, 100)
        },
        {
            label: 'Peak Precision',
            value: resumes.length > 0 ? Math.max(...resumes.map(r => calculateATSScore(r).score)) + '%' : '0%',
            icon: TrendingUp,
            color: '#10B981',
            progress: resumes.length > 0 ? Math.max(...resumes.map(r => calculateATSScore(r).score)) : 0
        }
    ];


    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', position: 'relative', overflowX: 'hidden' }}>
            {/* Background Ambience - More Dynamic */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)',
                zIndex: 0
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>

                {/* Top Navigation / Breadcrumb Look */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--fg-muted)' }}>
                    <span style={{ color: 'var(--accent)' }}>System</span> / <span>Commander</span> / <span>Dashboard</span>
                </div>

                {/* Hero Header */}
                <header style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Kirtan'}
                            </h1>
                            <p style={{ fontSize: '1rem', color: 'var(--fg-muted)', fontWeight: 500 }}>
                                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </motion.div>
                    </div>
                </header>


                {/* Intelligence Row */}
                <div className="responsive-grid" style={{ marginBottom: '2rem' }}>
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -4, background: 'var(--surface-highlight)' }}
                            className="glass-panel"
                            style={{
                                padding: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem',
                                borderRadius: '20px',
                                minHeight: '100px'
                            }}
                        >
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '12px',
                                background: `${stat.color}10`,
                                color: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <stat.icon size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{stat.label}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--fg)', lineHeight: 1 }}>{stat.value}</div>
                                <div style={{ height: '4px', width: '100%', background: 'var(--bg-soft)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.5rem' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.progress}%` }}
                                        style={{ height: '100%', background: stat.color }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Compact Expansion Card */}
                    {!user?.isPremium && (
                        <motion.div
                            whileHover={{ y: -4, boxShadow: 'var(--shadow-glow)' }}
                            className="glass-panel"
                            style={{
                                padding: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))',
                                border: '1px solid var(--accent)',
                                borderRadius: '20px',
                                minHeight: '120px'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--accent)' }}>Scale Operations</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>Unlock infinite architectures.</p>
                            </div>
                            <button className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.75rem', borderRadius: '12px' }}>UPGRADE</button>
                        </motion.div>
                    )}
                </div>




                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'start' }}>


                    <div>
                        {/* Search, Filter & New Architecture Box Row */}
                        {/* Pipeline Header with Integrated Action */}
                        <div className="mobile-stack" style={{ marginBottom: '1.5rem', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Production Pipeline</h2>
                                <p style={{ color: 'var(--fg-muted)', fontSize: '0.95rem' }}>{resumes.length} active architectures ready for deployment.</p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (!user?.isPremium && resumes.length >= 2) {
                                        alert("SYSTEM LIMIT REACHED: Free accounts are restricted to 2 active architectures. Please upgrade to Scale Operations to unlock infinite capacity.");
                                    } else {
                                        setView('templates');
                                    }
                                }}
                                className="btn-primary"
                                style={{
                                    padding: '0 2rem',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    height: '56px',
                                    width: '100%',
                                    maxWidth: '280px',
                                    opacity: (!user?.isPremium && resumes.length >= 2) ? 0.6 : 1,
                                    cursor: (!user?.isPremium && resumes.length >= 2) ? 'not-allowed' : 'pointer',
                                    background: (!user?.isPremium && resumes.length >= 2) ? 'var(--fg-muted)' : 'var(--accent)',
                                    boxShadow: '0 12px 24px -8px var(--accent-glow)'
                                }}
                            >
                                <Plus size={20} strokeWidth={3} />
                                {(!user?.isPremium && resumes.length >= 2) ? 'LIMIT REACHED' : 'NEW ARCHITECTURE'}
                            </motion.button>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="responsive-grid"
                        >
                            <AnimatePresence>
                                {filteredResumes.length > 0 ? filteredResumes.map((resume) => (
                                    <motion.div
                                        key={resume.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -10, boxShadow: 'var(--shadow-md)' }}

                                        className="glass-panel"
                                        style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', borderRadius: '24px' }}
                                        onClick={() => handlePreview(resume)}
                                    >
                                        <div style={{ height: '280px', background: 'var(--bg-soft)', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ transform: 'scale(0.3)', transformOrigin: 'top left', width: '210mm', position: 'absolute', top: '24px', left: '24px', background: 'white', boxShadow: '0 15px 45px rgba(0,0,0,0.2)' }}>
                                                <TemplatePreview data={resume} />
                                            </div>
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-soft) 0%, transparent 80%)' }}></div>

                                        </div>

                                        <div style={{ padding: '2rem' }}>
                                            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.3rem' }}>{resume.personalDetails?.fullName || 'Untitled'}</h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>Updated {getTimeAgo(resume.updated_at || resume.updatedAt || resume.createdAt)}</span>

                                                        {(() => {
                                                            const { score } = calculateATSScore(resume);
                                                            const color = score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
                                                            return score > 0 && (
                                                                <div style={{ padding: '2px 8px', borderRadius: '6px', background: `${color}15`, color, fontSize: '0.8rem', fontWeight: 700, border: `1px solid ${color}30` }}>
                                                                    {score}%
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                                <MoreVertical size={20} color="var(--fg-muted)" />
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <button onClick={(e) => handleEdit(e, resume)} className="btn-secondary" style={{ flex: 1, padding: '10px 12px', fontSize: '0.85rem', borderRadius: '12px', minWidth: '100px' }}>Edit</button>
                                                <button onClick={(e) => handleExportPDF(e, resume)} className="btn-primary" style={{ flex: 1, padding: '10px 12px', fontSize: '0.85rem', borderRadius: '12px', minWidth: '100px' }}>Export PDF</button>
                                                <button
                                                    className="btn-secondary"
                                                    style={{ padding: '10px 14px', color: '#ef4444', borderRadius: '12px', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                                    onClick={(e) => { e.stopPropagation(); if (window.confirm('Erase this architecture?')) deleteResume(resume.id); }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>





                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--fg-muted)', borderRadius: '24px' }}>
                                        <Briefcase size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                        <h3 style={{ fontSize: '1.25rem', color: 'var(--fg)', marginBottom: '0.5rem' }}>No Data Fragments</h3>
                                        <p style={{ fontSize: '0.9rem' }}>Your production pipeline is currently idle. Initialize a new architecture to begin.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>


                </div>

                {/* Hidden Renders for PDF extraction */}
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden' }}>
                    {(resumes || []).map(r => (
                        <div key={r.id} id={`resume-render-${r.id}`}>
                            <TemplatePreview data={r} />
                        </div>
                    ))}
                </div>

                {/* Preview Modal */}
                <AnimatePresence>
                    {isPreviewing && previewResume && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsPreviewing(false)}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="glass-panel"
                                style={{
                                    width: '95%',
                                    maxWidth: '1000px',
                                    maxHeight: '90vh',
                                    background: 'var(--bg)',
                                    borderRadius: '32px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)'
                                }}
                            >
                                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{previewResume.personalDetails?.fullName}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>Architecture Preview Mode</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={() => setIsPreviewing(false)}
                                            style={{ background: 'var(--bg-soft)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: 'var(--fg)' }}
                                        >
                                            <Plus style={{ transform: 'rotate(45deg)' }} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ flex: 1, overflowY: 'auto', padding: '3rem', background: '#f3f4f6', display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ background: 'white', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '210mm', minHeight: '297mm', padding: '0' }}>
                                        <TemplatePreview data={previewResume} />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Job Search Modal */}
                <JobSearch
                    isOpen={isJobSearchOpen}
                    onClose={() => setIsJobSearchOpen(false)}
                    searchQuery={previewResume?.personalDetails?.jobTitle || ''}
                    location={previewResume?.personalDetails?.location || ''}
                />

            </div>
        </div >
    );
};

export default Dashboard;
