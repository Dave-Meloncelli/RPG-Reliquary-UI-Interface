import { eventBus } from './eventBus';

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.loadToken();
  }

  private loadToken(): void {

    if (storedToken && storedUser && storedExpiry) {
      if (Date.now() < expiry) {
        this.token = storedToken;
        this.user = JSON.parse(storedUser);
        this.tokenExpiry = expiry;
      } else {
        this.clearAuth();
      }
    }
  }

  private saveToken(token: string, user: User, expiresIn: number): void {
    this.token = token;
    this.user = user;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_expiry', this.tokenExpiry.toString());
  }

  private clearAuth(): void {
    this.token = null;
    this.user = null;
    this.tokenExpiry = null;

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expiry');
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(error.detail || 'Login failed');
      }

      const authData: AuthResponse = await response.json();
      
      // Get user data
      const userResponse = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${authData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user data');
      }

      const user: User = await userResponse.json();
      this.saveToken(authData.access_token, user, authData.expires_in);

      eventBus.publish('auth.login', { user });
      return user;
    } catch (error) {
      eventBus.publish('auth.error', { error: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(error.detail || 'Registration failed');
      }

      const user: User = await response.json();
      eventBus.publish('auth.register', { user });
      return user;
    } catch (error) {
      eventBus.publish('auth.error', { error: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  }

  logout(): void {
    this.clearAuth();
    eventBus.publish('auth.logout', {});
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null && this.tokenExpiry !== null && Date.now() < this.tokenExpiry;
  }

  getToken(): string | null {
    if (this.isAuthenticated()) {
      return this.token;
    }
    return null;
  }

  getUser(): User | null {
    if (this.isAuthenticated()) {
      return this.user;
    }
    return null;
  }

  async refreshUser(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        this.clearAuth();
        return null;
      }

      const user: User = await response.json();
      this.user = user;
      localStorage.setItem('auth_user', JSON.stringify(user));
      return user;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  // Helper method for making authenticated API calls
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

export const authService = new AuthService(); 
