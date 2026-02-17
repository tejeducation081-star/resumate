import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Layers, Zap, Cloud, Lock, Play, PenTool, Download, Globe, Cpu, ChevronRight } from 'lucide-react';
import ResumeLogo from './ResumeLogo';
import ProductVideo from './ProductVideo';

const LandingPage = ({ setView }) => {
    const { scrollY, scrollYProgress } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    // Carousel State
    const [currentImage, setCurrentImage] = useState(0);
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
            <section style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '150px',
                overflow: 'hidden'
            }}>
                {/* Background FX */}
                <div className="mesh-gradient" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}></div>
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80vw',
                    height: '80vw',
                    background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                    zIndex: 0
                }}></div>


                {/* Hero Content */}
                <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{
                            display: 'inline-block',
                            padding: '6px 16px',
                            background: 'rgba(99,102,241,0.1)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: '100px',
                            color: '#818CF8',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            marginBottom: '2rem',
                            letterSpacing: '0.05em'
                        }}>
                            V 2.0 INTELLIGENCE ENGINE
                        </span>

                        <h1 style={{
                            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                            lineHeight: 1.1,
                            marginBottom: '2rem',
                            textShadow: '0 0 40px rgba(255,255,255,0.1)'
                        }}>
                            Dominate the <br />
                            <span className="text-gradient-accent">Hiring Algorithm.</span>
                        </h1>

                        <p style={{
                            fontSize: '1.25rem',
                            color: 'var(--fg-muted)',
                            maxWidth: '700px',
                            margin: '0 auto 3rem auto',
                            opacity: 0.9
                        }}>
                            Resumate isn't just a builder. It's a career infrastructure platform designed to
                            bypass filters and position you as the top 1% candidate.
                        </p>

                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                            <button
                                className="btn-primary"
                                style={{ padding: '16px 40px', fontSize: '1.1rem' }}
                                onClick={() => setView('auth')}
                            >
                                Launch Editor <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => document.getElementById('multimedia').scrollIntoView({ behavior: 'smooth' })}
                            >
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Floating Interface Carousel */}
                    <motion.div
                        style={{ marginTop: '2rem', y: y1 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                    >
                        <div className="glass-panel" style={{
                            borderRadius: '20px',
                            padding: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 50px 120px -20px rgba(0,0,0,0.6)',
                            position: 'relative',
                            aspectRatio: '16/9',
                            maxWidth: '1000px',
                            margin: '0 auto',
                            overflow: 'hidden'
                        }}>
                            <AnimatePresence mode='wait'>
                                <motion.img
                                    key={currentImage}
                                    src={heroImages[currentImage]}
                                    alt="Dashboard Preview"
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
                                />
                            </AnimatePresence>

                            {/* Carousel Indicators */}
                            <div style={{
                                position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                                display: 'flex', gap: '8px', zIndex: 10
                            }}>
                                {heroImages.map((_, idx) => (
                                    <div key={idx} style={{
                                        width: idx === currentImage ? '24px' : '8px',
                                        height: '8px',
                                        background: 'var(--fg)',
                                        borderRadius: '4px',
                                        opacity: idx === currentImage ? 1 : 0.3,
                                        transition: 'all 0.3s'

                                    }} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>




            {/* MULTIMEDIA / VIDEO SECTION */}
            <section id="features" style={{ padding: '8rem 0', position: 'relative' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <span style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em' }}>NEURAL RECRUITER ENGINE</span>
                            <h2 style={{ fontSize: '3rem', margin: '1rem 0 2rem 0' }}>It works like magic. <br /><span style={{ opacity: 0.5 }}>Because it is.</span></h2>
                            <p style={{ color: 'var(--fg-muted)', fontSize: '1.2rem', marginBottom: '2rem', lineHeight: 1.8 }}>
                                Our parsing engine deconstructs your career history into 40+ data points, comparing them against millions of successful job applications to suggest instant improvements.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {[
                                    { title: "Smart Keyword Injection", desc: "Automatically suggests industry-standard terminology." },
                                    { title: "Live Readability Analysis", desc: "Flesch-Kincaid scoring to ensure recruiter clarity." },
                                    { title: "Format Sanitization", desc: "Strips hidden characters that confuse legacy ATS software." }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ width: '24px', height: '24px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px' }}>
                                            <CheckCircle size={14} color="white" />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                                            {/* <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem' }}>{item.desc}</p> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Graphic / Video Container */}
                        <div id="multimedia" className="glass-panel" style={{ borderRadius: '24px', padding: '1rem', position: 'relative' }}>
                            <ProductVideo />
                        </div>
                    </div>
                </div>
            </section>

            {/* TEMPLATE GALLERY CAROUSEL - VARIED DESIGNS */}
            <section id="showcase" style={{ padding: '6rem 0', background: 'linear-gradient(to bottom, var(--bg) 0%, var(--bg-soft) 100%)' }}>
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
                                whileHover={{ y: -10 }}
                                style={{
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
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
                                        <button className="btn-primary" onClick={() => setView('auth')}>Use Template</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* STATS / PROOF */}
            <section style={{ padding: '6rem 0', background: 'var(--bg-soft)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
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
            </section>

            {/* CALL TO ACTION */}
            <section style={{ padding: '10rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, var(--accent-glow) 0%, transparent 60%)', pointerEvents: 'none' }}></div>


                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '4rem', marginBottom: '2rem' }}>Ready to <span style={{ color: 'var(--accent)' }}>Ascend?</span></h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--fg-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                        Join thousands of professionals who switched to Resumate and landed their dream roles.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ padding: '18px 48px', fontSize: '1.2rem' }}
                        onClick={() => setView('auth')}
                    >
                        Create My Account
                    </button>
                </div>
            </section>

            {/* RESTORED DETAILED FOOTER */}
            <footer id="contact" style={{ padding: '5rem 0 3rem 0', background: '#020617', color: 'var(--fg-muted)', borderTop: '1px solid var(--border)' }}>
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
                                <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Capabilities</a></li>
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
                            <span>Privacy Policy</span>
                            <span>Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
