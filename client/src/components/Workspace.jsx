import React, { useState, useEffect, useRef } from 'react';
import useResumeStore from '../store/resumeStore';
import useAuthStore from '../store/authStore';
import useProfileStore from '../store/profileStore';
import { API_ENDPOINTS } from '../config/api';
import {
    Layout,
    FileText,
    Palette,
    Briefcase,
    Search,
    Plus,
    Trash2,
    Download,
    ArrowLeft,
    Check,
    Settings,
    Eye,
    Upload,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    User,
    Award,
    Folder,
    Link,
    PlusCircle
} from 'lucide-react';
import TemplatePreview from './TemplatePreview';
import JobHub from './JobHub';
import { templates, fontOptions } from '../templates/config';
import { calculateATSScore } from '../utils/atsAnalyzer';
import ErrorBoundary from './ErrorBoundary';
import PremiumModal from './PremiumModal';
import { motion, AnimatePresence } from 'framer-motion';

const Workspace = ({ setView }) => {
    const { currentResume, saveResume, resumes, fetchResumes, setCurrentResume } = useResumeStore();
    const { user } = useAuthStore();
    const { profile } = useProfileStore();

    const [activeTab, setActiveTab] = useState('content'); // 'content', 'design', 'vault', 'jobs'
    const [activeSection, setActiveSection] = useState(null); // For progressive disclosure in content tab

    const defaultState = {
        personalDetails: {
            fullName: user?.user_metadata?.username || user?.email?.split('@')[0] || '',
            email: user?.email || '',
            phone: '',
            location: '',
            website: '',
            jobTitle: profile?.title || '',
            photoUrl: ''
        },
        summary: profile?.bio || '',
        experience: [],
        education: [],
        skills: profile?.skills?.join(', ') || '',
        projects: [],
        certificates: [],
        templateId: templates?.[0]?.id || 'elegant-pink-modern',
        customFontFamily: '',
        customFontSize: 14,
        customColor: '',
        customBgColor: '',
        customSections: []
    };

    const [formData, setFormData] = useState(currentResume ? { ...defaultState, ...currentResume } : defaultState);
    const [scale, setScale] = useState(0.65);
    const [isSaving, setIsSaving] = useState(false);
    const [showAts, setShowAts] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const previewContainerRef = useRef(null);

    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    useEffect(() => {
        const calculateScale = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.offsetWidth - 80;
                const containerHeight = previewContainerRef.current.offsetHeight - 80;
                const resumeWidth = 794;
                const resumeHeight = 1123;
                const scaleByWidth = containerWidth / resumeWidth;
                const scaleByHeight = containerHeight / resumeHeight;
                const calculatedScale = Math.min(scaleByWidth, scaleByHeight, 0.85);
                setScale(Math.max(calculatedScale, 0.4));
            }
        };
        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveResume(formData);
            // Optional: toast notification
        } catch (err) {
            alert("Save Failed: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const updateFormData = (updater) => {
        setFormData(prev => {
            const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
            return next;
        });
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Mocking Intelligent Import for now
        // In a real scenario, we'd send this to a backend parser
        alert("Initializing Neural Parser... (Simulated Import)");

        // Simulating data extraction
        setTimeout(() => {
            updateFormData({
                personalDetails: { ...formData.personalDetails, fullName: "Extracted Name", jobTitle: "Extracted Title" },
                summary: "This is a summary extracted from your document by our Intelligent Parser.",
                experience: [{ company: "Neural Tech", position: "AI Researcher", startDate: "2022", endDate: "Present", description: "Led development of parsing engines." }]
            });
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

            {/* 30% SIDEBAR */}
            <aside style={{
                width: '32%',
                minWidth: '400px',
                background: 'var(--surface)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                zIndex: 10
            }}>
                {/* Slim Icon Bar */}
                <div style={{
                    width: '64px',
                    background: '#111827',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '24px 0',
                    gap: '24px'
                }}>
                    <button onClick={() => setView('dashboard')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: '12px' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ height: '1px', width: '32px', background: 'rgba(255,255,255,0.1)' }}></div>

                    {[
                        { id: 'content', icon: FileText, label: 'Content' },
                        { id: 'design', icon: Palette, label: 'Design' },
                        { id: 'vault', icon: Settings, label: 'Vault' },
                        { id: 'jobs', icon: Briefcase, label: 'Job Hub' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                position: 'relative',
                                color: activeTab === tab.id ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '12px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <tab.icon size={20} />
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', width: '4px', height: '24px', background: 'var(--accent)', borderRadius: '4px' }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <header style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                            {activeTab === 'content' && 'Resume Content'}
                            {activeTab === 'design' && 'Design Center'}
                            {activeTab === 'vault' && 'Career Vault'}
                            {activeTab === 'jobs' && 'Job Hub'}
                        </h2>
                        <button
                            className="btn-primary"
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{ padding: '8px 16px', fontSize: '0.8rem', height: '36px', minWidth: '80px' }}
                        >
                            {isSaving ? '...' : (
                                <>Save <Check size={14} /></>
                            )}
                        </button>
                    </header>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                        {activeTab === 'content' && (
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {/* Progressive Disclosure Sections */}
                                {[
                                    { id: 'personal', title: 'Personal Details', icon: User },
                                    { id: 'summary', title: 'Professional Summary', icon: FileText },
                                    { id: 'experience', title: 'Work Experience', icon: Briefcase },
                                    { id: 'projects', title: 'Projects', icon: Folder },
                                    { id: 'education', title: 'Education', icon: Award },
                                    { id: 'certificates', title: 'Certificates', icon: CheckCircle2 },
                                    { id: 'skills', title: 'Skills', icon: Settings },
                                    ... (formData.customSections || []).map(section => ({
                                        id: section.id,
                                        title: section.title || 'New Section',
                                        icon: Layout,
                                        isCustom: true
                                    }))
                                ].map(section => (
                                    <div key={section.id} style={{
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        background: activeSection === section.id ? 'var(--bg-soft)' : 'white',
                                        transition: 'all 0.2s'
                                    }}>
                                        <button
                                            onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                                            style={{
                                                width: '100%',
                                                padding: '16px 20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <section.icon size={18} color={activeSection === section.id ? 'var(--accent)' : 'var(--fg-muted)'} />
                                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{section.title}</span>
                                            </div>
                                            <ChevronRight size={18} style={{
                                                transform: activeSection === section.id ? 'rotate(90deg)' : 'rotate(0)',
                                                transition: 'transform 0.2s'
                                            }} />
                                        </button>

                                        <AnimatePresence>
                                            {activeSection === section.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <div style={{ padding: '0 20px 24px 20px' }}>
                                                        {section.id === 'personal' && (
                                                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                                                <div>
                                                                    <label>Full Name</label>
                                                                    <input value={formData.personalDetails.fullName} onChange={e => updateFormData({ personalDetails: { ...formData.personalDetails, fullName: e.target.value } })} />
                                                                </div>
                                                                <div>
                                                                    <label>Email Address</label>
                                                                    <input value={formData.personalDetails.email} onChange={e => updateFormData({ personalDetails: { ...formData.personalDetails, email: e.target.value } })} />
                                                                </div>
                                                                <div>
                                                                    <label>Job Title</label>
                                                                    <input value={formData.personalDetails.jobTitle} onChange={e => updateFormData({ personalDetails: { ...formData.personalDetails, jobTitle: e.target.value } })} />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {section.id === 'summary' && (
                                                            <div>
                                                                <textarea rows={5} value={formData.summary} onChange={e => updateFormData({ summary: e.target.value })} />
                                                            </div>
                                                        )}
                                                        {/* Adding more sections later */}
                                                        {section.id === 'experience' && (
                                                            <div style={{ display: 'grid', gap: '20px' }}>
                                                                {formData.experience.map((exp, idx) => (
                                                                    <div key={idx} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'white', position: 'relative' }}>
                                                                        <button
                                                                            onClick={() => {
                                                                                const newExp = [...formData.experience];
                                                                                newExp.splice(idx, 1);
                                                                                updateFormData({ experience: newExp });
                                                                            }}
                                                                            style={{ position: 'absolute', top: '12px', right: '12px', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                        <div style={{ display: 'grid', gap: '12px' }}>
                                                                            <input placeholder="Company" value={exp.company} onChange={e => {
                                                                                const newExp = [...formData.experience];
                                                                                newExp[idx].company = e.target.value;
                                                                                updateFormData({ experience: newExp });
                                                                            }} />
                                                                            <input placeholder="Job Title" value={exp.position} onChange={e => {
                                                                                const newExp = [...formData.experience];
                                                                                newExp[idx].position = e.target.value;
                                                                                updateFormData({ experience: newExp });
                                                                            }} />
                                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                                <input placeholder="Years (e.g. 2020 - Present)" value={exp.years} onChange={e => {
                                                                                    const newExp = [...formData.experience];
                                                                                    newExp[idx].years = e.target.value;
                                                                                    updateFormData({ experience: newExp });
                                                                                }} />
                                                                            </div>
                                                                            <textarea placeholder="Description of responsibilities..." value={exp.description} onChange={e => {
                                                                                const newExp = [...formData.experience];
                                                                                newExp[idx].description = e.target.value;
                                                                                updateFormData({ experience: newExp });
                                                                            }} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <button className="btn-secondary" style={{ width: '100%', gap: '8px' }} onClick={() => updateFormData({ experience: [...formData.experience, { company: '', position: '', years: '', description: '' }] })}>
                                                                    <Plus size={16} /> Add Experience
                                                                </button>
                                                            </div>
                                                        )}

                                                        {section.id === 'projects' && (
                                                            <div style={{ display: 'grid', gap: '20px' }}>
                                                                {formData.projects.map((proj, idx) => (
                                                                    <div key={idx} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'white', position: 'relative' }}>
                                                                        <button
                                                                            onClick={() => {
                                                                                const newProj = [...formData.projects];
                                                                                newProj.splice(idx, 1);
                                                                                updateFormData({ projects: newProj });
                                                                            }}
                                                                            style={{ position: 'absolute', top: '12px', right: '12px', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                        <div style={{ display: 'grid', gap: '12px' }}>
                                                                            <input placeholder="Project Name" value={proj.name} onChange={e => {
                                                                                const newProj = [...formData.projects];
                                                                                newProj[idx].name = e.target.value;
                                                                                updateFormData({ projects: newProj });
                                                                            }} />
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-soft)', padding: '4px 12px', borderRadius: '8px' }}>
                                                                                <Link size={14} color="var(--fg-muted)" />
                                                                                <input placeholder="Project Link (URL)" style={{ background: 'none', border: 'none', padding: '8px 0' }} value={proj.link} onChange={e => {
                                                                                    const newProj = [...formData.projects];
                                                                                    newProj[idx].link = e.target.value;
                                                                                    updateFormData({ projects: newProj });
                                                                                }} />
                                                                            </div>
                                                                            <textarea placeholder="Tell us what you built..." value={proj.description} onChange={e => {
                                                                                const newProj = [...formData.projects];
                                                                                newProj[idx].description = e.target.value;
                                                                                updateFormData({ projects: newProj });
                                                                            }} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <button className="btn-secondary" style={{ width: '100%', gap: '8px' }} onClick={() => updateFormData({ projects: [...formData.projects, { name: '', link: '', description: '' }] })}>
                                                                    <Plus size={16} /> Add Project
                                                                </button>
                                                            </div>
                                                        )}

                                                        {section.id === 'education' && (
                                                            <div style={{ display: 'grid', gap: '20px' }}>
                                                                {formData.education.map((edu, idx) => (
                                                                    <div key={idx} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'white', position: 'relative' }}>
                                                                        <button
                                                                            onClick={() => {
                                                                                const newEdu = [...formData.education];
                                                                                newEdu.splice(idx, 1);
                                                                                updateFormData({ education: newEdu });
                                                                            }}
                                                                            style={{ position: 'absolute', top: '12px', right: '12px', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                        <div style={{ display: 'grid', gap: '12px' }}>
                                                                            <input placeholder="Institution" value={edu.school} onChange={e => {
                                                                                const newEdu = [...formData.education];
                                                                                newEdu[idx].school = e.target.value;
                                                                                updateFormData({ education: newEdu });
                                                                            }} />
                                                                            <input placeholder="Degree/Course" value={edu.degree} onChange={e => {
                                                                                const newEdu = [...formData.education];
                                                                                newEdu[idx].degree = e.target.value;
                                                                                updateFormData({ education: newEdu });
                                                                            }} />
                                                                            <input placeholder="Year" value={edu.year} onChange={e => {
                                                                                const newEdu = [...formData.education];
                                                                                newEdu[idx].year = e.target.value;
                                                                                updateFormData({ education: newEdu });
                                                                            }} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <button className="btn-secondary" style={{ width: '100%', gap: '8px' }} onClick={() => updateFormData({ education: [...formData.education, { school: '', degree: '', year: '' }] })}>
                                                                    <Plus size={16} /> Add Education
                                                                </button>
                                                            </div>
                                                        )}

                                                        {section.id === 'certificates' && (
                                                            <div style={{ display: 'grid', gap: '20px' }}>
                                                                {formData.certificates.map((cert, idx) => (
                                                                    <div key={idx} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'white', position: 'relative' }}>
                                                                        <button
                                                                            onClick={() => {
                                                                                const newCert = [...formData.certificates];
                                                                                newCert.splice(idx, 1);
                                                                                updateFormData({ certificates: newCert });
                                                                            }}
                                                                            style={{ position: 'absolute', top: '12px', right: '12px', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                        <div style={{ display: 'grid', gap: '12px' }}>
                                                                            <input placeholder="Certification Name" value={cert.name} onChange={e => {
                                                                                const newCert = [...formData.certificates];
                                                                                newCert[idx].name = e.target.value;
                                                                                updateFormData({ certificates: newCert });
                                                                            }} />
                                                                            <input placeholder="Issuing Organization" value={cert.issuer} onChange={e => {
                                                                                const newCert = [...formData.certificates];
                                                                                newCert[idx].issuer = e.target.value;
                                                                                updateFormData({ certificates: newCert });
                                                                            }} />
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-soft)', padding: '4px 12px', borderRadius: '8px' }}>
                                                                                <Link size={14} color="var(--fg-muted)" />
                                                                                <input placeholder="Credential Link" style={{ background: 'none', border: 'none', padding: '8px 0' }} value={cert.link} onChange={e => {
                                                                                    const newCert = [...formData.certificates];
                                                                                    newCert[idx].link = e.target.value;
                                                                                    updateFormData({ certificates: newCert });
                                                                                }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <button className="btn-secondary" style={{ width: '100%', gap: '8px' }} onClick={() => updateFormData({ certificates: [...formData.certificates, { name: '', issuer: '', link: '' }] })}>
                                                                    <Plus size={16} /> Add Certificate
                                                                </button>
                                                            </div>
                                                        )}
                                                        {section.id === 'skills' && (
                                                            <div>
                                                                <textarea rows={3} placeholder="Comma separated skills (e.g. React, Node.js, Architecture)" value={formData.skills} onChange={e => updateFormData({ skills: e.target.value })} />
                                                            </div>
                                                        )}

                                                        {section.isCustom && (
                                                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                                                <div>
                                                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px', display: 'block' }}>Section Title</label>
                                                                    <input
                                                                        placeholder="e.g. Languages, Hobbies, Awards"
                                                                        value={formData.customSections.find(s => s.id === section.id)?.title || ''}
                                                                        onChange={e => {
                                                                            const next = [...formData.customSections];
                                                                            const target = next.find(s => s.id === section.id);
                                                                            if (target) target.title = e.target.value;
                                                                            updateFormData({ customSections: next });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px', display: 'block' }}>Content</label>
                                                                    <textarea
                                                                        rows={5}
                                                                        placeholder="Enter section content here..."
                                                                        value={formData.customSections.find(s => s.id === section.id)?.content || ''}
                                                                        onChange={e => {
                                                                            const next = [...formData.customSections];
                                                                            const target = next.find(s => s.id === section.id);
                                                                            if (target) target.content = e.target.value;
                                                                            updateFormData({ customSections: next });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        const next = formData.customSections.filter(s => s.id !== section.id);
                                                                        updateFormData({ customSections: next });
                                                                        setActiveSection(null);
                                                                    }}
                                                                    style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                                                >
                                                                    <Trash2 size={14} /> Remove this section
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}

                                <button
                                    onClick={() => {
                                        const newSection = {
                                            id: 'custom-' + Date.now(),
                                            title: '',
                                            content: ''
                                        };
                                        updateFormData({ customSections: [...(formData.customSections || []), newSection] });
                                        setActiveSection(newSection.id);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        border: '2px dashed var(--border)',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        color: 'var(--fg-muted)',
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                        marginTop: '12px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--accent)';
                                        e.currentTarget.style.color = 'var(--accent)';
                                        e.currentTarget.style.background = 'var(--accent-glow)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.color = 'var(--fg-muted)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    }}
                                >
                                    <PlusCircle size={18} /> Add Custom Section
                                </button>

                                <div style={{ marginTop: '24px', padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent-glow) 0%, transparent 100%)', border: '1px dashed var(--accent)' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Sparkles size={16} /> Intelligent Import
                                    </h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginBottom: '16px' }}>Upload an existing resume. Let Resumate parse and map it perfectly.</p>
                                    <label htmlFor="import-resume" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '10px',
                                        background: 'white',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: 600
                                    }}>
                                        <Upload size={14} /> UNLOCK DATA FRAGMENTS
                                        <input id="import-resume" type="file" hidden onChange={handleImport} accept=".pdf,.doc,.docx" />
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeTab === 'design' && (
                            <div style={{ display: 'grid', gap: '2rem' }}>
                                <div>
                                    <label>Visual Architecture (Templates)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {templates.slice(0, 4).map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => updateFormData({ templateId: t.id })}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    border: formData.templateId === t.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                                                    background: 'white',
                                                    textAlign: 'left',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--fg-muted)' }}>{t.styles.layout} Engine</div>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className="btn-secondary"
                                        style={{ width: '100%', marginTop: '12px', padding: '10px' }}
                                        onClick={() => setView('templates')}
                                    >
                                        Browse Full Catalog (25+)
                                    </button>
                                </div>

                                <div>
                                    <label>Heading Precision (Color)</label>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {['#0091FF', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#111827'].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => updateFormData({ customColor: color })}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: color,
                                                    border: formData.customColor === color ? '2px solid white' : 'none',
                                                    boxShadow: formData.customColor === color ? `0 0 0 2px ${color}` : 'none'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label>Typography Matrix</label>
                                    <select value={formData.customFontFamily} onChange={e => updateFormData({ customFontFamily: e.target.value })}>
                                        <option value="">Template Default</option>
                                        {fontOptions.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === 'vault' && (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--accent-glow)', border: '1px solid var(--accent)', marginBottom: '8px' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '4px' }}>Asset Central</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>Select any vaulted asset to load it into the active workspace.</p>
                                </div>
                                {resumes.map(resume => (
                                    <motion.div
                                        key={resume.id}
                                        whileHover={{ x: 4 }}
                                        style={{
                                            padding: '16px 20px',
                                            borderRadius: '16px',
                                            border: '1px solid var(--border)',
                                            background: 'white',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => updateFormData(resume)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-soft)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FileText size={20} color="var(--fg-muted)" />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{resume.personalDetails.fullName || 'Untitled'}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--fg-muted)' }}>{resume.templateId} • {new Date(resume.updated_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} color="var(--border)" />
                                    </motion.div>
                                ))}
                                <button className="btn-secondary" style={{ padding: '16px', borderRadius: '16px', borderStyle: 'dashed', marginTop: '12px' }} onClick={() => setView('templates')}>
                                    <Plus size={16} /> INITIALIZE NEW ASSET
                                </button>
                            </div>
                        )}

                        {activeTab === 'jobs' && (
                            <div style={{ height: '100%' }}>
                                <JobHub isEmbedded={true} />
                            </div>
                        )}
                    </div>
                </div>
            </aside >

            {/* 70% CANVAS */}
            < main ref={previewContainerRef} style={{
                flex: 1,
                background: 'var(--bg-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px',
                overflowY: 'auto',
                position: 'relative'
            }}>
                {/* Floating Preview Tools */}
                < div style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    display: 'flex',
                    gap: '12px',
                    zIndex: 20
                }}>
                    <button className="glass-pill" style={{ padding: '8px 16px', gap: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                        <Eye size={16} /> LIVE PREVIEW
                    </button>
                    <button className="glass-pill" style={{ padding: '8px 16px', gap: '8px', fontSize: '0.85rem', fontWeight: 700 }} onClick={() => setShowAts(!showAts)}>
                        <Sparkles size={16} color="var(--accent)" /> ATS {calculateATSScore(formData).score}%
                    </button>
                </div >

                <div style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15)',
                    background: 'white',
                    width: '794px',
                    minHeight: '1123px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <ErrorBoundary>
                        <TemplatePreview data={formData} />
                    </ErrorBoundary>
                </div>
            </main >

            {/* ATS Panel */}
            < AnimatePresence >
                {showAts && (
                    <motion.div
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        style={{
                            position: 'fixed',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: '400px',
                            background: 'white',
                            boxShadow: '-20px 0 50px rgba(0,0,0,0.1)',
                            zIndex: 100,
                            padding: '40px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>ATS Breakdown</h3>
                            <button onClick={() => setShowAts(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                        </div>
                        {/* ATS details here */}
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--accent)' }}>{calculateATSScore(formData).score}%</div>
                            <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)' }}>Precision Score</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >

            <style>{`
                label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--fg-muted);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
                input, select, textarea {
                    font-family: var(--font-body);
                    border-radius: 8px;
                    border: 1px solid var(--border);
                    padding: 12px;
                    background: white;
                    width: 100%;
                }
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px var(--accent-glow);
                }
                .glass-pill {
                    border: 1px solid var(--border);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    border-radius: 100px;
                }
            `}</style>
        </div >
    );
};

export default Workspace;
