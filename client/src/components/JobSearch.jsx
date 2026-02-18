import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { X, Search, Briefcase, MapPin, DollarSign, Clock, ExternalLink, Loader, AlertCircle, ChevronDown } from 'lucide-react';
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
    const [platforms, setPlatforms] = useState([]);

    useEffect(() => {
        const fetchPlatforms = async () => {
            try {
                const res = await fetch(API_ENDPOINTS.JOB_PLATFORMS);
                const data = await res.json();
                if (data.success) setPlatforms(data.data);
            } catch (e) { console.error('Failed to fetch platforms:', e); }
        };
        fetchPlatforms();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            handleSearch(searchQuery, location);
        }
    }, [isOpen]);

    const handleSearch = async (query = searchInput, loc = locationInput) => {
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
                    background: 'linear-gradient(135deg, var(--primary) 0%, rgba(99, 102, 241, 0.1) 100%)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Briefcase size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>Job Opportunities</h2>
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
                        <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%', maxWidth: '200px' }}>
                            <button
                                onClick={() => handleSearch()}
                                disabled={loading}
                                style={{
                                    background: 'var(--primary)',
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
                        // Job Detail View
                        <div style={{
                            padding: '2rem',
                            height: '100%',
                            overflowY: 'auto'
                        }}>
                            <button
                                onClick={() => setSelectedJob(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    marginBottom: '1.5rem',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                ← Back to Jobs
                            </button>

                            <div style={{
                                background: 'var(--surface)',
                                borderRadius: '12px',
                                padding: '2rem',
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--fg)', margin: '0 0 0.5rem 0' }}>
                                        {selectedJob.title}
                                    </h3>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 600, margin: 0 }}>
                                        {selectedJob.company}
                                    </p>
                                </div>

                                <div className="responsive-grid" style={{
                                    gap: '1rem',
                                    marginBottom: '2rem',
                                    padding: '1.5rem',
                                    background: 'var(--bg)',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg)' }}>
                                        <MapPin size={18} color="var(--primary)" />
                                        <span>{selectedJob.location}</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg)' }}>
                                        <Briefcase size={18} color="var(--primary)" />
                                        <span>{selectedJob.jobType}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg)' }}>
                                        <Clock size={18} color="var(--primary)" />
                                        <span>Posted: {new Date(selectedJob.postedDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.75rem' }}>Description</h4>
                                    <p style={{
                                        color: 'var(--muted)',
                                        lineHeight: 1.6,
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word'
                                    }}>
                                        {selectedJob.description || 'No description available'}
                                    </p>
                                </div>

                                {selectedJob.skills && selectedJob.skills.length > 0 && (
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.75rem' }}>Required Skills</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {selectedJob.skills.slice(0, 8).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        background: 'var(--primary)',
                                                        color: 'white',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <a
                                    href={selectedJob.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        padding: '1rem 2rem',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    Apply Now <ExternalLink size={18} />
                                </a>
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
                                        e.currentTarget.style.borderColor = 'var(--primary)';
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
                                            <p style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 600, margin: 0 }}>
                                                {job.company}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                            <span style={{
                                                background: job.id.startsWith('m') ? '#6B7280' : 'var(--primary)',
                                                color: 'white',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase'
                                            }}>
                                                {job.id.startsWith('m') ? 'Sample' : 'Live'}
                                            </span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                color: 'var(--muted)'
                                            }}>
                                                {job.source}
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
                                        <a
                                            href={job.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid var(--primary)',
                                                color: 'var(--primary)',
                                                padding: '0.4rem 1rem',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                textDecoration: 'none',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = 'var(--primary)';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--primary)';
                                            }}
                                        >
                                            Quick Apply <ExternalLink size={12} />
                                        </a>
                                    </div>

                                    <div style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        right: '1.5rem',
                                        opacity: 0,
                                        transition: 'opacity 0.2s ease'
                                    }}>
                                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>View Details →</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && !selectedJob && platforms.length > 0 && (
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--surface)',
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>Direct Search on Platforms</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {platforms.map(p => (
                                    <a
                                        key={p.id}
                                        href={p.url.replace('{query}', encodeURIComponent(searchInput || 'Developer')).replace('{location}', encodeURIComponent(locationInput || 'India'))}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            background: 'var(--bg)',
                                            border: '1px solid var(--border)',
                                            color: 'var(--fg)',
                                            textDecoration: 'none',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                    >
                                        <Globe size={14} /> {p.name}
                                    </a>
                                ))}
                            </div>
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
