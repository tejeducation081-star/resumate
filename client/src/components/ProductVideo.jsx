import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, BarChart3, PenTool, Wand2, CheckCircle, Zap } from 'lucide-react';

const ProductVideo = () => {
    // We will simulate a camera moving across a "Timeline" of screens.
    // No hard stops, just a continuous fluid journey.

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* Audio: Try to autoplay from a public domain source if local is missing, or placeholder */}
            {/* Using a generic placeholder. The user must provide the file. */}
            {/* <audio autoPlay loop muted={false} src="/background_music.mp3" /> */}


            <div className="glass-panel" style={{
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '16/9',
                background: '#0F172A',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* 1. THE CAMERA TRACK (Moves Left Continuously) */}
                <motion.div
                    animate={{ x: ['0%', '-66.6%'] }} // Move across 3 screens worth
                    transition={{
                        duration: 30, // 30 seconds for full loop
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                    style={{
                        display: 'flex',
                        width: '300%', // 3 Screens wide
                        height: '100%'
                    }}
                >
                    {/* SCENE 1: WORKSPACE & EDITOR */}
                    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                        <img
                            src="/creative_professional_workspace_1769946650154.png"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }}></div>

                        {/* Floating UI Elements moving at different speeds (Parallax) */}
                        <motion.div
                            animate={{ x: [100, -100], y: [0, -20, 0] }}
                            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
                            style={{ position: 'absolute', top: '20%', left: '20%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <PenTool color="#fff" size={24} />
                                <h3 style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>Live Studio</h3>
                            </div>
                            <p style={{ margin: '5px 0 0 0', color: '#cbd5e1' }}>Real-time formatting engine</p>
                        </motion.div>
                    </div>

                    {/* SCENE 2: DASHBOARD & ANALYTICS */}
                    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                        <img
                            src="/modern_analytics_interface_1769946631505.png"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.8), transparent, rgba(15,23,42,0.8))' }}></div>

                        {/* Animated Graph Overlay */}
                        <div style={{ position: 'absolute', bottom: '20%', right: '15%' }}>
                            <motion.div
                                animate={{ height: ['0px', '150px'], opacity: [0, 1] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}
                            >
                                {[40, 70, 50, 90, 60].map((h, i) => (
                                    <div key={i} style={{ width: '20px', height: `${h}px`, background: 'var(--accent)', borderRadius: '4px' }}></div>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    {/* SCENE 3: SCAN & RESULT */}
                    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Dynamic Background */}
                        <div className="mesh-gradient" style={{ position: 'absolute', inset: 0, opacity: 0.3 }}></div>

                        {/* Radar Scan Effect */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                            style={{
                                width: '600px', height: '600px',
                                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(99,102,241,0.2) 360deg)',
                                borderRadius: '50%',
                                position: 'absolute'
                            }}
                        />

                        <div style={{ zIndex: 10, textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '40px', borderRadius: '32px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                <CheckCircle size={80} color="#4ade80" style={{ margin: '0 auto 20px' }} />
                            </motion.div>
                            <h2 style={{ fontSize: '5rem', fontWeight: 800, margin: 0, lineHeight: 1, color: 'white' }}>98%</h2>
                            <p style={{ fontSize: '1.5rem', letterSpacing: '0.2em', color: '#94a3b8' }}>OPTIMIZED</p>
                        </div>
                    </div>
                </motion.div>

                {/* OVERLAY: FILM GRAIN / VIGNETTE */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle, transparent 60%, black 100%)', zIndex: 40 }}></div>
            </div>
        </div>
    );
};

export default ProductVideo;
