import React, { useEffect, useState } from 'react';
import useResumeStore from '../store/resumeStore';
import useAuthStore from '../store/authStore';
import { Plus, Search, FileText, Zap, TrendingUp, Briefcase, Trash2, Layout, MoreVertical, ExternalLink, Globe } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import TemplatePreview from './TemplatePreview';
import { calculateATSScore } from '../utils/atsAnalyzer';


const Dashboard = ({ setView }) => {
    const { resumes, fetchResumes, setCurrentResume, deleteResume } = useResumeStore();
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchResumes();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, [fetchResumes]);

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
            value: `${resumes.length}/2`,
            icon: FileText,
            color: 'var(--accent)',
            progress: Math.min((resumes.length / 2) * 100, 100)
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
                <header style={{ marginBottom: '4rem' }}>
                    <div className="flex-between" style={{ alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Kirtan'}
                            </h1>
                            <p style={{ fontSize: '1.25rem', color: 'var(--fg-muted)', fontWeight: 500 }}>
                                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} — System Status: <span style={{ color: '#10B981' }}>Optimized</span>
                            </p>
                        </motion.div>
                    </div>
                </header>


                {/* Intelligence Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -8, background: 'var(--surface-highlight)' }}

                            className="glass-panel"
                            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)', height: '210px' }}
                        >
                            <div className="flex-between">
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</span>
                                <div style={{ padding: '8px', borderRadius: '10px', background: `${stat.color}15`, color: stat.color }}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--fg)', lineHeight: 1, margin: '0.5rem 0' }}>{stat.value}</div>
                            <div style={{ height: '4px', width: '100%', background: 'var(--bg-soft)', borderRadius: '2px', overflow: 'hidden', marginTop: 'auto' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.progress}%` }}
                                    style={{ height: '100%', background: stat.color }}
                                />
                            </div>
                        </motion.div>
                    ))}

                    {/* Scale Operations Card */}
                    <motion.div
                        whileHover={{ y: -8, boxShadow: 'var(--shadow-glow)' }}
                        className="glass-panel"
                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', textAlign: 'center', border: '2px solid var(--accent)', background: 'var(--surface-highlight)', borderRadius: '24px', height: '210px' }}

                    >
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expansion</span>
                            <Zap size={20} color="var(--accent)" />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>Scale Operations</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', maxWidth: '240px', margin: '0 auto' }}>Unlock infinite architectures and elite templates.</p>
                        </div>
                        <button className="btn-primary" style={{ padding: '0.7rem', fontSize: '0.85rem', width: '100%', marginTop: '0.5rem' }}>UPGRADE TO PRO</button>
                    </motion.div>
                </div>




                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) 350px', gap: '4rem', alignItems: 'start' }}>


                    <div>
                        {/* Search, Filter & New Architecture Box Row */}
                        <div style={{ marginBottom: '3rem', display: 'flex', gap: '1rem', height: '56px' }}>
                            <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 1.25rem', borderRadius: '14px' }}>
                                <Search size={18} color="var(--fg-muted)" />
                                <input
                                    placeholder="Search archives..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--fg)',
                                        fontSize: '0.95rem',
                                        padding: '0 0.75rem',
                                        width: '100%',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <button className="glass-panel" style={{ padding: '0 1.25rem', borderRadius: '14px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>Filters</span>
                            </button>
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (resumes.length >= 2) {
                                        alert("SYSTEM LIMIT REACHED: Free accounts are restricted to 2 active architectures. Please upgrade to Scale Operations to unlock infinite capacity.");
                                    } else {
                                        setView('templates');
                                    }
                                }}
                                className="btn-primary"
                                style={{
                                    padding: '0 1.5rem',
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    height: '100%',
                                    whiteSpace: 'nowrap',
                                    opacity: resumes.length >= 2 ? 0.6 : 1,
                                    cursor: resumes.length >= 2 ? 'not-allowed' : 'pointer',
                                    background: resumes.length >= 2 ? 'var(--fg-muted)' : 'var(--accent)'
                                }}
                            >
                                <Plus size={18} strokeWidth={3} />
                                {resumes.length >= 2 ? 'LIMIT REACHED' : 'NEW ARCHITECTURE'}
                            </motion.button>

                        </div>



                        {/* Resume Pipeline Header */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Production Pipeline</h2>
                            <p style={{ color: 'var(--fg-muted)', fontSize: '1rem' }}>{resumes.length} active architectures ready for deployment.</p>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}
                        >
                            <AnimatePresence>
                                {filteredResumes.length > 0 ? filteredResumes.map((resume) => (
                                    <motion.div
                                        key={resume.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -10, boxShadow: 'var(--shadow-md)' }}

                                        className="glass-panel"
                                        style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', borderRadius: '24px' }}
                                        onClick={() => { setCurrentResume(resume); setView('editor'); }}
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

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
                                                <button className="btn-primary" style={{ padding: '8px 4px', fontSize: '0.85rem', background: 'var(--bg-soft)', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: '8px' }}>Edit Card</button>
                                                <button className="btn-primary" style={{ padding: '8px 4px', fontSize: '0.85rem', borderRadius: '8px' }}>Export PDF</button>
                                                <button
                                                    className="glass-panel"
                                                    style={{ padding: '0 8px', color: '#ef4444', borderRadius: '8px' }}
                                                    onClick={(e) => { e.stopPropagation(); if (window.confirm('Erase this architecture?')) deleteResume(resume.id); }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                <motion.button
                                                    whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0, 66, 154, 0.4)' }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="btn-primary"
                                                    style={{
                                                        padding: '10px',
                                                        fontSize: '0.75rem',
                                                        background: 'linear-gradient(135deg, #00429a 0%, #002b66 100%)',
                                                        color: 'white',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        fontWeight: 700
                                                    }}
                                                    onClick={(e) => { e.stopPropagation(); window.open('https://www.naukri.com/mnjuser/homepage', '_blank'); }}
                                                >
                                                    <Globe size={14} /> Naukri
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(37, 87, 167, 0.4)' }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="btn-primary"
                                                    style={{
                                                        padding: '10px',
                                                        fontSize: '0.75rem',
                                                        background: 'linear-gradient(135deg, #2557a7 0%, #173d7a 100%)',
                                                        color: 'white',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        fontWeight: 700
                                                    }}
                                                    onClick={(e) => { e.stopPropagation(); window.open('https://profiles.indeed.com/', '_blank'); }}
                                                >
                                                    <ExternalLink size={14} /> Indeed
                                                </motion.button>
                                            </div>



                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '6rem 2rem', textAlign: 'center', color: 'var(--fg-muted)', borderRadius: '32px' }}>
                                        <Briefcase size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                                        <h3 style={{ fontSize: '1.5rem', color: 'var(--fg)', marginBottom: '0.5rem' }}>No Data Fragments</h3>
                                        <p>Your production pipeline is currently idle. Initialize a new architecture to begin.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Sidebar Command Center */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Intelligence Card */}
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)', color: 'white', border: 'none' }}>


                            <Zap size={28} style={{ marginBottom: '1rem' }} />
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.8rem', color: 'white' }}>AI Intelligence</h4>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: 1.5, marginBottom: '1.5rem', color: 'white' }}>
                                {(() => {
                                    const topScore = resumes.length > 0 ? Math.max(...resumes.map(r => calculateATSScore(r).score)) : 0;
                                    return `Our neural network analyzed your highest score (${topScore}%). You're ${Math.max(0, topScore - 60)}% above the industry average.`;
                                })()}
                            </p>
                            <button style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'var(--bg)', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}>

                                VIEW INSIGHTS
                            </button>
                        </div>

                        {/* System Tools */}
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <h4 style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.5rem', fontWeight: 700 }}>Commander Tools</h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div className="flex-between" style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ padding: '10px', background: 'var(--bg-soft)', borderRadius: '12px' }}><Layout size={20} color="var(--accent)" /></div>
                                        <span style={{ fontWeight: 600 }}>Multi-Repo Sync</span>
                                    </div>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                                </div>
                                <div className="flex-between" style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ padding: '10px', background: 'var(--bg-soft)', borderRadius: '12px' }}><Zap size={20} color="#EAB308" /></div>
                                        <span style={{ fontWeight: 600 }}>Cover Letter AI</span>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', background: 'var(--secondary)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>UPCOMING</span>


                                </div>
                                <div className="flex-between" style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ padding: '10px', background: 'var(--bg-soft)', borderRadius: '12px' }}><TrendingUp size={20} color="#4ADE80" /></div>
                                        <span style={{ fontWeight: 600 }}>Market Analytics</span>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', background: 'var(--secondary)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>UPCOMING</span>


                                </div>
                            </div>
                        </div>



                    </aside>
                </div>

                {/* Hidden Renders for PDF extraction */}
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden' }}>
                    {(resumes || []).map(r => (
                        <div key={r.id} id={`resume-render-${r.id}`}>
                            <TemplatePreview data={r} />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
