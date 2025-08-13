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
  private baseURL: string = 'http://localhost:3001/api';

  constructor() {
    // Load token from localStorage on initialization
    this.loadToken();
  }

  private loadToken(): void {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    const storedExpiry = localStorage.getItem('auth_expiry');

    if (storedToken && storedUser && storedExpiry) {
      const expiry = parseInt(storedExpiry);
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
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const authData: AuthResponse = await response.json();

      // Get user data
      const userResponse = await fetch(`${this.baseURL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${authData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user data');
      }

      const user: User = await userResponse.json();
      this.saveToken(authData.access_token, user, authData.expires_in);

      // Publish login event
      eventBus.publish('auth.login', { user });

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Registration failed');
      }

      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout(): void {
    this.clearAuth();
    eventBus.publish('auth.logout', {});
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.tokenExpiry !== null && Date.now() < this.tokenExpiry;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  async refreshUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/users/me`, {
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
      console.error('Error refreshing user:', error);
      this.clearAuth();
      return null;
    }
  }

  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

export const authService = new AuthService(); 
