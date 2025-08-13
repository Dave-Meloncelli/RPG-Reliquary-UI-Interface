import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Integrate with autonomous system error handling
    this.reportToAutonomousSystem(error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  private async reportToAutonomousSystem(error: Error, errorInfo: ErrorInfo) {
    try {
      // Send to autonomous framework for analysis and self-healing
      const errorReport = {
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        componentStack: errorInfo.componentStack,
        context: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          userId: localStorage.getItem('userId') || 'anonymous'
        },
        severity: 'critical',
        source: 'frontend_error_boundary'
      };

      // Report to autonomous system via API
      await fetch('/api/autonomous/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport)
      }).catch(err => {
        console.warn('Failed to report error to autonomous system:', err);
      });

      // Also store locally for offline analysis
      const existingErrors = JSON.parse(localStorage.getItem('autonomous_error_log') || '[]');
      existingErrors.push(errorReport);
      // Keep only last 10 errors to avoid storage bloat
      localStorage.setItem('autonomous_error_log', JSON.stringify(existingErrors.slice(-10)));
      
    } catch (reportError) {
      console.warn('Error reporting to autonomous system failed:', reportError);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="max-w-md mx-auto text-center p-6 bg-gray-800 rounded-lg border border-red-500">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Application Error</h2>
            <p className="text-gray-300 mb-4">
              Something went wrong. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left text-sm bg-gray-700 p-3 rounded mt-4">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap text-red-300">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 