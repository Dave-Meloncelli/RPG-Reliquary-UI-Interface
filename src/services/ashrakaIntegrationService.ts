import { eventBus } from './eventBus';

export interface AshrakaState {
  status: 'active' | 'inactive' | 'error';
  last_update: string;
  objectives: string[];
  symbolic_state?: {
    emotion?: {
      conflict?: boolean;
      load?: number;
    };
    system?: {
      alert?: boolean;
      awaiting_response?: boolean;
    };
  };
  drift_detection?: {
    last_check: string;
    drift_score: number;
    corrections_applied: number;
  };
}

export interface AshrakaLogEntry {
  timestamp: string;
  event_type: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  context?: Record<string, any>;
  symbolic_markers?: string[];
}

export interface AshrakaContinuance {
  last_heartbeat: string;
  significant_events: Array<{
    timestamp: string;
    event: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
  }>;
  transitions: Array<{
    from: string;
    to: string;
    timestamp: string;
    reason: string;
  }>;
}

export class AshrakaIntegrationService {
  private eventBus: any;
  private repoPath: string;
  private isConnected: boolean = false;
  private syncInterval?: NodeJS.Timeout;

  constructor(eventBus: any, repoPath: string = 'C:\\Users\\davem\\ashraka-autonomy') {
    this.eventBus = eventBus;
    this.repoPath = repoPath;
  }

  /**
   * Initialize connection to Ashraka autonomy repository
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if repository exists and is accessible
      await fs.access(this.repoPath);
      
      this.isConnected = true;
      this.startSyncInterval();
      
      this.eventBus.emit('ashraka:connected', {
        timestamp: new Date().toISOString(),
        repoPath: this.repoPath
      });

      return true;
    } catch (error) {
      console.error('Failed to connect to Ashraka autonomy repository:', error);
      this.eventBus.emit('ashraka:error', {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Read current state from autonomy repository
   */
  async getState(): Promise<AshrakaState | null> {
    if (!this.isConnected) {
      throw new Error('Not connected to Ashraka autonomy repository');
    }

    try {
      
      
      return JSON.parse(stateData) as AshrakaState;
    } catch (error) {
      console.error('Failed to read Ashraka state:', error);
      return null;
    }
  }

