import React, { useState, useEffect } from 'react';
import useAuthStore from './store/authStore';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import ResumeForm from './components/ResumeForm';
import Navbar from './components/Navbar';
import TemplateGallery from './components/TemplateGallery';
import AdminPanel from './components/AdminPanel';
import SplashScreen from './components/SplashScreen';
import JobsPage from './components/JobsPage';
import ErrorBoundary from './components/ErrorBoundary';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

import useResumeStore from './store/resumeStore';

function App() {
    const { user } = useAuthStore();
    const { isPreviewing } = useResumeStore();
    const [view, setView] = useState('landing'); // 'landing', 'auth', 'dashboard', 'editor', 'templates', 'admin', 'privacy', 'terms'

    const [showSplash, setShowSplash] = useState(true);

    // Initial view based on URL params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlView = params.get('view');
        if (urlView && ['privacy', 'terms'].includes(urlView)) {
            setView(urlView);
            setShowSplash(false); // Skip splash for legal pages
        }
    }, []);

    // Redirect logic
    useEffect(() => {
        if (user && (view === 'landing' || view === 'auth')) {
            // Redirect admin users to admin panel, regular users to dashboard
            setView(user.isAdmin ? 'admin' : 'dashboard');
        }
        // Removed the forced guest redirect to landing for editor/templates
    }, [user, view]);

    return (
        <div className="app">
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
            {!showSplash && (
                <>
                    {!isPreviewing && !['privacy', 'terms'].includes(view) && <Navbar setView={setView} currentView={view} />}
                    <main style={{ paddingTop: isPreviewing || ['privacy', 'terms'].includes(view) ? '0' : '64px' }}>
                        {view === 'landing' && <LandingPage setView={setView} />}

                        {view === 'auth' && <AuthPage setView={setView} />}

                        {view === 'dashboard' && (user ? <Dashboard setView={setView} /> : <AuthPage setView={setView} />)}
                        {view === 'editor' && <ResumeForm setView={setView} />}
                        {view === 'templates' && <TemplateGallery setView={setView} />}
                        {view === 'jobs' && (
                            <ErrorBoundary>
                                <JobsPage setView={setView} />
                            </ErrorBoundary>
                        )}

                        {view === 'privacy' && <PrivacyPolicy />}
                        {view === 'terms' && <TermsOfService />}

                        {user?.isAdmin && view === 'admin' && <AdminPanel setView={setView} />}
                    </main>
                </>
            )}
        </div>
    );
}

export default App;
