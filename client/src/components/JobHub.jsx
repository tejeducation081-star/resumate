import React, { useState, useEffect, useCallback } from 'react';
import useResumeStore from '../store/resumeStore';
import useAuthStore from '../store/authStore';
import { API_ENDPOINTS } from '../config/api';
import {
    Search,
    MapPin,
    Briefcase,
    Sparkles,
    CheckCircle2,
    ArrowUpRight,
    X,
    Loader,
    Building,
    Calendar,
    Clock,
    FileText,
    ChevronRight,
    Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JobHub = ({ isEmbedded = false }) => {
    const { resumes, fetchResumes } = useResumeStore();
    const { user } = useAuthStore();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [applyStep, setApplyStep] = useState(1); // 1: Choose Resume, 2: Success

    // Search state
    const [query, setQuery] = useState('Software Engineer');
    const [location, setLocation] = useState('Bangalore');

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ query, location, limit: 12 });
            const res = await fetch(`${API_ENDPOINTS.SEARCH_JOBS}?${params}`);
            const data = await res.json();
            if (data.success) {
                setJobs(data.data || []);
            }
        } catch (err) {
            console.error('Job Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    }, [query, location]);

    useEffect(() => {
        fetchJobs();
        fetchResumes();
    }, [fetchJobs, fetchResumes]);

    const handleApply = async () => {
        setIsApplying(true);
        // Simulate application API call
        setTimeout(() => {
            setIsApplying(false);
            setApplyStep(2);
        }, 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: isEmbedded ? 'transparent' : 'var(--bg)' }}>

            {/* Context Header (only if not embedded) */}
            {!isEmbedded && (
                <div style={{ padding: '3rem 0', background: 'var(--surface)', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                    <div className="container">
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Job Hub <Sparkles size={24} color="var(--accent)" /></h1>
                        <p style={{ color: 'var(--fg-muted)', fontSize: '1.1rem' }}>No redirects. No friction. Just careers.</p>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className={isEmbedded ? '' : 'container'} style={{ marginBottom: '2rem' }}>
                <div className="glass-panel" style={{
                    padding: '12px',
                    display: 'flex',
                    gap: '12px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    background: 'white'
                }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)' }} />
                        <input
                            placeholder="Job Title or Skills"
                            style={{ paddingLeft: '48px', border: 'none', background: 'var(--bg-soft)' }}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchJobs()}
                        />
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)' }} />
                        <input
                            placeholder="Location"
                            style={{ paddingLeft: '48px', border: 'none', background: 'var(--bg-soft)' }}
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchJobs()}
                        />
                    </div>
                    <button className="btn-primary" onClick={fetchJobs} style={{ padding: '0 24px' }}>Search</button>
                </div>
            </div>

            {/* Job Grid */}
            <div className={isEmbedded ? '' : 'container'} style={{ flex: 1 }}>
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={{ height: '240px', borderRadius: '24px', background: 'var(--border)', animation: 'pulse 1.5s infinite ease-in-out' }} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
                    >
                        {jobs.map(job => (
                            <motion.div
                                key={job.id}
                                variants={itemVariants}
                                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                                onClick={() => setSelectedJob(job)}
                                style={{
                                    background: 'white',
                                    padding: '2rem',
                                    borderRadius: '24px',
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'var(--accent-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Briefcase size={22} color="var(--accent)" />
                                    </div>
                                    <div style={{ padding: '4px 12px', background: 'var(--bg-soft)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                        {job.source || 'Premium'}
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>{job.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--fg-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    <Building size={14} /> <span>{job.company}</span>
                                    <span style={{ opacity: 0.3 }}>•</span>
                                    <MapPin size={14} /> <span>{job.location}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                    {(job.skills || ['AI', 'Neural', 'Cloud']).slice(0, 3).map((s, i) => (
                                        <span key={i} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-glow)', padding: '4px 10px', borderRadius: '6px' }}>{s}</span>
                                    ))}
                                </div>
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg-muted)' }}>{job.salary || '$120k - $150k'}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', fontWeight: 800, fontSize: '0.85rem' }}>
                                        VIEW DETAILS <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Application Modal (Glassmorphic) */}
            <AnimatePresence>
                {selectedJob && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                width: '90%',
                                maxWidth: '1000px',
                                height: '85vh',
                                background: 'white',
                                borderRadius: '32px',
                                overflow: 'hidden',
                                display: 'flex',
                                boxShadow: '0 50px 100px rgba(0,0,0,0.3)'
                            }}
                        >
                            {/* Left: Job Info (40%) */}
                            <div style={{ width: '40%', background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)', color: 'white', padding: '3rem', overflowY: 'auto' }}>
                                <button onClick={() => setSelectedJob(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '12px', borderRadius: '50%', marginBottom: '2rem', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                                <div style={{ width: '64px', height: '64px', background: 'var(--accent)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                                    <Building size={32} />
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2, color: 'white' }}>{selectedJob.title}</h2>
                                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem' }}>{selectedJob.company} • {selectedJob.location}</p>

                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ color: 'var(--accent)' }}><Target size={24} /></div>
                                        <div>
                                            <div style={{ fontWeight: 800, marginBottom: '4px', color: 'white' }}>Expertise Score</div>
                                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Your profile matches 94% of core requirements for this position.</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ color: 'var(--accent)' }}><Clock size={24} /></div>
                                        <div>
                                            <div style={{ fontWeight: 800, marginBottom: '4px', color: 'white' }}>Engagement Window</div>
                                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Posted 2 days ago. Average HR response time: 48 hours.</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>Description</h4>
                                    <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>{selectedJob.description || "Leading the charge in architectural excellence. We're looking for visionary engineers to join our primary growth cluster as we scale our neural networks through 2024..."}</p>
                                </div>
                            </div>

                            {/* Right: Apply Flow (60%) */}
                            <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column' }}>
                                {applyStep === 1 ? (
                                    <>
                                        <header style={{ marginBottom: '4rem' }}>
                                            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Internal Apply</h3>
                                            <p style={{ color: 'var(--fg-muted)' }}>Choose an asset from your <strong>Career Vault</strong> to proceed.</p>
                                        </header>

                                        <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gap: '12px' }}>
                                            {resumes.map(r => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => setSelectedResumeId(r.id)}
                                                    style={{
                                                        padding: '20px 24px',
                                                        borderRadius: '20px',
                                                        border: selectedResumeId === r.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                                                        background: selectedResumeId === r.id ? 'var(--accent-glow)' : 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '20px',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <div style={{ width: '48px', height: '48px', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <FileText size={24} color={selectedResumeId === r.id ? 'var(--accent)' : 'var(--fg-muted)'} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 800, color: '#111827' }}>{r.personalDetails.fullName || 'Untitled Asset'}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>Optimized for {selectedJob.title} • Updated 2h ago</div>
                                                    </div>
                                                    {selectedResumeId === r.id && <CheckCircle2 size={24} color="var(--accent)" />}
                                                </button>
                                            ))}
                                            <button className="btn-secondary" style={{ padding: '20px', borderRadius: '20px', borderStyle: 'dashed' }}>
                                                + GENERATE TARGETED ASSET
                                            </button>
                                        </div>

                                        <footer style={{ marginTop: '4rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                            <button className="btn-secondary" onClick={() => setSelectedJob(null)}>Cancel</button>
                                            <button
                                                className="btn-primary"
                                                disabled={!selectedResumeId || isApplying}
                                                onClick={handleApply}
                                                style={{ padding: '0 40px', background: '#111827' }}
                                            >
                                                {isApplying ? 'Synchronizing with HRMS...' : 'TRANSMIT APPLICATION'}
                                            </button>
                                        </footer>
                                    </>
                                ) : (
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                        <div style={{ color: '#10B981', marginBottom: '2rem' }}>
                                            <CheckCircle2 size={100} />
                                        </div>
                                        <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Application Transmitted</h3>
                                        <p style={{ fontSize: '1.2rem', color: 'var(--fg-muted)', maxWidth: '400px', marginBottom: '3rem' }}>
                                            Your primary resume and profile have been successfully shared with <strong>{selectedJob.company}</strong>.
                                        </p>
                                        <button className="btn-primary" onClick={() => { setSelectedJob(null); setApplyStep(1); }}>Return to Hub</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                input {
                    font-family: var(--font-body);
                    border-radius: 8px;
                    border: 1px solid var(--border);
                    padding: 12px;
                    background: white;
                    width: 100%;
                }
                input:focus {
                    outline: none;
                    border-color: var(--accent);
                }
            `}</style>
        </div>
    );
};

export default JobHub;
