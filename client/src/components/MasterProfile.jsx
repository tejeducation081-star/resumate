import React, { useState, useEffect } from 'react';
import useProfileStore from '../store/profileStore';
import useAuthStore from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, MapPin, DollarSign, Target, Award, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const MasterProfile = ({ setView }) => {
    const { profile, updateProfile, fetchProfile } = useProfileStore();
    const { user } = useAuthStore();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(profile);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleUpdate = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile(formData);
            setStep(4); // Success step
        } catch (err) {
            alert("Failed to save profile: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const steps = [
        { id: 1, title: 'Basics', icon: User },
        { id: 2, title: 'Goals', icon: Target },
        { id: 3, title: 'Skills', icon: Award },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '100px', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Master Profile</h1>
                    <p style={{ color: 'var(--fg-muted)', fontSize: '1.1rem' }}>
                        The brain of your career ecosystem. Tell us who you are and where you want to go.
                    </p>
                </div>

                {/* Progress Bar */}
                {step <= 3 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', height: '2px', background: 'var(--border)', zIndex: 0 }}></div>
                        <div style={{ position: 'absolute', top: '24px', left: '0', width: `${((step - 1) / 2) * 100}%`, height: '2px', background: 'var(--accent)', zIndex: 0, transition: 'width 0.3s ease' }}></div>

                        {steps.map((s) => (
                            <div key={s.id} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: step >= s.id ? 'var(--accent)' : 'var(--bg)',
                                    border: `2px solid ${step >= s.id ? 'var(--accent)' : 'var(--border)'}`,
                                    color: step >= s.id ? 'white' : 'var(--fg-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <s.icon size={20} />
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: step >= s.id ? 'var(--fg)' : 'var(--fg-muted)' }}>{s.title}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '32px', border: '1px solid var(--border)' }}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Personal Foundations</h2>
                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    <div>
                                        <label>Current Professional Title</label>
                                        <input
                                            value={formData.title || ''}
                                            onChange={e => handleUpdate('title', e.target.value)}
                                            placeholder="e.g. Senior Marketing Analyst"
                                        />
                                    </div>
                                    <div>
                                        <label>Preferred Industry</label>
                                        <select
                                            value={formData.industry || ''}
                                            onChange={e => handleUpdate('industry', e.target.value)}
                                        >
                                            <option value="">Select Industry</option>
                                            <option value="tech">Technology</option>
                                            <option value="finance">Finance</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="education">Education</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Professional Bio</label>
                                        <textarea
                                            value={formData.bio || ''}
                                            onChange={e => handleUpdate('bio', e.target.value)}
                                            placeholder="A brief overview of your professional journey..."
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Career Trajectory</h2>
                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    <div>
                                        <label>Target Job Title</label>
                                        <input
                                            value={formData.targetTitle || ''}
                                            onChange={e => handleUpdate('targetTitle', e.target.value)}
                                            placeholder="e.g. Senior Manager, Marketing"
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label>Location Preference</label>
                                            <div style={{ position: 'relative' }}>
                                                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)' }} />
                                                <input
                                                    style={{ paddingLeft: '40px' }}
                                                    value={formData.location || ''}
                                                    onChange={e => handleUpdate('location', e.target.value)}
                                                    placeholder="City, Remote, etc."
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label>Target Salary Range</label>
                                            <div style={{ position: 'relative' }}>
                                                <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)' }} />
                                                <input
                                                    style={{ paddingLeft: '40px' }}
                                                    value={formData.salary || ''}
                                                    onChange={e => handleUpdate('salary', e.target.value)}
                                                    placeholder="e.g. $120k - $150k"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Core Competencies</h2>
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div>
                                        <label>Technical & Soft Skills</label>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginBottom: '1rem' }}>
                                            List your top weapons. These will feed the Job Matching Engine.
                                        </p>
                                        <textarea
                                            value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills || ''}
                                            onChange={e => handleUpdate('skills', e.target.value.split(',').map(s => s.trim()))}
                                            placeholder="e.g. Data Analysis, SEO, Project Management..."
                                            rows={6}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ textAlign: 'center', padding: '2rem 0' }}
                            >
                                <div style={{ color: '#10B981', marginBottom: '2rem' }}>
                                    <CheckCircle2 size={80} style={{ margin: '0 auto' }} />
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Profile Synchronized</h2>
                                <p style={{ color: 'var(--fg-muted)', fontSize: '1.1rem', marginBottom: '3rem' }}>
                                    Your Master Profile is now active. We've optimized your Job Hub with fresh matches based on your goals.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button className="btn-secondary" onClick={() => setView('dashboard')}>Go to Dashboard</button>
                                    <button className="btn-primary" onClick={() => setView('editor')}>Enter Workspace</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {step <= 3 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                            <button
                                className="btn-secondary"
                                style={{ padding: '12px 24px' }}
                                onClick={() => step > 1 ? setStep(s => s - 1) : setView('dashboard')}
                            >
                                <ArrowLeft size={18} /> {step === 1 ? 'Cancel' : 'Back'}
                            </button>

                            {step < 3 ? (
                                <button
                                    className="btn-primary"
                                    style={{ padding: '12px 32px' }}
                                    onClick={() => setStep(s => s + 1)}
                                >
                                    Continue <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    className="btn-primary"
                                    style={{ padding: '12px 32px', background: '#10B981', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Synchronizing...' : 'Complete Initialization'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MasterProfile;
