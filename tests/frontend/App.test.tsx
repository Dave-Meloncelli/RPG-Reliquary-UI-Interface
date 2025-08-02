import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../../App';
import { authService } from '../../services/authService';
import { eventBus } from '../../services/eventBus';

// Mock the services
vi.mock('../../services/authService');
vi.mock('../../services/eventBus');

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock the components that might not be available in test environment
vi.mock('../../components/Desktop', () => ({
  default: () => <div data-testid="desktop">Desktop Component</div>,
}));

vi.mock('../../components/Dock', () => ({
  default: ({ apps }: { apps: any[] }) => (
    <div data-testid="dock">Dock Component ({apps.length} apps)</div>
  ),
}));

vi.mock('../../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

vi.mock('../../components/LoginModal', () => ({
  LoginModal: ({ isOpen, onClose, onLoginSuccess }: any) =>
    isOpen ? (
      <div data-testid="login-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={onLoginSuccess}>Login Success</button>
      </div>
    ) : null,
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders loading state initially', () => {
    (authService.isAuthenticated as any).mockReturnValue(false);
    
    render(<App />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows login modal when user is not authenticated', async () => {
    (authService.isAuthenticated as any).mockReturnValue(false);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Agent Zero Vault')).toBeInTheDocument();
      expect(screen.getByText('Please sign in to continue')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  it('shows main interface when user is authenticated', async () => {
    (authService.isAuthenticated as any).mockReturnValue(true);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('desktop')).toBeInTheDocument();
      expect(screen.getByTestId('dock')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  it('opens login modal when sign in button is clicked', async () => {
    (authService.isAuthenticated as any).mockReturnValue(false);
    
    render(<App />);
    
    await waitFor(() => {
      const signInButton = screen.getByText('Sign In');
      fireEvent.click(signInButton);
    });
    
    expect(screen.getByTestId('login-modal')).toBeInTheDocument();
  });

  it('handles logout correctly', async () => {
    (authService.isAuthenticated as any).mockReturnValue(true);
    (authService.logout as any).mockImplementation(() => {
      // Simulate logout by publishing event
      eventBus.publish('auth.logout', {});
    });
    
    render(<App />);
    
    await waitFor(() => {
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
    });
    
    expect(authService.logout).toHaveBeenCalled();
  });

  it('subscribes to auth events on mount', () => {
    (authService.isAuthenticated as any).mockReturnValue(false);
    
    render(<App />);
    
    expect(eventBus.subscribe).toHaveBeenCalledWith('auth.login', expect.any(Function));
    expect(eventBus.subscribe).toHaveBeenCalledWith('auth.logout', expect.any(Function));
  });

  it('unsubscribes from auth events on unmount', () => {
    (authService.isAuthenticated as any).mockReturnValue(false);
    const mockUnsubscribe = vi.fn();
    (eventBus.subscribe as any).mockReturnValue(mockUnsubscribe);
    
    const { unmount } = render(<App />);
    unmount();
    
    expect(mockUnsubscribe).toHaveBeenCalledTimes(2);
  });
});

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('transitions from unauthenticated to authenticated state', async () => {
    (authService.isAuthenticated as any).mockReturnValue(false);
    
    render(<App />);
    
    // Initially shows login screen
    await waitFor(() => {
      expect(screen.getByText('Agent Zero Vault')).toBeInTheDocument();
    });
    
    // Simulate successful login
    const loginCallback = (eventBus.subscribe as any).mock.calls.find(
      (call: any) => call[0] === 'auth.login'
    )[1];
    
    loginCallback();
    
    await waitFor(() => {
      expect(screen.getByTestId('desktop')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  it('transitions from authenticated to unauthenticated state', async () => {
    (authService.isAuthenticated as any).mockReturnValue(true);
    
    render(<App />);
    
    // Initially shows main interface
    await waitFor(() => {
      expect(screen.getByTestId('desktop')).toBeInTheDocument();
    });
    
    // Simulate logout
    const logoutCallback = (eventBus.subscribe as any).mock.calls.find(
      (call: any) => call[0] === 'auth.logout'
    )[1];
    
    logoutCallback();
    
    await waitFor(() => {
      expect(screen.getByText('Agent Zero Vault')).toBeInTheDocument();
      expect(screen.getByText('Please sign in to continue')).toBeInTheDocument();
    });
  });
});

describe('Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('handles authentication service errors gracefully', async () => {
    (authService.isAuthenticated as any).mockImplementation(() => {
      throw new Error('Authentication service error');
    });
    
    render(<App />);
    
    // Should still render without crashing
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('handles event bus subscription errors gracefully', () => {
    (authService.isAuthenticated as any).mockReturnValue(false);
    (eventBus.subscribe as any).mockImplementation(() => {
      throw new Error('Event bus error');
    });
    
    // Should not crash the app
    expect(() => render(<App />)).not.toThrow();
  });
}); 