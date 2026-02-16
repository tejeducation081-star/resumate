import React, { useState, useEffect } from 'react';
import useResumeStore from '../store/resumeStore';
import { API_ENDPOINTS } from '../config/api';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import TemplatePreview from './TemplatePreview';
import { templates, fontOptions } from '../templates/config';
import { calculateATSScore } from '../utils/atsAnalyzer';
import ErrorBoundary from './ErrorBoundary';

const ResumeForm = ({ setView }) => {
  const { currentResume, saveResume } = useResumeStore();
  const [step, setStep] = useState(1);
  const [showAts, setShowAts] = useState(false);
  const defaultState = {
    personalDetails: { fullName: '', email: '', phone: '', location: '', website: '', jobTitle: '', photoUrl: '' },
    summary: '',
    experience: [],
    education: [],
    skills: '',
    templateId: templates?.[0]?.id || 'elegant-pink-modern',
    customFontFamily: '',
    customFontSize: 14
  };

  const [formData, setFormData] = useState(currentResume ? { ...defaultState, ...currentResume } : defaultState);

  // Dynamic Font Loader
  useEffect(() => {
    if (formData.customFontFamily) {
      try {
        const fontName = formData.customFontFamily.split(',')[0].replace(/['"]/g, '').trim();
        const linkId = `font-${fontName.replace(/\s+/g, '-')}`;

        if (!document.getElementById(linkId)) {
          const link = document.createElement('link');
          link.id = linkId;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
          document.head.appendChild(link);
        }
      } catch (e) {
        console.error("Failed to load font:", e);
      }
    }
  }, [formData.customFontFamily]);

  const handleSave = async () => {
    try {
      await saveResume(formData);
      setView('dashboard');
    } catch (err) {
      alert("Save Failed: " + (err.message || 'Unknown error'));
    }
  };

  const updatePersonal = (field, value) => {
    setFormData({ ...formData, personalDetails: { ...formData.personalDetails, [field]: value } });
  };

  const addExperience = () => {
    setFormData({ ...formData, experience: [...formData.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }] });
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...formData.experience];
    newExp[index][field] = value;
    setFormData({ ...formData, experience: newExp });
  };

  const removeExperience = (index) => {
    const newExp = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: newExp });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
        method: 'POST',
        body: data,
      });
      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      updatePersonal('photoUrl', result.imageUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <div className="resume-editor" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      maxWidth: '100%',
      margin: '0 auto',
      height: 'calc(100vh - 100px)',
      marginTop: '20px',
      padding: '0 20px',
      position: 'relative' /* For absolute positioning of ATS button */
    }}>

      {/* 1. Left Column: Form */}
      <div style={{ padding: '0 0 2rem 0', overflowY: 'auto', background: 'white', borderRadius: '16px', border: '1px solid var(--border)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem' }}>
          <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setView('dashboard')}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--fg)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface)'}
              >
                <ArrowLeft size={18} />
              </button>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--fg)' }}>Editor</h2>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>STEP {step}/5</span>
          </header>

          {step === 1 && (
            <div className="step-content">
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Full Name</label>
                  <input value={formData.personalDetails.fullName} onChange={e => updatePersonal('fullName', e.target.value)} />
                </div>
                <div style={{ position: 'relative' }}>
                  <input type="file" id="photo-upload" hidden onChange={handlePhotoUpload} accept="image/*" />
                  <label htmlFor="photo-upload" style={{
                    width: '80px',
                    height: '80px',
                    border: '2px dashed var(--border)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    background: formData.personalDetails.photoUrl ? 'none' : 'var(--surface)',
                    transition: 'all 0.2s ease'
                  }}>
                    {formData.personalDetails.photoUrl ? (
                      <img src={formData.personalDetails.photoUrl} alt="Vibe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <ImageIcon size={20} color="var(--muted)" />
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, marginTop: '4px', color: 'var(--muted)' }}>PHOTO</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <label>Job Title</label>
                  <input value={formData.personalDetails.jobTitle || ''} onChange={e => updatePersonal('jobTitle', e.target.value)} placeholder="e.g. Product Designer" />
                </div>
                <div>
                  <label>Location / Address</label>
                  <input value={formData.personalDetails.location || ''} onChange={e => updatePersonal('location', e.target.value)} placeholder="e.g. San Francisco, CA" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <label>Email Address</label>
                  <input value={formData.personalDetails.email} onChange={e => updatePersonal('email', e.target.value)} />
                </div>
                <div>
                  <label>Contact Number</label>
                  <input value={formData.personalDetails.phone} onChange={e => updatePersonal('phone', e.target.value)} />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label>Website / Portfolio</label>
                <input value={formData.personalDetails.website || ''} onChange={e => updatePersonal('website', e.target.value)} placeholder="e.g. www.portfolio.com" />
              </div>

              <label>Professional Summary</label>
              <textarea rows="6" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })}></textarea>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Work Experience</h3>
                <button onClick={addExperience} style={{ background: 'none', border: 'none', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Plus size={14} /> Add Experience
                </button>
              </div>
              {formData.experience.map((exp, i) => (
                <div key={i} style={{ padding: '2rem', border: '1px solid var(--border)', marginBottom: '2rem', position: 'relative' }}>
                  <button onClick={() => removeExperience(i)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <label>Company / Organization</label>
                      <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} />
                    </div>
                    <div>
                      <label>Job Title</label>
                      <input value={exp.position} onChange={e => updateExperience(i, 'position', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label>Start Date</label>
                        <input value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} />
                      </div>
                      <div>
                        <label>End Date</label>
                        <input value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label>Description</label>
                      <textarea rows="3" value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)}></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Education</h3>
                <button onClick={() => setFormData({ ...formData, education: [...formData.education, { school: '', degree: '', year: '' }] })} style={{ background: 'none', border: 'none', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Plus size={14} /> Add Education
                </button>
              </div>
              {formData.education.map((edu, i) => (
                <div key={i} style={{ padding: '2rem', border: '1px solid var(--border)', marginBottom: '2rem', position: 'relative' }}>
                  <button onClick={() => setFormData({ ...formData, education: formData.education.filter((_, idx) => idx !== i) })} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <label>School / University</label>
                      <input value={edu.school} onChange={e => {
                        const newEdu = [...formData.education];
                        newEdu[i].school = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                      <div>
                        <label>Degree / Qualification</label>
                        <input value={edu.degree} onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[i].degree = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }} />
                      </div>
                      <div>
                        <label>Year</label>
                        <input value={edu.year} onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[i].year = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="step-content">
              <label>Skills</label>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>Separate distinct skills with a comma or period.</p>
              <textarea rows="12" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="Strategy. Architecture. Creative Direction..."></textarea>
            </div>
          )}

          {step === 5 && (
            <div className="step-content">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Design & Typography</h3>

              <div style={{ marginBottom: '2rem' }}>
                <label>Font Family</label>
                <select
                  value={formData.customFontFamily || ''}
                  onChange={e => setFormData({ ...formData, customFontFamily: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.9rem' }}
                >
                  <option value="">Default Template Font</option>
                  {fontOptions && fontOptions.map((font, i) => (
                    <option key={i} value={font.value}>{font.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label>Font Size Base ({formData.customFontSize || 14}px)</label>
                <input
                  type="range"
                  min="10"
                  max="18"
                  step="0.5"
                  value={formData.customFontSize || 14}
                  onChange={e => setFormData({ ...formData, customFontSize: parseFloat(e.target.value) })}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '5px' }}>
                  <span>Small (10px)</span>
                  <span>Large (18px)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', padding: '2rem', borderTop: '1px solid var(--border)' }}>
          <button style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, color: step === 1 ? 'var(--muted)' : 'var(--fg)', cursor: step === 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {step === 5 && (
              <button className="btn-primary" onClick={handleSave} style={{ background: '#059669' }}>
                Save & Download <Check size={16} />
              </button>
            )}

            {step < 5 ? (
              <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
                {step === 4 ? 'Customize Design' : 'Continue'} <ArrowRight size={16} />
              </button>
            ) : null}
          </div>
        </footer>
      </div>

      {/* 2. Right Column: Preview */}
      <div style={{
        background: 'var(--surface)',
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem 0',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        height: '100%'
      }}>
        <div style={{
          transform: 'scale(0.85)', /* Slightly larger scale for 2-column view */
          transformOrigin: 'top center',
          height: 'fit-content'
        }}>
          <ErrorBoundary>
            <TemplatePreview data={formData} />
          </ErrorBoundary>
        </div>
      </div>

      {/* 3. Floating ATS Button & Panel */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 100 }}>
        {/* Toggle Button */}
        <button
          onClick={() => setShowAts(!showAts)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 0 15px rgba(124, 58, 237, 0.5), 0 10px 25px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {showAts ? <Check size={24} /> : <span style={{ fontSize: '1rem', fontWeight: 800 }}>ATS</span>}
        </button>

        {/* ATS Panel Overlay */}
        {showAts && (
          <div style={{
            position: 'absolute',
            bottom: '80px',
            right: '0',
            width: '350px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            border: '1px solid var(--border)',
            padding: '1.5rem',
            maxHeight: '600px',
            overflowY: 'auto',
            animation: 'fadeInUp 0.3s ease forwards'
          }}>
            {(() => {
              const { score, feedback } = calculateATSScore(formData);

              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)' }}>ATS Power Score</h3>
                    <button onClick={() => setShowAts(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                      {score}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444' }}>
                        {score >= 80 ? 'Excellent!' : score >= 50 ? 'Getting There' : 'Needs Work'}
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#F3F4F6', borderRadius: '3px', marginTop: '6px' }}>
                        <div style={{ width: `${score}%`, height: '100%', background: score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                      </div>
                    </div>
                  </div>

                  {feedback.critical.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Critical Fixes</h4>
                      {feedback.critical.map((msg, i) => (
                        <div key={i} style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', gap: '8px' }}>
                          <span style={{ color: '#EF4444' }}>•</span> {msg}
                        </div>
                      ))}
                    </div>
                  )}

                  {feedback.improvements.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Improvements</h4>
                      {feedback.improvements.map((msg, i) => (
                        <div key={i} style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', gap: '8px' }}>
                          <span style={{ color: '#F59E0B' }}>•</span> {msg}
                        </div>
                      ))}
                    </div>
                  )}

                  {feedback.good.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', marginBottom: '0.5rem' }}>What You Did Well</h4>
                      {feedback.good.map((msg, i) => (
                        <div key={i} style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', gap: '8px' }}>
                          <span style={{ color: '#10B981' }}>✓</span> {msg}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                input, textarea {
                    font-size: 0.9rem;
                    border: none;
                    border-bottom: 1px solid var(--border);
                    padding: 8px 0;
                    border-radius: 0;
                }
                input:focus, textarea:focus {
                    border-bottom-color: var(--fg);
                }
                textarea {
                    border: 1px solid var(--border);
                    padding: 12px;
                }
            `}</style>
    </div>
  );
};

export default ResumeForm;
