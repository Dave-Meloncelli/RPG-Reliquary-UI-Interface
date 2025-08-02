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
    this.state.successCount = 0;

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
    
    // Check if we should attempt to close the circuit
    if (this.state.status === 'OPEN' && now >= this.state.nextAttemptTime) {
      this.state.status = 'HALF_OPEN';
      console.log(`Circuit breaker '${this.name}' is now HALF_OPEN`);
    }

    // Log current state
    console.log(`Circuit breaker '${this.name}' status: ${this.state.status}, failures: ${this.state.failureCount}`);
  }

  getStatus(): CircuitBreakerState {
    return { ...this.state };
  }

  forceClose(): void {
    this.state.status = 'CLOSED';
    this.state.failureCount = 0;
    this.state.successCount = 0;
    console.log(`Circuit breaker '${this.name}' force closed`);
  }

  forceOpen(): void {
    this.state.status = 'OPEN';
    this.state.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
    console.log(`Circuit breaker '${this.name}' force opened`);
  }
}

// Circuit breaker manager
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
    for (const [name, breaker] of this.breakers) {
      status[name] = breaker.getStatus();
    }
    return status;
  }
}

// Global circuit breaker manager
export const circuitBreakerManager = new CircuitBreakerManager();

// Pre-configured circuit breakers for common services
export const serviceCircuitBreakers = {
  // API Services
  agentZeroAPI: circuitBreakerManager.createBreaker('agent-zero-api', {
    failureThreshold: 3,
    recoveryTimeout: 30000
  }),

  crewAI: circuitBreakerManager.createBreaker('crewai', {
    failureThreshold: 5,
    recoveryTimeout: 60000
  }),

  a2AGateway: circuitBreakerManager.createBreaker('a2a-gateway', {
    failureThreshold: 3,
    recoveryTimeout: 30000
  }),

  // External APIs
  geminiAPI: circuitBreakerManager.createBreaker('gemini-api', {
    failureThreshold: 5,
    recoveryTimeout: 120000
  }),

  openAIAPI: circuitBreakerManager.createBreaker('openai-api', {
    failureThreshold: 5,
    recoveryTimeout: 120000
  }),

  // Database
  postgres: circuitBreakerManager.createBreaker('postgres', {
    failureThreshold: 3,
    recoveryTimeout: 30000
  }),

  redis: circuitBreakerManager.createBreaker('redis', {
    failureThreshold: 3,
    recoveryTimeout: 30000
  }),

  // Vector Database
  milvus: circuitBreakerManager.createBreaker('milvus', {
    failureThreshold: 3,
    recoveryTimeout: 30000
  }),

  // LLM Services
  ollama: circuitBreakerManager.createBreaker('ollama', {
    failureThreshold: 3,
    recoveryTimeout: 60000
  })
};

// Utility function to execute with circuit breaker
export async function executeWithCircuitBreaker<T>(
  breakerName: string,
  operation: () => Promise<T>,
  fallback?: () => Promise<T>
): Promise<T> {
  const breaker = circuitBreakerManager.getBreaker(breakerName);
  
  if (!breaker) {
    // If no circuit breaker exists, execute directly
    return await operation();
  }

  try {
    return await breaker.execute(operation);
  } catch (error) {
    console.error(`Circuit breaker '${breakerName}' caught error:`, error);
    
    if (fallback) {
      console.log(`Executing fallback for '${breakerName}'`);
      return await fallback();
    }
    
    throw error;
  }
}

// Decorator for automatic circuit breaker integration
export function withCircuitBreaker(breakerName: string, fallback?: () => Promise<any>) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return executeWithCircuitBreaker(breakerName, () => method.apply(this, args), fallback);
    };
  };
}

export { CircuitBreaker, CircuitBreakerManager };
export type { CircuitBreakerState, CircuitBreakerConfig }; 