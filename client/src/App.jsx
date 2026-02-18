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

import useResumeStore from './store/resumeStore';

function App() {
    const { user } = useAuthStore();
    const { isPreviewing } = useResumeStore();
    const [view, setView] = useState('landing'); // 'landing', 'auth', 'dashboard', 'editor', 'templates', 'admin'

    const [showSplash, setShowSplash] = useState(true);

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
                    {!isPreviewing && <Navbar setView={setView} currentView={view} />}
                    <main style={{ paddingTop: isPreviewing ? '0' : '80px' }}>
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

                        {user?.isAdmin && view === 'admin' && <AdminPanel setView={setView} />}
                    </main>
                </>
            )}
        </div>
    );
}

export default App;
