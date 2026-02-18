import React, { useState, useEffect } from 'react';
import { templates, fontOptions } from '../templates/config';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Palette, X, Layout, Lock, Sparkles } from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import useAuthStore from '../store/authStore';
import TemplatePreview from './TemplatePreview';
import PremiumModal from './PremiumModal';
import { sampleResume } from '../data/sampleResume';

// High-Fidelity Mini Thumbnail Component 
// High-Fidelity Mini Thumbnail Component 
// Ult-Realistic Mini Thumbnail Component
const MiniThumbnail = ({ template }) => {
    const { layout, accent, headerStyle, decor, sidebarBg } = template?.styles || {};

    // Helper for Text Blocks (Greeking)
    const TextBlock = ({ width, mb = 2, height = 2, opacity = 1, color = 'rgba(17, 24, 39, 0.4)' }) => (
        <div style={{ width, height, background: color, marginBottom: mb, borderRadius: 0.5, opacity }} />
    );

    const Decorator = () => {
        if (decor === 'circle-accents') return <div style={{ position: 'absolute', top: -10, right: -10, width: 40, height: 40, borderRadius: '50%', background: accent, opacity: 0.2 }}></div>;
        if (decor === 'diagonal') return <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 40, background: `linear-gradient(135deg, ${accent} 0%, transparent 40%)`, opacity: 0.2 }}></div>;
        if (decor === 'solid-block') return <div style={{ position: 'absolute', top: 30, right: 0, width: 20, height: 20, background: accent, opacity: 0.8 }}></div>;
        if (decor === 'dots') return <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: '4px 4px', opacity: 0.4 }}></div>;
        if (decor === 'blob') return <div style={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', background: accent, opacity: 0.15 }}></div>;
        if (decor === 'grid-pattern') return <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`, backgroundSize: '10px 10px', opacity: 0.1, zIndex: 0 }}></div>;
        if (decor === 'border-frame') return <div style={{ position: 'absolute', top: 5, left: 5, right: 5, bottom: 5, border: `1px solid ${accent}`, opacity: 0.5, borderRadius: 2 }}></div>;
        if (decor === 'accent-strip') return <div style={{ position: 'absolute', top: 0, left: 0, width: 10, height: '100%', background: accent, zIndex: 1 }}></div>;
        return null;
    }

    // 0. NEW REPLICA LAYOUTS
    if (layout === 'modern-silk') return (
        <div style={{ height: '100%', padding: '10px', background: '#FFF5F7', textAlign: 'center', fontFamily: 'serif' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', border: '1px solid #ddd', margin: '0 auto 5px' }}></div>
            <TextBlock width="60%" height={3} color="#111827" mb={2} style={{ margin: '0 auto' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 5, background: 'white', padding: 5, borderRadius: 2 }}>
                <div style={{ borderRight: '1px solid #eee', paddingRight: 2 }}>
                    <TextBlock width="100%" height={1.5} color={accent} mb={2} />
                    <TextBlock width="100%" height={1} color="#999" mb={1} />
                    <TextBlock width="80%" height={1} color="#999" />
                </div>
                <div>
                    <TextBlock width="100%" height={1.5} color={accent} mb={2} />
                    <TextBlock width="100%" height={1} color="#999" mb={1} />
                    <TextBlock width="100%" height={1} color="#999" />
                </div>
            </div>
        </div>
    );
    if (layout === 'zenith-minimal') return (
        <div style={{ height: '100%', padding: '10px', background: 'white', fontFamily: 'sans-serif' }}>
            <div style={{ borderBottom: '1px solid #eee', paddingBottom: 5, marginBottom: 5 }}>
                <TextBlock width="50%" height={3} color="#111827" mb={1} />
                <TextBlock width="30%" height={1.5} color={accent} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                <div><TextBlock width="100%" height={1.5} color={accent} mb={2} /></div>
                <div><TextBlock width="100%" height={1.5} color={accent} mb={2} /></div>
            </div>
        </div>
    );
    if (layout === 'apex-plain') return (
        <div style={{ height: '100%', background: 'white', fontFamily: 'sans-serif' }}>
            <div style={{ background: '#111827', height: 40, position: 'relative' }}>
                <div style={{ position: 'absolute', right: 0, top: 0, width: 40, height: '100%', background: accent, clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
            </div>
            <div style={{ padding: 10, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 5 }}>
                <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 2 }}><TextBlock width="100%" height={1.5} color="#333" /></div>
                <div><TextBlock width="100%" height={1.5} color="#333" /></div>
            </div>
        </div>
    );
    if (layout === 'horizon-sidebar') return (
        <div style={{ height: '100%', display: 'flex', fontFamily: 'sans-serif' }}>
            <div style={{ width: 15, background: accent }}></div>
            <div style={{ flex: 1, padding: 10, background: 'white' }}>
                <div style={{ borderBottom: '2px solid #111827', marginBottom: 5, paddingBottom: 2 }}>
                    <TextBlock width="70%" height={4} color="#111827" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 5 }}>
                    <div><TextBlock width="100%" height={2} color="#111827" mb={2} /></div>
                    <div><TextBlock width="100%" height={2} color="#111827" mb={2} /></div>
                </div>
            </div>
        </div>
    );

    const SectionTitle = ({ color = '#111827' }) => (
        <div style={{ fontSize: '3px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2, color, letterSpacing: '0.2px' }}>EXPERIENCE</div>
    );

    // 1. SPLIT HEADER (Teal Split / Replica)
    if (headerStyle === 'split') return (
        <div style={{ height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', background: 'white' }}>
            <Decorator />
            <div style={{ display: 'flex', height: 40, marginBottom: 10 }}>
                <div style={{ flex: 1, background: '#F3F4F6', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 10 }}>
                    <div style={{ fontWeight: '800', fontSize: '6px', color: '#111827', textTransform: 'uppercase', marginBottom: 2 }}>JULIAN BOURNE</div>
                    <div style={{ fontSize: '3px', color: accent, fontWeight: '600', textTransform: 'uppercase' }}>PRODUCT DESIGNER</div>
                </div>
                <div style={{ flex: 1, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.5)' }}></div>
                </div>
            </div>
            <div style={{ padding: '0 12px', display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                    <SectionTitle color={accent} />
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ marginBottom: 4 }}>
                            <TextBlock width="100%" height={2} color="#111827" mb={1} />
                            <TextBlock width="30%" height={1.5} color="#6B7280" mb={1} />
                            <TextBlock width="100%" height={1} color="#9CA3AF" mb={0.5} />
                            <TextBlock width="80%" height={1} color="#9CA3AF" />
                        </div>
                    ))}
                </div>
                <div style={{ width: '30%' }}>
                    <SectionTitle color={accent} />
                    <TextBlock width="100%" height={1.5} mb={2} />
                    <TextBlock width="100%" height={1.5} mb={2} />
                    <TextBlock width="100%" height={1.5} mb={5} />
                    <SectionTitle color={accent} />
                    <TextBlock width="100%" height={1.5} mb={2} />
                    <TextBlock width="100%" height={1.5} mb={2} />
                </div>
            </div>
        </div>
    );

    // 2. SIDEBAR (Professional, Orange Curve, Creative, etc.)
    if (layout === 'sidebar') return (
        <div style={{ display: 'flex', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif', background: 'white' }}>
            <Decorator />
            <div style={{ width: '32%', background: sidebarBg || template.styles.sidebarBg || '#111827', padding: '10px', color: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', marginBottom: 15, alignSelf: 'center' }}></div>

                <div style={{ fontSize: '3px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 3, color: 'rgba(255,255,255,0.9)' }}>CONTACT</div>
                <TextBlock width="100%" height={1} color="rgba(255,255,255,0.5)" mb={2} />
                <TextBlock width="80%" height={1} color="rgba(255,255,255,0.5)" mb={8} />

                <div style={{ fontSize: '3px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 3, color: 'rgba(255,255,255,0.9)' }}>SKILLS</div>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ marginBottom: 2 }}>
                        <TextBlock width="100%" height={1} color="rgba(255,255,255,0.5)" mb={1} />
                        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.1)' }}>
                            <div style={{ width: '70%', height: '100%', background: 'rgba(255,255,255,0.8)' }}></div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ flex: 1, padding: '12px 12px 0 12px' }}>
                <div style={{ fontWeight: '800', fontSize: '8px', color: '#111827', textTransform: 'uppercase', lineHeight: 1 }}>JULIAN</div>
                <div style={{ fontWeight: '800', fontSize: '8px', color: accent, textTransform: 'uppercase', marginBottom: 2, lineHeight: 1 }}>BOURNE</div>
                <div style={{ fontSize: '3px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '1px' }}>PRODUCT DESIGNER</div>

                <SectionTitle color={'#111827'} />
                <div style={{ height: 1, width: '100%', background: '#E5E7EB', marginBottom: 4 }}></div>
                {[1, 2].map(i => (
                    <div key={i} style={{ marginBottom: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                            <TextBlock width="40%" height={2} color="#111827" />
                            <TextBlock width="20%" height={2} color="#9CA3AF" />
                        </div>
                        <TextBlock width="100%" height={1} color="#6B7280" mb={1} />
                        <TextBlock width="100%" height={1} color="#6B7280" mb={1} />
                        <TextBlock width="80%" height={1} color="#6B7280" />
                    </div>
                ))}
            </div>
        </div>
    );

    // 3. GRID / MODERN / BANNER
    return (
        <div style={{ height: '100%', position: 'relative', overflow: 'hidden', background: 'white', fontFamily: 'sans-serif' }}>
            <Decorator />

            {/* Banner Header */}
            {headerStyle === 'banner' ? (
                <div style={{ height: 45, background: accent, marginBottom: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 15px', color: 'white' }}>
                    <div style={{ fontWeight: '800', fontSize: '8px', textTransform: 'uppercase' }}>JULIAN BOURNE</div>
                    <div style={{ fontSize: '3px', opacity: 0.8, fontWeight: '500', marginTop: 1 }}>SENIOR ENGINEER</div>
                </div>
            ) : headerStyle === 'diagonal-banner' ? (
                <div style={{ height: 45, background: accent, marginBottom: 12, position: 'relative', overflow: 'hidden', padding: '10px 15px', color: 'white' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: accent, transform: 'skewY(-10deg)', transformOrigin: 'top left', marginTop: '-10px' }} />
                    <div style={{ position: 'relative', zIndex: 1, fontWeight: '800', fontSize: '8px' }}>ANNE ROBERTSON</div>
                </div>
            ) : headerStyle === 'navy-gold' ? (
                <div style={{ height: 60, background: '#1A1A2E', marginBottom: 12, textAlign: 'center', padding: '10px', color: 'white', borderBottom: `2px solid ${accent}` }}>
                    <div style={{ fontWeight: '800', fontSize: '8px' }}>MATHEW SMITH</div>
                    <div style={{ fontSize: '3px', color: accent }}>GRAPHIC DESIGNER</div>
                </div>
            ) : headerStyle === 'asymmetric' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', padding: '15px', gap: '10px', alignItems: 'end' }}>
                    <div style={{ fontWeight: '900', fontSize: '10px', lineHeight: 0.9 }}>JULIAN<br />BOURNE</div>
                    <div style={{ height: 1, background: '#000' }}></div>
                </div>
            ) : headerStyle === 'neon-banner' ? (
                <div style={{ height: 50, background: '#050505', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${accent}` }}>
                    <div style={{ fontWeight: '800', fontSize: '8px', color: 'white', textShadow: `0 0 5px ${accent}` }}>NEON GLOW</div>
                </div>
            ) : (
                <div style={{ padding: '15px 15px 0 15px', textAlign: headerStyle === 'center' ? 'center' : 'left' }}>
                    <div style={{ fontWeight: '800', fontSize: '8px', color: '#111827', textTransform: 'uppercase', marginBottom: 2 }}>JULIAN BOURNE</div>
                    <div style={{ fontSize: '3px', color: accent, fontWeight: '600', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '1px' }}>SENIOR ENGINEER</div>
                </div>
            )}

            <div style={{ padding: '0 15px', display: 'grid', gridTemplateColumns: layout === 'grid' ? '1fr 1fr' : '1fr', gap: 10 }}>
                <div>
                    <SectionTitle color={accent} />
                    <div style={{ marginBottom: 2, height: 1, width: 15, background: accent }}></div>
                    <TextBlock width="90%" height={1.5} color="#4B5563" mb={1} />
                    <TextBlock width="100%" height={1.5} color="#4B5563" mb={1} />
                    <TextBlock width="80%" height={1.5} color="#4B5563" mb={8} />

                    <SectionTitle color={accent} />
                    <div style={{ marginBottom: 2, height: 1, width: 15, background: accent }}></div>
                    <TextBlock width="100%" height={2} color="#111827" mb={1} />
                    <TextBlock width="100%" height={1} color="#6B7280" mb={4} />
                    <TextBlock width="100%" height={2} color="#111827" mb={1} />
                    <TextBlock width="100%" height={1} color="#6B7280" />
                </div>
                {(layout === 'grid' || layout !== 'minimal') && (
                    <div>
                        <SectionTitle color={accent} />
                        <div style={{ marginBottom: 2, height: 1, width: 15, background: accent }}></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                            <TextBlock width="100%" height={1.5} color="#4B5563" />
                            <TextBlock width="100%" height={1.5} color="#4B5563" />
                            <TextBlock width="100%" height={1.5} color="#4B5563" />
                            <TextBlock width="100%" height={1.5} color="#4B5563" />
                        </div>
                    </div>
                )}
            </div>
            {layout === 'block-modern' && (
                <div style={{ position: 'absolute', inset: 0, background: template.styles.backgroundColor || '#FFF1F3', padding: 10 }}>
                    <div style={{ background: 'white', borderRadius: 8, height: 20, marginBottom: 5 }}></div>
                    <div style={{ display: 'flex', gap: 5, height: 'calc(100% - 30px)' }}>
                        <div style={{ flex: 1, background: 'white', borderRadius: 8 }}></div>
                        <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <div style={{ flex: 1, background: 'white', borderRadius: 8 }}></div>
                            <div style={{ flex: 1, background: 'white', borderRadius: 8 }}></div>
                        </div>
                    </div>
                </div>
            )}
            {layout === 'cyber' && (
                <div style={{ position: 'absolute', inset: 0, background: sidebarBg || '#0D0D0D', padding: 10, border: `1px solid ${accent}` }}>
                    <div style={{ height: 15, border: `1px solid ${accent}`, marginBottom: 10 }}></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 30px', gap: 5, height: 'calc(100% - 30px)' }}>
                        <div style={{ borderLeft: `1px solid ${accent}40`, paddingLeft: 5 }}>
                            <div style={{ height: 4, background: `${accent}40`, width: '80%', marginBottom: 3 }}></div>
                            <div style={{ height: 20, background: `${accent}10` }}></div>
                        </div>
                        <div style={{ border: `1px solid ${accent}40` }}></div>
                    </div>
                </div>
            )}
            {layout === 'timeline' && (
                <div style={{ position: 'absolute', inset: 0, background: template.styles.backgroundColor || 'white', padding: 10 }}>
                    <div style={{ position: 'absolute', left: '50%', top: 20, bottom: 0, width: 2, background: `${accent}20` }}></div>
                    <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 15 }}>
                        <div style={{ width: '40%', height: 15, background: '#f8fafc', alignSelf: 'flex-start' }}></div>
                        <div style={{ width: '40%', height: 15, background: '#f8fafc', alignSelf: 'flex-end' }}></div>
                        <div style={{ width: '40%', height: 15, background: '#f8fafc', alignSelf: 'flex-start' }}></div>
                    </div>
                </div>
            )}
            {layout === 'cards' && (
                <div style={{ position: 'absolute', inset: 0, background: template.styles.backgroundColor || '#f8fafc', padding: 10 }}>
                    <div style={{ height: 30, background: 'white', borderRadius: 8, marginBottom: 10 }}></div>
                    <div style={{ display: 'flex', gap: 5, height: 'calc(100% - 45px)' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <div style={{ flex: 1, background: 'white', borderRadius: 8 }}></div>
                            <div style={{ flex: 1, background: 'white', borderRadius: 8 }}></div>
                        </div>
                        <div style={{ width: '30%', background: accent, borderRadius: 8 }}></div>
                    </div>
                </div>
            )}
            {layout === 'brutalist' && (
                <div style={{ position: 'absolute', inset: 0, background: sidebarBg || '#FFFF00', padding: 10, border: '4px solid black' }}>
                    <div style={{ background: 'black', color: sidebarBg || '#FFFF00', fontSize: 10, fontWeight: 900, padding: 2, marginBottom: 5 }}>NAME</div>
                    <div style={{ background: 'white', border: '2px solid black', height: 40, boxShadow: '5px 5px 0 black' }}></div>
                </div>
            )}
            {layout === 'split-vertical' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                    <div style={{ width: '40%', background: sidebarBg || '#1E293B' }}></div>
                    <div style={{ width: '60%', background: 'white', padding: 5 }}>
                        <div style={{ height: 10, background: '#f1f5f9', marginBottom: 5 }}></div>
                        <div style={{ height: 10, background: '#f1f5f9' }}></div>
                    </div>
                </div>
            )}
            {layout === 'newspaper' && (
                <div style={{ position: 'absolute', inset: 0, background: '#fcfaf2', padding: 10, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ borderBottom: '2px solid black', height: 15, marginBottom: 5 }}></div>
                    <div style={{ display: 'flex', gap: 5, flex: 1 }}>
                        <div style={{ flex: 1, background: '#eee' }}></div>
                        <div style={{ flex: 1, background: '#eee' }}></div>
                    </div>
                </div>
            )}
            {layout === 'bauhaus' && (
                <div style={{ position: 'absolute', inset: 0, background: 'white' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, background: '#E63946' }}></div>
                    <div style={{ position: 'absolute', bottom: 10, right: 10, width: 20, height: 20, borderRadius: '50%', background: '#FFB703' }}></div>
                    <div style={{ margin: 25, height: 40, width: 50, background: '#1D3557' }}></div>
                </div>
            )}
            {layout === 'retro' && (
                <div style={{ position: 'absolute', inset: 0, background: 'black', border: '1px solid #00FF41', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color: '#00FF41', fontSize: 6 }}>{`> RE_SYS`}</div>
                </div>
            )}
            {layout === 'industrial' && (
                <div style={{ position: 'absolute', inset: 0, background: '#2D2D2D', borderLeft: `4px solid ${accent}` }}>
                    <div style={{ height: 30, background: '#444', margin: 10 }}></div>
                </div>
            )}
            {layout === 'swiss' && (
                <div style={{ position: 'absolute', inset: 0, background: 'white', padding: 10 }}>
                    <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -1, lineHeight: 0.8 }}>SWISS<br />MODE</div>
                    <div style={{ borderTop: '4px solid black', marginTop: 10 }}></div>
                </div>
            )}
            {layout === 'manifesto' && (
                <div style={{ position: 'absolute', inset: 0, background: 'white', borderRight: '10px solid black', padding: 10 }}>
                    <div style={{ background: 'black', height: 10, width: '100%', marginBottom: 5 }}></div>
                    <div style={{ fontSize: 8, fontWeight: 900 }}>BOLD STATEMENT</div>
                </div>
            )}
            {layout === 'organic' && (
                <div style={{ position: 'absolute', inset: 0, background: '#F0FFF4', borderRadius: 20, padding: 10 }}>
                    <div style={{ background: 'white', borderRadius: '15px 15px 30px 15px', height: 30, marginBottom: 5 }}></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, height: 20 }}>
                        <div style={{ background: 'white', borderRadius: 10 }}></div>
                        <div style={{ background: 'white', borderRadius: 10 }}></div>
                    </div>
                </div>
            )}
            {layout === 'block-modern' && (
                <div style={{ position: 'absolute', inset: 0, background: '#f8fafc', padding: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, height: 30, marginBottom: 5 }}>
                        <div style={{ background: accent, borderRadius: 10 }}></div>
                        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: 10 }}></div>
                    </div>
                    <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: 10, flex: 1, minHeight: 40 }}></div>
                </div>
            )}
        </div>
    );
};

