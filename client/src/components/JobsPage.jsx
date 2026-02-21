import React, { useState, useEffect, useCallback, useRef } from 'react';
import { API_ENDPOINTS } from '../config/api';
import {
    Search, Briefcase, MapPin, DollarSign, Clock, ExternalLink,
    Loader, AlertCircle, Globe, X,
    Star, Building, Calendar, ArrowUpRight, RefreshCw, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Platform brand config
const PLATFORMS = {
    all: { label: 'All Jobs', color: '#6366f1', bg: 'linear-gradient(135deg, #6366f1, #a855f7)' },
};



const SOURCE_COLORS = {
    'LinkedIn': '#0a66c2',
    'TheMuse': '#5f3dc4',
    'RemoteOK': '#00b894',
    'Glassdoor': '#0caa41',
    'Job Board': '#6366f1',
    'Resumate Jobs': '#0091FF',
};

const DATE_FILTERS = [
    { label: 'Any time', value: 'all' },
    { label: 'Past month', value: 'month' },
    { label: 'Past week', value: 'week' },
    { label: 'Past 3 days', value: '3days' },
    { label: 'Today', value: 'today' },
];

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

const JOB_TYPES = [
    { label: 'All Types', value: '' },
    { label: 'Full-time', value: 'FULLTIME' },
    { label: 'Part-time', value: 'PARTTIME' },
    { label: 'Internship', value: 'INTERN' },
    { label: 'Contract', value: 'CONTRACTOR' },
];

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [apiWarning, setApiWarning] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [activePlatform, setActivePlatform] = useState('all');
    const [platforms, setPlatforms] = useState([]);
    const [isLive, setIsLive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalEstimated, setTotalEstimated] = useState(0);
    const [dateFilter, setDateFilter] = useState('all');
    const [jobTypeFilter, setJobTypeFilter] = useState('');
    const [remoteOnly, setRemoteOnly] = useState(false);
    const [jobCategory, setJobCategory] = useState('all');
    const [selectedJob, setSelectedJob] = useState(null);
    const currentQueryRef = useRef({ query: 'Software Developer', location: '', platform: 'all' });

    // Fetch platform deep-links
    const fetchPlatforms = useCallback(async (query = '', location = '') => {
        try {
            const params = new URLSearchParams({ query, location });
            const res = await fetch(`${API_ENDPOINTS.JOB_PLATFORMS}?${params}`);
            const data = await res.json();
            if (data.success) {
                setPlatforms(data.data || []);
            }
        } catch (e) { console.error('Failed to fetch platforms:', e); }
    }, []);

    // Core fetch function
    const fetchJobs = useCallback(async ({
        query = 'Software Developer',
        location = '',
        platform = 'all',
        page = 1,
        append = false   // true = Load More, false = fresh search
    } = {}) => {
        if (append) setLoadingMore(true);
        else { setLoading(true); setError(''); setApiWarning(''); }

        try {
            const params = new URLSearchParams({
                query,
                location,
                platform,
                page,
                limit: 30
            });

            const res = await fetch(`${API_ENDPOINTS.SEARCH_JOBS}?${params}`);
            const data = await res.json();

            if (data.success || data.data) {
                const newJobs = data.data || [];
                setJobs(prev => append ? [...prev, ...newJobs] : newJobs);
                setHasMore(data.hasMore || false);
                setTotalEstimated(data.totalEstimated || newJobs.length);
                setIsLive(!data.warning);
                if (data.warning) setApiWarning(data.warning);
                if (!append && newJobs.length === 0) setError('No jobs found. Try different keywords or location.');
            } else {
                if (!append) setError(data.error || 'Failed to fetch jobs.');
            }
        } catch (err) {
            if (!append) setError(`Connection error: ${err.message}`);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchJobs({ query: 'Software Developer', location: '', platform: 'all', page: 1 });
        fetchPlatforms('Software Developer', '');
    }, []);

    // Auto-refresh jobs every 5 minutes
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            const { query, location, platform } = currentQueryRef.current;
            fetchJobs({ query, location, platform, page: 1, append: false });
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(refreshInterval);
    }, [fetchJobs]);

    // Clear all filters and reload default jobs
    const handleClearFilters = useCallback(() => {
        setSearchInput('');
        setLocationInput('');
        setActivePlatform('all');
        setDateFilter('all');
        setJobTypeFilter('');
        setRemoteOnly(false);
        setCurrentPage(1);
        currentQueryRef.current = { query: 'Software Developer', location: '', platform: 'all' };
        fetchJobs({ query: 'Software Developer', location: '', platform: 'all', page: 1, append: false });
        fetchPlatforms('Software Developer', '');
    }, [fetchJobs, fetchPlatforms]);

    // Fresh search (resets pagination)
    const handleSearch = useCallback(() => {
        const q = searchInput.trim() || 'Software Developer';
        const loc = locationInput.trim();
        currentQueryRef.current = { query: q, location: loc, platform: activePlatform };
        setCurrentPage(1);
        fetchJobs({ query: q, location: loc, platform: activePlatform, page: 1, append: false });
        fetchPlatforms(q, loc);
    }, [searchInput, locationInput, activePlatform, fetchJobs, fetchPlatforms]);

    // Platform tab change
    const handlePlatformChange = useCallback((platform) => {
        setActivePlatform(platform);
        const q = searchInput.trim() || 'Software Developer';
        const loc = locationInput.trim();
        currentQueryRef.current = { query: q, location: loc, platform };
        setCurrentPage(1);
        fetchJobs({ query: q, location: loc, platform, page: 1, append: false });
    }, [searchInput, locationInput, fetchJobs]);

    // Load More
    const handleLoadMore = useCallback(() => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        const { query, location, platform } = currentQueryRef.current;
        fetchJobs({ query, location, platform, page: nextPage, append: true });
    }, [currentPage, fetchJobs]);

    // Client-side filtering & sorting
    const processedJobs = React.useMemo(() => {
        let result = [...jobs];

        // Platform source filter (when a specific tab is active)
        if (activePlatform !== 'all') {
            const filtered = result.filter(j =>
                (j.source || '').toLowerCase().includes(activePlatform.toLowerCase())
            );
            // Only apply if it yields results, otherwise show all
            if (filtered.length > 0) result = filtered;
        }

        // Remote filter
        if (remoteOnly) result = result.filter(j => j.isRemote);

        // Job type filter — handle both 'Full-time' and 'FULLTIME' formats
        if (jobTypeFilter) {
            const typeMap = {
                'FULLTIME': ['full-time', 'fulltime', 'full time', 'permanent'],
                'PARTTIME': ['part-time', 'parttime', 'part time'],
                'INTERN': ['intern', 'internship', 'trainee'],
                'CONTRACTOR': ['contract', 'contractor', 'freelance', 'temporary'],
            };
            const keywords = typeMap[jobTypeFilter] || [jobTypeFilter.toLowerCase()];
            result = result.filter(j => {
                const jt = (j.jobType || '').toLowerCase();
                return keywords.some(k => jt.includes(k));
            });
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = Date.now();
            const cutoffs = { today: 86400000, '3days': 259200000, week: 604800000, month: 2592000000 };
            const cutoff = cutoffs[dateFilter];
            if (cutoff) {
                result = result.filter(j => {
                    if (!j.postedDate) return true; // keep if no date
                    const diff = now - new Date(j.postedDate).getTime();
                    return diff >= 0 && diff <= cutoff;
                });
            }
        }

        // Job category filter (Technical vs Non-Technical)
        if (jobCategory !== 'all') {
            const technicalKeywords = ['developer', 'engineer', 'programmer', 'architect', 'devops', 'qa', 'tester', 'data scientist', 'data engineer', 'machine learning', 'ai researcher', 'ai ', 'ml ', 'frontend', 'backend', 'full stack', 'nodejs', 'python', 'java', 'react', 'angular', 'vue', 'database', 'sql', 'tech', 'coding', 'software', 'it ', 'system', 'network', 'security', 'cloud', 'research'];
            const nonTechnicalKeywords = ['sales', 'marketing', 'hr', 'human resources', 'finance', 'operations', 'administration', 'admin', 'manager', 'coordinator', 'supervisor', 'officer', 'executive', 'business analyst', 'financial analyst', 'recruiter', 'consultant', 'business', 'account', 'customer', 'support', 'training', 'teacher', 'educator'];

            result = result.filter(j => {
                const title = (j.title || '').toLowerCase();
                const company = (j.company || '').toLowerCase();
                const searchText = title + ' ' + company;

                if (jobCategory === 'technical') {
                    return technicalKeywords.some(keyword => searchText.includes(keyword));
                } else if (jobCategory === 'non-technical') {
                    return nonTechnicalKeywords.some(keyword => searchText.includes(keyword));
                }
                return true;
            });
        }

        return result;
    }, [jobs, activePlatform, remoteOnly, jobTypeFilter, dateFilter, jobCategory]);

    const getTimeAgo = (dateString) => {
        if (!dateString) return 'Recently';
        const diff = Math.floor((Date.now() - new Date(dateString)) / 1000);
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return `${Math.floor(diff / 604800)}w ago`;
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.3 } } };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', paddingBottom: '5rem' }}>

            {/* ── Hero Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.06) 100%)',
                borderBottom: '1px solid var(--border)',
                padding: '3rem 0 2.5rem'
            }}>
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                            <h1 style={{
                                fontSize: 'clamp(2rem, 8vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0,
                                background: 'linear-gradient(to right, #6366f1, #a855f7)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>
                                Find Your Dream Job
                            </h1>
                        </div>
                        <p style={{ fontSize: '1rem', color: 'var(--fg-muted)', margin: '0 0 1.75rem', maxWidth: '600px' }}>
                            Discover opportunities curated from multiple sources — all in one place.
                        </p>

                        {/* Search Bar */}
                        <div className="mobile-stack" style={{
                            gap: '10px', maxWidth: '860px',
                            background: 'var(--surface)', padding: '12px',
                            borderRadius: '18px', border: '1px solid var(--border)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{ flex: 2, position: 'relative', display: 'flex', alignItems: 'center', minWidth: '200px' }}>
                                <Search size={17} style={{ position: 'absolute', left: '14px', color: 'var(--fg-muted)', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="Job title, skills, or company..."
                                    value={searchInput}
                                    onChange={e => setSearchInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px', border: 'none', outline: 'none', background: 'var(--bg)', color: 'var(--fg)', fontSize: '0.93rem' }}
                                />
                            </div>
                            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                                <MapPin size={17} style={{ position: 'absolute', left: '14px', color: 'var(--fg-muted)', pointerEvents: 'none' }} />
                                <select
                                    value={locationInput}
                                    onChange={e => setLocationInput(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 42px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        outline: 'none',
                                        background: 'var(--bg)',
                                        color: 'var(--fg)',
                                        fontSize: '0.93rem',
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        WebkitAppearance: 'none'
                                    }}
                                >
                                    {COMMON_LOCATIONS.map(loc => (
                                        <option key={loc.value} value={loc.value}>{loc.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '14px', color: 'var(--fg-muted)', pointerEvents: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                <motion.button
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{ flex: 1, padding: '0 1.75rem', borderRadius: '12px', height: '48px', fontSize: '0.93rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
                                >
                                    {loading && <Loader size={16} className="spin-icon" />}
                                    Search
                                </motion.button>
                                {(searchInput || locationInput || dateFilter !== 'all' || jobTypeFilter || remoteOnly) && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                        onClick={handleClearFilters}
                                        title="Clear all filters"
                                        style={{
                                            padding: '0 1.25rem', borderRadius: '12px', height: '48px',
                                            fontSize: '0.93rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                            border: '1px solid var(--border)', background: 'var(--bg)',
                                            color: 'var(--fg-muted)', cursor: 'pointer'
                                        }}
                                    >
                                        <X size={16} />
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '2rem' }}>

                {/* ── Filter Bar ── */}
                <div style={{
                    display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap',
                    padding: '14px 18px', borderRadius: '16px',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    alignItems: 'center'
                }}>
                    {/* Date Posted */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', fontWeight: 600 }}>Posted:</span>
                        <select
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', fontSize: '0.82rem', cursor: 'pointer' }}
                        >
                            {DATE_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                    </div>

                    {/* Job Type */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', fontWeight: 600 }}>Type:</span>
                        <select
                            value={jobTypeFilter}
                            onChange={e => setJobTypeFilter(e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', fontSize: '0.82rem', cursor: 'pointer' }}
                        >
                            {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>

                    {/* Remote Toggle */}
                    <button
                        onClick={() => setRemoteOnly(v => !v)}
                        style={{
                            padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)',
                            background: remoteOnly ? 'rgba(16,185,129,0.1)' : 'var(--bg)',
                            color: remoteOnly ? '#10b981' : 'var(--fg-muted)',
                            fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        🌐 Remote Only
                    </button>

                    {/* Job Category Filter */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                            onClick={() => setJobCategory(jobCategory === 'technical' ? 'all' : 'technical')}
                            style={{
                                padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)',
                                background: jobCategory === 'technical' ? 'rgba(99,102,241,0.1)' : 'var(--bg)',
                                color: jobCategory === 'technical' ? '#6366f1' : 'var(--fg-muted)',
                                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            💻 Technical
                        </button>
                        <button
                            onClick={() => setJobCategory(jobCategory === 'non-technical' ? 'all' : 'non-technical')}
                            style={{
                                padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)',
                                background: jobCategory === 'non-technical' ? 'rgba(168,85,247,0.1)' : 'var(--bg)',
                                color: jobCategory === 'non-technical' ? '#a855f7' : 'var(--fg-muted)',
                                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            👔 Non-Technical
                        </button>
                    </div>

                    {/* Job Count on Right */}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <motion.button
                            whileHover={{ rotate: 180 }} whileTap={{ scale: 0.9 }}
                            onClick={handleSearch}
                            title="Refresh"
                            style={{ padding: '6px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center' }}
                        >
                            <RefreshCw size={15} />
                        </motion.button>
                        <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {loading ? 'Searching...' : (
                                <>
                                    <strong style={{ color: 'var(--fg)' }}>{processedJobs.length}</strong>
                                    <span style={{ marginLeft: '4px' }}>jobs</span>
                                </>
                            )}
                        </span>
                    </div>

                </div>



                <div className="sidebar-layout" style={{ alignItems: 'start' }}>

                    {/* ── Jobs List ── */}
                    <div>
                        {/* Empty state */}
                        {!loading && processedJobs.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--fg-muted)' }}>
                                <Briefcase size={52} style={{ margin: '0 auto 1rem', opacity: 0.15 }} />
                                <h3 style={{ color: 'var(--fg)', marginBottom: '8px' }}>No Jobs Found</h3>
                                <p style={{ fontSize: '0.9rem' }}>{error || 'Try different keywords, location, or remove filters.'}</p>
                            </div>
                        )}

                        {/* Skeleton loaders */}
                        {loading && (
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {Array(8).fill(0).map((_, i) => (
                                    <div key={i} style={{
                                        height: '170px', borderRadius: '20px',
                                        background: 'var(--surface)', border: '1px solid var(--border)',
                                        animation: 'pulse 1.5s infinite ease-in-out',
                                        animationDelay: `${i * 0.1}s`
                                    }} />
                                ))}
                            </div>
                        )}

                        {/* Job cards */}
                        {!loading && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'grid', gap: '12px' }}>
                                {processedJobs.map(job => {
                                    const srcColor = SOURCE_COLORS[job.source] || '#6366f1';
                                    return (
                                        <motion.div
                                            key={job.id}
                                            variants={itemVariants}
                                            whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                                            onClick={() => setSelectedJob(job)}
                                            style={{
                                                background: 'var(--surface)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '20px',
                                                padding: '1.5rem 1.75rem',
                                                transition: 'all 0.2s',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {/* Source accent bar */}
                                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: srcColor }} />

                                            {/* Header row */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '3px', color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {job.title}
                                                    </h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                        <Building size={13} style={{ color: 'var(--fg-muted)', flexShrink: 0 }} />
                                                        <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem' }}>{job.company}</span>
                                                        {job.isRemote && (
                                                            <span style={{ padding: '2px 7px', borderRadius: '5px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.68rem', fontWeight: 800 }}>REMOTE</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px', flexShrink: 0, marginLeft: '12px' }}>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '7px',
                                                        background: `${srcColor}18`, color: srcColor,
                                                        fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
                                                    }}>
                                                        {job.source}
                                                    </span>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                        <Calendar size={11} /> {getTimeAgo(job.postedDate)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Meta row */}
                                            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--fg-muted)', fontSize: '0.82rem' }}>
                                                    <MapPin size={13} /> {job.location}
                                                </span>

                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--fg-muted)', fontSize: '0.82rem' }}>
                                                    <Clock size={13} /> {job.jobType}
                                                </span>
                                                {job.experience && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--fg-muted)', fontSize: '0.82rem' }}>
                                                        <Star size={13} /> {job.experience}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p style={{
                                                color: 'var(--fg-muted)', fontSize: '0.84rem', lineHeight: 1.6,
                                                marginBottom: '1rem',
                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                            }}>
                                                {job.description}
                                            </p>

                                            {/* Footer row */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                    {job.skills?.slice(0, 5).map((skill, i) => (
                                                        <span key={i} style={{
                                                            padding: '3px 9px', borderRadius: '6px',
                                                            background: 'var(--bg-soft)', color: 'var(--fg-muted)',
                                                            fontSize: '0.72rem', fontWeight: 600
                                                        }}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedJob(job);
                                                    }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '5px',
                                                        padding: '9px 18px', borderRadius: '10px',
                                                        background: 'var(--bg-soft)', color: 'var(--fg)',
                                                        border: '1px solid var(--border)', fontWeight: 700, fontSize: '0.82rem',
                                                        cursor: 'pointer', flexShrink: 0, marginLeft: '10px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    View Details <ArrowUpRight size={13} />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}

                        {/* Load More */}
                        {!loading && hasMore && (
                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <motion.button
                                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    style={{
                                        padding: '14px 40px', borderRadius: '50px',
                                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                        color: '#fff', border: 'none', cursor: 'pointer',
                                        fontWeight: 700, fontSize: '0.95rem',
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        boxShadow: '0 4px 16px rgba(99,102,241,0.3)'
                                    }}
                                >
                                    {loadingMore
                                        ? <><Loader size={17} className="spin-icon" /> Loading more jobs...</>
                                        : <><ChevronDown size={17} /> Load More Jobs</>
                                    }
                                </motion.button>
                                <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', marginTop: '10px' }}>
                                    Showing {processedJobs.length} of ~{totalEstimated.toLocaleString()} jobs
                                </p>
                            </div>
                        )}

                        {/* Loading more skeletons */}
                        {loadingMore && (
                            <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
                                {Array(5).fill(0).map((_, i) => (
                                    <div key={i} style={{
                                        height: '150px', borderRadius: '20px',
                                        background: 'var(--surface)', border: '1px solid var(--border)',
                                        animation: 'pulse 1.5s infinite ease-in-out'
                                    }} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <aside style={{ position: 'sticky', top: '100px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <Globe size={16} /> Apply Directly
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                            {(Array.isArray(platforms) && platforms.length > 0 ? platforms : [
                                { name: 'Naukri.com', color: '#00429a', url: 'https://www.naukri.com', description: "India's #1 job portal", jobCount: '1 Crore+' },
                                { name: 'Indeed India', color: '#2557a7', url: 'https://in.indeed.com', description: "World's #1 job site", jobCount: '250M+' },
                            ]).map((p, i) => (
                                <motion.a
                                    key={i}
                                    href={p.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ x: 4 }}
                                    style={{
                                        padding: '1.1rem 1.25rem', borderRadius: '14px',
                                        background: 'var(--surface)', border: '1px solid var(--border)',
                                        textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', display: 'block'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: p.color }}>{p.name}</span>
                                        <ArrowUpRight size={14} style={{ color: p.color }} />
                                    </div>
                                    <p style={{ fontSize: '0.77rem', color: 'var(--fg-muted)', margin: '0 0 10px' }}>{p.description}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: p.color, background: `${p.color}12`, padding: '4px 8px', borderRadius: '6px' }}>{p.jobCount || 'Live'} jobs</span>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)' }}>Browse →</span>
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                    </aside>
                </div>
            </div>

            {/* ── Job Details Modal ── */}
            <AnimatePresence>
                {selectedJob && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{
                                width: '100%', maxWidth: '850px', maxHeight: '90vh',
                                background: 'var(--surface)', borderRadius: '24px',
                                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                                boxShadow: '0 30px 100px rgba(0,0,0,0.4)', border: '1px solid var(--border)'
                            }}
                        >
                            {/* Modal Header */}
                            <div style={{
                                padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)',
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '14px',
                                        background: (SOURCE_COLORS[selectedJob.source] || '#6366f1') + '15',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: SOURCE_COLORS[selectedJob.source] || '#6366f1'
                                    }}>
                                        <Briefcase size={22} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--fg)' }}>Job Details</h2>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', margin: 0 }}>View complete opportunities</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => setSelectedJob(null)}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        background: 'var(--bg)', border: '1px solid var(--border)',
                                        color: 'var(--fg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            {/* Modal Content */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
                                {/* Main Info */}
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--fg)', margin: 0, flex: 1, lineHeight: 1.2 }}>
                                            {selectedJob.title}
                                        </h1>
                                        <span style={{
                                            padding: '6px 14px', borderRadius: '8px',
                                            background: (SOURCE_COLORS[selectedJob.source] || '#6366f1') + '18',
                                            color: SOURCE_COLORS[selectedJob.source] || '#6366f1',
                                            fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
                                        }}>
                                            {selectedJob.source}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Building size={14} color="var(--accent)" />
                                            </div>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>{selectedJob.company}</span>
                                        </div>
                                        {selectedJob.isRemote && (
                                            <span style={{ padding: '3px 9px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.72rem', fontWeight: 800 }}>REMOTE</span>
                                        )}
                                    </div>

                                    {/* Metadata Pills */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', padding: '1.5rem', background: 'var(--bg)', borderRadius: '18px', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <MapPin size={17} style={{ color: 'var(--fg-muted)' }} />
                                            <div>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', margin: 0 }}>Location</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{selectedJob.location}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Clock size={17} style={{ color: 'var(--fg-muted)' }} />
                                            <div>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', margin: 0 }}>Employment Type</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{selectedJob.jobType || 'Full-time'}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Star size={17} style={{ color: 'var(--fg-muted)' }} />
                                            <div>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', margin: 0 }}>Experience</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{selectedJob.experience || 'Not specified'}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Calendar size={17} style={{ color: 'var(--fg-muted)' }} />
                                            <div>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', margin: 0 }}>Posted On</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{new Date(selectedJob.postedDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '4px', height: '18px', background: 'var(--accent)', borderRadius: '2px' }} />
                                        Job Description
                                    </h3>
                                    <div style={{
                                        color: 'var(--fg-muted)', fontSize: '1rem', lineHeight: 1.8,
                                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                        padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px'
                                    }}>
                                        {selectedJob.description}
                                    </div>
                                </div>

                                {/* Skills */}
                                {selectedJob.skills && selectedJob.skills.length > 0 && (
                                    <div style={{ marginBottom: '2.5rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '4px', height: '18px', background: 'var(--accent)', borderRadius: '2px' }} />
                                            Desired Skills
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {selectedJob.skills.map((skill, i) => (
                                                <span key={i} style={{
                                                    padding: '8px 16px', borderRadius: '10px',
                                                    background: 'var(--bg)', border: '1px solid var(--border)',
                                                    color: 'var(--fg)', fontSize: '0.85rem', fontWeight: 600
                                                }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div style={{
                                padding: '1.5rem 2.5rem', borderTop: '1px solid var(--border)',
                                background: 'var(--surface)', display: 'flex', justifyContent: 'center', gap: '1rem',
                                alignItems: 'center'
                            }}>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    style={{
                                        padding: '12px 24px', borderRadius: '12px', background: 'transparent',
                                        border: '1px solid var(--border)', color: 'var(--fg-muted)',
                                        fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <motion.a
                                    whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                                    href={selectedJob.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: '14px 32px', borderRadius: '12px',
                                        background: SOURCE_COLORS[selectedJob.source] || 'var(--accent)',
                                        color: '#fff', textDecoration: 'none', fontWeight: 800,
                                        fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px',
                                        boxShadow: `0 8px 20px -6px ${(SOURCE_COLORS[selectedJob.source] || '#0091FF')}80`
                                    }}
                                >
                                    Apply on {selectedJob.source} <ArrowUpRight size={18} />
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes pulse { 0%,100%{opacity:0.45} 50%{opacity:0.75} }
                .spin-icon { animation: spin 0.9s linear infinite; }
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>
        </div>
    );
};

export default JobsPage;
