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

    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    const filteredResumes = (resumes || []).filter(r =>
        (r.personalDetails.fullName || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase())
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

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', position: 'relative', overflowX: 'hidden' }}>
            {/* Background Ambience */}
            <div className="mesh-gradient" style={{ position: 'fixed', inset: 0, opacity: 0.4, zIndex: 0 }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '120px', paddingBottom: '4rem' }}>

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-between"
                    style={{ alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}
                >
                    <div>
                        <h1 className="hero-title" style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1 }}>
                            Welcome, {user?.user_metadata?.username || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--fg-muted)', maxWidth: '500px', marginBottom: '1rem' }}>
                            manage your professional infrastructure.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        onClick={() => { setCurrentResume(null); setView('templates'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <Plus size={20} /> New Architecture
                    </motion.button>
                </motion.div>

                {/* Search & Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>

                    {/* Search Bar */}
                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0 1.5rem' }}>
                        <Search size={22} color="var(--fg-muted)" />
                        <input
                            placeholder="Search archives..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--fg)',
                                fontSize: '1.2rem',
                                padding: '1.5rem 1rem',
                                width: '100%',
                                outline: 'none',
                                fontFamily: 'var(--font-body)'
                            }}
                        />
                    </div>

                    {/* Stat Card 1 */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-panel"
                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)' }}>Active Documents</span>
                            <FileText size={20} color="var(--accent)" />
                        </div>
                        <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>
                            {resumes.length || '0'}
                        </div>
                    </motion.div>

                    {/* Stat Card 2 */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-panel"
                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)' }}>Top Optimization</span>
                            <TrendingUp size={20} color="#4ade80" />
                        </div>
                        {(() => {
                            const topScore = resumes.length > 0 ? Math.max(...resumes.map(r => calculateATSScore(r).score)) : 0;
                            const color = topScore >= 80 ? '#10B981' : topScore >= 50 ? '#F59E0B' : '#EF4444';
                            return (
                                <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1, color }}>
                                    {topScore}%
                                </div>
                            );
                        })()}


                    </motion.div>
                </div>

                {/* Main Content Area */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) 300px', gap: '3rem' }}>

                    {/* Resume Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex-between" style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Recent Projects</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            <AnimatePresence>
                                {filteredResumes.length > 0 ? filteredResumes.map((resume) => (
                                    <motion.div
                                        key={resume.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(99,102,241,0.3)' }}
                                        className="glass-panel"
                                        style={{
                                            padding: '0',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            border: '1px solid var(--border)'
                                        }}
                                        onClick={() => { setCurrentResume(resume); setView('editor'); }}
                                    >
                                        {/* Preview Window */}
                                        <div style={{
                                            height: '250px',
                                            background: '#1e293b',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            {/* Mini Scaled Preview */}
                                            <div style={{
                                                transform: 'scale(0.25)',
                                                transformOrigin: 'top left',
                                                width: '210mm',
                                                position: 'absolute',
                                                top: '20px', left: '20px',
                                                background: 'white',
                                                boxShadow: '0 10px 50px rgba(0,0,0,0.5)'
                                            }}>
                                                <TemplatePreview data={resume} />
                                            </div>

                                            {/* Fade Overlay */}
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #1e293b 0%, transparent 50%)' }}></div>
                                        </div>

                                        {/* Card Content */}
                                        <div style={{ padding: '1.5rem' }}>
                                            <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div>
                                                    {(() => {
                                                        const { score } = calculateATSScore(resume);
                                                        const color = score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
                                                        return score > 0 && (
                                                            <div style={{
                                                                padding: '4px 8px',
                                                                borderRadius: '6px',
                                                                background: `${color}15`,
                                                                color: color,
                                                                fontSize: '0.85rem',
                                                                fontWeight: 700,
                                                                border: `1px solid ${color}30`
                                                            }}>
                                                                {score}%
                                                            </div>
                                                        );
                                                    })()}


                                                </div>

                                                {/* Actions */}
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px' }}>
                                                    <button className="glass-pill" style={{ fontSize: '0.9rem', justifyContent: 'center' }}>Edit</button>
                                                    <button
                                                        className="glass-pill"
                                                        style={{ fontSize: '0.9rem', justifyContent: 'center', background: 'var(--bg-soft)' }}
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            // PDF Generation Logic (Same as before)
                                                            const response = await fetch('http://localhost:5000/api/pdf/generate-pdf', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    htmlContent: document.getElementById(`resume-render-${resume.id}`).innerHTML,
                                                                    styles: `#resume-preview { width: 210mm; min-height: 297mm; background: white !important; padding: 40px !important; }`
                                                                })
                                                            });
                                                            const blob = await response.blob();
                                                            const url = URL.createObjectURL(blob);
                                                            const a = document.createElement('a');
                                                            a.href = url;
                                                            a.download = `${resume.personalDetails.fullName}.pdf`;
                                                            a.click();
                                                        }}
                                                    >
                                                        PDF
                                                    </button>
                                                    <button
                                                        className="glass-pill"
                                                        style={{ padding: '0.5rem', color: '#ef4444' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm('Delete this resume?')) deleteResume(resume.id);
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                    </motion.div>
                                )) : (
                                    <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', color: 'var(--fg-muted)' }}>
                                        <Briefcase size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                        <p>No architectures found in this sector.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Sidebar / Tools */}
                    <div>
                        <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '140px' }}>
                            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem', color: 'var(--fg-muted)' }}>System Tools</h4>

                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', listStyle: 'none' }}>
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', opacity: 0.8 }} className="hover-glow">
                                    <Briefcase size={20} color="var(--accent)" />
                                    <span>Application Tracker</span>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', opacity: 0.8 }} className="hover-glow">
                                    <Zap size={20} color="#eab308" />
                                    <span>Cover Letter AI</span>
                                </li>
                            </ul>

                            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Pro Account</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--fg-muted)', marginBottom: '1rem' }}>Unlock unlimited templates and advanced analysis.</p>
                                <button className="btn-primary" style={{ width: '100%', fontSize: '0.9rem' }}>UPGRADE</button>
                            </div>
                        </div>
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

            </div>
        </div>
    );
};

export default Dashboard;
