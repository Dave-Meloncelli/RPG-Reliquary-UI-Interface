/**
 * Circuit Breaker Implementation
 * 
 * Clean implementation for circuit breaker pattern
 */

interface CircuitBreakerState {
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime: number;
  successCount: number;
  nextAttemptTime: number;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  expectedErrors: string[];
  monitorInterval: number;
}

class CircuitBreaker {
  private state: CircuitBreakerState;
  private config: CircuitBreakerConfig;
  private name: string;

  constructor(name: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.name = name;
    this.config = {
      failureThreshold: 5,
      recoveryTimeout: 60000, // 1 minute
      expectedErrors: [],
      monitorInterval: 30000, // 30 seconds
      ...config
    };

    this.state = {
      status: 'CLOSED',
      failureCount: 0,
      lastFailureTime: 0,
      successCount: 0,
      nextAttemptTime: 0
    };

    // Start monitoring
    this.startMonitoring();
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state.status === 'OPEN') {
      if (Date.now() < this.state.nextAttemptTime) {
        throw new Error(`Circuit breaker '${this.name}' is OPEN`);
      }
      this.state.status = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  private onSuccess(): void {
    this.state.failureCount = 0;
    this.state.successCount++;

    if (this.state.status === 'HALF_OPEN') {
      this.state.status = 'CLOSED';
      console.log(`Circuit breaker '${this.name}' is now CLOSED`);
    }
  }

  private onFailure(error: any): void {
    this.state.failureCount++;
    this.state.lastFailureTime = Date.now();

    if (this.state.failureCount >= this.config.failureThreshold) {
      this.state.status = 'OPEN';
      this.state.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
      console.log(`Circuit breaker '${this.name}' is now OPEN`);
    }
  }

  private startMonitoring(): void {
    setInterval(() => {
      this.monitor();
    }, this.config.monitorInterval);
  }

  private monitor(): void {
    const now = Date.now();

    // Log status periodically
    if (this.state.status === 'OPEN' && now > this.state.nextAttemptTime) {
      console.log(`Circuit breaker '${this.name}' ready for HALF_OPEN test`);
    }
  }

  getStatus(): CircuitBreakerState {
    return { ...this.state };
  }

  forceClose(): void {
    this.state.status = 'CLOSED';
    this.state.failureCount = 0;
    console.log(`Circuit breaker '${this.name}' force closed`);
  }

  forceOpen(): void {
    this.state.status = 'OPEN';
    this.state.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
    console.log(`Circuit breaker '${this.name}' force opened`);
  }
}

class CircuitBreakerManager {
  private breakers: Map<string, CircuitBreaker> = new Map();

  createBreaker(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    const breaker = new CircuitBreaker(name, config);
    this.breakers.set(name, breaker);
    return breaker;
  }

  getBreaker(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  getAllBreakers(): Map<string, CircuitBreaker> {
    return new Map(this.breakers);
  }

  getStatus(): Record<string, CircuitBreakerState> {
    const status: Record<string, CircuitBreakerState> = {};
    for (const [name, breaker] of this.breakers.entries()) {
      status[name] = breaker.getStatus();
    }
    return status;
  }

  removeBreaker(name: string): boolean {
    return this.breakers.delete(name);
  }

  clearAll(): void {
    this.breakers.clear();
  }
}

// Global circuit breaker manager
export const circuitBreakerManager = new CircuitBreakerManager();

// Utility function to execute operations with circuit breaker
export async function executeWithCircuitBreaker<T>(
  breakerName: string,
  operation: () => Promise<T>,
  fallback?: () => Promise<T>
): Promise<T> {
  let breaker = circuitBreakerManager.getBreaker(breakerName);

  if (!breaker) {
    breaker = circuitBreakerManager.createBreaker(breakerName);
  }

  try {
    return await breaker.execute(operation);
  } catch (error) {
    if (fallback) {
      console.log(`Using fallback for '${breakerName}'`);
      return await fallback();
    }
    throw error;
  }
}

// Decorator for methods
export function withCircuitBreaker(breakerName: string, fallback?: () => Promise<any>) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return executeWithCircuitBreaker(
        breakerName,
        () => method.apply(this, args),
        fallback
      );
    };
  };
}

export { CircuitBreaker, CircuitBreakerManager };
export type { CircuitBreakerState, CircuitBreakerConfig }; 
