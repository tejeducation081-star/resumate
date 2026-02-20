import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            color: '#1e293b',
            fontFamily: 'Inter, sans-serif',
            padding: '4rem 1rem'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem', color: '#0091FF' }}>
                    <Shield size={32} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>Privacy Policy</h1>
                </div>

                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Last updated: February 20, 2026</p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#1e293b' }}>
                        <Lock size={20} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>1. Information We Collect</h2>
                    </div>
                    <p style={{ lineHeight: 1.7, color: '#334155' }}>
                        We collect information you provide directly to us when you create an account, build a resume, or communicate with us. This includes:
                    </p>
                    <ul style={{ lineHeight: 1.7, color: '#334155', paddingLeft: '1.5rem' }}>
                        <li>Account information (Name, Email, Password)</li>
                        <li>Resume content (Work history, Education, Skills)</li>
                        <li>Contact details and profile information</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#1e293b' }}>
                        <Eye size={20} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>2. How We Use Your Information</h2>
                    </div>
                    <p style={{ lineHeight: 1.7, color: '#334155' }}>
                        Your data is used specifically to provide our services, including:
                    </p>
                    <ul style={{ lineHeight: 1.7, color: '#334155', paddingLeft: '1.5rem' }}>
                        <li>Generating AI-powered resume suggestions and improvements.</li>
                        <li>Formatting and exporting resumes to PDF and DocX formats.</li>
                        <li>Managing your account and providing customer support.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#1e293b' }}>
                        <FileText size={20} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>3. Data Security</h2>
                    </div>
                    <p style={{ lineHeight: 1.7, color: '#334155' }}>
                        We take data security seriously. We use industry-standard encryption and secure cloud providers (Supabase and Railway) to ensure your data is protected from unauthorized access. Your resume data is private and only accessible by you unless you explicitly choose to share it.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>4. AI Processing</h2>
                    <p style={{ lineHeight: 1.7, color: '#334155' }}>
                        Resumate uses AI models to analyze and enhance your resume content. We do not use your personal resume data to train global AI models without your explicit consent. Your data is processed in real-time to provide immediate value for your career search.
                    </p>
                </section>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', marginTop: '3rem', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Questions about our privacy policy? Contact us at vachhanitej081@gmail.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
