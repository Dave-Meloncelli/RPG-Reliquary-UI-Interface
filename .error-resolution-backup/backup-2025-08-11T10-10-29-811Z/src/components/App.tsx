import React, { useState, useEffect } from 'react';
import Desktop from './Desktop';
import Dock from './Dock';
import ErrorBoundary from './ErrorBoundary';
import { LoginModal } from './LoginModal';
import { APPS } from '../constants';
import { WindowProvider } from '../context/WindowContext';
import { authService } from '../services/authService';
import { eventBus } from '../services/eventBus';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = async () => {
      // Development mode bypass - remove this in production
      if (import.meta.env.DEV) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      if (authService.isAuthenticated()) {
        setIsAuthenticated(true);
      } else {
        setShowLoginModal(true);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth events
    const unsubscribeLogin = eventBus.subscribe('auth.login', () => {
      setIsAuthenticated(true);
      setShowLoginModal(false);
    });

    const unsubscribeLogout = eventBus.subscribe('auth.logout', () => {
      setIsAuthenticated(false);
      setShowLoginModal(true);
    });

    return () => {
      unsubscribeLogin();
      unsubscribeLogout();
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <WindowProvider>
        <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 font-sans antialiased">
          {isAuthenticated ? (
            <>
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
              <Desktop />
              <Dock apps={APPS} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">Agent Zero Vault</h1>
                <p className="text-xl mb-8">Please sign in to continue</p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
          
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </WindowProvider>
    </ErrorBoundary>
  );
};

export default App;