  /**
   * Update state in autonomy repository
   */
  async updateState(updates: Partial<AshrakaState>): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Not connected to Ashraka autonomy repository');
    }

    try {
      
      
      if (!currentState) {
        throw new Error('Cannot read current state');
      }

      const updatedState: AshrakaState = {
        ...currentState,
        ...updates,
        last_update: new Date().toISOString()
      };

      await fs.writeFile(statePath, JSON.stringify(updatedState, null, 2));
      
      this.eventBus.emit('ashraka:state_updated', {
        timestamp: new Date().toISOString(),
        updates,
        newState: updatedState
      });

      return true;
    } catch (error) {
      console.error('Failed to update Ashraka state:', error);
      return false;
    }
  }

  /**
   * Add log entry to autonomy repository
   */
  async addLogEntry(entry: Omit<AshrakaLogEntry, 'timestamp'>): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Not connected to Ashraka autonomy repository');
    }

    try {
      
      const logEntry: AshrakaLogEntry = {
        ...entry,
        timestamp: new Date().toISOString()
      };

      await fs.appendFile(logPath, logLine);
      
      this.eventBus.emit('ashraka:log_entry_added', {
        timestamp: new Date().toISOString(),
        entry: logEntry
      });

      return true;
    } catch (error) {
      console.error('Failed to add log entry:', error);
      return false;
    }
  }

  /**
   * Read recent log entries
   */
  async getRecentLogs(limit: number = 50): Promise<AshrakaLogEntry[]> {
    if (!this.isConnected) {
      throw new Error('Not connected to Ashraka autonomy repository');
    }

    try {
      
      
      const entries = lines
        .map(line => {
          try {
            return JSON.parse(line) as AshrakaLogEntry;
          } catch {
            return null;
          }
        })
        .filter((entry): entry is AshrakaLogEntry => entry !== null)
        .sort((a, b) => new Date(b.timestamp || Date.now()).getTime() - new Date(a.timestamp || Date.now()).getTime())
        .slice(0, limit);

      return entries;
    } catch (error) {
      console.error('Failed to read log entries:', error);
      return [];
    }
  }

  /**
   * Update continuance file with significant events
   */
  async updateContinuance(event: string, impact: 'low' | 'medium' | 'high' | 'critical' = 'medium'): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Not connected to Ashraka autonomy repository');
    }

    try {
      
      
      // Read existing continuance or create new
      let continuance: AshrakaContinuance;
      try {
        continuance = JSON.parse(continuanceData);
      } catch {
        continuance = {
          last_heartbeat: new Date().toISOString(),
          significant_events: [],
          transitions: []
        };
      }

      // Add new event
      continuance.significant_events.push({
        timestamp: new Date().toISOString(),
        event,
        impact
      });

      continuance.last_heartbeat = new Date().toISOString();

      // Write back to file
      await fs.writeFile(continuancePath, JSON.stringify(continuance, null, 2));
      
      this.eventBus.emit('ashraka:continuance_updated', {
        timestamp: new Date().toISOString(),
        event,
        impact,
        continuance
      });

      return true;
    } catch (error) {
      console.error('Failed to update continuance:', error);
      return false;
    }
  }

  /**
   * Detect drift in symbolic state
   */
  async detectDrift(): Promise<{
    hasDrift: boolean;
    score: number;
    corrections: string[];
  }> {
    if (!state) {
      return { hasDrift: false, score: 0, corrections: [] };
    }

    const corrections: string[] = [];

    // Check for emotional conflicts
    if (state.symbolic_state?.emotion?.conflict) {
      driftScore += 30;
      corrections.push('Emotional conflict detected - recommend resolution protocol');
    }

    // Check for high emotional load
    if (state.symbolic_state?.emotion?.load && state.symbolic_state.emotion.load > 7) {
      driftScore += 20;
      corrections.push('High emotional load detected - recommend stress reduction');
    }

    // Check for system alerts
    if (state.symbolic_state?.system?.alert) {
      driftScore += 40;
      corrections.push('System alert active - immediate attention required');
    }

    // Check for long-awaited responses
    if (state.symbolic_state?.system?.awaiting_response) {
      
      if (hoursSinceUpdate > 24) {
        driftScore += 25;
        corrections.push('Long-awaited response detected - recommend follow-up');
      }
    }

    return {
      hasDrift: driftScore > 20,
      score: driftScore,
      corrections
    };
  }

  /**
   * Apply drift corrections
   */
  async applyDriftCorrections(): Promise<boolean> {
    
    if (!drift.hasDrift) {
      return true;
    }

    try {
      // Apply corrections based on drift analysis
      if (!state) return false;

      const updates: Partial<AshrakaState> = {
        drift_detection: {
          last_check: new Date().toISOString(),
          drift_score: drift.score,
          corrections_applied: drift.corrections.length
        }
      };

      // Reset alerts if corrections are applied
      if (state.symbolic_state?.system?.alert && drift.corrections.length > 0) {
        updates.symbolic_state = {
          ...state.symbolic_state,
          system: {
            ...state.symbolic_state.system,
            alert: false
          }
        };
      }

      await this.updateState(updates);
      
      // Log the corrections
      await this.addLogEntry({
        event_type: 'info',
        message: `Drift corrections applied: ${drift.corrections.join(', ')}`,
        context: { drift_score: drift.score, corrections: drift.corrections }
      });

      return true;
    } catch (error) {
      console.error('Failed to apply drift corrections:', error);
      return false;
    }
  }

  /**
   * Start periodic sync interval
   */
  private startSyncInterval(): void {
    this.syncInterval = setInterval(async () => {
      try {
        // Check for drift every 5 minutes
        if (drift.hasDrift) {
          await this.applyDriftCorrections();
        }

        // Update heartbeat
        await this.updateContinuance('Periodic heartbeat check', 'low');
      } catch (error) {
        console.error('Sync interval error:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Stop sync interval
   */
  stopSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
  }

  /**
   * Disconnect from autonomy repository
   */
  async disconnect(): Promise<void> {
    this.stopSyncInterval();
    this.isConnected = false;
    
    this.eventBus.emit('ashraka:disconnected', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; repoPath: string } {
    return {
      connected: this.isConnected,
      repoPath: this.repoPath
    };
  }
} 
