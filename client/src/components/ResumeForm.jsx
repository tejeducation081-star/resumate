import React, { useState, useEffect } from 'react';
import useResumeStore from '../store/resumeStore';
import useAuthStore from '../store/authStore';
import { API_ENDPOINTS } from '../config/api';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import TemplatePreview from './TemplatePreview';
import { templates, fontOptions } from '../templates/config';
import { calculateATSScore } from '../utils/atsAnalyzer';
import ErrorBoundary from './ErrorBoundary';
import PremiumModal from './PremiumModal';
import JobSearch from './JobSearch';
import { Globe, Share2, Download, Briefcase } from 'lucide-react';

const ResumeForm = ({ setView }) => {
  const { currentResume, saveResume } = useResumeStore();
  const [step, setStep] = useState(1);
  const [showAts, setShowAts] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isJobSearchOpen, setIsJobSearchOpen] = useState(false);
  const { user } = useAuthStore();
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
    if (!user) {
      setIsPremiumModalOpen(true);
      return;
    }
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      updatePersonal('photoUrl', result.imageUrl);
    } catch (err) {
      console.error('Detailed Upload failed:', err);
      alert(`Failed to upload image: ${err.message}`);
    }

  };

  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  return (
    <div className={`resume-editor ${showPreviewMobile ? 'show-preview' : ''}`} style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem',
      maxWidth: '1280px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 100px)',
      marginTop: '20px',
      padding: '0 20px',
      position: 'relative'
    }}>

      {/* 1. Left Column: Form */}
      <div className={`editor-form-col ${showPreviewMobile ? 'mobile-hidden' : ''}`} style={{
        padding: '0 0 2rem 0',
        overflowY: { md: 'auto' },
        background: 'var(--bg)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>

        <div style={{ padding: '1.5rem 1rem' }}>
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
                  color: 'var(--fg)'
                }}
              >
                <ArrowLeft size={18} />
              </button>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fg)' }}>Editor</h2>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>STEP {step}/5</span>
          </header>

          {step === 1 && (
            <div className="step-content">
              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', alignSelf: 'center', marginBottom: '1rem' }}>
                  <input type="file" id="photo-upload" hidden onChange={handlePhotoUpload} accept="image/*" />
                  <label htmlFor="photo-upload" style={{
                    width: '100px',
                    height: '100px',
                    border: '2px dashed var(--border)',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    background: formData.personalDetails.photoUrl ? 'none' : 'var(--surface)'
                  }}>
                    {formData.personalDetails.photoUrl ? (
                      <img src={formData.personalDetails.photoUrl} alt="Vibe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <ImageIcon size={24} color="var(--muted)" />
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '4px', color: 'var(--muted)' }}>ADD PHOTO</span>
                      </>
                    )}
                  </label>
                </div>
                <div>
                  <label>Full Name</label>
                  <input value={formData.personalDetails.fullName} onChange={e => updatePersonal('fullName', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label>Job Title</label>
                  <input value={formData.personalDetails.jobTitle || ''} onChange={e => updatePersonal('jobTitle', e.target.value)} placeholder="e.g. Product Designer" />
                </div>
                <div>
                  <label>Location / Address</label>
                  <input value={formData.personalDetails.location || ''} onChange={e => updatePersonal('location', e.target.value)} placeholder="e.g. San Francisco, CA" />
                </div>
                <div>
                  <label>Email Address</label>
                  <input value={formData.personalDetails.email} onChange={e => updatePersonal('email', e.target.value)} />
                </div>
                <div>
                  <label>Contact Number</label>
                  <input value={formData.personalDetails.phone} onChange={e => updatePersonal('phone', e.target.value)} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label>Website / Portfolio</label>
                <input value={formData.personalDetails.website || ''} onChange={e => updatePersonal('website', e.target.value)} placeholder="e.g. www.portfolio.com" />
              </div>

              <label>Professional Summary</label>
              <textarea rows="4" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })}></textarea>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Work Experience</h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn-secondary" onClick={addExperience} style={{ padding: '8px 16px', fontSize: '0.75rem', borderRadius: '8px' }}>
                    <Plus size={14} /> Add Experience
                  </button>
                </div>
              </div>
              {formData.experience.map((exp, i) => (
                <div key={i} style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '1.5rem', position: 'relative' }}>
                  <button onClick={() => removeExperience(i)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gap: '1.25rem' }}>
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
                <button className="btn-secondary" onClick={() => setFormData({ ...formData, education: [...formData.education, { school: '', degree: '', year: '' }] })} style={{ padding: '8px 16px', fontSize: '0.75rem', borderRadius: '8px' }}>
                  <Plus size={14} /> Add Education
                </button>
              </div>
              {formData.education.map((edu, i) => (
                <div key={i} style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '1.5rem', position: 'relative' }}>
                  <button onClick={() => setFormData({ ...formData, education: formData.education.filter((_, idx) => idx !== i) })} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'grid', gap: '1.25rem' }}>
                    <div>
                      <label>School / University</label>
                      <input value={edu.school} onChange={e => {
                        const newEdu = [...formData.education];
                        newEdu[i].school = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
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
              <textarea rows="10" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="Strategy. Architecture. Creative Direction..."></textarea>
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
              </div>
            </div>
          )}
        </div>

        <footer style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', padding: '1.5rem 1rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px' }} onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {step === 5 && (
              <button className="btn-primary" onClick={handleSave} style={{ background: '#059669', padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px' }}>
                Save <Download size={16} />
              </button>
            )}

            {step < 5 ? (
              <button className="btn-primary" onClick={() => setStep(s => s + 1)} style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px' }}>
                Next <ArrowRight size={16} />
              </button>
            ) : null}
          </div>
        </footer>

        <PremiumModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          setView={setView}
        />

        <JobSearch
          isOpen={isJobSearchOpen}
          onClose={() => setIsJobSearchOpen(false)}
          searchQuery={formData.personalDetails.jobTitle || ''}
          location={formData.personalDetails.location || ''}
        />
      </div>

      {/* 2. Right Column: Preview */}
      <div className={`preview-panel-col ${showPreviewMobile ? 'mobile-visible' : 'mobile-hidden'}`} style={{
        background: 'var(--surface)',
        overflowY: { md: 'auto' },
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem 0',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        height: '100%'
      }}>
        <div className="preview-container-scale" style={{
          transform: 'scale(1)',
          transformOrigin: 'top center',
          height: 'fit-content',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <ErrorBoundary>
            <TemplatePreview data={formData} />
          </ErrorBoundary>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="mobile-only mobile-preview-toggle"
        onClick={() => setShowPreviewMobile(!showPreviewMobile)}
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '30px',
          zIndex: 2000,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {showPreviewMobile ? <ArrowLeft size={24} /> : <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>LIVE</div>}
      </button>

      {/* 3. Floating ATS Button & Panel */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 2000 }}>
        <button
          onClick={() => setShowAts(!showAts)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            color: 'white',
            border: 'none',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showAts ? <Check size={24} /> : <span style={{ fontSize: '1rem', fontWeight: 800 }}>ATS</span>}
        </button>

        {showAts && (
          <div style={{
            position: 'absolute',
            bottom: '80px',
            right: '0',
            width: 'calc(100vw - 40px)',
            maxWidth: '350px',
            background: 'var(--bg)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border)',
            padding: '1.5rem',
            maxHeight: '70vh',
            overflowY: 'auto'
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {feedback.critical.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Critical Fixes</h4>
                        {feedback.critical.map((msg, i) => (
                          <div key={i} style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', gap: '8px' }}>
                            <span style={{ color: '#EF4444' }}>•</span> {msg}
                          </div>
                        ))}
                      </div>
                    )}

                    {feedback.improvements.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Improvements</h4>
                        {feedback.improvements.map((msg, i) => (
                          <div key={i} style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', gap: '8px' }}>
                            <span style={{ color: '#F59E0B' }}>•</span> {msg}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <style>{`
                .resume-editor {
                    margin-bottom: 50px;
                }
                @media (max-width: 1023px) {
                    .resume-editor {
                        grid-template-columns: 1fr !important;
                        height: auto !important;
                        padding-top: 100px;
                        padding-bottom: 50px;
                    }
                    .preview-panel-col {
                        display: none !important;
                    }
                    .resume-editor.show-preview .preview-panel-col {
                        display: flex !important;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 1000;
                        background: var(--bg);
                        padding: 80px 10px 10px 10px;
                        border-radius: 0;
                        border: none;
                        align-items: flex-start;
                        overflow-y: scroll;
                    }
                    .resume-editor.show-preview .editor-form-col {
                        display: none !important;
                    }
                    .preview-container-scale {
                        transform: scale(0.42) !important;
                        transform-origin: top center !important;
                        margin-bottom: 20px;
                        margin-top: 20px;
                    }
                }
                @media (min-width: 1024px) {
                    .mobile-only { display: none !important; }
                    .preview-panel-col { display: flex !important; }
                    .editor-form-col { display: flex !important; }
                    .preview-container-scale { transform: scale(0.8) !important; }
                }

                .step-content input {
                    background: var(--bg-soft);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    width: 100%;
                }

                .step-content input:focus {
                    background: var(--bg);
                    border-color: var(--accent);
                    box-shadow: 0 0 0 4px var(--accent-glow);
                }

                .step-content textarea {
                    background: var(--bg-soft);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    resize: vertical;
                    min-height: 100px;
                }

                .step-content textarea:focus {
                    background: var(--bg);
                    border-color: var(--accent);
                    box-shadow: 0 0 0 4px var(--accent-glow);
                }

                label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--fg-muted);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
            `}</style>
    </div>
  );
};

export default ResumeForm;
