import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Layers, Zap, Cloud, Lock, Play, PenTool, Download, Globe, Cpu, ChevronRight, ChevronDown } from 'lucide-react';
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

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                            <button
                                className="btn-primary"
                                style={{ padding: '16px 40px', fontSize: '1.1rem', width: '100%', maxWidth: '280px' }}
                                onClick={() => setView('templates')}
                            >
                                START BUILDING <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                            </button>
                            <button
                                className="btn-secondary"
                                style={{ width: '100%', maxWidth: '280px' }}
                                onClick={() => document.getElementById('multimedia').scrollIntoView({ behavior: 'smooth' })}
                            >
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Floating Interface Carousel */}
                    <motion.div
                        style={{ marginTop: '4rem', y: y1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                    >
                        <div className="glass-panel" style={{
                            borderRadius: '24px',
                            padding: 'clamp(8px, 2vw, 16px)',
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

            {/* HOW IT WORKS SECTION */}
            <section id="workflow" style={{ padding: '8rem 0', background: 'var(--bg-soft)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem' }}>The Blueprint</span>
                        <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Your Path to the <span className="text-gradient">Top 1%.</span></h2>
                        <p style={{ color: 'var(--fg-muted)', fontSize: '1.1rem' }}>A clinical engineering process for your professional identity.</p>
                    </div>

                    <div className="responsive-grid">
                        {[
                            { step: "01", title: "Architecture", desc: "Select from 25+ neural-optimized templates designed for high-end readability.", icon: <Layers size={24} /> },
                            { step: "02", title: "Intelligence", desc: "Our real-time ATS analyzer scores your content and suggests surgical improvements.", icon: <Cpu size={24} /> },
                            { step: "03", title: "Authorization", desc: "Secure your Premium License from our Admin to unlock full infrastructure access.", icon: <Lock size={24} /> },
                            { step: "04", title: "Deployment", desc: "Directly sync your architecture to Naukri, Indeed, and LinkedIn with one click.", icon: <Globe size={24} /> }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                                whileHover={{ y: -10 }}
                                className="glass-panel"
                                style={{ padding: '2.5rem', borderRadius: '24px', position: 'relative', border: '1px solid var(--border)' }}
                            >
                                <div style={{ fontSize: '3rem', fontWeight: 900, opacity: 0.05, position: 'absolute', top: '1rem', right: '1rem', color: 'var(--fg)' }}>{item.step}</div>
                                <div style={{ width: '50px', height: '50px', background: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.5rem', boxShadow: '0 10px 20px var(--accent-alpha)' }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{item.title}</h3>
                                <p style={{ color: 'var(--fg-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>




            {/* MULTIMEDIA / VIDEO SECTION */}
            <section id="features" style={{ padding: '8rem 0', position: 'relative' }}>
                <div className="container">
                    <div className="mobile-stack" style={{ gap: '4rem', alignItems: 'center' }}>
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
                            {/* Float Tags */}
                            <div style={{ position: 'absolute', top: '-10px', left: '-10px', background: '#FF6B6B', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem', boxShadow: 'var(--shadow-md)', transform: 'rotate(-5deg)' }}>ATS VERIFIED 98.4%</div>
                            <div style={{ position: 'absolute', bottom: '20px', right: '-20px', background: 'var(--accent)', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem', boxShadow: 'var(--shadow-md)', transform: 'rotate(3deg)' }}>NEURAL ENGINE ON</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTEGRATIONS / SYNC SECTION */}
            <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <div className="mobile-stack" style={{ alignItems: 'center', justifyContent: 'space-between', gap: '4rem' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Direct Global Synchronization</h2>
                            <p style={{ color: 'var(--fg-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                Why waste hours uploading manually? Resumate integrates directly with the world's most powerful job boards. Update your profile architecture across all platforms instantly.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {['Naukri.com', 'Indeed', 'LinkedIn', 'Glassdoor', 'Google Jobs', 'Monster'].map(job => (
                                    <div key={job} style={{ padding: '8px 16px', borderRadius: '100px', background: 'var(--bg-soft)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 600 }}>
                                        {job}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '24px', border: '2px solid var(--accent)' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.5rem' }}>01</div>
                                <div style={{ fontWeight: 700 }}>Single Source</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>One master architecture</div>
                            </div>
                            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '24px' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '0.5rem' }}>∞</div>
                                <div style={{ fontWeight: 700 }}>Infinite Sync</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Automatic updates</div>
                            </div>
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
            </section>

            {/* COMMAND CENTER SHOWCASE (DASHBOARD) */}
            <section id="dashboard-preview" style={{ padding: '8rem 0', position: 'relative' }}>
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

            {/* FAQ / SUPPORT SECTION */}
            <section style={{ padding: '8rem 0' }}>
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
            </section>


            {/* CALL TO ACTION */}
            <section style={{ padding: '10rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
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
