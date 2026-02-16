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

function App() {
    const { user } = useAuthStore();
    const [view, setView] = useState('landing'); // 'landing', 'auth', 'dashboard', 'editor', 'templates', 'admin'

    const [showSplash, setShowSplash] = useState(true);

    // Redirect logic
    useEffect(() => {
        if (user && (view === 'landing' || view === 'auth')) {
            // Redirect admin users to admin panel, regular users to dashboard
            setView(user.isAdmin ? 'admin' : 'dashboard');
        } else if (!user && view !== 'landing' && view !== 'auth') {
            setView('landing');
        }
    }, [user, view]);

    return (
        <div className="app">
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
            {!showSplash && (
                <>
                    {view !== 'templates' && <Navbar setView={setView} currentView={view} />}
                    <main style={{ paddingTop: view === 'templates' ? '0' : '80px' }}>
                        {view === 'landing' && <LandingPage setView={setView} />}

                        {view === 'auth' && <AuthPage setView={setView} />}

                        {user && (
                            <>
                                {user.isAdmin ? (
                                    // Admin users only see Admin Panel
                                    <AdminPanel setView={setView} />
                                ) : (
                                    // Regular users see normal resume features
                                    <>
                                        {view === 'dashboard' && <Dashboard setView={setView} />}
                                        {view === 'editor' && <ResumeForm setView={setView} />}
                                        {view === 'templates' && <TemplateGallery setView={setView} />}
                                    </>
                                )}
                            </>
                        )}
                    </main>
                </>
            )}
        </div>
    );
}

export default App;
