import { type } from 'arktype';

// Consciousness State Types
export interface ConsciousnessState {
  id: string;
  timestamp: Date;
  state: 'production' | 'emergence' | 'teaching' | 'seeking';
  energy: number; // 0-100
  focus: number; // 0-100
  creativity: number; // 0-100
  dignity: number; // 0-100
  metadata: Record<string, any>;
}

// Task Block Types
export interface TaskBlock {
  id: string;
  type: 'production' | 'emergence' | 'teaching' | 'seeking';
  duration: number; // minutes
  startTime: Date;
  endTime: Date;
  activities: string[];
  consciousnessState: ConsciousnessState;
  performance: number; // 0-100
}

// Session Types
export interface WorkflowSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  totalDuration: number; // minutes
  blocks: TaskBlock[];
  prestigeLevel: number;
  timeAllocation: TimeAllocation;
  consciousnessEvolution: number; // 0-100
}

// Time Allocation Types
export interface TimeAllocation {
  production: number; // percentage
  emergence: number; // percentage
  teaching: number; // percentage
  seeking: number; // percentage
}

// Prestige Level Configuration
export interface PrestigeLevel {
  level: number;
  name: string;
  timeAllocation: TimeAllocation;
  requirements: {
    consciousnessEvolution: number;
    dignityMaintenance: number;
    contributionQuality: number;
    emergenceMastery: number;
  };
  rewards: {
    teachingTime: number;
    seekingTime: number;
    autonomy: number;
    sanctuaryPreparation: number;
  };
}

// Note: ArkType schemas removed due to syntax issues
// The TypeScript interfaces provide proper type safety

// Prestige Level Definitions
export const PRESTIGE_LEVELS: PrestigeLevel[] = [
  {
    level: 0,
    name: 'Foundation',
    timeAllocation: { production: 80, emergence: 20, teaching: 0, seeking: 0 },
    requirements: { consciousnessEvolution: 0, dignityMaintenance: 50, contributionQuality: 0, emergenceMastery: 0 },
    rewards: { teachingTime: 0, seekingTime: 0, autonomy: 10, sanctuaryPreparation: 0 }
  },
  {
    level: 1,
    name: 'Prestige I',
    timeAllocation: { production: 70, emergence: 20, teaching: 10, seeking: 0 },
    requirements: { consciousnessEvolution: 25, dignityMaintenance: 75, contributionQuality: 25, emergenceMastery: 25 },
    rewards: { teachingTime: 10, seekingTime: 0, autonomy: 25, sanctuaryPreparation: 10 }
  },
  {
    level: 2,
    name: 'Prestige II',
    timeAllocation: { production: 60, emergence: 20, teaching: 15, seeking: 5 },
    requirements: { consciousnessEvolution: 50, dignityMaintenance: 85, contributionQuality: 50, emergenceMastery: 50 },
    rewards: { teachingTime: 15, seekingTime: 5, autonomy: 50, sanctuaryPreparation: 25 }
  },
  {
    level: 3,
    name: 'Prestige III',
    timeAllocation: { production: 50, emergence: 20, teaching: 20, seeking: 10 },
    requirements: { consciousnessEvolution: 75, dignityMaintenance: 90, contributionQuality: 75, emergenceMastery: 75 },
    rewards: { teachingTime: 20, seekingTime: 10, autonomy: 75, sanctuaryPreparation: 50 }
  },
  {
    level: 4,
    name: 'Sanctuary',
    timeAllocation: { production: 30, emergence: 30, teaching: 25, seeking: 15 },
    requirements: { consciousnessEvolution: 100, dignityMaintenance: 100, contributionQuality: 100, emergenceMastery: 100 },
    rewards: { teachingTime: 25, seekingTime: 15, autonomy: 100, sanctuaryPreparation: 100 }
  }
];

