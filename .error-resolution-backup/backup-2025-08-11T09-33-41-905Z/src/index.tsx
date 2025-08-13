import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import ErrorBoundary from './components/ErrorBoundary';
import { validateAndLogEnvironment } from './utils/env-validation';
import './styles/index.css';

// Validate environment configuration
validateAndLogEnvironment();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
