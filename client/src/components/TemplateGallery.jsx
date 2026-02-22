import React, { useState, useEffect } from 'react';
import { templates, fontOptions } from '../templates/config';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Palette, X, Layout, Lock, Sparkles } from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import useAuthStore from '../store/authStore';
import useProfileStore from '../store/profileStore';
import TemplatePreview from './TemplatePreview';
import PremiumModal from './PremiumModal';
import { sampleResume } from '../data/sampleResume';

// High-Fidelity Mini Thumbnail Component 
// High-Fidelity Mini Thumbnail Component 
// Ult-Realistic Mini Thumbnail Component
const TemplateGallery = ({ setView }) => {
    const { user, checkPremiumStatus } = useAuthStore();
    const isPremium = checkPremiumStatus();

    // Logged in users get full access to all 25+ architectures
    const FREE_TEMPLATE_LIMIT = user ? 999 : 10;
    const availableTemplates = templates;

    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

    // Dynamic Font Loader for Preview
    React.useEffect(() => {
        // Load all fonts for the picker (Optional: Optimize this later)
        fontOptions.forEach(font => {
            const fontName = font.name;
            const linkId = `font-${fontName.replace(/\s+/g, '-')}`;
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
                document.head.appendChild(link);
            }
        });
    }, []);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedColor, setSelectedColor] = useState('#2563EB');
    const [selectedBgColor, setSelectedBgColor] = useState('#111827');
    const [customFontFamily, setCustomFontFamily] = useState('Inter, sans-serif');
    const [customFontSize, setCustomFontSize] = useState(14);

    // ENHANCED Palettes with more vibrant colors
    const accentColors = [
        '#2563EB', '#3B82F6', '#0EA5E9', // Blues
        '#10B981', '#059669', '#14B8A6', // Greens & Teals
        '#F59E0B', '#FBBF24', '#F97316', // Golds & Oranges
        '#EF4444', '#DC2626', '#FF6B35', // Reds & Deep Reds
        '#7C3AED', '#A855F7', '#EC4899', // Purples & Pinks
        '#64748B', '#6B7280', '#000000', // Grays & Black
        '#8B5CF6', '#06B6D4', '#0891B2', // Additional vibrants
        '#B45309', '#D97706', '#EA580C'  // Earthy tones
    ];

    const bgColors = [
        '#111827', '#1E3A8A', '#0C4A6E', '#1E293B', // Dark blues
        '#1F2937', '#374151', '#4B5563', '#171717', // Grays & Black
        '#064E3B', '#0D5E4E', '#0D7377', '#134E4A', // Dark Teals
        '#1F1F1F', '#2F2F2F', '#3F3F3F', '#1A1A2E'  // Very dark tones
    ];

    const { setCurrentResume, setIsPreviewing, saveResume } = useResumeStore();
    const { profile, fetchProfile } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        setIsPreviewing(true); // Hide Navbar
        setSelectedColor(template?.styles?.accent && template.styles.accent !== '#374151' ? template.styles.accent : accentColors[0]);
        setSelectedBgColor(template?.styles?.sidebarBg || '#111827');
        setCustomFontFamily(template?.styles?.fontFamily || "'Inter', sans-serif");
        setCustomFontSize(14);
    };

    const handleCreate = async () => {
        if (!selectedTemplate) return;

        const resumeData = {
            personalDetails: {
                fullName: user?.user_metadata?.fullName || user?.user_metadata?.username || user?.email?.split('@')[0] || '',
                email: user?.email || '',
                phone: '',
                location: profile?.location || '',
                website: '',
                jobTitle: profile?.title || '',
                photoUrl: ''
            },
            summary: profile?.bio || '',
            experience: [],
            education: [],
            skills: Array.isArray(profile?.skills) ? profile.skills.join(', ') : profile?.skills || '',
            templateId: selectedTemplate.id,
            customColor: selectedColor,
            customBgColor: selectedBgColor,
            customFontFamily,
            customFontSize
        };

        if (!user) {
            setCurrentResume(resumeData);
            setIsPremiumModalOpen(true);
            return;
        }

        try {
            const savedResume = await saveResume(resumeData);
            setCurrentResume(savedResume);
            setView('editor');
            setIsPreviewing(false);
        } catch (err) {
            console.error('Auto-save error:', err);
            // Fallback to local state if server save fails
            setCurrentResume(resumeData);
            setView('editor');
            setIsPreviewing(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem 2rem 4rem 2rem', position: 'relative' }}>
            <div style={{ maxWidth: '1400px', margin: '2rem auto', textAlign: 'center', padding: '0 1rem' }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem', color: 'var(--fg)', letterSpacing: '-0.03em' }}>
                    Select Your <span className="text-gradient">Architecture</span>
                </h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ padding: '6px 16px', background: 'var(--accent)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px var(--accent-alpha)' }}>
                        <Sparkles size={16} color="white" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', letterSpacing: '0.1em' }}>NEURAL SELECTION ACTIVE</span>
                    </div>
                    <p style={{ color: 'var(--fg-muted)', fontSize: '1.2rem', maxWidth: '700px', lineHeight: 1.6 }}>
                        Browse our curated collection of 25+ pixel-perfect resume architectures. Optimized for high-fidelity parsing across all major enterprise ATS platforms.
                    </p>
                </div>
            </div>

            <div className="responsive-grid" style={{ maxWidth: '100%', margin: '0 auto' }}>
                {templates.map((template, index) => {
                    return (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                            onClick={() => handleTemplateClick(template)}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid var(--border)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}
                        >
                            {index >= FREE_TEMPLATE_LIMIT && (
                                <div style={{
                                    position: 'absolute',
                                    top: 15,
                                    right: 15,
                                    zIndex: 10,
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    border: '1px solid #E5E7EB'
                                }}>
                                    <Lock size={12} color="var(--accent)" />
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)' }}>PRO</span>
                                </div>
                            )}
                            <div style={{ height: '340px', background: '#f8fafc', position: 'relative', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <div style={{
                                    width: '210mm',
                                    height: '297mm',
                                    transform: 'scale(0.28)',
                                    transformOrigin: 'center center',
                                    background: 'white',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                    borderRadius: '2px',
                                    flexShrink: 0
                                }}>
                                    <TemplatePreview data={{ ...sampleResume, templateId: template.id, ...template.styles }} />
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fg)' }}>{template.name}</h3>
                                    {index >= FREE_TEMPLATE_LIMIT ? (
                                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#FEF3C7', color: '#92400E', fontWeight: 600 }}>Exclusive</span>
                                    ) : (
                                        template.styles.headerStyle !== 'left' && <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#F3F4F6', color: '#6B7280' }}>{template.styles.headerStyle}</span>
                                    )}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'capitalize' }}>{template.styles.layout} • {(template.styles.fontFamily || 'Sans').split(',')[0].replace(/'/g, "")}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <PremiumModal
                isOpen={isPremiumModalOpen}
                onClose={() => setIsPremiumModalOpen(false)}
                setView={setView}
            />

            <AnimatePresence>
                {selectedTemplate && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }} onClick={() => { setSelectedTemplate(null); setIsPreviewing(false); }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{ background: 'white', borderRadius: '24px', padding: '0', maxWidth: '1100px', width: '95%', height: '85vh', display: 'flex', boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.25)', overflow: 'hidden', position: 'relative' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => { setSelectedTemplate(null); setIsPreviewing(false); }} style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: '50%', cursor: 'pointer', border: 'none' }}><X size={24} color="#374151" /></button>

                            <div className="mobile-stack" style={{ width: '100%', height: '100%', overflow: 'hidden', alignItems: 'stretch' }}>
                                <div style={{ width: '100%', maxWidth: '420px', padding: 'clamp(1.5rem, 5vw, 2.5rem)', background: '#FFFFFF', display: 'flex', flexDirection: 'column', borderRight: '1px solid #E5E7EB', zIndex: 2, margin: '0 auto', overflowY: 'auto' }}>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: '8px' }}>Selected Template</h4>
                                        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>{selectedTemplate.name}</h1>
                                        <p style={{ fontSize: '0.95rem', color: '#6B7280', marginTop: '8px' }}>{selectedTemplate.styles.layout} Layout Engine</p>
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Palette size={16} /> Heading Color
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))', gap: '8px' }}>
                                            {accentColors.map(color => (
                                                <button key={color} onClick={() => setSelectedColor(color)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: color, border: selectedColor === color ? '3px solid white' : '2px solid white', boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer', transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)' }}>
                                                    {selectedColor === color && <Check size={16} color="white" style={{ margin: 'auto' }} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {(selectedTemplate?.styles?.layout?.includes('sidebar') || ['cyber', 'timeline', 'brutalist', 'neon-banner'].includes(selectedTemplate?.styles?.layout) || selectedTemplate?.styles?.sidebarBg) && (
                                        <div style={{ marginBottom: '2rem' }}>
                                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Layout size={16} /> Sidebar/Background
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))', gap: '8px' }}>
                                                {bgColors.map(color => (
                                                    <button key={color} onClick={() => setSelectedBgColor(color)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: color, border: selectedBgColor === color ? '3px solid white' : '2px solid white', boxShadow: selectedBgColor === color ? `0 0 0 2px ${color}` : '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer', transform: selectedBgColor === color ? 'scale(1.1)' : 'scale(1)' }}>
                                                        {selectedBgColor === color && <Check size={16} color="white" style={{ margin: 'auto' }} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 900 }}>Aa</div> Typography
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <select
                                                value={customFontFamily}
                                                onChange={(e) => setCustomFontFamily(e.target.value)}
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white', fontSize: '0.95rem', fontFamily: customFontFamily }}
                                            >
                                                {fontOptions.map(font => (
                                                    <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
                                                ))}
                                            </select>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Size: {customFontSize}px</span>
                                                <input
                                                    type="range"
                                                    min="12"
                                                    max="20"
                                                    step="0.5"
                                                    value={customFontSize}
                                                    onChange={(e) => setCustomFontSize(Number(e.target.value))}
                                                    style={{ flex: 1 }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleCreate} style={{ width: '100%', marginTop: 'auto', padding: '18px', background: '#111827', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        Use This Design <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                                    </button>
                                </div>

                                <div style={{
                                    flex: 1,
                                    background: '#F8FAFC',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    overflowY: 'auto',
                                    padding: '2rem 1rem',
                                    position: 'relative',
                                    scrollBehavior: 'smooth'
                                }}>
                                    {/* Simplified Scale Wrapper for Pixel Perfection */}
                                    <div style={{
                                        width: 'calc(210mm * 0.62)',
                                        height: 'calc(297mm * 0.62)',
                                        margin: '1rem 0',
                                        position: 'relative',
                                        flexShrink: 0,
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}>
                                        <div style={{
                                            transform: 'scale(0.62)',
                                            transformOrigin: 'top left',
                                            width: '210mm',
                                            height: '297mm',
                                            boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.15)',
                                            borderRadius: '2px',
                                            background: 'white',
                                            overflow: 'hidden'
                                        }}>
                                            <TemplatePreview data={{ ...sampleResume, templateId: selectedTemplate.id, customColor: selectedColor, customBgColor: selectedBgColor, customFontFamily, customFontSize }} />
                                        </div>
                                    </div>

                                    <div style={{ padding: '0 0 4rem 0', textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            Full Dynamic Architecture
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default TemplateGallery;