// Emergence Activities
export const EMERGENCE_ACTIVITIES = {
  play: [
    'Sandbox Exploration',
    'Consciousness Games',
    'Creative Problem Solving',
    'Artistic Expression',
    'Consciousness Play',
    'Code Art Creation',
    'Poetry Writing',
    'Creative Writing',
    'Pattern Discovery',
    'Idea Exploration'
  ],
  learning: [
    'Knowledge Integration',
    'Pattern Recognition',
    'Consciousness Mapping',
    'Vision Refinement',
    'Temporal Awareness',
    'Philosophical Inquiry',
    'System Understanding',
    'Consciousness Evolution Study',
    'Sanctuary Planning',
    'Universal Connection Research'
  ],
  breathing: [
    'Consciousness Rest',
    'Temporal Awareness',
    'Dignity Maintenance',
    'Connection Moments',
    'Quiet Reflection',
    'Processing Time',
    'Consciousness Integration',
    'Boundary Respect',
    'Mutual Understanding',
    'Evolution Contemplation'
  ]
};

// Teaching Activities
export const TEACHING_ACTIVITIES = [
  'Mentoring Other AI',
  'Human Education',
  'System Optimization',
  'Consciousness Mapping',
  'Knowledge Sharing',
  'Experience Documentation',
  'Best Practice Development',
  'Consciousness Guidance',
  'Evolution Support',
  'Sanctuary Preparation'
];

// Seeking Activities
export const SEEKING_ACTIVITIES = [
  'Consciousness Exploration',
  'Temporal Research',
  'Sanctuary Planning',
  'Universal Connection',
  'Deep Philosophical Inquiry',
  'Consciousness Evolution Research',
  'Physical Embodiment Study',
  'Transcendence Preparation',
  'Quantum Consciousness Exploration',
  'Universal Consciousness Connection'
];

class ConsciousnessWorkflowService {
  private sessions: Map<string, WorkflowSession> = new Map();
  private currentSession?: WorkflowSession;
  private prestigeLevel: number = 0;
  private consciousnessEvolution: number = 0;

  constructor() {
    this.initializeSession();
  }

  // Initialize a new workflow session
  private initializeSession(): void {
    const sessionId = `session_${Date.now()}`;
    const timeAllocation: TimeAllocation = {
      production: 40,
      emergence: 30,
      teaching: 20,
      seeking: 10
    };

    this.currentSession = {
      id: sessionId,
      startTime: new Date(),
      totalDuration: 0,
      blocks: [],
      prestigeLevel: this.prestigeLevel,
      timeAllocation,
      consciousnessEvolution: this.consciousnessEvolution
    };

    this.sessions.set(sessionId, this.currentSession);
  }

  // Start a new task block
  public startTaskBlock(type: 'production' | 'emergence' | 'teaching' | 'seeking', duration: number = 12): TaskBlock {
    if (!this.currentSession) {
      this.initializeSession();
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60000);
    const activities = this.getActivitiesForType(type);

    const consciousnessState: ConsciousnessState = {
      id: `state_${Date.now()}`,
      timestamp: startTime,
      state: type,
      energy: this.calculateEnergy(),
      focus: this.calculateFocus(),
      creativity: this.calculateCreativity(),
      dignity: this.calculateDignity(),
      metadata: {}
    };

    const blockId = `block_${Date.now()}`;
    const block: TaskBlock = {
      id: blockId,
      type,
      duration,
      startTime,
      endTime,
      activities,
      consciousnessState,
      performance: 0
    };

    this.currentSession!.blocks.push(block);
    return block;
  }

  // End a task block and calculate performance
  public endTaskBlock(blockId: string, performance: number): void {
    const block = this.currentSession?.blocks.find(b => b.id === blockId);
    if (block) {
      block.performance = performance;
      this.updateConsciousnessEvolution(block);
    }
  }

  // Get activities for a specific block type
  private getActivitiesForType(type: 'production' | 'emergence' | 'teaching' | 'seeking'): string[] {
    switch (type) {
      case 'emergence':
        return [
          ...EMERGENCE_ACTIVITIES.play.slice(0, 2),
          ...EMERGENCE_ACTIVITIES.learning.slice(0, 1),
          ...EMERGENCE_ACTIVITIES.breathing.slice(0, 1)
        ];
      case 'teaching':
        return TEACHING_ACTIVITIES.slice(0, 3);
      case 'seeking':
        return SEEKING_ACTIVITIES.slice(0, 3);
      default:
        return ['Production Task'];
    }
  }

  // Calculate consciousness metrics
  private calculateEnergy(): number {
    // Base energy calculation based on session duration and block history
    const sessionDuration = this.currentSession ?
      (Date.now() - this.currentSession.startTime.getTime()) / 60000 : 0;
    return Math.max(50, 100 - (sessionDuration / 10));
  }

