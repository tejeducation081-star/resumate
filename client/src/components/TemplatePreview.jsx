import React, { useState, useRef, useEffect } from 'react';
import { templates } from '../templates/config';

const TemplatePreview = ({ data }) => {
    const { personalDetails = {}, summary = '', experience = [], education = [], skills = '', templateId, customColor, customBgColor } = data || {};

    // Safety check for templates
    const template = templates?.find(t => t.id === templateId) || templates?.[0];

    if (!template || !template.styles) {
        return <div style={{ padding: '2em', color: 'red' }}>Template Error</div>;
    }

    const { styles } = template;

    // Default Colors
    const accentColor = customColor || styles.accent;
    const bgColor = customBgColor || '#111827';

    // --- Helper Components & Styles ---

    // Decoration Elements
    const Decorator = () => {
        if (styles.decor === 'circle-accents') {
            return (
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: accentColor, opacity: 0.1, pointerEvents: 'none' }} />
            );
        }
        if (styles.decor === 'diagonal') {
            return (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '300px', background: `linear-gradient(135deg, ${accentColor} 0%, transparent 40%)`, opacity: 0.15, pointerEvents: 'none', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0% 100%)' }} />
            );
        }
        if (styles.decor === 'dots') {
            return (
                <div style={{ position: 'absolute', top: '20px', right: '20px', width: '100px', height: '100px', backgroundImage: `radial-gradient(${accentColor} 20%, transparent 20%)`, backgroundSize: '10px 10px', opacity: 0.2 }} />
            );
        }
        if (styles.decor === 'border-frame') {
            return (
                <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px', border: `1px solid ${accentColor}`, opacity: 0.3, pointerEvents: 'none', borderRadius: '4px' }} />
            );
        }
        if (styles.decor === 'grid-pattern') {
            return (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '150px', background: `linear-gradient(90deg, ${accentColor}08 1px, transparent 1px), linear-gradient(${accentColor}08 1px, transparent 1px)`, backgroundSize: '20px 20px', pointerEvents: 'none' }} />
            );
        }
        if (styles.decor === 'blob') {
            return (
                <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '150px', background: accentColor, borderRadius: '50%', opacity: 0.1, filter: 'blur(40px)', pointerEvents: 'none' }} />
            );
        }
        if (styles.decor === 'accent-strip') {
            return (
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '40px', background: accentColor, zIndex: 0 }} />
            );
        }
        if (styles.decor === 'gold-line') {
            return (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '8px', background: accentColor, opacity: 1 }} />
            );
        }
        if (styles.decor === 'zenith-border') {
            return (
                <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px', border: `3px double ${accentColor}`, opacity: 0.6, pointerEvents: 'none' }} />
            );
        }
        return null;
    };

    // Section Headers
    const SectionTitle = ({ title }) => {
        const baseStyle = {
            color: accentColor, // Always use the resolved accent color (custom or style default)
            fontWeight: 700,
            fontSize: styles.sectionStyle === 'caps-minimal' ? '0.9em' : '0.95em',
            textAlign: 'left',
            marginBottom: '1em',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
        };

        if (styles.sectionStyle === 'zenith') {
            return (
                <div style={{ marginBottom: '1.5em' }}>
                    <h3 style={{ ...baseStyle, borderBottom: `1px solid #E5E7EB`, paddingBottom: '0.5em', marginBottom: '4px' }}>{title}</h3>
                    <div style={{ height: '3px', borderTop: `1px solid ${accentColor}`, width: '100px' }}></div>
                </div>
            );
        }
        if (styles.sectionStyle === 'underline') {
            return <h3 style={{ ...baseStyle, borderBottom: '2px solid #E5E7EB', paddingBottom: '0.5em' }}>{title}</h3>;
        }
        if (styles.sectionStyle === 'box') {
            return <div style={{ marginBottom: '1em' }}><h3 style={{ ...baseStyle, background: '#F3F4F6', color: '#111827', padding: '6px 12px', borderRadius: '4px', borderLeft: `4px solid ${accentColor}`, display: 'inline-block', marginBottom: 0 }}>{title}</h3></div>;
        }
        if (styles.sectionStyle === 'line-beside') {
            return <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginBottom: '1em' }}><h3 style={{ ...baseStyle, marginBottom: 0 }}>{title}</h3><div style={{ flex: 1, height: '2px', background: '#F3F4F6', position: 'relative' }}><div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '40px', background: accentColor }}></div></div></div>;
        }
        if (styles.sectionStyle === 'bracket') {
            return <h3 style={{ ...baseStyle, borderLeft: `6px solid ${accentColor}`, paddingLeft: '12px', lineHeight: 1 }}>{title}</h3>;
        }
        if (styles.sectionStyle === 'circle-title') {
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8em', marginBottom: '1.5em' }}>
                    <div style={{ width: '12px', height: '12px', background: accentColor, borderRadius: '50%' }} />
                    <h3 style={{ ...baseStyle, marginBottom: 0, color: '#111827', fontSize: '1.1em' }}>{title}</h3>
                </div>
            );
        }
        if (styles.sectionStyle === 'none') {
            return null;
        }
        // Minimal/Caps
        return <h3 style={{ ...baseStyle, letterSpacing: '0.2em', borderBottom: `1px solid ${accentColor}30`, paddingBottom: '4px' }}>{title}</h3>;
    };

    // Header Styles
    const HeaderRenderer = () => {
        const headerInfo = (
            <div>
                <h1 style={{
                    fontSize: '2.8em',
                    fontWeight: 800,
                    color: styles.headerStyle === 'banner' ? 'white' : (styles.headerStyle === 'split' ? '#111827' : accentColor),
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    marginBottom: '0.5em',
                    transition: 'color 0.3s'
                }}>
                    {personalDetails.fullName || 'YOUR NAME'}
                </h1>
                <p style={{ fontSize: '1.1em', color: styles.headerStyle === 'banner' ? 'rgba(255,255,255,0.9)' : '#6B7280', marginBottom: '0.5em' }}>
                    {personalDetails.jobTitle || 'Job Title'}
                </p>
                <ContactInfo colorOverride={styles.headerStyle === 'banner' ? 'rgba(255,255,255,0.8)' : null} vertical={styles.headerStyle === 'split'} />
            </div>
        );

        const photoStyle = {
            width: '8em',
            height: '8em',
            objectFit: 'cover',
            borderRadius: styles.decor === 'circle-accents' || styles.decor === 'blob' ? '50%' : '6px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        };

        if (styles.headerStyle === 'banner') {
            return (
                <div style={{ background: styles.decor === 'diagonal' ? `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` : accentColor, padding: '2.5em 3.75em', color: 'white', marginBottom: '2.5em', display: 'flex', justifyContent: 'space-between', alignItems: 'center', clipPath: styles.decor === 'diagonal' ? 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)' : 'none' }}>
                    {headerInfo}
                    {personalDetails.photoUrl && <img src={personalDetails.photoUrl} alt="Profile" style={{ ...photoStyle, border: '0.25em solid rgba(255,255,255,0.3)', borderRadius: '50%' }} />}
                </div>
            );
        }
        if (styles.headerStyle === 'center') {
            return (
                <div style={{ textAlign: 'center', padding: '3.75em 3.75em 2.5em 3.75em', borderBottom: styles.decor === 'line' ? '1px solid #E5E7EB' : 'none', marginBottom: '2.5em', position: 'relative' }}>
                    {personalDetails.photoUrl && <img src={personalDetails.photoUrl} alt="Profile" style={{ ...photoStyle, marginBottom: '1.25em', width: '9.5em', height: '9.5em' }} />}
                    <h1 style={{ fontSize: '3.5em', fontWeight: 700, color: '#111827', marginBottom: '0.15em', letterSpacing: '-0.02em' }}>{personalDetails.fullName || 'YOUR NAME'}</h1>
                    <p style={{ fontSize: '1.2em', color: accentColor, marginBottom: '1.25em', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{personalDetails.jobTitle || 'Job Title'}</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}><ContactInfo /></div>
                </div>
            );
        }
        if (styles.headerStyle === 'asymmetric') {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2em', marginBottom: '4em', alignItems: 'end', padding: '0 3.75em', paddingTop: '3.75em' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-0.5em', left: '-0.25em', fontSize: '8em', fontWeight: 900, color: accentColor, opacity: 0.05, zIndex: 0, pointerEvents: 'none' }}>{personalDetails.fullName?.charAt(0) || 'Y'}</div>
                        <h1 style={{ fontSize: '5em', fontWeight: 900, color: '#000', lineHeight: 0.8, letterSpacing: '-0.05em', position: 'relative', zIndex: 1 }}>
                            {personalDetails.fullName?.split(' ')[0] || 'YOUR'}
                        </h1>
                        <h1 style={{ fontSize: '5em', fontWeight: 300, color: '#000', lineHeight: 0.8, letterSpacing: '-0.05em', position: 'relative', zIndex: 1, marginTop: '0.1em' }}>
                            {personalDetails.fullName?.split(' ')[1] || 'NAME'}
                        </h1>
                    </div>
                    <div style={{ paddingBottom: '0.6em' }}>
                        <p style={{ fontSize: '1.2em', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5em' }}>{personalDetails.jobTitle || 'Creative Director'}</p>
                        <ContactInfo vertical />
                    </div>
                </div>
            );
        }
        if (styles.headerStyle === 'zenith') {
            return (
                <div style={{ textAlign: 'center', marginBottom: '2.5em', position: 'relative' }}>
                    <div style={{ height: '0.5em', background: accentColor, width: '100%', marginBottom: '2.5em' }}></div>
                    <h1 style={{ fontSize: '3.5em', fontWeight: 800, color: '#111827', marginBottom: '0.15em', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{personalDetails.fullName || 'YOUR NAME'}</h1>
                    <p style={{ fontSize: '1em', color: accentColor, marginBottom: '1.25em', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 700 }}>{personalDetails.jobTitle || 'Job Title'}</p>

                    <div style={{ borderTop: `1px solid ${accentColor}`, borderBottom: `1px solid ${accentColor}`, padding: '0.6em 0', margin: '0 3.75em 2.5em 3.75em', display: 'flex', justifyContent: 'center' }}>
                        <ContactInfo />
                    </div>
                </div>
            );
        }

        if (styles.headerStyle === 'neon-banner') {
            return (
                <div style={{ background: '#050505', padding: '3.75em', borderBottom: `2px solid ${accentColor}`, position: 'relative', overflow: 'hidden', marginBottom: '2.5em' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
                    <h1 style={{ fontSize: '4em', fontWeight: 900, color: 'white', textShadow: `0 0 20px ${accentColor}80`, letterSpacing: '0.1em', textAlign: 'center' }}>
                        {personalDetails.fullName || 'YOUR NAME'}
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1em' }}>
                        <div style={{ padding: '0.25em 1.25em', background: `${accentColor}20`, border: `1px solid ${accentColor}`, borderRadius: '1.25em', color: accentColor, fontSize: '0.9em', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                            {personalDetails.jobTitle || 'Software Architect'}
                        </div>
                    </div>
                </div>
            );
        }
        if (styles.headerStyle === 'diagonal-banner') {
            return (
                <div style={{ position: 'relative', height: '12.5em', overflow: 'hidden', padding: '2.5em 3.75em' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: accentColor, transform: 'skewY(-5deg)', transformOrigin: 'top left', marginTop: '-3em', zIndex: 0 }} />
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: '3em', fontWeight: 800, color: '#111827' }}>{personalDetails.fullName || 'YOUR NAME'}</h1>
                            <p style={{ fontSize: '1.2em', color: '#111827', fontWeight: 600, opacity: 0.8 }}>{personalDetails.jobTitle || 'WEB DESIGNER'}</p>
                        </div>
                        {personalDetails.photoUrl && <img src={personalDetails.photoUrl} alt="Profile" style={{ ...photoStyle, borderRadius: '50%', border: '0.25em solid white' }} />}
                    </div>
                </div>
            );
        }
        if (styles.headerStyle === 'navy-gold') {
            const headerBg = customBgColor || '#1A1A2E';
            return (
                <div style={{ background: headerBg, color: 'white', padding: '3.75em', textAlign: 'center', position: 'relative', borderBottom: `0.5em solid ${accentColor}` }}>
                    <div style={{ position: 'absolute', top: '1.25em', left: '50%', transform: 'translateX(-50%)', width: '2.5em', height: '2.5em', border: `2px solid ${accentColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{personalDetails.fullName?.charAt(0) || 'M'}</div>
                    <h1 style={{ fontSize: '3.5em', fontWeight: 700, letterSpacing: '0.05em', marginTop: '1em' }}>{personalDetails.fullName || 'MATHEW SMITH'}</h1>
                    <p style={{ fontSize: '1.2em', color: accentColor, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{personalDetails.jobTitle || 'GRAPHIC DESIGNER'}</p>
                </div>
            );
        }
        if (styles.headerStyle === 'split') {
            return (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '3.75em', borderBottom: styles.decor === 'accent-strip' ? 'none' : `0.25em solid ${accentColor}`, marginBottom: '2.5em', background: styles.layout === 'block-modern' ? 'transparent' : '#F9FAFB' }}>
                    <div>
                        <h1 style={{ fontSize: '3.5em', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{personalDetails.fullName?.split(' ')[0] || 'YOUR'}</h1>
                        <h1 style={{ fontSize: '3.5em', fontWeight: 900, color: accentColor, lineHeight: 1 }}>{personalDetails.fullName?.split(' ')[1] || 'NAME'}</h1>
                        <p style={{ fontSize: '1em', color: '#6B7280', marginTop: '0.6em', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{personalDetails.jobTitle || 'GRAPHIC & WEB DESIGNER'}</p>
                    </div>
                    {personalDetails.photoUrl && <img src={personalDetails.photoUrl} alt="Profile" style={{ ...photoStyle, borderRadius: '4px' }} />}
                    <div style={{ textAlign: 'right', marginTop: '0.6em' }}>
                        <ContactInfo vertical />
                    </div>
                </div>
            );
        }
        // Minimal / Left
        return (
            <div style={{ padding: '3.75em 3.75em 1.8em 3.75em', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8em' }}>
                <div>
                    <h1 style={{ fontSize: '3.5em', fontWeight: 800, color: '#111827', lineHeight: 1.1, marginBottom: '0.3em' }}>{personalDetails.fullName || 'YOUR NAME'}</h1>
                    <p style={{ fontSize: '1.25em', color: accentColor, fontWeight: 500 }}>{personalDetails.jobTitle || 'Senior Product Designer'}</p>
                    <div style={{ marginTop: '1em' }}><ContactInfo /></div>
                </div>
                {personalDetails.photoUrl && <img src={personalDetails.photoUrl} alt="Profile" style={photoStyle} />}
            </div>
        );
    };

    const ExperienceItem = ({ exp }) => (
        <div style={{ marginBottom: '1.8em' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3em' }}>
                <h4 style={{ fontWeight: 700, color: '#111827', fontSize: '1.05em' }}>{exp.company}</h4>
                <span style={{ fontSize: '0.85em', color: styles.layout === 'minimal' ? '#9CA3AF' : accentColor, fontWeight: 600 }}>{exp.startDate} — {exp.endDate}</span>
            </div>
            <div style={{ fontSize: '0.9em', fontWeight: 500, color: '#4B5563', marginBottom: '0.6em', fontStyle: 'italic' }}>{exp.position}</div>
            <p style={{ fontSize: '0.9em', lineHeight: '1.6', color: '#4B5563' }}>{exp.description}</p>
        </div>
    );

    const EducationItem = ({ edu }) => (
        <div style={{ marginBottom: '1.5em' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3em' }}>
                <h4 style={{ fontWeight: 700, color: '#111827', fontSize: '1.05em' }}>{edu.school}</h4>
                <span style={{ fontSize: '0.85em', color: styles.layout === 'minimal' ? '#9CA3AF' : accentColor, fontWeight: 600 }}>{edu.year}</span>
            </div>
            <div style={{ fontSize: '0.9em', fontWeight: 500, color: '#4B5563' }}>{edu.degree}</div>
        </div>
    );

    const SkillsList = () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6em' }}>
            {skills && skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                <span key={i} style={{
                    background: styles.layout === 'modern' || styles.layout === 'grid' ? (styles.decor === 'grid-pattern' ? 'white' : `${accentColor}10`) : '#F3F4F6',
                    color: accentColor,
                    border: styles.decor === 'grid-pattern' ? `1px solid ${accentColor}40` : 'none',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8em',
                    fontWeight: 600
                }}>
                    {s.trim()}
                </span>
            ))}
        </div>
    );

    const ContactInfo = ({ vertical = false, colorOverride }) => (
        <div style={{
            fontSize: '0.85em',
            color: colorOverride || (styles.layout === 'sidebar' && !vertical ? 'rgba(255,255,255,0.8)' : '#6B7280'),
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
            gap: vertical ? '0.4em' : '1.5em',
            flexWrap: 'wrap',
            alignItems: vertical ? (styles.headerStyle === 'split' ? 'flex-end' : 'flex-start') : 'center'
        }}>
            {personalDetails.email && <span>{personalDetails.email}</span>}
            {personalDetails.phone && <span>{personalDetails.phone}</span>}
            {personalDetails.location && <span>{personalDetails.location}</span>}
            {personalDetails.website && <span>{personalDetails.website}</span>}
        </div>
    );

    // --- Layout Renderers ---

    const LayoutSidebar = () => {
        // Prioritize customBgColor (present in data) if it exists, otherwise fall back to style default or generic default
        const sidebarBg = customBgColor || styles.sidebarBg || '#111827';

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 32%) 1fr', minHeight: '1123px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ background: sidebarBg, color: 'white', padding: '2.5em 2em', display: 'flex', flexDirection: 'column', gap: '2em', textAlign: styles.headerStyle === 'center' ? 'center' : 'left', position: 'sticky', top: 0, height: '100vh', flexShrink: 0, overflow: 'hidden' }}>
                    <Decorator />
                    {/* Sidebar Decor */}
                    {styles.decor === 'grid-pattern' && <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '1.25em 1.25em' }}></div>}

                    <div style={{ position: 'relative', zIndex: 1, paddingLeft: styles.decor === 'accent-strip' ? '2.5em' : '0' }}>
                        {/* Photo moved to HeaderRenderer for cleaner layout */}
                        <h3 style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '1em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.3em' }}>Contact Me</h3>
                        <ContactInfo vertical colorOverride="rgba(255,255,255,0.8)" />
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, marginTop: '1em', paddingLeft: styles.decor === 'accent-strip' ? '2.5em' : '0' }}>
                        <h3 style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '1em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.3em' }}>Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em', justifyContent: styles.headerStyle === 'center' ? 'center' : 'flex-start' }}>
                            {skills && skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                                <span key={i} style={{ fontSize: '0.85em', color: 'white', background: 'rgba(255,255,255,0.1)', padding: '0.25em 0.5em', borderRadius: '4px' }}>{s.trim()}</span>
                            ))}
                        </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, marginTop: '2em', paddingLeft: styles.decor === 'accent-strip' ? '2.5em' : '0' }}>
                        <h3 style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '1em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.3em' }}>Education</h3>
                        {education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '1.2em' }}>
                                <div style={{ fontSize: '0.9em', fontWeight: 600, color: 'white' }}>{edu.school}</div>
                                <div style={{ fontSize: '0.8em', color: 'rgba(255,255,255,0.7)' }}>{edu.degree}</div>
                                <div style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.5)' }}>{edu.year}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '3em 2.5em', background: 'white', position: 'relative', overflow: 'hidden', height: 'auto' }}>
                    {styles.roundedContent ? (
                        <div style={{ background: 'white', padding: '2.5em', borderRadius: '2.5em 0 0 2.5em', marginLeft: '-2.5em', position: 'relative', zIndex: 1 }}>
                            <HeaderRenderer />
                            {summary && (
                                <section style={{ marginBottom: '2.5em', position: 'relative' }}>
                                    <h3 style={{ fontSize: '1em', background: 'white', border: `2px solid ${accentColor}`, color: accentColor, padding: '0.25em 1em', borderRadius: '1.25em', display: 'inline-block', marginBottom: '1em', textTransform: 'uppercase', fontWeight: 700 }}>About Me</h3>
                                    <p style={{ lineHeight: 1.7 }}>{summary}</p>
                                </section>
                            )}
                            <section style={{ position: 'relative' }}>
                                <SectionTitle title="Job Experience" />
                                {experience.map((exp, i) => <ExperienceItem key={i} exp={exp} />)}
                            </section>
                        </div>
                    ) : (
                        <>
                            <Decorator />
                            <HeaderRenderer />
                            {summary && (
                                <section style={{ marginBottom: '2.5em', position: 'relative' }}>
                                    <SectionTitle title="Profile" />
                                    <p style={{ lineHeight: 1.7 }}>{summary}</p>
                                </section>
                            )}
                            <section style={{ position: 'relative' }}>
                                <SectionTitle title="Experience" />
                                {experience.map((exp, i) => <ExperienceItem key={i} exp={exp} />)}
                            </section>
                            <section style={{ marginTop: '2.5em', position: 'relative' }}>
                                <SectionTitle title="Education" />
                                {education.map((edu, i) => (
                                    <div key={i} style={{ marginBottom: '1.2em' }}>
                                        <h4 style={{ fontWeight: 700, fontSize: '1em' }}>{edu.school}</h4>
                                        <div style={{ fontSize: '0.9em', color: '#6B7280' }}>{edu.degree} • {edu.year}</div>
                                    </div>
                                ))}
                            </section>
                        </>
                    )}
                </div>
            </div >
        );
    };

    const LayoutGrid = () => (
        <div style={{ padding: '0 0 3em 0', position: 'relative' }}>
            <Decorator />
            <HeaderRenderer />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4em', padding: '0 3.75em' }}>
                <div>
                    {summary && (
                        <div style={{ marginBottom: '2.5em' }}>
                            <SectionTitle title="About" />
                            <p style={{ lineHeight: 1.7 }}>{summary}</p>
                        </div>
                    )}
                    {skills && (
                        <div style={{ marginBottom: '2.5em' }}>
                            <SectionTitle title="Core Competencies" />
                            <SkillsList />
                        </div>
                    )}
                    <div>
                        <SectionTitle title="Education" />
                        {education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '1em', borderLeft: `2px solid ${accentColor}`, paddingLeft: '1em' }}>
                                <h4 style={{ fontWeight: 700 }}>{edu.school}</h4>
                                <div style={{ fontSize: '0.85em', color: '#6B7280' }}>{edu.degree} • {edu.year}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <SectionTitle title="Experience" />
                    {experience.map((exp, i) => <ExperienceItem key={i} exp={exp} />)}
                </div>
            </div>
        </div>
    );

    const LayoutModern = () => (
        <div style={{ padding: '0', minHeight: '1123px', height: 'auto', position: 'relative' }}>
            <Decorator />
            <HeaderRenderer />

            <div style={{ padding: '0 3.75em 2.5em 3.75em', maxWidth: '850px', margin: '0 auto' }}>
                {summary && (
                    <div style={{ padding: '2em', background: '#F9FAFB', borderRadius: '12px', marginBottom: '3em', borderLeft: `4px solid ${accentColor}` }}>
                        <p style={{ fontSize: '1.05em', fontStyle: 'italic', color: '#4B5563', lineHeight: 1.6 }}>"{summary}"</p>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '3em' }}>
                    <div>
                        <SectionTitle title="Work History" />
                        {experience.map((exp, i) => <ExperienceItem key={i} exp={exp} />)}
                    </div>
                    <div>
                        <div style={{ marginBottom: '3em' }}>
                            <SectionTitle title="Skills" />
                            <SkillsList />
                        </div>
                        <div>
                            <SectionTitle title="Education" />
                            {education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '1.5em' }}>
                                    <h4 style={{ fontWeight: 700, fontSize: '1em' }}>{edu.school}</h4>
                                    <div style={{ fontSize: '0.9em', color: '#6B7280' }}>{edu.degree}</div>
                                    <div style={{ fontSize: '0.85em', color: '#9CA3AF' }}>{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const LayoutMinimal = () => (
        <div style={{ padding: '0', textAlign: 'left', position: 'relative' }}>
            <HeaderRenderer />

            <div style={{ textAlign: 'left', maxWidth: '750px', margin: '0 auto', padding: '0 3.75em' }}>
                {summary && <p style={{ marginBottom: '3em', lineHeight: 1.8, fontSize: '1.05em', color: '#374151' }}>{summary}</p>}

                <div style={{ marginBottom: '3.5em' }}>
                    <h3 style={{ fontSize: '0.85em', fontWeight: 600, marginBottom: '2em', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.6em' }}>Experience</h3>
                    {experience.map((exp, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', marginBottom: '2.5em' }}>
                            <span style={{ fontSize: '0.85em', color: '#6B7280', fontWeight: 500 }}>{exp.startDate} — {exp.endDate}</span>
                            <div>
                                <h4 style={{ fontWeight: 700, marginBottom: '0.25em', fontSize: '1.1em', color: '#111827' }}>{exp.company}</h4>
                                <div style={{ fontSize: '0.9em', fontStyle: 'italic', marginBottom: '0.8em', color: accentColor }}>{exp.position}</div>
                                <p style={{ fontSize: '0.95em', lineHeight: 1.7, color: '#4B5563' }}>{exp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginBottom: '3.5em' }}>
                    <h3 style={{ fontSize: '0.85em', fontWeight: 600, marginBottom: '2em', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.6em' }}>Education</h3>
                    {education.map((edu, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', marginBottom: '1.5em' }}>
                            <span style={{ fontSize: '0.85em', color: '#6B7280', fontWeight: 500 }}>{edu.year}</span>
                            <div>
                                <h4 style={{ fontWeight: 700, marginBottom: '0.25em', fontSize: '1em', color: '#111827' }}>{edu.school}</h4>
                                <div style={{ fontSize: '0.9em', color: '#4B5563' }}>{edu.degree}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginBottom: '3.5em' }}>
                    <h3 style={{ fontSize: '0.85em', fontWeight: 600, marginBottom: '2em', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.6em' }}>Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6em' }}>
                        {skills && skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                            <span key={i} style={{ background: '#F3F4F6', padding: '0.4em 0.8em', borderRadius: '4px', fontSize: '0.9em', color: '#374151', fontWeight: 500 }}>{s.trim()}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const LayoutClassic = () => (
        <div style={{ padding: '0', position: 'relative' }}>
            <Decorator />
            <HeaderRenderer />

            <div style={{ padding: '0 5em', maxWidth: '1000px', margin: '0 auto' }}>
                {summary && (
                    <section style={{ marginBottom: '2.5em' }}>
                        <SectionTitle title="Professional Summary" />
                        <p style={{ lineHeight: 1.8 }}>{summary}</p>
                    </section>
                )}

                <section style={{ marginBottom: '2.5em' }}>
                    <SectionTitle title="Experience" />
                    {experience.map((exp, i) => <ExperienceItem key={i} exp={exp} />)}
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3em' }}>
                    <section>
                        <SectionTitle title="Education" />
                        {education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '1em' }}>
                                <h4 style={{ fontWeight: 700 }}>{edu.school}</h4>
                                <div style={{ fontSize: '0.9em', color: '#6B7280' }}>{edu.degree} • {edu.year}</div>
                            </div>
                        ))}
                    </section>
                    <section>
                        <SectionTitle title="Skills" />
                        <SkillsList />
                    </section>
                </div>
            </div>
        </div>
    );

    const LayoutCyber = () => {
        const mainBg = customBgColor || '#0D0D0D';
        return (
            <div style={{ background: mainBg, color: '#00FF41', minHeight: '1123px', padding: '40px', fontFamily: "'JetBrains Mono', monospace" }}>
                <div style={{ border: '1px solid #00FF41', padding: '30px', position: 'relative', marginBottom: '30px' }}>
                    <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#0D0D0D', padding: '0 10px', fontSize: '0.8em' }}>SYS_PROFILE_V1.0</div>
                    <h1 style={{ fontSize: '3em', fontWeight: 800, marginBottom: '10px', color: '#00FF41', textShadow: '0 0 10px #00FF4140' }}>{personalDetails.fullName || 'ROOT_USER'}</h1>
                    <p style={{ fontSize: '1.1em', opacity: 0.8 }}>// DESIGN_ENGINEER</p>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '20px', fontSize: '0.8em', opacity: 0.6 }}>
                        <span>E: {personalDetails.email}</span>
                        <span>P: {personalDetails.phone}</span>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
                    <div>
                        <h3 style={{ borderBottom: '1px solid #00FF41', paddingBottom: '5px', marginBottom: '20px', fontSize: '1em' }}>LOG_EXPERIENCE</h3>
                        {experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '20px', borderLeft: '2px solid #00FF4140', paddingLeft: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 700 }}>{exp.company}</span>
                                    <span style={{ opacity: 0.6 }}>{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', marginBottom: '10px', color: '#00FF4180' }}>{exp.position}</div>
                                <p style={{ fontSize: '0.85em', lineHeight: 1.6 }}>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3 style={{ borderBottom: '1px solid #00FF41', paddingBottom: '5px', marginBottom: '20px', fontSize: '1em' }}>SCAN_SKILLS</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                            {skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                                <span key={i} style={{ border: '1px solid #00FF4160', padding: '4px 10px', fontSize: '0.8em' }}>{s.trim()}</span>
                            ))}
                        </div>

                        <h3 style={{ borderBottom: '1px solid #00FF41', paddingBottom: '5px', marginBottom: '20px', fontSize: '1em' }}>DB_EDUCATION</h3>
                        {education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '20px' }}>
                                <div style={{ fontWeight: 700, color: '#00FF41' }}>{edu.school}</div>
                                <div style={{ fontSize: '0.9em', opacity: 0.8 }}>{edu.degree}</div>
                                <div style={{ fontSize: '0.8em', opacity: 0.6 }}>{edu.year}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const LayoutMagazine = () => (
        <div style={{ background: '#F5F5F5', minHeight: '100%', padding: '60px', color: '#000', fontFamily: "'Playfair Display', serif" }}>
            <HeaderRenderer />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6em' }}>
                <div style={{ borderTop: '4px solid #000', paddingTop: '20px' }}>
                    <h3 style={{ fontSize: '2em', fontWeight: 900, marginBottom: '2em' }}>Experience</h3>
                    {experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '3em' }}>
                            <div style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px', fontWeight: 700 }}>{exp.startDate} - {exp.endDate}</div>
                            <h4 style={{ fontSize: '1.5em', fontWeight: 400, marginBottom: '10px' }}>{exp.company}</h4>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95em', lineHeight: 1.8, color: '#333' }}>{exp.description}</p>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4em' }}>
                    <div>
                        <h3 style={{ fontSize: '2em', fontWeight: 900, marginBottom: '2em', textAlign: 'right' }}>Competencies</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'flex-end' }}>
                            {skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                                <span key={i} style={{ fontSize: '1.1em', borderBottom: '1px solid #000', paddingBottom: '2px' }}>{s.trim()}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2em', fontWeight: 900, marginBottom: '2em', textAlign: 'right' }}>Education</h3>
                        {education.map((edu, i) => (
                            <div key={i} style={{ textAlign: 'right', marginBottom: '20px' }}>
                                <div style={{ fontSize: '1.2em', fontWeight: 400 }}>{edu.school}</div>
                                <div style={{ fontSize: '0.8em', opacity: 0.6 }}>{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const LayoutTimeline = () => (
        <div style={{ background: 'white', minHeight: '100%', padding: '60px', position: 'relative' }}>
            <HeaderRenderer />
            <div style={{ maxWidth: '800px', margin: '40px auto', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: '4px', background: `${accentColor}20` }} />

                <section style={{ marginBottom: '4em' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2em' }}>
                        <div style={{ background: accentColor, color: 'white', padding: '8px 24px', borderRadius: '30px', fontSize: '0.9em', fontWeight: 700, position: 'relative', zIndex: 1 }}>EXPERIENCE</div>
                    </div>
                    {experience.map((exp, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: '20px', marginBottom: '40px', alignItems: 'center' }}>
                            <div style={{ textAlign: 'right', order: i % 2 === 0 ? 1 : 3 }}>
                                <h4 style={{ fontWeight: 700, fontSize: '1.1em' }}>{exp.company}</h4>
                                <div style={{ color: accentColor, fontWeight: 600, fontSize: '0.9em' }}>{exp.position}</div>
                            </div>
                            <div style={{ order: 2, display: 'flex', justifyContent: 'center' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: accentColor, border: '4px solid white', boxShadow: '0 0 0 4px rgba(0,0,0,0.05)', position: 'relative', zIndex: 1 }} />
                            </div>
                            <div style={{ order: i % 2 === 0 ? 3 : 1 }}>
                                <div style={{ fontSize: '0.8em', color: '#6B7280', marginBottom: '5px' }}>{exp.startDate} - {exp.endDate}</div>
                                <p style={{ fontSize: '0.85em', lineHeight: 1.5, color: '#4B5563' }}>{exp.description?.substring(0, 100)}...</p>
                            </div>
                        </div>
                    ))}
                </section>

                <section style={{ marginBottom: '4em' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2em' }}>
                        <div style={{ background: accentColor, color: 'white', padding: '8px 24px', borderRadius: '30px', fontSize: '0.9em', fontWeight: 700, position: 'relative', zIndex: 1 }}>EDUCATION</div>
                    </div>
                    {education.map((edu, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: '20px', marginBottom: '40px', alignItems: 'center' }}>
                            <div style={{ textAlign: 'right', order: i % 2 === 0 ? 1 : 3 }}>
                                <h4 style={{ fontWeight: 700, fontSize: '1em' }}>{edu.school}</h4>
                            </div>
                            <div style={{ order: 2, display: 'flex', justifyContent: 'center' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white', border: `3px solid ${accentColor}`, position: 'relative', zIndex: 1 }} />
                            </div>
                            <div style={{ order: i % 2 === 0 ? 3 : 1 }}>
                                <div style={{ fontSize: '0.9em', color: '#333' }}>{edu.degree}</div>
                                <div style={{ fontSize: '0.8em', color: '#6B7280' }}>{edu.year}</div>
                            </div>
                        </div>
                    ))}
                </section>

                <section style={{ marginBottom: '4em' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2em' }}>
                        <div style={{ background: accentColor, color: 'white', padding: '8px 24px', borderRadius: '30px', fontSize: '0.9em', fontWeight: 700, position: 'relative', zIndex: 1 }}>SKILLS</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
                        {skills && skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                            <span key={i} style={{ background: 'white', border: `1px solid ${accentColor}40`, color: '#374151', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9em', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative', zIndex: 1 }}>{s.trim()}</span>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );

    const LayoutCards = () => (
        <div style={{ background: '#F8FAFC', minHeight: '100%', padding: '40px 60px' }}>
            <HeaderRenderer />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2em', marginTop: '20px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    {experience.map((exp, i) => (
                        <div key={i} style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.2em', fontWeight: 700, color: '#1E293B' }}>{exp.company}</h4>
                                    <div style={{ color: accentColor, fontWeight: 600 }}>{exp.position}</div>
                                </div>
                                <span style={{ padding: '4px 12px', background: '#F1F5F9', borderRadius: '20px', fontSize: '0.8em', color: '#64748B' }}>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95em' }}>{exp.description}</p>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
                    <div style={{ background: accentColor, color: 'white', padding: '30px', borderRadius: '20px', boxShadow: `0 20px 25px -5px ${accentColor}30` }}>
                        <h3 style={{ fontSize: '1.1em', fontWeight: 700, marginBottom: '1.5em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                                <span key={i} style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85em' }}>{s.trim()}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.1em', fontWeight: 700, color: '#1E293B', marginBottom: '1.5em' }}>Education</h3>
                        {education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '15px' }}>
                                <div style={{ fontWeight: 600, color: '#334155' }}>{edu.school}</div>
                                <div style={{ fontSize: '0.85em', color: '#64748B' }}>{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const LayoutBrutalist = () => {
        const brutesBg = customBgColor || '#FFFF00';
        return (
            <div style={{ background: brutesBg, color: '#000', minHeight: '100%', padding: '40px', border: '10px solid #000' }}>
                <h1 style={{ fontSize: '6em', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, marginBottom: '40px', letterSpacing: '-4px', background: '#000', color: '#FFFF00', display: 'inline-block', padding: '10px 20px' }}>
                    {personalDetails.fullName || 'RAW POWER'}
                </h1>
                <div style={{ border: '5px solid #000', padding: '20px', background: 'white', marginBottom: '40px', boxShadow: '20px 20px 0 #000' }}>
                    <p style={{ fontSize: '1.5em', fontWeight: 700 }}>{personalDetails.jobTitle || 'SOFTWARE ENGINEER'} // 2024_SUBMISSION</p>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '20px' }}>
                        <span>{personalDetails.email}</span>
                        <span>{personalDetails.phone}</span>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                    <div style={{ border: '5px solid #000', padding: '30px', background: 'white', boxShadow: '15px 15px 0 #000' }}>
                        <h3 style={{ fontSize: '2em', fontWeight: 900, textTransform: 'uppercase', borderBottom: '5px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>WORK_EXP</h3>
                        {experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '30px' }}>
                                <h4 style={{ fontSize: '1.5em', fontWeight: 900 }}>{exp.company}</h4>
                                <div style={{ fontWeight: 700, color: '#666' }}>{exp.position}</div>
                                <p style={{ marginTop: '10px' }}>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div style={{ border: '5px solid #000', padding: '30px', background: 'white', boxShadow: '15px 15px 0 #000' }}>
                            <h3 style={{ fontSize: '2em', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>SKILLS_RAW</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                                    <span key={i} style={{ background: '#000', color: '#fff', padding: '5px 15px', fontWeight: 900 }}>{s.trim()}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ border: '5px solid #000', padding: '30px', background: 'white', boxShadow: '15px 15px 0 #000' }}>
                            <h3 style={{ fontSize: '2em', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>EDU_TRAINING</h3>
                            {education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                                    <div style={{ fontWeight: 900, fontSize: '1.2em' }}>{edu.school}</div>
                                    <div style={{ fontWeight: 700 }}>{edu.degree}</div>
                                    <div style={{ fontSize: '0.9em' }}>{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const LayoutModernSilk = () => {
        const headerBg = customBgColor || '#FFF5F7';
        return (
            <div style={{ background: headerBg, minHeight: '1123px', padding: '50px', position: 'relative', fontFamily: "'Playfair Display', serif", color: '#333' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '10px', background: `linear-gradient(90deg, ${accentColor}, transparent)` }}></div>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    {personalDetails.photoUrl && (
                        <img src={personalDetails.photoUrl} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: `4px solid white`, boxShadow: '0 10px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }} />
                    )}
                    <h1 style={{ fontSize: '3.5em', fontWeight: 700, margin: '0 0 10px 0', color: '#111827' }}>{personalDetails.fullName || 'YOUR NAME'}</h1>
                    <p style={{ fontSize: '1.2em', fontStyle: 'italic', color: accentColor, letterSpacing: '2px', textTransform: 'uppercase' }}>{personalDetails.jobTitle}</p>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.9em' }}>
                        <ContactInfo />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '50px', background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
                    <div style={{ borderRight: '1px solid #eee', paddingRight: '40px' }}>
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: `2px solid ${accentColor}`, paddingBottom: '10px', marginBottom: '20px' }}>Profile</h3>
                            <p style={{ lineHeight: 1.8, fontSize: '0.95em', fontFamily: "'Inter', sans-serif" }}>{summary}</p>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: `2px solid ${accentColor}`, paddingBottom: '10px', marginBottom: '20px' }}>Skills</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {(skills || '').split(/[.,\n]/).map((s, i) => s.trim() && (
                                    <span key={i} style={{ background: '#F9FAFB', padding: '5px 10px', borderRadius: '4px', fontSize: '0.85em', fontFamily: "'Inter', sans-serif" }}>{s.trim()}</span>
                                ))}
                            </div>
                        </section>
                    </div>
                    <div>
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: `2px solid ${accentColor}`, paddingBottom: '10px', marginBottom: '20px' }}>Experience</h3>
                            {experience.map((exp, i) => (
                                <div key={i} style={{ marginBottom: '30px' }}>
                                    <h4 style={{ fontSize: '1.1em', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{exp.company}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666', fontSize: '0.9em', fontFamily: "'Inter', sans-serif" }}>
                                        <span>{exp.position}</span>
                                        <span>{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p style={{ lineHeight: 1.7, fontSize: '0.95em', fontFamily: "'Inter', sans-serif" }}>{exp.description}</p>
                                </div>
                            ))}
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: `2px solid ${accentColor}`, paddingBottom: '10px', marginBottom: '20px' }}>Education</h3>
                            {education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '20px' }}>
                                    <h4 style={{ fontSize: '1em', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{edu.school}</h4>
                                    <div style={{ fontSize: '0.9em', color: '#666', fontFamily: "'Inter', sans-serif" }}>{edu.degree} • {edu.year}</div>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            </div>
        );
    };

    const LayoutZenith = () => {
        return (
            <div style={{ background: 'white', minHeight: '1123px', padding: '60px', fontFamily: "'Inter', sans-serif", color: '#1F2937' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E5E7EB', paddingBottom: '40px', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '3em', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1, marginBottom: '10px', textTransform: 'uppercase', color: '#111827' }}>{personalDetails.fullName || 'YOUR NAME'}</h1>
                        <p style={{ fontSize: '1.1em', letterSpacing: '3px', textTransform: 'uppercase', color: accentColor, fontWeight: 600 }}>{personalDetails.jobTitle}</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.9em', color: '#6B7280', lineHeight: 1.6 }}>
                        <div>{personalDetails.email}</div>
                        <div>{personalDetails.phone}</div>
                        <div>{personalDetails.location}</div>
                        <div>{personalDetails.website}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px' }}>
                    <div>
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '0.9em', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '20px', height: '2px', background: accentColor }}></span> Education
                            </h3>
                            {education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '20px' }}>
                                    <div style={{ fontWeight: 600 }}>{edu.school}</div>
                                    <div style={{ fontSize: '0.9em', color: '#6B7280' }}>{edu.degree}</div>
                                    <div style={{ fontSize: '0.85em', color: '#9CA3AF' }}>{edu.year}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '0.9em', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '20px', height: '2px', background: accentColor }}></span> Skills
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(skills || '').split(/[.,\n]/).map((s, i) => s.trim() && (
                                    <span key={i} style={{ fontSize: '0.9em', color: '#4B5563' }}>• {s.trim()}</span>
                                ))}
                            </div>
                        </div>
                        {summary && (
                            <div style={{ marginBottom: '40px' }}>
                                <h3 style={{ fontSize: '0.9em', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ width: '20px', height: '2px', background: accentColor }}></span> About
                                </h3>
                                <p style={{ fontSize: '0.9em', lineHeight: 1.7, color: '#4B5563' }}>{summary}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 style={{ fontSize: '0.9em', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '20px', height: '2px', background: accentColor }}></span> Experience
                        </h3>
                        {experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: '100px 1fr', gap: '20px' }}>
                                <div style={{ fontSize: '0.85em', fontWeight: 600, color: '#111827' }}>{exp.startDate}<br /><span style={{ color: '#9CA3AF', fontWeight: 400 }}>{exp.endDate}</span></div>
                                <div>
                                    <h4 style={{ fontSize: '1.2em', fontWeight: 700, marginBottom: '5px' }}>{exp.company}</h4>
                                    <div style={{ fontSize: '0.95em', color: accentColor, marginBottom: '10px', fontStyle: 'italic' }}>{exp.position}</div>
                                    <p style={{ fontSize: '0.95em', lineHeight: 1.6, color: '#4B5563' }}>{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const LayoutApex = () => {
        return (
            <div style={{ background: 'white', minHeight: '1123px', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ background: '#111827', color: 'white', padding: '50px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', background: accentColor, clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            {personalDetails.photoUrl && (
                                <img src={personalDetails.photoUrl} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: `4px solid white`, marginBottom: '20px' }} />
                            )}
                            <h1 style={{ fontSize: '3.5em', fontWeight: 800, lineHeight: 1, marginBottom: '10px', color: 'white' }}>{personalDetails.fullName || 'YOUR NAME'}</h1>
                            <p style={{ fontSize: '1.2em', opacity: 0.9, letterSpacing: '1px', color: 'white' }}>{personalDetails.jobTitle || 'Software Architect'}</p>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.9em', lineHeight: 1.8 }}>
                            <div>{personalDetails.email}</div>
                            <div>{personalDetails.phone}</div>
                            <div>{personalDetails.location}</div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '60px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '50px' }}>
                    <div>
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.1em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', borderLeft: `5px solid ${accentColor}`, paddingLeft: '15px' }}>About Me</h3>
                            <p style={{ lineHeight: 1.7, color: '#4B5563' }}>{summary}</p>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.1em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', borderLeft: `5px solid ${accentColor}`, paddingLeft: '15px' }}>Skills</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {(skills || '').split(/[.,\n]/).map((s, i) => s.trim() && (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '100%', background: '#F3F4F6', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.random() * 40 + 60}%`, background: accentColor, height: '100%' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.9em', fontWeight: 600, minWidth: '100px' }}>{s.trim()}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div>
                        <section style={{ marginBottom: '50px' }}>
                            <h3 style={{ fontSize: '1.1em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '30px', borderLeft: `5px solid ${accentColor}`, paddingLeft: '15px' }}>Work Experience</h3>
                            {experience.map((exp, i) => (
                                <div key={i} style={{ marginBottom: '35px', paddingLeft: '20px', borderLeft: '1px solid #E5E7EB', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '9px', height: '9px', borderRadius: '50%', background: accentColor }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                                        <h4 style={{ fontSize: '1.2em', fontWeight: 700 }}>{exp.company}</h4>
                                        <span style={{ fontSize: '0.9em', fontWeight: 600, color: '#6B7280' }}>{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <div style={{ color: accentColor, fontWeight: 600, marginBottom: '10px' }}>{exp.position}</div>
                                    <p style={{ lineHeight: 1.6, color: '#4B5563' }}>{exp.description}</p>
                                </div>
                            ))}
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.1em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '30px', borderLeft: `5px solid ${accentColor}`, paddingLeft: '15px' }}>Education</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {education.map((edu, i) => (
                                    <div key={i} style={{ background: '#F9FAFB', padding: '20px', borderRadius: '8px', borderTop: `3px solid ${accentColor}` }}>
                                        <h4 style={{ fontWeight: 700 }}>{edu.school}</h4>
                                        <div style={{ fontSize: '0.9em', color: '#6B7280', marginTop: '5px' }}>{edu.degree}</div>
                                        <div style={{ fontSize: '0.8em', color: '#9CA3AF', marginTop: '5px' }}>{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    };

    const LayoutHorizon = () => {
        return (
            <div style={{ display: 'flex', minHeight: '1123px', fontFamily: "'Oswald', sans-serif" }}>
                <div style={{ width: '80px', background: accentColor, flexShrink: 0 }}></div>
                <div style={{ flex: 1, padding: '60px', background: 'white' }}>
                    <div style={{ borderBottom: '4px solid #111827', paddingBottom: '30px', marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 style={{ fontSize: '4.5em', fontWeight: 700, lineHeight: 1, color: '#111827', textTransform: 'uppercase' }}>
                                {personalDetails.fullName?.split(' ')[0] || 'YOUR'}<br />
                                <span style={{ color: accentColor }}>{personalDetails.fullName?.split(' ')[1] || 'NAME'}</span>
                            </h1>
                        </div>
                        <div style={{ textAlign: 'right', paddingBottom: '10px' }}>
                            <p style={{ fontSize: '1.5em', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase' }}>{personalDetails.jobTitle}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px' }}>
                        <div>
                            <section style={{ marginBottom: '50px' }}>
                                <h3 style={{ fontSize: '1.5em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '20px', color: '#111827' }}>Contact</h3>
                                <div style={{ fontSize: '1.1em', fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}>
                                    <div>{personalDetails.email}</div>
                                    <div>{personalDetails.phone}</div>
                                    <div>{personalDetails.location}</div>
                                </div>
                            </section>
                            <section style={{ marginBottom: '50px' }}>
                                <h3 style={{ fontSize: '1.5em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '20px', color: '#111827' }}>Education</h3>
                                {education.map((edu, i) => (
                                    <div key={i} style={{ marginBottom: '20px' }}>
                                        <h4 style={{ fontSize: '1.2em' }}>{edu.school}</h4>
                                        <div style={{ fontFamily: "'Inter', sans-serif", color: '#666' }}>{edu.degree}</div>
                                        <div style={{ fontFamily: "'Inter', sans-serif", color: '#999', fontSize: '0.9em' }}>{edu.year}</div>
                                    </div>
                                ))}
                            </section>
                            <section>
                                <h3 style={{ fontSize: '1.5em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '20px', color: '#111827' }}>Expertise</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {(skills || '').split(/[.,\n]/).map((s, i) => s.trim() && (
                                        <span key={i} style={{ background: '#111827', color: 'white', padding: '8px 15px', fontSize: '0.9em', fontFamily: "'Inter', sans-serif", letterSpacing: '1px' }}>{s.trim()}</span>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div>
                            <section>
                                <h3 style={{ fontSize: '1.5em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '30px', color: '#111827' }}>Professional Experience</h3>
                                {experience.map((exp, i) => (
                                    <div key={i} style={{ marginBottom: '40px' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '10px' }}>
                                            <h4 style={{ fontSize: '1.3em', fontWeight: 600 }}>{exp.company}</h4>
                                            <span style={{ background: accentColor, color: 'white', padding: '2px 8px', fontSize: '0.8em', fontFamily: "'Inter', sans-serif" }}>{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <div style={{ fontSize: '1.1em', color: '#555', marginBottom: '15px' }}>{exp.position}</div>
                                        <p style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.6, color: '#444' }}>{exp.description}</p>
                                    </div>
                                ))}
                            </section>
                            {summary && (
                                <section style={{ marginTop: '50px', padding: '30px', background: '#F3F4F6', borderLeft: `5px solid ${accentColor}` }}>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.1em', fontStyle: 'italic', lineHeight: 1.6 }}>"{summary}"</p>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const LayoutSplitVertical = () => {
        const sidebarBg = customBgColor || styles.sidebarBg || '#1E293B';
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', minHeight: '1123px', background: 'white', overflow: 'hidden' }}>
                <div style={{ background: sidebarBg, color: 'white', padding: '80px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '1123px', position: 'sticky', top: 0, flexShrink: 0 }}>
                    <h1 style={{ fontSize: '4em', fontWeight: 900, lineHeight: 1, marginBottom: '20px', color: 'white' }}>{personalDetails.fullName || 'YOUR NAME'}</h1>
                    <p style={{ fontSize: '1.2em', color: accentColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '40px' }}>{personalDetails.jobTitle || 'Architect'}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', opacity: 0.8 }}>
                        <div>{personalDetails.email}</div>
                        <div>{personalDetails.phone}</div>
                        <div>{personalDetails.address}</div>
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {(skills || '').split(/[.,\n]/).map((s, i) => s.trim() && (
                                <span key={i} style={{ border: `1px solid ${accentColor}`, color: accentColor, padding: '4px 12px', borderRadius: '20px', fontSize: '0.8em' }}>{s.trim()}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ padding: '80px 60px', overflowY: 'auto', overflowX: 'hidden', height: '100%' }}>
                    <section style={{ marginBottom: '60px' }}>
                        <h3 style={{ fontSize: '1.5em', fontWeight: 800, marginBottom: '40px', color: '#1E293B', borderBottom: `4px solid ${accentColor}`, display: 'inline-block' }}>Experience</h3>
                        {experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '40px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <h4 style={{ fontSize: '1.2em', fontWeight: 700, color: '#1E293B' }}>{exp.company}</h4>
                                    <span style={{ color: '#64748B' }}>{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <div style={{ color: accentColor, fontWeight: 600, marginBottom: '15px' }}>{exp.position}</div>
                                <p style={{ color: '#334155', lineHeight: 1.8 }}>{exp.description}</p>
                            </div>
                        ))}
                    </section>
                    <section>
                        <h3 style={{ fontSize: '1.5em', fontWeight: 800, marginBottom: '40px', color: '#1E293B', borderBottom: `4px solid ${accentColor}`, display: 'inline-block' }}>Education</h3>
                        {education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '20px' }}>
                                <h4 style={{ fontWeight: 700 }}>{edu.school}</h4>
                                <div>{edu.degree}</div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        );
    };

    const LayoutBlockModern = () => (
        <div style={{ background: '#f8fafc', minHeight: '1123px', padding: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: accentColor, color: 'white', padding: '40px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h1 style={{ fontSize: '3em', fontWeight: 900, lineHeight: 1 }}>{personalDetails.fullName || 'YOUR NAME'}</h1>
                    <p style={{ fontSize: '1.2em', opacity: 0.9, marginTop: '10px' }}>{personalDetails.jobTitle || 'Creative Designer'}</p>
                </div>
                <div style={{ background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontWeight: 800, marginBottom: '15px' }}>CONTACT</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: '#64748b' }}>
                        <div>{personalDetails.email}</div>
                        <div>{personalDetails.phone}</div>
                        <div>{personalDetails.location}</div>
                    </div>
                </div>
            </div>
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 800, color: accentColor, marginBottom: '20px', letterSpacing: '2px' }}>EXPERIENCE</h3>
                {experience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '30px', borderLeft: `4px solid ${accentColor}20`, paddingLeft: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span>{exp.company}</span>
                            <span style={{ color: '#94a3b8' }}>{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <div style={{ color: accentColor, fontSize: '0.9em' }}>{exp.position}</div>
                        <p style={{ marginTop: '10px', fontSize: '0.95em', color: '#475569' }}>{exp.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const LayoutNewspaper = () => {
        const paperBg = customBgColor || '#fcfaf2';
        return (
            <div style={{ background: paperBg, color: '#1a1a1a', minHeight: '1123px', padding: '40px', border: '1px solid #ddd' }}>
                <div style={{ textAlign: 'center', borderBottom: '4px double #1a1a1a', paddingBottom: '20px', marginBottom: '30px' }}>
                    <div style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>ESTABLISHED 2024 // VOL. LXX</div>
                    <h1 style={{ fontSize: '4.5em', fontWeight: 900, fontFamily: "'Crimson Pro', serif", lineHeight: 1, letterSpacing: '-1px' }}>{personalDetails.fullName || 'THE GAZETTE'}</h1>
                    <div style={{ borderTop: '1px solid #1a1a1a', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', fontWeight: 700 }}>
                        <span>RESUMATE EDITION</span>
                        <span>{personalDetails.email}</span>
                        <span>WORLD NEWS</span>
                    </div>
                </div>
                <div style={{ columnCount: 3, columnGap: '30px', columnRule: '1px solid #eee' }}>
                    <div style={{ breakInside: 'avoid', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.5em', fontWeight: 900, borderBottom: '2px solid #1a1a1a', marginBottom: '10px' }}>LATEST EXPERIENCE</h3>
                        {(experience || []).map((exp, i) => (
                            <div key={i} style={{ marginBottom: '15px' }}>
                                <h4 style={{ fontWeight: 800 }}>{exp.company}</h4>
                                <p style={{ fontSize: '0.85em', fontStyle: 'italic' }}>{exp.position}</p>
                                <p style={{ fontSize: '0.85em', marginTop: '5px' }}>{exp.description?.substring(0, 150)}...</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ breakInside: 'avoid' }}>
                        <h3 style={{ fontSize: '1.5em', fontWeight: 900, borderBottom: '2px solid #1a1a1a', marginBottom: '10px' }}>KEY SKILLS</h3>
                        <ul style={{ paddingLeft: '15px', marginBottom: '30px' }}>
                            {(skills || '').split(/[.,\n]/).map((s, i) => s.trim() && <li key={i} style={{ fontSize: '0.9em', marginBottom: '5px' }}>{s.trim()}</li>)}
                        </ul>

                        <h3 style={{ fontSize: '1.5em', fontWeight: 900, borderBottom: '2px solid #1a1a1a', marginBottom: '10px' }}>EDUCATION</h3>
                        {education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '15px' }}>
                                <h4 style={{ fontWeight: 800 }}>{edu.school}</h4>
                                <div style={{ fontSize: '0.85em' }}>{edu.degree}, {edu.year}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const LayoutBauhaus = () => (
        <div style={{ background: 'white', minHeight: '1123px', padding: '60px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100px', background: '#E63946' }}></div>
            <div style={{ position: 'absolute', bottom: '100px', right: 0, width: '200px', height: '40px', background: '#1D3557' }}></div>
            <div style={{ position: 'absolute', top: '200px', right: '40px', width: '60px', height: '60px', borderRadius: '50%', background: '#FFB703' }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <h1 style={{ fontSize: '6em', fontWeight: 900, color: '#1D3557', lineHeight: 0.8, marginBottom: '60px' }}>
                    {personalDetails.fullName?.split(' ')[0]}<br />
                    <span style={{ color: '#E63946' }}>{personalDetails.fullName?.split(' ')[1]}</span>
                </h1>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '40px' }}>
                    <div style={{ fontSize: '1.2em', fontWeight: 900, transform: 'rotate(-90deg)', transformOrigin: 'top right', width: '200px', height: '150px', textAlign: 'right', translate: '-150px 0' }}>INFO_DATA</div>
                    <div>
                        <section style={{ marginBottom: '60px' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
                                <div style={{ height: '4px', flex: 1, background: '#1D3557' }}></div>
                                <h3 style={{ fontSize: '2em', fontWeight: 700 }}>EXPERIENCE</h3>
                            </div>
                            {experience.map((exp, i) => (
                                <div key={i} style={{ marginBottom: '30px', background: i === 0 ? '#f1f1f1' : 'transparent', padding: i === 0 ? '20px' : '0' }}>
                                    <div style={{ fontWeight: 900, fontSize: '1.2em' }}>{exp.company}</div>
                                    <div style={{ color: '#E63946', fontWeight: 700 }}>{exp.position}</div>
                                    <p style={{ marginTop: '10px', fontSize: '0.9em' }}>{exp.description}</p>
                                </div>
                            ))}
                        </section>

                        <section>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
                                <div style={{ height: '4px', flex: 1, background: '#FFB703' }}></div>
                                <h3 style={{ fontSize: '2em', fontWeight: 700 }}>EDUCATION</h3>
                            </div>
                            {education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '30px' }}>
                                    <div style={{ fontWeight: 900, fontSize: '1.2em' }}>{edu.school}</div>
                                    <div style={{ color: '#E63946', fontWeight: 700 }}>{edu.degree}</div>
                                    <div style={{ fontSize: '0.9em' }}>{edu.year}</div>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );

    const LayoutRetro = () => (
        <div style={{ background: '#000', color: '#00FF41', minHeight: '1123px', padding: '40px', fontFamily: "'JetBrains Mono', monospace", border: '2px solid #00FF41' }}>
            <div style={{ textAlign: 'center', color: '#00FF41', marginBottom: '40px' }}>
                <pre style={{ fontSize: '0.5em', lineHeight: 1 }}>{`
██████╗ ███████╗███████╗██╗   ██╗███╗   ███╗███████╗
██╔══██╗██╔════╝██╔════╝██║   ██║████╗ ████║██╔════╝
██████╔╝█████╗  ███████╗██║   ██║██╔████╔██║█████╗  
██╔══██╗██╔══╝  ╚════██║██║   ██║██║╚██╔╝██║██╔══╝  
██║  ██║███████╗███████║╚██████╔╝██║ ╚═╝ ██║███████╗
╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝`}</pre>
                <h1 style={{ fontSize: '2em', fontWeight: 700, margin: '20px 0' }}>[[ {personalDetails.fullName} ]]</h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                <div style={{ border: '1px solid #00FF41', padding: '20px' }}>
                    <div style={{ background: '#00FF41', color: '#000', padding: '2px 10px', display: 'inline-block', fontWeight: 700, marginBottom: '20px' }}>{'>'} EXEC_HISTORY</div>
                    {experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 700 }}>ST_DATE: {exp.startDate} | END_DATE: {exp.endDate}</div>
                            <div style={{ fontWeight: 700 }}>ORG: {exp.company}</div>
                            <div style={{ color: '#00FF4180' }}>POS: {exp.position}</div>
                            <p style={{ marginTop: '5px' }}>{exp.description}</p>
                        </div>
                    ))}
                </div>

                <div style={{ border: '1px solid #00FF41', padding: '20px', marginTop: '20px' }}>
                    <div style={{ background: '#00FF41', color: '#000', padding: '2px 10px', display: 'inline-block', fontWeight: 700, marginBottom: '20px' }}>{'>'} EDUCATION_LOG</div>
                    {education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '15px' }}>
                            <div>{edu.school}</div>
                            <div style={{ opacity: 0.8 }}>{edu.degree} [{edu.year}]</div>
                        </div>
                    ))}
                </div>

                <div style={{ border: '1px solid #00FF41', padding: '20px', marginTop: '20px' }}>
                    <div style={{ background: '#00FF41', color: '#000', padding: '2px 10px', display: 'inline-block', fontWeight: 700, marginBottom: '20px' }}>{'>'} SKILL_SET</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {skills && skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                            <span key={i}>[{s.trim()}]</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const LayoutSwiss = () => (
        <div style={{ background: '#fff', color: '#000', minHeight: '1123px', padding: '80px', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: '8em', fontWeight: 900, letterSpacing: '-6px', lineHeight: 0.8, marginBottom: '80px' }}>
                {personalDetails.fullName?.split(' ')[0]}<br />
                {personalDetails.fullName?.split(' ')[1]}
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '60px', borderTop: '10px solid #000', paddingTop: '40px' }}>
                <div style={{ fontSize: '1.5em', fontWeight: 700, lineHeight: 1.2 }}>
                    {personalDetails.email}<br />
                    {personalDetails.phone}<br />
                    RESUMATE_PROFILE_2024
                </div>
                <div>
                    <section style={{ marginBottom: '80px' }}>
                        <h3 style={{ fontSize: '1.2em', fontWeight: 900, textTransform: 'uppercase', marginBottom: '40px' }}>Experience</h3>
                        {experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '40px' }}>
                                <div style={{ fontSize: '2em', fontWeight: 900 }}>{exp.company}</div>
                                <div style={{ fontSize: '1.2em', fontWeight: 400 }}>{exp.position} / {exp.startDate}</div>
                                <p style={{ marginTop: '20px', color: '#666', fontSize: '1.1em', lineHeight: 1.6 }}>{exp.description}</p>
                            </div>
                        ))}
                    </section>

                    <section style={{ marginBottom: '80px' }}>
                        <h3 style={{ fontSize: '1.2em', fontWeight: 900, textTransform: 'uppercase', marginBottom: '40px' }}>Education</h3>
                        {education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '40px' }}>
                                <div style={{ fontSize: '2em', fontWeight: 900 }}>{edu.school}</div>
                                <div style={{ fontSize: '1.2em', fontWeight: 400 }}>{edu.degree} / {edu.year}</div>
                            </div>
                        ))}
                    </section>

                    <section>
                        <h3 style={{ fontSize: '1.2em', fontWeight: 900, textTransform: 'uppercase', marginBottom: '40px' }}>Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            {skills && skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                                <span key={i} style={{ fontSize: '1.1em', borderBottom: '2px solid #000' }}>{s.trim()}</span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );

    const LayoutIndustrial = () => (
        <div style={{ background: '#2D2D2D', color: '#E0E0E0', minHeight: '1123px', padding: '40px', border: '2px solid #444' }}>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ width: '120px', height: '120px', background: '#444', border: '5px solid #666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3em', fontWeight: 900 }}>M</div>
                <div>
                    <h1 style={{ fontSize: '4em', fontWeight: 900, color: 'white', letterSpacing: '2px' }}>{personalDetails.fullName}</h1>
                    <div style={{ height: '5px', background: accentColor, width: '200px', marginTop: '10px' }}></div>
                </div>
            </div>
            <div style={{ background: '#1A1A1A', padding: '30px', borderLeft: `8px solid ${accentColor}` }}>
                <h3 style={{ fontSize: '1.5em', fontWeight: 800, marginBottom: '20px', color: accentColor }}>SYSTEM_EXPERIENCE</h3>
                {experience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4 style={{ fontSize: '1.2em', fontWeight: 700 }}>{exp.company}</h4>
                            <span style={{ opacity: 0.5 }}>{exp.startDate}</span>
                        </div>
                        <p style={{ marginTop: '10px' }}>{exp.description}</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', background: '#1A1A1A', padding: '30px', borderLeft: `8px solid ${accentColor}` }}>
                <h3 style={{ fontSize: '1.5em', fontWeight: 800, marginBottom: '20px', color: accentColor }}>SYSTEM_EDUCATION</h3>
                {education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4 style={{ fontSize: '1.2em', fontWeight: 700 }}>{edu.school}</h4>
                            <span style={{ opacity: 0.5 }}>{edu.year}</span>
                        </div>
                        <p style={{ marginTop: '5px', opacity: 0.8 }}>{edu.degree}</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', background: '#1A1A1A', padding: '30px', borderLeft: `8px solid ${accentColor}` }}>
                <h3 style={{ fontSize: '1.5em', fontWeight: 800, marginBottom: '20px', color: accentColor }}>SYSTEM_SKILLS</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {skills && skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                        <span key={i} style={{ background: '#333', padding: '5px 10px', fontSize: '0.9em' }}>{s.trim()}</span>
                    ))}
                </div>
            </div>
        </div>
    );

    const LayoutManifesto = () => (
        <div style={{ background: 'white', color: 'black', minHeight: '1123px', padding: '60px', textAlign: 'justify' }}>
            <h1 style={{ fontSize: '5em', fontWeight: 900, textAlign: 'left', marginBottom: '40px', borderBottom: '20px solid black' }}>{personalDetails.fullName}</h1>
            <div style={{ fontSize: '2em', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginBottom: '40px' }}>
                I AM A SOFTWARE ARCHITECT. I BUILD SYSTEMS. I SOLVE PROBLEMS. I CREATE VALUE.
            </div>
            <section>
                {experience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '1.5em', fontWeight: 900, background: 'black', color: 'white', padding: '5px 10px', display: 'inline-block', marginBottom: '10px' }}>{exp.company}</h3>
                        <p style={{ fontSize: '1.2em', lineHeight: 1.4 }}>{exp.description}</p>
                    </div>
                ))}
            </section>

            <section style={{ marginTop: '60px', borderTop: '20px solid black', paddingTop: '40px' }}>
                {education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '1.5em', fontWeight: 900, background: 'black', color: 'white', padding: '5px 10px', display: 'inline-block', marginBottom: '10px' }}>{edu.school}</h3>
                        <p style={{ fontSize: '1.2em', fontWeight: 700 }}>{edu.degree} // {edu.year}</p>
                    </div>
                ))}
            </section>

            <section style={{ marginTop: '60px' }}>
                <h3 style={{ fontSize: '2em', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>CAPABILITIES</h3>
                <div style={{ fontSize: '1.3em', fontWeight: 700, lineHeight: 1.6 }}>
                    {skills && skills.split(/[.,\n]/).map((s, i) => s.trim()).join('  ●  ')}
                </div>
            </section>
        </div>
    );

    const LayoutOrganic = () => (
        <div style={{ background: '#F0FFF4', color: '#2D3748', minHeight: '1123px', padding: '60px', borderRadius: '40px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '30px 30px 100px 30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '4em', fontWeight: 800, color: '#276749' }}>{personalDetails.fullName}</h1>
                <p style={{ fontSize: '1.5em', color: '#38A169' }}>Environmental Designer</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                {experience.map((exp, i) => (
                    <div key={i} style={{ background: 'white', padding: '30px', borderRadius: '30px', border: '1px solid #C6F6D5' }}>
                        <h4 style={{ fontSize: '1.2em', fontWeight: 700, color: '#276749' }}>{exp.company}</h4>
                        <p style={{ fontSize: '0.9em', lineHeight: 1.6 }}>{exp.description}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '40px' }}>
                <div style={{ background: 'white', padding: '30px', borderRadius: '30px', border: '1px solid #C6F6D5' }}>
                    <h4 style={{ fontSize: '1.2em', fontWeight: 700, color: '#276749', marginBottom: '20px' }}>Education</h4>
                    {education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ fontWeight: 700 }}>{edu.school}</div>
                            <div style={{ color: '#38A169' }}>{edu.degree}</div>
                            <div style={{ fontSize: '0.9em', color: '#718096' }}>{edu.year}</div>
                        </div>
                    ))}
                </div>

                <div style={{ background: 'white', padding: '30px', borderRadius: '30px', border: '1px solid #C6F6D5' }}>
                    <h4 style={{ fontSize: '1.2em', fontWeight: 700, color: '#276749', marginBottom: '20px' }}>Skills</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {skills && skills.split(/[.,\n]/).map((s, i) => s.trim() && (
                            <span key={i} style={{ background: '#F0FFF4', color: '#276749', padding: '5px 12px', borderRadius: '20px', border: '1px solid #9AE6B4' }}>{s.trim()}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Multi-Page Pagination Engine ---
    const [pagesCount, setPagesCount] = useState(1);
    const scoutRef = useRef(null);

    // Measure height and update page count
    useEffect(() => {
        const updateHeight = () => {
            if (scoutRef.current) {
                const height = scoutRef.current.offsetHeight;
                const needed = Math.ceil(height / 1123);
                if (needed !== pagesCount) {
                    setPagesCount(Math.max(1, needed));
                }
            }
        };

        // Initial measurement
        updateHeight();

        // Re-measure when data changes
        const timer = setTimeout(updateHeight, 300);
        return () => clearTimeout(timer);
    }, [data, pagesCount]);

    const renderSelectedLayout = () => (
        <>
            {styles.layout === 'sidebar' || styles.layout === 'sidebar-big' ? <LayoutSidebar /> :
                styles.layout === 'modern' ? <LayoutModern /> :
                    styles.layout === 'grid' ? <LayoutGrid /> :
                        styles.layout === 'minimal' ? <LayoutMinimal /> :
                            styles.layout === 'block-modern' ? <LayoutBlockModern /> :
                                styles.layout === 'cyber' ? <LayoutCyber /> :
                                    styles.layout === 'magazine' ? <LayoutMagazine /> :
                                        styles.layout === 'timeline' ? <LayoutTimeline /> :
                                            styles.layout === 'cards' ? <LayoutCards /> :
                                                styles.layout === 'brutalist' ? <LayoutBrutalist /> :
                                                    styles.layout === 'split-vertical' ? <LayoutSplitVertical /> :
                                                        styles.layout === 'newspaper' ? <LayoutNewspaper /> :
                                                            styles.layout === 'bauhaus' ? <LayoutBauhaus /> :
                                                                styles.layout === 'retro' ? <LayoutRetro /> :
                                                                    styles.layout === 'swiss' ? <LayoutSwiss /> :
                                                                        styles.layout === 'industrial' ? <LayoutIndustrial /> :
                                                                            styles.layout === 'manifesto' ? <LayoutManifesto /> :
                                                                                styles.layout === 'organic' ? <LayoutOrganic /> :
                                                                                    styles.layout === 'modern-silk' ? <LayoutModernSilk /> :
                                                                                        styles.layout === 'zenith-minimal' ? <LayoutZenith /> :
                                                                                            styles.layout === 'apex-plain' ? <LayoutApex /> :
                                                                                                styles.layout === 'horizon-sidebar' ? <LayoutHorizon /> :
                                                                                                    <LayoutClassic />}
        </>
    );

    return (
        <div id="resume-preview-outer-wrapper" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f1f5f9', minHeight: '100%', padding: '40px 0' }}>

            {/* 1. Hidden Scout for Height Measurement */}
            <div
                ref={scoutRef}
                style={{
                    position: 'absolute',
                    top: '-10000px',
                    left: '-10000px',
                    width: '794px',
                    height: 'auto',
                    visibility: 'hidden',
                    pointerEvents: 'none'
                }}
            >
                {renderSelectedLayout()}
            </div>

            {/* 2. Global Page Break Styles */}
            <style>{`
                section, .section, .experience-item, .education-item, tr, p, h1, h2, h3, h4, .career-header {
                    break-inside: avoid !important;
                    page-break-inside: avoid !important;
                }
                @media print {
                    #resume-preview-outer-wrapper { background: white !important; padding: 0 !important; }
                    .resume-visual-page { margin-bottom: 0 !important; box-shadow: none !important; break-after: page !important; }
                }
            `}</style>

            {/* 3. Visible Pages */}
            {Array.from({ length: pagesCount }).map((_, index) => (
                <div
                    key={index}
                    className="resume-visual-page"
                    style={{
                        width: '794px',
                        height: '1123px',
                        background: 'white',
                        marginBottom: '30px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    <div
                        style={{
                            transform: `translateY(-${index * 1123}px)`,
                            width: '100%',
                            height: 'auto',
                            fontFamily: data?.customFontFamily || styles.fontFamily,
                            color: '#374151',
                            fontSize: data?.customFontSize ? `${data.customFontSize}px` : '14px',
                            borderTop: (index === 0 && !['modern', 'modern-silk', 'zenith-minimal', 'apex-plain', 'horizon-sidebar', 'cyber', 'magazine', 'bauhaus', 'swiss', 'industrial', 'manifesto', 'organic', 'newspaper'].includes(styles.layout)) ? `8px solid ${accentColor}` : 'none',
                        }}
                    >
                        {renderSelectedLayout()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TemplatePreview;
