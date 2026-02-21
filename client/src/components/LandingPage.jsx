import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Layers, Zap, Cloud, Lock, Play, PenTool, Download, Globe, Cpu, ChevronRight, ChevronDown, Palette, Sparkles, FileText, Layout, MessageSquare, Plus, Lightbulb } from 'lucide-react';
import ResumeLogo from './ResumeLogo';
import ProductVideo from './ProductVideo';

const LandingPage = ({ setView }) => {
    const { scrollY, scrollYProgress } = useScroll();

    // Smooth out scroll-linked values
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const y1 = useTransform(smoothProgress, [0, 0.5], [0, 150]);
    const y2 = useTransform(smoothProgress, [0, 0.5], [0, -100]);

    // Carousel State
    const [currentImage, setCurrentImage] = useState(0);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const heroImages = [
        '/professional_mockup.png',
        '/modern_analytics_interface_1769946631505.png',
        '/landing_hero_resume_mockup_1769946611712.png',
        '/creative_professional_workspace_1769946650154.png'
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [heroImages.length]);

    // Template Gallery Data
    const templates = [
        { name: "Executive Core", style: "Modern", color: "#3B82F6", image: "/resume_thumb_modern.png" },
        { name: "Cipher Analyst", style: "Corporate", color: "#10B981", image: "/resume_thumb_corporate.png" },
        { name: "Flux Creative", style: "Minimalist", color: "#6366F1", image: "/resume_thumb_creative.png" },
        { name: "Titan Lead", style: "Tech", color: "#F59E0B", image: "/resume_thumb_tech.png" },
        { name: "Nova Struct", style: "Swiss", color: "#EC4899", image: "/resume_thumb_minimal.png" },
        { name: "Zenith Pro", style: "Executive", color: "#8B5CF6", image: "/resume_thumb_executive.png" },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', overflowX: 'hidden' }}>
            {/* Scroll Progress Bar */}
            <motion.div
                style={{
                    scaleX: scrollYProgress,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, var(--accent), var(--cyan))',
                    transformOrigin: '0%',
                    zIndex: 200,
                    boxShadow: '0 0 10px var(--accent)'
                }}
            />

            {/* HERO SECTION */}
            <section id="landing" style={{
                position: 'relative',
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '60px',
                paddingBottom: '60px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)'
            }}>
                <div className="container">
                    <div className="mobile-stack" style={{ gap: '4rem', alignItems: 'center' }}>

                        {/* Hero Content - Left Side */}
                        <div style={{ flex: 1, textAlign: 'left', zIndex: 10 }}>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 style={{
                                    fontSize: 'clamp(3.5rem, 5vw, 5rem)',
                                    lineHeight: 1.05,
                                    marginBottom: '2rem',
                                    fontWeight: 800,
                                    color: 'var(--fg)',
                                    letterSpacing: '-0.02em'
                                }}>
                                    Create an impressive resume with a <br />
                                    <span style={{ color: '#0091FF' }}>free resume builder.</span>
                                </h1>

                                <p style={{
                                    fontSize: '1.25rem',
                                    color: 'var(--fg-muted)',
                                    maxWidth: '550px',
                                    marginBottom: '3.5rem',
                                    lineHeight: 1.6,
                                    fontWeight: 500
                                }}>
                                    The first step to a better job? A better resume. Only 2% of resumes win, and yours will be one of them. Build it now for free!
                                </p>

                                {/* High-End ATS Certified Seal */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 10,
                                        delay: 0.4
                                    }}
                                    style={{
                                        position: 'absolute',
                                        left: '-120px',
                                        top: '20px',
                                        width: '180px',
                                        height: '180px',
                                        zIndex: -1,
                                        display: 'none', // Shown on desktop via media query logic (simulated with large left)
                                    }}
                                    className="desktop-only"
                                >
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {/* Outer Rotating Ring */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                border: '2px dashed rgba(0, 145, 255, 0.2)',
                                                borderRadius: '50%',
                                            }}
                                        />

                                        {/* Inner Seal */}
                                        <div style={{
                                            width: '120px',
                                            height: '120px',
                                            background: 'white',
                                            borderRadius: '50%',
                                            border: '6px double #0091FF',
                                            boxShadow: '0 20px 40px rgba(0, 145, 255, 0.1), inset 0 0 20px rgba(0, 145, 255, 0.05)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '10px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ color: '#0091FF', marginBottom: '4px' }}>
                                                <Zap size={28} fill="#0091FF" />
                                            </div>
                                            <div style={{
                                                fontSize: '0.6rem',
                                                fontWeight: 900,
                                                color: '#0070C5',
                                                lineHeight: 1,
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}>
                                                Powered with<br />
                                                <span style={{ fontSize: '1.2rem', color: '#0091FF' }}>ATS</span>
                                            </div>
                                            <div style={{
                                                marginTop: '4px',
                                                fontSize: '0.5rem',
                                                fontWeight: 800,
                                                color: '#10B981',
                                                textTransform: 'uppercase'
                                            }}>
                                                ● Certified ●
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 24px',
                                        borderRadius: '100px',
                                        background: 'linear-gradient(to right, #ffffff, #f0f9ff)',
                                        border: '1.5px solid rgba(0, 145, 255, 0.3)',
                                        marginBottom: '2.5rem',
                                        boxShadow: '0 10px 25px -5px rgba(0, 145, 255, 0.1)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Glass reflection effect */}
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '50%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                                            skewX: '-20deg',
                                            pointerEvents: 'none'
                                        }}
                                    />

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '28px',
                                        height: '28px',
                                        background: '#0091FF',
                                        borderRadius: '50%',
                                        color: 'white',
                                    }}>
                                        <Zap size={14} fill="currentColor" />
                                    </div>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 800,
                                        color: '#0070C5',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase'
                                    }}>
                                        Engineered with <span style={{ color: '#0091FF', fontWeight: 900 }}>ATS Precision</span>
                                    </span>
                                </motion.div>

                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '4.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        className="btn-primary"
                                        style={{
                                            padding: '18px 36px',
                                            fontSize: '1.05rem',
                                            borderRadius: '12px',
                                            fontWeight: 700
                                        }}
                                        onClick={() => setView('templates')}
                                    >
                                        Create a New Resume
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        style={{
                                            border: '2px solid #0091FF',
                                            color: '#0091FF',
                                            background: 'transparent',
                                            padding: '18px 36px',
                                            fontSize: '1.05rem',
                                            borderRadius: '12px',
                                            fontWeight: 700
                                        }}
                                        onClick={() => setView('editor')}
                                    >
                                        Improve My Resume
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '4rem', borderTop: '2px solid rgba(0,0,0,0.05)', paddingTop: '3rem' }}>
                                    <div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10B981', marginBottom: '8px', lineHeight: 1 }}>48%</div>
                                        <div style={{ fontSize: '1rem', color: 'var(--fg-muted)', fontWeight: 600, maxWidth: '160px' }}>more likely to get hired</div>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-2rem', top: '10%', height: '80%', width: '1px', background: 'var(--border)' }}></div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#F59E0B', marginBottom: '8px', lineHeight: 1 }}>12%</div>
                                        <div style={{ fontSize: '1rem', color: 'var(--fg-muted)', fontWeight: 600, maxWidth: '160px' }}>better pay with your next job</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Hero Graphic - Right Side */}
                        <div style={{ flex: 1.2, position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: 30 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                style={{ position: 'relative', width: '100%', maxWidth: '600px' }}
                            >
                                {/* Circle Background Effect */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '140%',
                                    height: '140%',
                                    background: 'radial-gradient(circle, white 0%, transparent 75%)',
                                    opacity: 0.7,
                                    zIndex: 0
                                }}></div>

                                {/* Main Resume Mockup */}
                                <div className="glass-panel" style={{
                                    width: '100%',
                                    height: '650px',
                                    background: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.12)',
                                    padding: '3rem',
                                    position: 'relative',
                                    zIndex: 2,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                                        <div style={{ width: '100px', height: '100px', background: '#f1f5f9', borderRadius: '12px' }}></div>
                                        <div style={{ flex: 1, paddingTop: '10px' }}>
                                            <div style={{ width: '45%', height: '18px', background: '#1e293b', marginBottom: '12px', borderRadius: '4px' }}></div>
                                            <div style={{ width: '30%', height: '10px', background: '#94a3b8', borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ width: '100%', height: '1px', background: '#f1f5f9', marginBottom: '3rem' }}></div>

                                    {/* Mock Content Rows */}
                                    {[1, 2, 3].map(row => (
                                        <div key={row} style={{ marginBottom: '2.5rem' }}>
                                            <div style={{ width: '20%', height: '12px', background: '#1e293b', marginBottom: '15px', borderRadius: '2px' }}></div>
                                            <div style={{ width: '100%', height: '8px', background: '#f8fafc', marginBottom: '10px', borderRadius: '2px' }}></div>
                                            <div style={{ width: '90%', height: '8px', background: '#f8fafc', marginBottom: '10px', borderRadius: '2px' }}></div>
                                            <div style={{ width: '95%', height: '8px', background: '#f8fafc', borderRadius: '2px' }}></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Floating UI Element: AI Suggestions */}
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="glass-panel"
                                    style={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        right: '-40px',
                                        width: '320px',
                                        background: 'white',
                                        borderRadius: '20px',
                                        padding: '1.5rem',
                                        zIndex: 10,
                                        boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                                        border: '1px solid rgba(0, 145, 255, 0.1)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem', color: '#0091FF' }}>
                                        <Sparkles size={20} />
                                        <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI-powered ideas</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                                        <div style={{ width: '18px', height: '18px', background: '#0091FF', borderRadius: '50%', flexShrink: 0, marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Plus size={12} /></div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', lineHeight: 1.5 }}>Analyzed market trends to identify new growth opportunities.</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ width: '18px', height: '18px', background: '#0091FF', borderRadius: '50%', flexShrink: 0, marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Plus size={12} /></div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', lineHeight: 1.5 }}>Reduced operational costs by 15% through process optimization.</div>
                                    </div>
                                </motion.div>


                                {/* Floating UI Element: Download Controls */}
                                <div style={{
                                    position: 'absolute',
                                    top: '40px',
                                    right: '-30px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    zIndex: 12
                                }}>
                                    <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '14px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}><FileText size={22} /></div>
                                    <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '14px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}><Download size={22} /></div>
                                </div>

                                {/* Floating UI Element: Color Palette */}
                                <div style={{
                                    position: 'absolute',
                                    top: '250px',
                                    left: '-30px',
                                    background: 'white',
                                    padding: '10px',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                    display: 'flex',
                                    gap: '8px',
                                    zIndex: 10
                                }}>
                                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444'].map(color => (
                                        <div key={color} style={{ width: '16px', height: '16px', background: color, borderRadius: '4px' }}></div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div >
            </section >

            {/* HOW IT WORKS SECTION - ILLUSTRATIVE PROCESS */}
            < section id="workflow" style={{ padding: '8rem 0 2rem 0', background: 'var(--bg)', position: 'relative' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>
                            Build your resume in <span className="text-gradient-accent">3 simple steps.</span>
                        </h2>
                        <p style={{ color: 'var(--fg-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                            Our intuitive platform handles the heavy lifting so you can focus on landing the job.
                        </p>
                    </div>

                    <div className="responsive-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
                        {[
                            {
                                title: "Pick a resume template.",
                                desc: "Choose from 25+ sleek, ATS-optimized designs crafted by career experts.",
                                color: "#6366F1",
                                icon: <Layers size={32} />,
                                graphic: (
                                    <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={{ width: '120px', height: '160px', background: 'white', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', transform: 'rotate(-5deg)', position: 'absolute', zIndex: 1, padding: '10px' }}>
                                            <div style={{ width: '100%', height: '10px', background: 'var(--bg-soft)', marginBottom: '8px' }}></div>
                                            <div style={{ width: '60%', height: '6px', background: 'var(--bg-soft)', marginBottom: '8px' }}></div>
                                            <div style={{ width: '100%', height: '30px', background: 'var(--accent-glow)', marginBottom: '8px' }}></div>
                                        </div>
                                        <div style={{ width: '120px', height: '160px', background: 'white', borderRadius: '8px', border: '1px solid var(--accent)', boxShadow: '0 20px 40px var(--accent-alpha)', transform: 'rotate(5deg)', position: 'absolute', zIndex: 2, padding: '10px' }}>
                                            <div style={{ width: '100%', height: '10px', background: 'var(--accent)', marginBottom: '8px' }}></div>
                                            <div style={{ width: '80%', height: '6px', background: 'var(--bg-soft)', marginBottom: '12px' }}></div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                                <div style={{ height: '40px', background: 'var(--bg-soft)' }}></div>
                                                <div style={{ height: '40px', background: 'var(--bg-soft)' }}></div>
                                            </div>
                                        </div>
                                        <div style={{ position: 'absolute', top: '10px', right: '40px', zIndex: 3, color: 'var(--accent)' }}>
                                            <Sparkles size={24} />
                                        </div>
                                    </div>
                                )
                            },
                            {
                                title: "Fill in the blanks.",
                                desc: "Simply type your details. Our AI engine suggests high-impact keywords for your role.",
                                color: "#A855F7",
                                icon: <PenTool size={32} />,
                                graphic: (
                                    <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={{ width: '220px', background: 'white', borderRadius: '12px', padding: '15px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--fg-muted)', marginBottom: '8px' }}>SKILLS</div>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <div style={{ padding: '4px 10px', background: 'var(--accent)', color: 'white', fontSize: '0.6rem', borderRadius: '4px' }}>Project Management</div>
                                                <div style={{ padding: '4px 10px', background: 'var(--bg-soft)', color: 'var(--fg)', fontSize: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}>+ Add Expert Skill</div>
                                            </div>
                                            <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '6px', border: '1px dashed #059669', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '12px', height: '12px', background: '#059669', borderRadius: '50%', flexShrink: 0 }}></div>
                                                <div style={{ width: '100%', height: '6px', background: '#059669', opacity: 0.3 }}></div>
                                            </div>
                                        </div>
                                        <div style={{ position: 'absolute', bottom: '0', right: '60px', width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
                                            <CheckCircle size={20} />
                                        </div>
                                    </div>
                                )
                            },
                            {
                                title: "Customize your document.",
                                desc: "Match your personal brand. Change colors, fonts, and layouts in real-time.",
                                color: "#06B6D4",
                                icon: <Palette size={32} />,
                                graphic: (
                                    <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={{ width: '180px', height: '140px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', padding: '12px', overflow: 'hidden' }}>
                                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                                <div style={{ width: '20px', height: '20px', background: '#6366F1', borderRadius: '4px' }}></div>
                                                <div style={{ width: '20px', height: '20px', background: '#EC4899', borderRadius: '4px' }}></div>
                                                <div style={{ width: '20px', height: '20px', background: '#10B981', borderRadius: '4px' }}></div>
                                                <div style={{ width: '20px', height: '20px', background: '#F59E0B', borderRadius: '50%', border: '2px solid var(--accent)' }}></div>
                                            </div>
                                            <div style={{ width: '100%', height: '60px', background: '#F59E0B', opacity: 0.1, borderRadius: '4px', borderLeft: '3px solid #F59E0B' }}></div>
                                        </div>
                                        <div style={{ position: 'absolute', top: '20px', right: '50px', transform: 'rotate(15deg)' }}>
                                            <div style={{ padding: '8px 12px', background: 'var(--fg)', color: 'white', fontSize: '0.7rem', fontWeight: 700, borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                                MODERN SWISS
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.8 }}
                                style={{ textAlign: 'center' }}
                            >
                                <div style={{ marginBottom: '2.5rem' }}>
                                    {item.graphic}
                                </div>
                                <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 800 }}>{item.title}</h3>
                                <p style={{ color: 'var(--fg-muted)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto' }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section >





            {/* TEMPLATE GALLERY CAROUSEL - VARIED DESIGNS */}
            < section id="showcase" style={{ padding: '6rem 0', background: 'linear-gradient(to bottom, var(--bg) 0%, var(--bg-soft) 100%)' }}>
                <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Architectural Blueprints</h2>
                    <p style={{ color: 'var(--fg-muted)' }}>Choose from 25+ ATS-verified structures.</p>
                </div>

                {/* Varied Grid/Carousel */}
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {templates.map((template, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                style={{
                                    background: 'var(--surface)',
                                    border: i % 3 === 2 ? '1px solid var(--border)' : 'none',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    height: '450px',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{
                                    padding: '1.5rem',
                                    background: i % 3 === 1 ? template.color : 'transparent',
                                    color: i % 3 === 1 ? 'white' : 'var(--fg)'
                                }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{template.name}</h3>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{template.style}</span>
                                </div>

                                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={template.image}
                                        alt={template.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transform: i % 3 === 0 ? 'scale(1.1) rotate(-2deg)' : 'scale(1)',
                                            transition: 'transform 0.4s'
                                        }}
                                    />
                                    {/* Overlay for interaction */}
                                    <div className="hover-overlay" style={{
                                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                                        opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <button className="btn-primary" onClick={() => setView('templates')}>Use Template</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* COMMAND CENTER SHOWCASE (DASHBOARD) */}
            < section id="dashboard-preview" style={{ padding: '8rem 0', position: 'relative' }}>
                <div className="container">
                    <div className="mobile-stack" style={{ gap: '5rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)', position: 'relative', zIndex: 10 }}>
                                <img src="/landing_hero_resume_mockup_1769946611712.png" alt="Features Preview" style={{ width: '100%', borderRadius: '24px', display: 'block' }} />
                            </div>
                            {/* Floating Stats */}
                            <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} style={{ position: 'absolute', top: '20%', left: '-40px', background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 20 }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '5px' }}>ATS SCORE</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>+412%</div>
                            </motion.div>
                        </div>
                        <div>
                            <span style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em' }}>ALL-IN-ONE CAREER SUITE</span>
                            <h2 style={{ fontSize: '3rem', margin: '1rem 0 2rem 0' }}>The Ultimate <span className="text-gradient">Toolkit.</span></h2>
                            <p style={{ color: 'var(--fg-muted)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                                Dominate the job market with our integrated ecosystem. From architectural resume design to live global job hunting, we've engineered every tool you need to land your next elite role.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    "Live Job Board (Naukri, Indeed & more)",
                                    "ATS-Level Power Checker Engine",
                                    "Instant Resume Creation & PDF Download",
                                    "25+ Premium Architectural Templates",
                                    "Direct Naukri & Indeed Job Facilities"
                                ].map(feat => (
                                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ color: 'var(--accent)' }}><CheckCircle size={20} /></div>
                                        <span style={{ fontWeight: 600 }}>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section >



            {/* STATS / PROOF */}
            < section style={{ padding: '6rem 0', background: 'var(--bg-soft)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '3rem', textAlign: 'center' }}>
                    <div>
                        <div className="text-gradient" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1 }}>98%</div>
                        <div style={{ color: 'var(--fg-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>ATS PASS RATE</div>
                    </div>
                    <div>
                        <div className="text-gradient" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1 }}>15k+</div>
                        <div style={{ color: 'var(--fg-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>RESUMES BUILT</div>
                    </div>
                    <div>
                        <div className="text-gradient" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1 }}>24/7</div>
                        <div style={{ color: 'var(--fg-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>UPTIME</div>
                    </div>
                </div>
            </section >

            {/* FAQ / SUPPORT SECTION */}
            < section id="faq" style={{ padding: '8rem 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem' }}>Common Inquiries</h2>
                        <p style={{ color: 'var(--fg-muted)' }}>Everything you need to know about the platform.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { q: "How do I get my Premium Credentials?", a: "Once you purchase premium, our administrator will verify the transaction and manually issue your unique credentials (ID/Password). This manual audit ensures every user receives personalized onboarding." },
                            { q: "Is the ATS Power Score really different?", a: "Yes. Most checkers only look for keywords. Our Neural Engine analyzes Flesch-Kincaid readability, recursive parsing pathways, and hidden character contamination to ensure enterprise-grade compatibility." },
                            { q: "Can I manage multiple architectures?", a: "Absolutely. Premium users can maintain a matrix of resume versions, each architecture precisely tuned for different industries or platforms." },
                            { q: "What does 'Direct Global Sync' mean?", a: "It means you don't download and upload. You finalize your design in Resumate, click Sync, and we push the data directly into your Naukri and Indeed profiles via our secure API pipes." }
                        ].map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                style={{ padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--surface)' }}
                            >
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--fg)' }}>{faq.q}</h4>
                                <p style={{ color: 'var(--fg-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >


            {/* CALL TO ACTION */}
            < section style={{ padding: '10rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, var(--accent-glow) 0%, transparent 60%)', pointerEvents: 'none' }}></div>


                <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '4rem', marginBottom: '2rem' }}>Ready to <span style={{ color: 'var(--accent)' }}>Ascend?</span></h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--fg-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                        Join thousands of professionals who switched to Resumate and landed their dream roles.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ padding: '18px 48px', fontSize: '1.2rem', margin: '0 auto' }}
                        onClick={() => setView('templates')}
                    >
                        Start Building Now
                    </button>
                </div>
            </section >

            {/* RESTORED DETAILED FOOTER */}
            < footer id="contact" style={{ padding: '5rem 0 3rem 0', background: '#020617', color: 'var(--fg-muted)', borderTop: '1px solid var(--border)' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '4rem',
                        marginBottom: '4rem'
                    }}>
                        {/* Brand Column */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                <ResumeLogo size={32} dark={false} />
                                <span style={{
                                    fontSize: '1.8rem',
                                    fontWeight: 700,
                                    fontFamily: 'var(--font-display)',
                                    color: 'white',
                                    letterSpacing: '-0.02em'
                                }}>resumate</span>
                            </div>
                            <p style={{ lineHeight: '1.6', maxWidth: '300px', fontSize: '0.95rem' }}>
                                The advanced career infrastructure platform designed to bypass filters and position you as the top 1% candidate in the global market.
                            </p>
                        </div>

                        {/* Navigation */}
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '1.5rem', letterSpacing: '0.1em', fontSize: '0.9rem', textTransform: 'uppercase' }}>Platform</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li><a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Home</a></li>
                                <li><a href="#showcase" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Templates</a></li>
                                <li><a href="#auth" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Login</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '1.5rem', letterSpacing: '0.1em', fontSize: '0.9rem', textTransform: 'uppercase' }}>Contact</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: 'white' }}>Email:</span> <a href="mailto:vachhanitej081@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>vachhanitej081@gmail.com</a>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: 'white' }}>Phone:</span> +91 92770 70007
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: 'white' }}>HQ:</span> Rajkot, Gujarat, India
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem'
                    }}>
                        <p>&copy; 2026 Resumate. All rights reserved.</p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <button onClick={() => setShowPrivacyModal(true)} style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.3s', fontSize: '0.85rem', padding: 0 }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'inherit'}>Privacy Policy</button>
                            <button onClick={() => setShowTermsModal(true)} style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.3s', fontSize: '0.85rem', padding: 0 }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'inherit'}>Terms of Service</button>
                        </div>
                    </div>
                </div>
            </footer >

            {/* Privacy Policy Modal */}
            < AnimatePresence >
                {showPrivacyModal && (
                    <motion.div
                        onClick={() => setShowPrivacyModal(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            onClick={e => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                maxWidth: '700px',
                                width: '100%',
                                maxHeight: '85vh',
                                overflow: 'auto',
                                padding: '40px',
                                position: 'relative',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <button
                                onClick={() => setShowPrivacyModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', color: '#1f2937' }}>Privacy Policy</h2>
                            <div style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '0.95rem' }}>
                                <p><strong>Last Updated: January 2026</strong></p>
                                <p>At Resumate, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>1. Information We Collect</h3>
                                <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                                <ul>
                                    <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                                    <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase services from the Site.</li>
                                    <li><strong>Data From Third Parties:</strong> Information from third parties, including but not limited to identity verification services, credit bureaus, mailing list providers, publicly available sources, and data providers.</li>
                                </ul>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>2. Use of Your Information</h3>
                                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                                <ul>
                                    <li>Create and manage your account</li>
                                    <li>Process your transactions and send related information</li>
                                    <li>Email regarding your account or order confirmation</li>
                                    <li>Fulfill and manage purchases</li>
                                    <li>Generate a personal profile about you</li>
                                    <li>Increase the efficiency and operation of the Site</li>
                                    <li>Monitor and analyze usage and trends</li>
                                    <li>Notify you of updates to the Site</li>
                                    <li>Offer new products, services, and promotions</li>
                                </ul>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>3. Disclosure of Your Information</h3>
                                <p>We may share your information in the following situations:</p>
                                <ul>
                                    <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information is necessary to comply with the law.</li>
                                    <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us.</li>
                                    <li><strong>Business Transfers:</strong> Your information may be disclosed and otherwise transferred in connection with a merger, acquisition, or sale of all or substantially all of our assets.</li>
                                </ul>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>4. Security of Your Information</h3>
                                <p>We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>5. Contact Us</h3>
                                <p>If you have questions or comments about this Privacy Policy, please contact us at: <strong>vachhanitej081@gmail.com</strong></p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Terms of Service Modal */}
            < AnimatePresence >
                {showTermsModal && (
                    <motion.div
                        onClick={() => setShowTermsModal(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            onClick={e => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                maxWidth: '700px',
                                width: '100%',
                                maxHeight: '85vh',
                                overflow: 'auto',
                                padding: '40px',
                                position: 'relative',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <button
                                onClick={() => setShowTermsModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', color: '#1f2937' }}>Terms of Service</h2>
                            <div style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '0.95rem' }}>
                                <p><strong>Last Updated: January 2026</strong></p>
                                <p>By accessing or using Resumate, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>1. Use License</h3>
                                <p>Permission is granted to temporarily download one copy of the materials (information or software) on Resumate for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                                <ul>
                                    <li>Modify or copy the materials</li>
                                    <li>Use the materials for any commercial purpose or for any public display</li>
                                    <li>Attempt to decompile or reverse engineer any software contained on Resumate</li>
                                    <li>Remove any copyright or other proprietary notations from the materials</li>
                                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                                </ul>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>2. Disclaimer</h3>
                                <p>The materials on Resumate are provided on an 'as is' basis. Resumate makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>3. Limitations</h3>
                                <p>In no event shall Resumate or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Resumate, even if Resumate or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>4. Accuracy of Materials</h3>
                                <p>The materials appearing on Resumate could include technical, typographical, or photographic errors. Resumate does not warrant that any of the materials on the Site are accurate, complete, or current. Resumate may make changes to the materials contained on the Site at any time without notice.</p>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>5. Links</h3>
                                <p>Resumate has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Resumate of the site. Use of any such linked website is at the user's own risk.</p>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>6. Modifications</h3>
                                <p>Resumate may revise these terms of service for the Site at any time without notice. By using this Site, you are agreeing to be bound by the then current version of these terms of service.</p>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>7. Governing Law</h3>
                                <p>These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>

                                <h3 style={{ marginTop: '20px', color: '#1f2937' }}>8. Contact Us</h3>
                                <p>If you have questions about these Terms of Service, please contact us at: <strong>vachhanitej081@gmail.com</strong></p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default LandingPage;