const TemplateGallery = ({ setView }) => {
    const { user, checkPremiumStatus } = useAuthStore();
    const isPremium = checkPremiumStatus();

    // Logged in users get full access to all 25+ architectures
    const FREE_TEMPLATE_LIMIT = user ? 999 : 10;
    const availableTemplates = templates;

    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

    // Dynamic Font Loader for Preview
    React.useEffect(() => {
        // Load all fonts for the picker (Optional: Optimize this later)
        fontOptions.forEach(font => {
            const fontName = font.name;
            const linkId = `font-${fontName.replace(/\s+/g, '-')}`;
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
                document.head.appendChild(link);
            }
        });
    }, []);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedColor, setSelectedColor] = useState('#2563EB');
    const [selectedBgColor, setSelectedBgColor] = useState('#111827');
    const [customFontFamily, setCustomFontFamily] = useState('Inter, sans-serif');
    const [customFontSize, setCustomFontSize] = useState(14);

    // ENHANCED Palettes with more vibrant colors
    const accentColors = [
        '#2563EB', '#3B82F6', '#0EA5E9', // Blues
        '#10B981', '#059669', '#14B8A6', // Greens & Teals
        '#F59E0B', '#FBBF24', '#F97316', // Golds & Oranges
        '#EF4444', '#DC2626', '#FF6B35', // Reds & Deep Reds
        '#7C3AED', '#A855F7', '#EC4899', // Purples & Pinks
        '#64748B', '#6B7280', '#000000', // Grays & Black
        '#8B5CF6', '#06B6D4', '#0891B2', // Additional vibrants
        '#B45309', '#D97706', '#EA580C'  // Earthy tones
    ];

    const bgColors = [
        '#111827', '#1E3A8A', '#0C4A6E', '#1E293B', // Dark blues
        '#1F2937', '#374151', '#4B5563', '#171717', // Grays & Black
        '#064E3B', '#0D5E4E', '#0D7377', '#134E4A', // Dark Teals
        '#1F1F1F', '#2F2F2F', '#3F3F3F', '#1A1A2E'  // Very dark tones
    ];

    const { setCurrentResume, setIsPreviewing } = useResumeStore();

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        setIsPreviewing(true); // Hide Navbar
        setSelectedColor(template?.styles?.accent && template.styles.accent !== '#374151' ? template.styles.accent : accentColors[0]);
        setSelectedBgColor(template?.styles?.sidebarBg || '#111827');
        setCustomFontFamily(template?.styles?.fontFamily || "'Inter', sans-serif");
        setCustomFontSize(14);
    };

    const handleCreate = () => {
        if (!selectedTemplate) return;

        setCurrentResume({
            ...sampleResume,
            templateId: selectedTemplate.id,
            customColor: selectedColor,
            customBgColor: selectedBgColor,
            customFontFamily,
            customFontSize
        });

        if (!user) {
            setIsPremiumModalOpen(true);
            return;
        }

        setView('editor');
        setIsPreviewing(false); // Restore Navbar state for editor (or let editor handle it)
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem 2rem 4rem 2rem', position: 'relative' }}>
            <div style={{ maxWidth: '1400px', margin: '2rem auto', textAlign: 'center', padding: '0 1rem' }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem', color: 'var(--fg)', letterSpacing: '-0.03em' }}>
                    Select Your <span className="text-gradient">Architecture</span>
                </h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ padding: '6px 16px', background: 'var(--accent)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px var(--accent-alpha)' }}>
                        <Sparkles size={16} color="white" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', letterSpacing: '0.1em' }}>NEURAL SELECTION ACTIVE</span>
                    </div>
                    <p style={{ color: 'var(--fg-muted)', fontSize: '1.2rem', maxWidth: '700px', lineHeight: 1.6 }}>
                        Browse our curated collection of 25+ pixel-perfect resume architectures. Optimized for high-fidelity parsing across all major enterprise ATS platforms.
                    </p>
                </div>
            </div>

            <div className="responsive-grid" style={{ maxWidth: '100%', margin: '0 auto' }}>
                {templates.map((template, index) => {
                    return (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                            onClick={() => handleTemplateClick(template)}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid var(--border)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}
                        >
                            {index >= FREE_TEMPLATE_LIMIT && (
                                <div style={{
                                    position: 'absolute',
                                    top: 15,
                                    right: 15,
                                    zIndex: 10,
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    border: '1px solid #E5E7EB'
                                }}>
                                    <Lock size={12} color="var(--accent)" />
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)' }}>PRO</span>
                                </div>
                            )}
                            <div style={{ height: '340px', background: '#f9fafb', position: 'relative', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '100%', height: '100%', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden', borderTop: template.styles.layout === 'modern' ? 'none' : `4px solid ${template.styles.accent}` }}>
                                    <MiniThumbnail template={template} />
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fg)' }}>{template.name}</h3>
                                    {index >= FREE_TEMPLATE_LIMIT ? (
                                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#FEF3C7', color: '#92400E', fontWeight: 600 }}>Exclusive</span>
                                    ) : (
                                        template.styles.headerStyle !== 'left' && <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#F3F4F6', color: '#6B7280' }}>{template.styles.headerStyle}</span>
                                    )}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'capitalize' }}>{template.styles.layout} • {(template.styles.fontFamily || 'Sans').split(',')[0].replace(/'/g, "")}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <PremiumModal
                isOpen={isPremiumModalOpen}
                onClose={() => setIsPremiumModalOpen(false)}
                setView={setView}
            />

            <AnimatePresence>
                {selectedTemplate && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }} onClick={() => { setSelectedTemplate(null); setIsPreviewing(false); }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{ background: 'white', borderRadius: '24px', padding: '0', maxWidth: '1100px', width: '95%', height: '85vh', display: 'flex', boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.25)', overflow: 'hidden', position: 'relative' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => { setSelectedTemplate(null); setIsPreviewing(false); }} style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: '50%', cursor: 'pointer', border: 'none' }}><X size={24} color="#374151" /></button>

                            <div className="mobile-stack" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                                <div style={{ width: '100%', maxWidth: '420px', padding: 'clamp(1.5rem, 5vw, 2.5rem)', background: '#FFFFFF', display: 'flex', flexDirection: 'column', borderRight: '1px solid #E5E7EB', zIndex: 2, margin: '0 auto' }}>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: '8px' }}>Selected Template</h4>
                                        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>{selectedTemplate.name}</h1>
                                        <p style={{ fontSize: '0.95rem', color: '#6B7280', marginTop: '8px' }}>{selectedTemplate.styles.layout} Layout Engine</p>
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Palette size={16} /> Heading Color
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))', gap: '8px' }}>
                                            {accentColors.map(color => (
                                                <button key={color} onClick={() => setSelectedColor(color)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: color, border: selectedColor === color ? '3px solid white' : '2px solid white', boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer', transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)' }}>
                                                    {selectedColor === color && <Check size={16} color="white" style={{ margin: 'auto' }} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {(selectedTemplate?.styles?.layout?.includes('sidebar') || ['cyber', 'timeline', 'brutalist', 'neon-banner'].includes(selectedTemplate?.styles?.layout) || selectedTemplate?.styles?.sidebarBg) && (
                                        <div style={{ marginBottom: '2rem' }}>
                                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Layout size={16} /> Sidebar/Background
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))', gap: '8px' }}>
                                                {bgColors.map(color => (
                                                    <button key={color} onClick={() => setSelectedBgColor(color)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: color, border: selectedBgColor === color ? '3px solid white' : '2px solid white', boxShadow: selectedBgColor === color ? `0 0 0 2px ${color}` : '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer', transform: selectedBgColor === color ? 'scale(1.1)' : 'scale(1)' }}>
                                                        {selectedBgColor === color && <Check size={16} color="white" style={{ margin: 'auto' }} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 900 }}>Aa</div> Typography
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <select
                                                value={customFontFamily}
                                                onChange={(e) => setCustomFontFamily(e.target.value)}
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white', fontSize: '0.95rem', fontFamily: customFontFamily }}
                                            >
                                                {fontOptions.map(font => (
                                                    <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
                                                ))}
                                            </select>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Size: {customFontSize}px</span>
                                                <input
                                                    type="range"
                                                    min="12"
                                                    max="20"
                                                    step="0.5"
                                                    value={customFontSize}
                                                    onChange={(e) => setCustomFontSize(Number(e.target.value))}
                                                    style={{ flex: 1 }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleCreate} style={{ width: '100%', marginTop: 'auto', padding: '18px', background: '#111827', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        Use This Design <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                                    </button>
                                </div>

                                <div style={{ flex: 1, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2rem 0' }}>
                                    <div style={{ transform: 'scale(clamp(0.4, 60vw, 0.6))', transformOrigin: 'center center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '4px' }}>
                                        <TemplatePreview data={{ ...sampleResume, templateId: selectedTemplate.id, customColor: selectedColor, customBgColor: selectedBgColor, customFontFamily, customFontSize }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default TemplateGallery;
