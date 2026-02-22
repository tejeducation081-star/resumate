import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { X, Search, Briefcase, MapPin, DollarSign, Clock, ExternalLink, Loader, AlertCircle, ChevronDown, Globe, ChevronLeft, Building, Calendar, Zap, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMON_LOCATIONS = [
    { label: 'All Locations', value: '' },
    { label: 'Remote', value: 'Remote' },
    { label: 'Bangalore', value: 'Bangalore' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Hyderabad', value: 'Hyderabad' },
    { label: 'Delhi NCR', value: 'Delhi' },
    { label: 'Pune', value: 'Pune' },
    { label: 'Chennai', value: 'Chennai' },
];

const JobSearch = ({ isOpen, onClose, searchQuery = '', location = '' }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [locationInput, setLocationInput] = useState(location);
    const [jobType, setJobType] = useState('');
    const [platforms, setPlatforms] = useState([]);

    const fetchPlatforms = async (q = searchInput, l = locationInput) => {
        try {
            const params = new URLSearchParams({ query: q, location: l });
            const res = await fetch(`${API_ENDPOINTS.JOB_PLATFORMS}?${params}`);
            const data = await res.json();
            if (data.success) setPlatforms(data.data);
        } catch (e) { console.error('Failed to fetch platforms:', e); }
    };

    useEffect(() => {
        if (isOpen) {
            handleSearch(searchInput, locationInput, jobType);
            fetchPlatforms(searchInput, locationInput);
        }
    }, [isOpen]);

    // Auto-refresh jobs every 5 minutes when modal is open
    useEffect(() => {
        if (!isOpen) return;

        const refreshInterval = setInterval(() => {
            handleSearch(searchInput, locationInput, jobType);
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(refreshInterval);
    }, [isOpen, searchInput, locationInput, jobType]);

    const handleSearch = async (query = searchInput, loc = locationInput, type = jobType) => {
        if (!query.trim()) {
            setError('Please enter a job title or skill');
            return;
        }

        setLoading(true);
        setError('');
        setSelectedJob(null);

        try {
            const params = new URLSearchParams({
                query: query.trim(),
                location: loc.trim(),
                jobType: type,
                limit: 20
            });

            const response = await fetch(`${API_ENDPOINTS.SEARCH_JOBS}?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setJobs(data.data || []);
                if (data.data.length === 0) {
                    setError('No jobs found for this search. Try different keywords.');
                }
                // Show warning if it's sample data
                if (data.source === 'Sample Data' || !data.isLive) {
                    setError('Live API limits reached. Showing sample jobs for now.');
                }
            } else {
                setJobs(data.data || []);
                if (data.warning) {
                    console.warn('API Warning:', data.warning);
                }
            }
        } catch (err) {
            setError(`Failed to fetch jobs: ${err.message}`);
            console.error('Job search error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(4px)'
        }}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                style={{
                    background: 'var(--bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    width: '90%',
                    maxWidth: '900px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden'
                }}>

                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border)',
                    background: 'linear-gradient(135deg, var(--accent) 0%, rgba(99, 102, 241, 0.1) 100%)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Briefcase size={24} color="var(--accent)" />
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>Resumate Jobs</h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0.25rem 0 0 0' }}>Curated opportunities from multiple sources</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--fg)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 0, 0, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search Section */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--surface)'
                }}>
                    <div className="mobile-stack" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>Job Title/Skills</label>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="e.g., Senior Developer, React Engineer..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    background: 'var(--bg)',
                                    color: 'var(--fg)',
                                    fontSize: '0.9rem',
                                    marginTop: '0.5rem'
                                }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>Location</label>
                            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                <select
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        background: 'var(--bg)',
                                        color: 'var(--fg)',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        WebkitAppearance: 'none'
                                    }}
                                >
                                    {COMMON_LOCATIONS.map(loc => (
                                        <option key={loc.value} value={loc.value}>{loc.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>Job Type</label>
                            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                <select
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        background: 'var(--bg)',
                                        color: 'var(--fg)',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        WebkitAppearance: 'none'
                                    }}
                                >
                                    <option value="">All Types</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%', maxWidth: '200px' }}>
                            <button
                                onClick={() => {
                                    handleSearch();
                                    fetchPlatforms();
                                }}
                                disabled={loading}
                                style={{
                                    background: 'var(--accent)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: 600,
                                    width: '100%',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    opacity: loading ? 0.6 : 1,
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                {loading && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                padding: '1rem 1.5rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                borderBottom: '1px solid #ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Jobs List */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: selectedJob ? '0' : '1.5rem'
                }}>
                    {loading && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '300px',
                            color: 'var(--muted)'
                        }}>
                            <Loader size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                            <p>Searching for jobs...</p>
                        </div>
                    )}

                    {!loading && selectedJob ? (
                        // ── Premium Job Detail View ──
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                            {/* Sub-Header */}
                            <div style={{
                                padding: '1rem 2rem', borderBottom: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-soft)'
                            }}>
                                <motion.button
                                    whileHover={{ x: -4 }}
                                    onClick={() => setSelectedJob(null)}
                                    style={{
                                        background: 'transparent', border: 'none', color: 'var(--accent)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                        fontSize: '0.9rem', fontWeight: 700
                                    }}
                                >
                                    <ChevronLeft size={20} /> Back to Search
                                </motion.button>
                            </div>

                            {/* Detail Content */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                    {/* Main Title Section */}
                                    <div style={{ marginBottom: '2.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                                            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--fg)', margin: 0, lineHeight: 1.2 }}>
                                                {selectedJob.title}
                                            </h1>
                                            <span style={{
                                                padding: '6px 14px', borderRadius: '8px',
                                                background: 'var(--accent)18', color: 'var(--accent)',
                                                fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap'
                                            }}>
                                                {selectedJob.source || 'Resumate Jobs'}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent)10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Building size={16} color="var(--accent)" />
                                                </div>
                                                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--fg)' }}>{selectedJob.company}</span>
                                            </div>
                                            {selectedJob.isRemote && (
                                                <span style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.75rem', fontWeight: 800 }}>REMOTE</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Metadata Grid */}
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                                        gap: '1rem', padding: '1.5rem', background: 'var(--bg)',
                                        borderRadius: '20px', border: '1px solid var(--border)', marginBottom: '2.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <MapPin size={18} style={{ color: 'var(--fg-muted)' }} />
                                            <div>
                                                <p style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>Location</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{selectedJob.location}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Clock size={18} style={{ color: 'var(--fg-muted)' }} />
                                            <div>
                                                <p style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>Type</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{selectedJob.jobType || 'Full-time'}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Calendar size={18} style={{ color: 'var(--fg-muted)' }} />
                                            <div>
                                                <p style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>Posted</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{new Date(selectedJob.postedDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {selectedJob.salary && selectedJob.salary !== 'Not specified' && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Zap size={18} style={{ color: 'var(--accent)' }} />
                                                <div>
                                                    <p style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>Compensation</p>
                                                    <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{selectedJob.salary}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div style={{ marginBottom: '3rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '4px', height: '20px', background: 'var(--accent)', borderRadius: '2px' }} />
                                            Job Description
                                        </h3>
                                        <div style={{
                                            color: 'var(--fg-muted)', fontSize: '1.05rem', lineHeight: 1.8,
                                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                            padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
                                            border: '1px solid var(--border)'
                                        }}>
                                            {selectedJob.description}
                                        </div>
                                    </div>

                                    {/* Skills Tags */}
                                    {selectedJob.skills && selectedJob.skills.length > 0 && (
                                        <div style={{ marginBottom: '3rem' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '4px', height: '20px', background: '#ec4899', borderRadius: '2px' }} />
                                                Required Competencies
                                            </h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                {selectedJob.skills.map((skill, i) => (
                                                    <span key={i} style={{
                                                        padding: '10px 20px', borderRadius: '12px',
                                                        background: 'var(--bg)', border: '1px solid var(--border)',
                                                        color: 'var(--fg)', fontSize: '0.85rem', fontWeight: 650,
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                                    }}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Final CTA */}
                                    <div style={{
                                        padding: '2.5rem',
                                        background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(168,85,247,0.05) 100%)',
                                        borderRadius: '24px',
                                        border: '1px solid var(--accent)20',
                                        textAlign: 'center',
                                        marginBottom: '2rem'
                                    }}>
                                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ready to take the next step?</h4>
                                        <p style={{ color: 'var(--fg-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Apply directly on the source platform to start your journey.</p>
                                        <motion.a
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={selectedJob.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '16px 40px',
                                                background: 'var(--accent)',
                                                color: 'white',
                                                borderRadius: '14px',
                                                textDecoration: 'none',
                                                fontWeight: 800,
                                                fontSize: '1rem',
                                                boxShadow: '0 10px 25px -5px var(--accent-glow)'
                                            }}
                                        >
                                            Apply on {selectedJob.source || 'Platform'} <ArrowUpRight size={20} />
                                        </motion.a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : !loading && jobs.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '300px',
                            color: 'var(--muted)',
                            textAlign: 'center'
                        }}>
                            <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No jobs found yet</p>
                            <p style={{ fontSize: '0.9rem' }}>Try searching for a job title or skill</p>
                        </div>
                    ) : !loading && (
                        // Jobs Grid
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {jobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSelectedJob(job)}
                                    style={{
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--bg)';
                                        e.currentTarget.style.borderColor = 'var(--accent)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--surface)';
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)', margin: 0, marginBottom: '0.25rem' }}>
                                                {job.title}
                                            </h4>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--accent)', fontWeight: 600, margin: 0 }}>
                                                {job.company}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                            <span style={{
                                                background: job.id.startsWith('m') ? '#6B7280' : 'var(--accent)',
                                                color: 'white',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase'
                                            }}>
                                                {job.id.startsWith('m') ? 'Sample' : 'Live'}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        gap: '2rem',
                                        marginBottom: '1rem',
                                        fontSize: '0.9rem',
                                        color: 'var(--muted)',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <MapPin size={16} />
                                            {job.location}
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Clock size={16} />
                                            {job.jobType}
                                        </div>
                                    </div>

                                    <p style={{
                                        color: 'var(--muted)',
                                        fontSize: '0.85rem',
                                        margin: '0 0 1rem 0',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {job.description}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedJob(job);
                                            }}
                                            style={{
                                                background: 'var(--accent)10',
                                                border: '1px solid var(--accent)30',
                                                color: 'var(--accent)',
                                                padding: '0.6rem 1.2rem',
                                                borderRadius: '8px',
                                                fontSize: '0.8rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            View Details <ChevronRight size={14} />
                                        </motion.button>
                                    </div>

                                    <div style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        right: '1.5rem',
                                        opacity: 0,
                                        transition: 'opacity 0.2s ease'
                                    }}>
                                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>View Details →</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}


                </div>
            </motion.div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default JobSearch;
