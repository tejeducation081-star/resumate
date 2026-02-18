import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Crown, Mail, ArrowRight, X } from 'lucide-react';
import PaymentForm from './PaymentForm';

const PremiumModal = ({ isOpen, onClose, setView }) => {
    const [showPayment, setShowPayment] = useState(false);

    if (!isOpen) return null;

    const handlePaymentSuccess = () => {
        // In a real app, update user status here
        setTimeout(() => {
            onClose();
            setShowPayment(false);
            // Optionally redirect to dashboard or show a global success state
        }, 2000);
    };

    return (
        <AnimatePresence>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    backdropFilter: 'blur(10px)'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    style={{
                        background: 'white',
                        borderRadius: '32px',
                        padding: showPayment ? '2rem' : '3rem',
                        maxWidth: '500px',
                        width: '90%',
                        textAlign: showPayment ? 'left' : 'center',
                        boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.5)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Decorative Background Element */}
                    <div style={{ position: 'absolute', top: -100, left: -100, width: 250, height: 250, background: 'var(--accent)', opacity: 0.05, borderRadius: '50%' }}></div>

                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: 20, right: 20, background: '#f3f4f6', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}
                    >
                        <X size={20} />
                    </button>

                    {showPayment ? (
                        <PaymentForm
                            onSuccess={handlePaymentSuccess}
                            onCancel={() => setShowPayment(false)}
                        />
                    ) : (
                        <>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'var(--accent)',
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem auto',
                                boxShadow: '0 20px 40px -10px var(--accent-alpha)'
                            }}>
                                <Crown size={40} color="white" />
                            </div>

                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#111827' }}>Unlock Full Access</h2>
                            <p style={{ color: '#6B7280', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                                You're currently in <strong>Preview Mode</strong>. To save, download, and sync your resume to top job boards, please purchase a Premium License.
                            </p>

                            <div style={{
                                background: '#f8fafc',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                marginBottom: '2.5rem',
                                textAlign: 'left',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.8rem' }}>
                                    <div style={{ padding: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <Mail size={16} color="var(--accent)" />
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>How to get access?</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    Once you purchase the premium, our Administrator will provide you with a unique <strong>ID and Password</strong> to log in and unlock all pro features.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    className="btn-primary"
                                    style={{ padding: '1.2rem', fontSize: '1rem', width: '100%', borderRadius: '14px' }}
                                    onClick={() => setShowPayment(true)}
                                >
                                    Purchase Premium Now
                                </button>

                                <button
                                    style={{
                                        background: 'transparent',
                                        border: '2px solid #e2e8f0',
                                        padding: '1.1rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                    onClick={() => {
                                        onClose();
                                        setView('auth');
                                    }}
                                >
                                    Already have credentials? Login <ArrowRight size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PremiumModal;
