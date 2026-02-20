import React from 'react';
import { Scale, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

const TermsOfService = () => {
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
                    <Scale size={32} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>Terms of Service</h1>
                </div>

                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Last updated: February 20, 2026</p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#1e293b' }}>
                        <CheckCircle size={20} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>1. Acceptance of Terms</h2>
                    </div>
                    <p style={{ lineHeight: 1.7, color: '#334155' }}>
                        By accessing or using Resumate, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#1e293b' }}>
                        <HelpCircle size={20} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>2. Use License</h2>
                    </div>
                    <p style={{ lineHeight: 1.7, color: '#334155' }}>
                        Permission is granted to use Resumate for personal, non-commercial transition and career building purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul style={{ lineHeight: 1.7, color: '#334155', paddingLeft: '1.5rem' }}>
                        <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
                        <li>Remove any copyright or other proprietary notations from the materials.</li>
                        <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#1e293b' }}>
                        <AlertCircle size={20} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>3. Disclaimer</h2>
                    </div>
                    <p style={{ lineHeight: 1.7, color: '#334155' }}>
                        The materials on Resumate are provided on an 'as is' basis. While our AI makes suggestions based on market trends, we do not guarantee employment or the accuracy of AI-generated content. Users are responsible for verifying all information on their resumes before submission to employers.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>4. Limitations</h2>
                    <p style={{ lineHeight: 1.7, color: '#334155' }}>
                        In no event shall Resumate or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on Resumate, even if Resumate has been notified of the possibility of such damage.
                    </p>
                </section>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', marginTop: '3rem', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        By using this site, you acknowledge that you have read and understood these terms.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
