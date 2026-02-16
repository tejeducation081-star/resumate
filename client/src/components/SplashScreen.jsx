import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 15;
                if (next >= 100) return 100;
                return next;
            });
        }, 150);

        const timer = setTimeout(() => {
            setIsVisible(false);
            clearInterval(interval);
            if (onFinish) setTimeout(onFinish, 800); // Allow exit animation
        }, 2200);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [onFinish]);

    // Animation Variants
    const containerVariants = {
        initial: { opacity: 1 },
        exit: {
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }
    };

    const textContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.3
            }
        }
    };

    const textItem = {
        hidden: { y: 40, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    className="splash-screen"
                    variants={containerVariants}
                    initial="initial"
                    exit="exit"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: 'var(--bg)',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {/* Dynamic Ambient Background */}
                    <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6 }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle at center, rgba(99,102,241,0.05) 0%, transparent 60%)'
                            }}
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            style={{
                                position: 'absolute',
                                bottom: '-50%',
                                right: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle at center, rgba(168,85,247,0.05) 0%, transparent 60%)'
                            }}
                        />
                    </div>

                    <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Logo Container with Breathing Effect */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], filter: ['drop-shadow(0 0 0px rgba(99,102,241,0))', 'drop-shadow(0 0 20px rgba(99,102,241,0.3))', 'drop-shadow(0 0 0px rgba(99,102,241,0))'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    width: '140px',
                                    height: '140px',
                                    margin: '0 auto 2rem auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <img
                                    src="/logo_final.png"
                                    alt="Resumate Logo"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Staggered Text Animation */}
                        <motion.div
                            variants={textContainer}
                            initial="hidden"
                            animate="show"
                            style={{ display: 'flex', marginBottom: '1rem', overflow: 'hidden' }}
                        >
                            {Array.from("Resumate").map((char, i) => (
                                <motion.span
                                    key={i}
                                    variants={textItem}
                                    style={{
                                        fontSize: '3.5rem',
                                        fontWeight: 800,
                                        color: 'var(--fg)',
                                        fontFamily: 'var(--font-display)',
                                        display: 'inline-block'
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            style={{
                                color: 'var(--fg-muted)',
                                fontSize: '0.9rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                marginBottom: '2.5rem'
                            }}
                        >
                            Intelligence Engine
                        </motion.p>

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '240px', opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{ height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}
                        >
                            <motion.div
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, var(--accent), var(--secondary))',
                                    boxShadow: '0 0 10px var(--accent)',
                                    width: `${progress}%`,
                                    transition: 'width 0.1s ease-out'
                                }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
