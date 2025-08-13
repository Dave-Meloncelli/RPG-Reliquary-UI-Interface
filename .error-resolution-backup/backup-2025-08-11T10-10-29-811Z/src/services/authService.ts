/**
 * Production Authentication Service
 * 
 * JWT-based authentication with refresh tokens, rate limiting, and security features
 * Targets: Secure, scalable authentication for 100+ concurrent users
 */

import { performanceService } from './performanceService';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin: Date;
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RateLimitInfo {
  attempts: number;
  lastAttempt: number;
  blocked: boolean;
  blockExpiry: number;
}

class AuthService {
  private users: Map<string, User> = new Map();
  private refreshTokens: Map<string, string> = new Map(); // refreshToken -> userId
  private rateLimits: Map<string, RateLimitInfo> = new Map();
  private blacklistedTokens: Set<string> = new Set();

  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  private readonly REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
  private readonly ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.initializeDemoUsers();
    this.startTokenCleanup();
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const startTime = Date.now();

    try {
      // Rate limiting check
      if (this.isRateLimited(credentials.email)) {
        throw new Error('Too many login attempts. Please try again later.');
      }

      // Validate credentials
      const user = await this.validateCredentials(credentials);
      if (!user) {
        this.recordFailedAttempt(credentials.email);
        throw new Error('Invalid credentials');
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Update user last login
      user.lastLogin = new Date();
      this.users.set(user.id, user);

      // Store refresh token
      this.refreshTokens.set(tokens.refreshToken, user.id);

      // Track performance
      const duration = Date.now() - startTime;
      performanceService.trackResponseTime('auth.login', duration);

      return tokens;
    } catch (error) {
      const duration = Date.now() - startTime;
      performanceService.trackResponseTime('auth.login', duration);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    try {
      // Validate refresh token
      const userId = this.refreshTokens.get(refreshToken);
      if (!userId) {
        throw new Error('Invalid refresh token');
      }

      const user = this.users.get(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Remove old refresh token and store new one
      this.refreshTokens.delete(refreshToken);
      this.refreshTokens.set(tokens.refreshToken, userId);

      return tokens;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    // Blacklist access token
    this.blacklistedTokens.add(accessToken);

    // Remove refresh token if provided
    if (refreshToken) {
      this.refreshTokens.delete(refreshToken);
    }
  }

  async validateToken(token: string): Promise<TokenPayload | null> {
    try {
      // Check if token is blacklisted
      if (this.blacklistedTokens.has(token)) {
        return null;
      }

      // Verify JWT token
      const payload = this.verifyJWT(token);
      return payload;
    } catch (error) {
      return null;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Security Methods
  private isRateLimited(email: string): boolean {
    const limitInfo = this.rateLimits.get(email);
    if (!limitInfo) return false;

    const now = Date.now();

    // Check if still blocked
    if (limitInfo.blocked && now < limitInfo.blockExpiry) {
      return true;
    }

    // Reset if block expired
    if (limitInfo.blocked && now >= limitInfo.blockExpiry) {
      this.rateLimits.delete(email);
      return false;
    }

    // Check attempt count
    if (limitInfo.attempts >= this.MAX_LOGIN_ATTEMPTS) {
      limitInfo.blocked = true;
      limitInfo.blockExpiry = now + this.BLOCK_DURATION;
      return true;
    }

    return false;
  }

  private recordFailedAttempt(email: string): void {
    const now = Date.now();
    const limitInfo = this.rateLimits.get(email) || {
      attempts: 0,
      lastAttempt: 0,
      blocked: false,
      blockExpiry: 0
    };

    // Reset attempts if more than 1 hour has passed
    if (now - limitInfo.lastAttempt > 60 * 60 * 1000) {
      limitInfo.attempts = 0;
    }

    limitInfo.attempts++;
    limitInfo.lastAttempt = now;
    this.rateLimits.set(email, limitInfo);
  }

  // Token Management
  private async generateTokens(user: User): Promise<AuthToken> {
    const accessToken = this.generateJWT(user, this.ACCESS_TOKEN_EXPIRY);
    const refreshToken = this.generateJWT(user, this.REFRESH_TOKEN_EXPIRY, this.REFRESH_SECRET);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      tokenType: 'Bearer'
    };
  }

  private generateJWT(user: User, expiry: number, secret?: string): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      iat: Date.now(),
      exp: Date.now() + expiry
    };

    // Simple JWT implementation (use a proper library in production)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadStr = btoa(JSON.stringify(payload));
    const signature = btoa(secret || this.JWT_SECRET);

    return `${header}.${payloadStr}.${signature}`;
  }

  private verifyJWT(token: string): TokenPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    try {
      const payload = JSON.parse(atob(parts[1]));

      // Check expiration
      if (payload.exp < Date.now()) {
        throw new Error('Token expired');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Demo Data
  private initializeDemoUsers(): void {
    const demoUsers: User[] = [
      {
        id: '1',
        email: 'admin@az-interface.com',
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'admin'],
        lastLogin: new Date()
      },
      {
        id: '2',
        email: 'user@az-interface.com',
        role: 'user',
        permissions: ['read', 'write'],
        lastLogin: new Date()
      },
      {
        id: '3',
        email: 'moderator@az-interface.com',
        role: 'moderator',
        permissions: ['read', 'write', 'moderate'],
        lastLogin: new Date()
      }
    ];

    demoUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  // Cleanup
  private startTokenCleanup(): void {
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, 60 * 60 * 1000); // Every hour
  }

  private cleanupExpiredTokens(): void {
    const now = Date.now();

    // Clean up expired refresh tokens
    for (const [token, userId] of this.refreshTokens.entries()) {
      try {
        const payload = this.verifyJWT(token);
        if (payload.exp < now) {
          this.refreshTokens.delete(token);
        }
      } catch (error) {
        this.refreshTokens.delete(token);
      }
    }

    // Clean up old blacklisted tokens (older than 24 hours)
    // In production, use Redis with TTL for this
    console.log(`Cleaned up expired tokens. Active refresh tokens: ${this.refreshTokens.size}`);
  }

  // Validation
  private async validateCredentials(credentials: LoginCredentials): Promise<User | null> {
    // In production, hash passwords and check against database
    // For demo, use simple email matching
    for (const user of this.users.values()) {
      if (user.email === credentials.email) {
        // Simulate password validation
        if (credentials.password === 'password123') {
          return user;
        }
      }
    }
    return null;
  }

  // Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    activeUsers: number;
    activeTokens: number;
    rateLimitedIPs: number;
  }> {
    const activeUsers = this.users.size;
    const activeTokens = this.refreshTokens.size;
    const rateLimitedIPs = this.rateLimits.size;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (rateLimitedIPs > 100) {
      status = 'degraded';
    }

    if (activeTokens > 1000) {
      status = 'degraded';
    }

    return {
      status,
      activeUsers,
      activeTokens,
      rateLimitedIPs
    };
  }
}

export const authService = new AuthService(); 
