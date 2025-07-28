import React from 'react';
import Desktop from './components/Desktop';
import Dock from './components/Dock';
import ErrorBoundary from './components/ErrorBoundary';
import { APPS } from './constants';
import { WindowProvider } from './context/WindowContext';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <WindowProvider>
        <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 font-sans antialiased">
          <Desktop />
          <Dock apps={APPS} />
        </div>
      </WindowProvider>
    </ErrorBoundary>
  );
};

export default App;