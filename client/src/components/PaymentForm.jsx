import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, ShieldCheck, ArrowRight, Loader2, X } from 'lucide-react';
import useAuthStore from '../store/authStore';

const PaymentForm = ({ onSuccess, onCancel }) => {
    const [step, setStep] = useState('details'); // 'details', 'processing', 'success'
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep('processing');

        // Simulate high-end payment processing
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess();
            }, 2000);
        }, 3000);
    };

    if (step === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem' }}
            >
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#10B981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    boxShadow: '0 0 40px rgba(16, 185, 129, 0.3)'
                }}>
                    <CheckCircle size={40} color="white" />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Payment Secure</h2>
                <p style={{ color: '#6B7280', fontSize: '1rem' }}>Your premium license is being activated...</p>
            </motion.div>
        );
    }

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Secure Checkout</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', background: '#D1FAE5', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <ShieldCheck size={14} />
                    SSL SECURED
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Cardholder Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '1rem' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Card Number</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            name="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            required
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            style={{ padding: '12px 12px 12px 45px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '1rem', width: '100%' }}
                        />
                        <CreditCard size={20} color="#9CA3AF" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Expiry Date</label>
                        <input
                            type="text"
                            name="expiry"
                            placeholder="MM / YY"
                            required
                            value={formData.expiry}
                            onChange={handleInputChange}
                            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '1rem' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>CVC</label>
                        <input
                            type="password"
                            name="cvc"
                            placeholder="•••"
                            required
                            maxLength="3"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '1rem' }}
                        />
                    </div>
                </div>

                <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '1rem', marginTop: '1rem', border: '1px dashed #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Premium License Fee</span>
                        <span style={{ fontWeight: 700, color: '#111827' }}>$29.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: '#111827' }}>Total Amount</span>
                        <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.1rem' }}>$29.00</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={step === 'processing'}
                    className="btn-primary"
                    style={{
                        padding: '1.2rem',
                        fontSize: '1rem',
                        borderRadius: '14px',
                        marginTop: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    {step === 'processing' ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Authorizing Transaction...
                        </>
                    ) : (
                        <>
                            Pay $29.00 Securely <ArrowRight size={18} />
                        </>
                    )}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Lock size={12} /> Encrypted & Secure Payment Processing
                </p>
            </form>
        </div>
    );
};

export default PaymentForm;
