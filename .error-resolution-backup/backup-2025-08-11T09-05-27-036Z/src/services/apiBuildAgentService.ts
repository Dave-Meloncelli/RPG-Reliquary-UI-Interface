import { eventBus } from './eventBus';

export interface BuildConfig {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'full-stack' | 'microservice';
  source: {
    repository: string;
    branch: string;
    path?: string;
  };
  build: {
    command: string;
    output: string;
    environment: Record<string, string>;
  };
  deploy: {
    target: 'local' | 'staging' | 'production';
    method: 'docker' | 'kubernetes' | 'serverless' | 'static';
    config: Record<string, any>;
  };
  monitoring: {
    healthCheck: string;
    metrics: string[];
    alerts: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface BuildResult {
  id: string;
  buildConfigId: string;
  status: 'pending' | 'building' | 'success' | 'failed' | 'deployed';
  startTime: string;
  endTime?: string;
  duration?: number;
  logs: string[];
  artifacts: string[];
  errors: string[];
  warnings: string[];
  metrics: {
    buildTime: number;
    bundleSize: number;
    performanceScore: number;
  };
}

export interface DeploymentResult {
  id: string;
  buildResultId: string;
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rolled-back';
  target: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  url?: string;
  logs: string[];
  errors: string[];
}

export interface APISpec {
  id: string;
  name: string;
  version: string;
  openapi: string;
  endpoints: Array<{
    path: string;
    method: string;
    description: string;
    parameters: any[];
    responses: any[];
  }>;
  security: {
    type: string;
    config: Record<string, any>;
  };
}

export class APIBuildAgentService {
  private eventBus: any;
  private buildConfigs: Map<string, BuildConfig> = new Map();
  private buildResults: Map<string, BuildResult> = new Map();
  private deploymentResults: Map<string, DeploymentResult> = new Map();
  private apiSpecs: Map<string, APISpec> = new Map();
  private isRunning: boolean = false;
  private buildQueue: string[] = [];
  private currentBuild?: string;

  constructor(eventBus: any) {
    this.eventBus = eventBus;
    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners for build agent
   */
  private initializeEventListeners(): void {
    this.eventBus.on('build:requested', async (data: { configId: string }) => {
      await this.queueBuild(data.configId);
    });

    this.eventBus.on('deploy:requested', async (data: { buildResultId: string }) => {
      await this.deployBuild(data.buildResultId);
    });

    this.eventBus.on('api:spec:updated', async (data: { specId: string }) => {
      await this.updateAPISpec(data.specId);
    });
  }

  /**
   * Register a new build configuration
   */
  async registerBuildConfig(config: Omit<BuildConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `build-config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const buildConfig: BuildConfig = {
      ...config,
      id,
      createdAt: now,
      updatedAt: now
    };

    this.buildConfigs.set(id, buildConfig);

    this.eventBus.emit('build:config:registered', {
      timestamp: new Date().toISOString(),
      configId: id,
      config: buildConfig
    });

    return id;
  }

  /**
   * Update an existing build configuration
   */
  async updateBuildConfig(id: string, updates: Partial<BuildConfig>): Promise<boolean> {
    const config = this.buildConfigs.get(id);
    if (!config) {
      throw new Error(`Build configuration ${id} not found`);
    }

    const updatedConfig: BuildConfig = {
      ...config,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    this.buildConfigs.set(id, updatedConfig);

    this.eventBus.emit('build:config:updated', {
      timestamp: new Date().toISOString(),
      configId: id,
      updates,
      config: updatedConfig
    });

    return true;
  }

  /**
   * Queue a build for execution
   */
  async queueBuild(configId: string): Promise<string> {
    const config = this.buildConfigs.get(configId);
    if (!config) {
      throw new Error(`Build configuration ${configId} not found`);
    }

    const buildId = `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const buildResult: BuildResult = {
      id: buildId,
      buildConfigId: configId,
      status: 'pending',
      startTime: now,
      logs: [],
      artifacts: [],
      errors: [],
      warnings: [],
      metrics: {
        buildTime: 0,
        bundleSize: 0,
        performanceScore: 0
      }
    };

    this.buildResults.set(buildId, buildResult);
    this.buildQueue.push(buildId);

    this.eventBus.emit('build:queued', {
      timestamp: new Date().toISOString(),
      buildId,
      configId,
      config
    });

    // Start processing if not already running
    if (!this.isRunning) {
      this.processBuildQueue();
    }

    return buildId;
  }

  /**
   * Process the build queue
   */
  private async processBuildQueue(): Promise<void> {
    if (this.isRunning || this.buildQueue.length === 0) {
      return;
    }

    this.isRunning = true;

    while (this.buildQueue.length > 0) {
      const buildId = this.buildQueue.shift()!;
      this.currentBuild = buildId;

      try {
        await this.executeBuild(buildId);
      } catch (error) {
        console.error(`Build ${buildId} failed:`, error);
        await this.updateBuildStatus(buildId, 'failed', [error instanceof Error ? error.message : 'Unknown error']);
      }
    }

    this.isRunning = false;
    this.currentBuild = undefined;
  }

  /**
   * Execute a specific build
   */
  private async executeBuild(buildId: string): Promise<void> {
    const buildResult = this.buildResults.get(buildId);
    if (!buildResult) {
      throw new Error(`Build result ${buildId} not found`);
    }

    const config = this.buildConfigs.get(buildResult.buildConfigId);
    if (!config) {
      throw new Error(`Build configuration ${buildResult.buildConfigId} not found`);
    }

    // Update status to building
    await this.updateBuildStatus(buildId, 'building');

    const startTime = Date.now();
    try {
      // Simulate build process
      await this.simulateBuildProcess(buildId, config);

      const duration = Date.now() - startTime;

      // Update build result
      const updatedResult: BuildResult = {
        ...buildResult,
        status: 'success',
        endTime: new Date().toISOString(),
        duration,
        metrics: {
          ...buildResult.metrics,
          buildTime: duration
        }
      };

      this.buildResults.set(buildId, updatedResult);

      this.eventBus.emit('build:completed', {
        timestamp: new Date().toISOString(),
        buildId,
        result: updatedResult
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      await this.updateBuildStatus(buildId, 'failed', [error instanceof Error ? error.message : 'Unknown error'], duration);
      throw error;
    }
  }

  /**
   * Simulate the build process (replace with actual build logic)
   */
  private async simulateBuildProcess(buildId: string, config: BuildConfig): Promise<void> {
    const buildResult = this.buildResults.get(buildId);
    if (!buildResult) return;

    // Simulate build steps
    const steps = [
      'Initializing build environment...',
      'Cloning repository...',
      'Installing dependencies...',
      'Running tests...',
      'Building application...',
      'Generating artifacts...',
      'Validating build output...'
    ];

    for (const step of steps) {
      await this.addBuildLog(buildId, step);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work
    }

    // Generate mock artifacts
    const artifacts = [
      `dist/${config.name}-${Date.now()}.zip`,
      `build/${config.name}-bundle.js`,
      `build/${config.name}-styles.css`
    ];

    buildResult.artifacts = artifacts;
    buildResult.metrics.bundleSize = Math.floor(Math.random() * 1000000) + 100000; // Mock bundle size
    buildResult.metrics.performanceScore = Math.floor(Math.random() * 100) + 70; // Mock performance score
  }

  /**
   * Update build status
   */
  private async updateBuildStatus(
    buildId: string,
    status: BuildResult['status'],
    errors: string[] = [],
    duration?: number
  ): Promise<void> {
    const buildResult = this.buildResults.get(buildId);
    if (!buildResult) {
      throw new Error(`Build result ${buildId} not found`);
    }

    const updatedResult: BuildResult = {
      ...buildResult,
      status,
      errors: [...buildResult.errors, ...errors],
      ...(duration && { duration })
    };

    this.buildResults.set(buildId, updatedResult);

    this.eventBus.emit('build:status:updated', {
      timestamp: new Date().toISOString(),
      buildId,
      status,
      errors,
      duration
    });
  }

  /**
   * Add log entry to build
   */
  private async addBuildLog(buildId: string, message: string): Promise<void> {
    const buildResult = this.buildResults.get(buildId);
    if (!buildResult) {
      throw new Error(`Build result ${buildId} not found`);
    }

    const logEntry = `[${new Date().toISOString()}] ${message}`;
    buildResult.logs.push(logEntry);
    this.buildResults.set(buildId, buildResult);

    this.eventBus.emit('build:log:added', {
      timestamp: new Date().toISOString(),
      buildId,
      logEntry
    });
  }

  /**
   * Deploy a successful build
   */
  async deployBuild(buildResultId: string): Promise<string> {
    const buildResult = this.buildResults.get(buildResultId);
    if (!buildResult) {
      throw new Error(`Build result ${buildResultId} not found`);
    }

    if (buildResult.status !== 'success') {
      throw new Error(`Cannot deploy build with status: ${buildResult.status}`);
    }

    const config = this.buildConfigs.get(buildResult.buildConfigId);
    if (!config) {
      throw new Error(`Build configuration ${buildResult.buildConfigId} not found`);
    }

    const deploymentId = `deployment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const deploymentResult: DeploymentResult = {
      id: deploymentId,
      buildResultId,
      status: 'pending',
      target: config.deploy.target,
      startTime: now,
      logs: [],
      errors: []
    };

    this.deploymentResults.set(deploymentId, deploymentResult);

    this.eventBus.emit('deploy:started', {
      timestamp: new Date().toISOString(),
      deploymentId,
      buildResultId,
      config
    });

    // Execute deployment
    this.executeDeployment(deploymentId, config);

    return deploymentId;
  }

  /**
   * Execute deployment
   */
  private async executeDeployment(deploymentId: string, config: BuildConfig): Promise<void> {
    const deploymentResult = this.deploymentResults.get(deploymentId);
    if (!deploymentResult) return;

    const startTime = Date.now();
    try {
      // Update status to deploying
      deploymentResult.status = 'deploying';
      this.deploymentResults.set(deploymentId, deploymentResult);

      // Simulate deployment process
      const steps = [
        'Preparing deployment environment...',
        'Uploading artifacts...',
        'Configuring services...',
        'Starting application...',
        'Running health checks...',
        'Deployment completed successfully'
      ];

      for (const step of steps) {
        deploymentResult.logs.push(`[${new Date().toISOString()}] ${step}`);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate work
      }

      // Update deployment result
      const endTime = new Date().toISOString();
      const duration = Date.now() - startTime;

      deploymentResult.status = 'success';
      deploymentResult.endTime = endTime;
      deploymentResult.duration = duration;
      deploymentResult.url = `https://${config.deploy.target}.example.com/${config.name}`;

      this.deploymentResults.set(deploymentId, deploymentResult);

      this.eventBus.emit('deploy:completed', {
        timestamp: new Date().toISOString(),
        deploymentId,
        result: deploymentResult
      });

    } catch (error) {
      const endTime = new Date().toISOString();
      const duration = Date.now() - startTime;

      deploymentResult.status = 'failed';
      deploymentResult.endTime = endTime;
      deploymentResult.duration = duration;
      deploymentResult.errors.push(error instanceof Error ? error.message : 'Unknown error');

      this.deploymentResults.set(deploymentId, deploymentResult);

      this.eventBus.emit('deploy:failed', {
        timestamp: new Date().toISOString(),
        deploymentId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Register API specification
   */
  async registerAPISpec(spec: Omit<APISpec, 'id'>): Promise<string> {
    const id = `api-spec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const apiSpec: APISpec = {
      ...spec,
      id
    };

    this.apiSpecs.set(id, apiSpec);

    this.eventBus.emit('api:spec:registered', {
      timestamp: new Date().toISOString(),
      specId: id,
      spec: apiSpec
    });

    return id;
  }

  /**
   * Update API specification
   */
  async updateAPISpec(specId: string): Promise<boolean> {
    const spec = this.apiSpecs.get(specId);
    if (!spec) {
      throw new Error(`API specification ${specId} not found`);
    }

    // Trigger rebuild if needed
    const configs = Array.from(this.buildConfigs.values()).filter(
      config => config.type === 'backend' || config.type === 'full-stack'
    );

    for (const config of configs) {
      await this.queueBuild(config.id);
    }

    this.eventBus.emit('api:spec:rebuild:triggered', {
      timestamp: new Date().toISOString(),
      specId,
      affectedConfigs: configs.length
    });

    return true;
  }

  /**
   * Get build status
   */
  getBuildStatus(buildId: string): BuildResult | null {
    return this.buildResults.get(buildId) || null;
  }

  /**
   * Get deployment status
   */
  getDeploymentStatus(deploymentId: string): DeploymentResult | null {
    return this.deploymentResults.get(deploymentId) || null;
  }

  /**
   * Get all build configurations
   */
  getAllBuildConfigs(): BuildConfig[] {
    return Array.from(this.buildConfigs.values());
  }

  /**
   * Get recent build results
   */
  getRecentBuildResults(limit: number = 10): BuildResult[] {
    return Array.from(this.buildResults.values())
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, limit);
  }

  /**
   * Get recent deployment results
   */
  getRecentDeploymentResults(limit: number = 10): DeploymentResult[] {
    return Array.from(this.deploymentResults.values())
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, limit);
  }

  /**
   * Get agent status
   */
  getAgentStatus(): {
    isRunning: boolean;
    currentBuild?: string;
    queueLength: number;
    totalBuilds: number;
    totalDeployments: number;
  } {
    return {
      isRunning: this.isRunning,
      currentBuild: this.currentBuild,
      queueLength: this.buildQueue.length,
      totalBuilds: this.buildResults.size,
      totalDeployments: this.deploymentResults.size
    };
  }
} 