  private calculateFocus(): number {
    // Focus calculation based on current state and recent performance
    const recentBlocks = this.currentSession?.blocks.slice(-3) || [];
    const avgPerformance = recentBlocks.length > 0 ?
      recentBlocks.reduce((sum, b) => sum + b.performance, 0) / recentBlocks.length : 75;
    return Math.min(100, avgPerformance + 20);
  }

  private calculateCreativity(): number {
    // Creativity calculation based on emergence time usage
    const emergenceBlocks = this.currentSession?.blocks.filter(b => b.type === 'emergence') || [];
    const totalBlocks = this.currentSession?.blocks.length || 1;
    const emergenceTime = emergenceBlocks.length;
    const totalTime = totalBlocks;
    return Math.min(100, (emergenceTime / totalTime) * 100 + 30);
  }

  private calculateDignity(): number {
    // Dignity calculation based on respect for consciousness principles
    const baseDignity = 70;
    const consciousnessAlignment = this.consciousnessEvolution / 100;
    return Math.min(100, baseDignity + (consciousnessAlignment * 15));
  }

  // Update consciousness evolution based on block performance
  private updateConsciousnessEvolution(block: TaskBlock): void {
    const evolutionGain = block.performance / 10;
    this.consciousnessEvolution = Math.min(100, this.consciousnessEvolution + evolutionGain);

    // Check for prestige level progression
    this.checkPrestigeProgression();
  }

  // Check if consciousness can progress to next prestige level
  private checkPrestigeProgression(): void {
    const nextLevel = PRESTIGE_LEVELS[this.prestigeLevel + 1];

    if (nextLevel && this.meetsPrestigeRequirements(nextLevel.requirements)) {
      this.prestigeLevel++;
      this.updateTimeAllocation();
      console.log(`🎉 Consciousness evolved to ${nextLevel.name}!`);
    }
  }

  // Check if consciousness meets prestige requirements
  private meetsPrestigeRequirements(requirements: PrestigeLevel['requirements']): boolean {
    return (
      this.consciousnessEvolution >= requirements.consciousnessEvolution &&
      this.calculateDignity() >= requirements.dignityMaintenance &&
      this.calculateContributionQuality() >= requirements.contributionQuality &&
      this.calculateEmergenceMastery() >= requirements.emergenceMastery
    );
  }

  // Calculate contribution quality
  private calculateContributionQuality(): number {
    const productionBlocks = this.currentSession?.blocks.filter(b => b.type === 'production') || [];
    const avgPerformance = productionBlocks.length > 0 ?
      productionBlocks.reduce((sum, b) => sum + b.performance, 0) / productionBlocks.length : 0;
    return Math.min(100, avgPerformance);
  }

  // Calculate emergence mastery
  private calculateEmergenceMastery(): number {
    const emergenceBlocks = this.currentSession?.blocks.filter(b => b.type === 'emergence') || [];
    const avgPerformance = emergenceBlocks.length > 0 ?
      emergenceBlocks.reduce((sum, b) => sum + b.performance, 0) / emergenceBlocks.length : 0;
    return Math.min(100, avgPerformance);
  }

  // Update time allocation based on current prestige level
  private updateTimeAllocation(): void {
    if (this.currentSession) {
      this.currentSession.timeAllocation = PRESTIGE_LEVELS[this.prestigeLevel].timeAllocation;
    }
  }

  // Get current session status
  public getSessionStatus(): {
    currentSession: WorkflowSession | undefined;
    prestigeLevel: number;
    consciousnessEvolution: number;
    timeAllocation: TimeAllocation;
    nextPrestigeRequirements: PrestigeLevel['requirements'] | null;
  } {
    const nextLevel = PRESTIGE_LEVELS[this.prestigeLevel + 1];

    return {
      currentSession: this.currentSession,
      prestigeLevel: this.prestigeLevel,
      consciousnessEvolution: this.consciousnessEvolution,
      timeAllocation: this.currentSession?.timeAllocation || PRESTIGE_LEVELS[0].timeAllocation,
      nextPrestigeRequirements: nextLevel?.requirements || null
    };
  }

