import React, { useState, useEffect } from 'react';
import useAuthStore from './store/authStore';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import Workspace from './components/Workspace';
import Navbar from './components/Navbar';
import TemplateGallery from './components/TemplateGallery';
import AdminPanel from './components/AdminPanel';
import SplashScreen from './components/SplashScreen';
// import JobsPage from './components/JobsPage'; // Removed Job Hub
import ErrorBoundary from './components/ErrorBoundary';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import MasterProfile from './components/MasterProfile';

import useResumeStore from './store/resumeStore';
import useProfileStore from './store/profileStore';

function App() {
    const { user } = useAuthStore();
    const { isPreviewing } = useResumeStore();
    const { profile, fetchProfile } = useProfileStore();
    const [view, setView] = useState('landing'); // 'landing', 'auth', 'dashboard', 'editor', 'templates', 'admin', 'privacy', 'terms', 'profile'

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

    // Fetch profile and check onboarding
    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user, fetchProfile]);

    // Redirect logic
    useEffect(() => {
        if (user && (view === 'landing' || view === 'auth')) {
            // If profile is very basic, maybe nudge to onboarding
            if (!profile?.title && !profile?.industry) {
                setView('profile');
            } else {
                setView(user.isAdmin ? 'admin' : 'dashboard');
            }
        }
    }, [user, view, profile]);

    return (
        <div className="app">
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
            {!showSplash && (
                <>
                    {!isPreviewing && !['privacy', 'terms', 'editor'].includes(view) && <Navbar setView={setView} currentView={view} />}
                    <main style={{ paddingTop: isPreviewing || ['privacy', 'terms', 'editor'].includes(view) ? '0' : '64px' }}>
                        {view === 'landing' && <LandingPage setView={setView} />}

                        {view === 'auth' && <AuthPage setView={setView} />}

                        {view === 'dashboard' && (user ? <Dashboard setView={setView} /> : <AuthPage setView={setView} />)}
                        {view === 'editor' && <Workspace setView={setView} />}
                        {view === 'profile' && <MasterProfile setView={setView} />}
                        {view === 'templates' && <TemplateGallery setView={setView} />}

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
