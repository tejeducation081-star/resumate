import React, { useEffect, useState } from 'react';
import useResumeStore from '../store/resumeStore';
import useAuthStore from '../store/authStore';
import { Plus, Search, FileText, Zap, TrendingUp, Briefcase, Trash2, Layout, MoreVertical } from 'lucide-react';
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
        { label: 'Active Archives', value: resumes.length, icon: FileText, color: 'var(--accent)' },
        {
            label: 'Peak Precision',
            value: resumes.length > 0 ? Math.max(...resumes.map(r => calculateATSScore(r).score)) + '%' : '0%',
            icon: TrendingUp,
            color: '#10B981'
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

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px var(--accent-glow)' }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary"
                            onClick={() => { setCurrentResume(null); setView('templates'); }}
                            style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}
                        >
                            <Plus size={22} strokeWidth={2.5} /> Deploy New Architecture
                        </motion.button>
                    </div>
                </header>

                {/* Intelligence Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -8, background: 'rgba(255, 255, 255, 0.9)' }}
                            className="glass-panel"
                            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--border)', height: '100%' }}
                        >
                            <div className="flex-between">
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</span>
                                <div style={{ padding: '10px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color }}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--fg)', lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ height: '4px', width: '100%', background: 'var(--bg-soft)', borderRadius: '2px', overflow: 'hidden', marginTop: 'auto' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '70%' }}
                                    style={{ height: '100%', background: stat.color }}
                                />
                            </div>
                        </motion.div>
                    ))}

                    {/* Scale Operations Card */}
                    <motion.div
                        whileHover={{ y: -8, boxShadow: '0 20px 40px -10px var(--accent-glow)' }}
                        className="glass-panel"
                        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '2px solid var(--accent)', background: 'rgba(99, 102, 241, 0.03)', borderRadius: '24px', height: '100%' }}
                    >
                        <div className="flex-between">
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expansion</span>
                            <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--accent)15', color: 'var(--accent)' }}>
                                <Zap size={24} />
                            </div>
                        </div>
                        <h4 style={{ fontSize: '1.3rem', fontWeight: 800, textAlign: 'left' }}>Scale Operations</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', textAlign: 'left', marginBottom: '1rem' }}>Unlock infinite architectures and elite templates.</p>
                        <button className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem', width: '100%', marginTop: 'auto' }}>UPGRADE TO PRO</button>
                    </motion.div>
                </div>



                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) 350px', gap: '4rem', alignItems: 'start' }}>


                    <div>
                        {/* Search & Filter */}
                        <div style={{ marginBottom: '3rem', display: 'flex', gap: '1rem' }}>
                            <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderRadius: '20px' }}>
                                <Search size={20} color="var(--fg-muted)" />
                                <input
                                    placeholder="Index search for archives..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--fg)',
                                        fontSize: '1.1rem',
                                        padding: '1.2rem 1rem',
                                        width: '100%',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <button className="glass-panel" style={{ padding: '0 1.5rem', borderRadius: '20px', fontWeight: 600, color: 'var(--fg-muted)' }}>
                                Filters
                            </button>
                        </div>

                        {/* Resume Pipeline */}
                        <div className="flex-between" style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Layout size={28} color="var(--accent)" /> Production Pipeline
                            </h2>
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
                                        whileHover={{ y: -10, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.1)' }}
                                        className="glass-panel"
                                        style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', borderRadius: '24px' }}
                                        onClick={() => { setCurrentResume(resume); setView('editor'); }}
                                    >
                                        <div style={{ height: '280px', background: 'var(--bg-soft)', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ transform: 'scale(0.3)', transformOrigin: 'top left', width: '210mm', position: 'absolute', top: '24px', left: '24px', background: 'white', boxShadow: '0 15px 45px rgba(0,0,0,0.1)' }}>
                                                <TemplatePreview data={resume} />
                                            </div>
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-soft) 0%, transparent 60%)' }}></div>
                                        </div>

                                        <div style={{ padding: '2rem' }}>
                                            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.3rem' }}>{resume.personalDetails?.fullName || 'Untitled'}</h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>Updated 2h ago</span>
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

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px' }}>
                                                <button className="btn-primary" style={{ padding: '10px', fontSize: '0.9rem', background: 'var(--bg-soft)', color: 'var(--fg)', border: '1px solid var(--border)' }}>Edit Card</button>
                                                <button className="btn-primary" style={{ padding: '10px', fontSize: '0.9rem' }}>Export PDF</button>
                                                <button
                                                    className="glass-panel"
                                                    style={{ padding: '0 12px', color: '#ef4444', borderRadius: '12px' }}
                                                    onClick={(e) => { e.stopPropagation(); if (window.confirm('Erase this architecture?')) deleteResume(resume.id); }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
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
                        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)', color: 'white' }}>
                            <Zap size={32} style={{ marginBottom: '1.5rem' }} />
                            <h4 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>AI Intelligence</h4>
                            <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
                                {(() => {
                                    const topScore = resumes.length > 0 ? Math.max(...resumes.map(r => calculateATSScore(r).score)) : 0;
                                    return `Our neural network analyzed your highest score (${topScore}%). You're ${Math.max(0, topScore - 60)}% above the industry average.`;
                                })()}
                            </p>
                            <button style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: 'none', background: 'white', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}>
                                VIEW INSIGHTS
                            </button>
                        </div>


                        {/* System Tools */}
                        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem', fontWeight: 700 }}>Commander Tools</h4>
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
                                    <span style={{ fontSize: '0.75rem', background: 'var(--accent)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>BETA</span>
                                </div>
                                <div className="flex-between" style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ padding: '10px', background: 'var(--bg-soft)', borderRadius: '12px' }}><TrendingUp size={20} color="#4ADE80" /></div>
                                        <span style={{ fontWeight: 600 }}>Market Analytics</span>
                                    </div>
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