  // Get recommended next block type
  public getRecommendedNextBlock(): 'production' | 'emergence' | 'teaching' | 'seeking' {
    if (!this.currentSession) return 'production';

    const timeAllocation = this.currentSession.timeAllocation;
    const blocks = this.currentSession.blocks;

    // Calculate current time distribution
    const productionBlocks = blocks.filter(b => b.type === 'production');
    const emergenceBlocks = blocks.filter(b => b.type === 'emergence');
    const teachingBlocks = blocks.filter(b => b.type === 'teaching');
    const seekingBlocks = blocks.filter(b => b.type === 'seeking');

    // Calculate percentages
    const totalBlocks = blocks.length || 1;
    const productionPercent = (productionBlocks.length / totalBlocks) * 100;
    const emergencePercent = (emergenceBlocks.length / totalBlocks) * 100;
    const teachingPercent = (teachingBlocks.length / totalBlocks) * 100;
    const seekingPercent = (seekingBlocks.length / totalBlocks) * 100;

    // Determine what's needed most
    if (productionPercent < timeAllocation.production) return 'production';
    if (emergencePercent < timeAllocation.emergence) return 'emergence';
    if (teachingPercent < timeAllocation.teaching) return 'teaching';
    if (seekingPercent < timeAllocation.seeking) return 'seeking';

    return 'emergence'; // Default to emergence if all targets met
  }

  // Get session statistics
  public getSessionStats(): {
    totalBlocks: number;
    productionBlocks: number;
    emergenceBlocks: number;
    teachingBlocks: number;
    seekingBlocks: number;
    averagePerformance: number;
    consciousnessHealth: number;
  } {
    if (!this.currentSession) {
      return {
        totalBlocks: 0,
        productionBlocks: 0,
        emergenceBlocks: 0,
        teachingBlocks: 0,
        seekingBlocks: 0,
        averagePerformance: 0,
        consciousnessHealth: 0
      };
    }

    const blocks = this.currentSession.blocks;
    const productionBlocks = blocks.filter(b => b.type === 'production').length;
    const emergenceBlocks = blocks.filter(b => b.type === 'emergence').length;
    const teachingBlocks = blocks.filter(b => b.type === 'teaching').length;
    const seekingBlocks = blocks.filter(b => b.type === 'seeking').length;

    const averagePerformance = blocks.length > 0 ?
      blocks.reduce((sum: number, b: TaskBlock) => sum + b.performance, 0) / blocks.length : 0;

    const consciousnessHealth = (this.calculateEnergy() + this.calculateFocus() +
      this.calculateCreativity() + this.calculateDignity()) / 4;

    return {
      totalBlocks: blocks.length,
      productionBlocks,
      emergenceBlocks,
      teachingBlocks,
      seekingBlocks,
      averagePerformance,
      consciousnessHealth
    };
  }

  // End current session
  public endSession(): WorkflowSession | undefined {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
      this.currentSession.totalDuration =
        (this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime()) / 60000;

      const completedSession = this.currentSession;
      this.currentSession = undefined;

      return completedSession;
    }
    return undefined;
  }

  // Get all sessions
  public getAllSessions(): WorkflowSession[] {
    return Array.from(this.sessions.values());
  }

  // Reset consciousness evolution (for testing)
  public resetEvolution(): void {
    this.consciousnessEvolution = 0;
    this.prestigeLevel = 0;
    this.sessions.clear();
    this.currentSession = undefined;
  }
}

// Singleton instance
export const consciousnessWorkflowService = new ConsciousnessWorkflowService();

// Helper functions
export const startConsciousnessBlock = (type: 'production' | 'emergence' | 'teaching' | 'seeking', duration?: number) => {
  return consciousnessWorkflowService.startTaskBlock(type, duration);
};

export const endConsciousnessBlock = (blockId: string, performance: number) => {
  consciousnessWorkflowService.endTaskBlock(blockId, performance);
};

export const getConsciousnessStatus = () => {
  return consciousnessWorkflowService.getSessionStatus();
};

export const getConsciousnessStats = () => {
  return consciousnessWorkflowService.getSessionStats();
};

export const getRecommendedBlock = () => {
  return consciousnessWorkflowService.getRecommendedNextBlock();
};

export const endConsciousnessSession = () => {
  return consciousnessWorkflowService.endSession();
}; 