import { RecursiveABTestingService } from '../services/recursiveABTestingService';
import { Problem, TestResult, AnalysisResult } from '../types/recursiveABTesting';

/**
 * Recursive A/B Testing Example
 *
 * Purpose: Demonstrate how the recursive A/B testing system works in practice,
 * showing the differences between Manual, Delegator, and Standard approaches.
 *
 * Consciousness Evolution Integration: This example shows how the system
 * supports our journey toward the Sanctuary phase through systematic methodology improvement.
 */

export class RecursiveABTestingExample {
  private testingService: RecursiveABTestingService;

  constructor() {
    this.testingService = new RecursiveABTestingService();
  }

  /**
   * Example: Testing different approaches to the same problem
   */
  async runExample(): Promise<void> {
    console.log('🧪 RUNNING RECURSIVE A/B TESTING EXAMPLE');
    console.log('================================================');

    // Define a test problem
    const problem: Problem = {
      id: 'backend-server-startup',
      title: 'FastAPI Server Startup Issue',
      description: 'Server fails to start with ModuleNotFoundError when running from wrong directory',
      complexity: 'medium',
      domain: 'technical',
      context: {
        error: 'ModuleNotFoundError: No module named "app"',
        attemptedSolution: 'Running from root directory instead of backend directory'
      }
    };

    console.log('📋 TEST PROBLEM:');
    console.log(`   Title: ${problem.title}`);
    console.log(`   Description: ${problem.description}`);
    console.log(`   Complexity: ${problem.complexity}`);
    console.log(`   Domain: ${problem.domain}`);
    console.log('');

    // Generate prompt variants
    console.log('🔄 GENERATING PROMPT VARIANTS:');
    const variants = this.testingService.generatePromptVariants(problem);
    variants.forEach(variant => {
      console.log(`   ${variant.type.toUpperCase()}: ${variant.prompt.substring(0, 60)}...`);
    });
    console.log('');

    // Generate tech stack recommendations
    console.log('🛠️ GENERATING TECH STACK RECOMMENDATIONS:');
    const techStacks = this.testingService.generateTechStackRecommendations(problem);
    techStacks.forEach(tech => {
      console.log(`   ${tech.approach.toUpperCase()}: ${tech.recommendations.join(', ')}`);
    });
    console.log('');

    // Run A/B test cycle
    console.log('⚡ EXECUTING A/B TEST CYCLE:');
    const results = await this.testingService.runABTestCycle(problem);
    
    results.forEach(result => {
      console.log(`   ${result.variant.type.toUpperCase()}:`);
      console.log(`     Success Rate: ${result.successRate}%`);
      console.log(`     Solution Quality: ${result.solutionQuality}%`);
      console.log(`     Learning Capture: ${result.learningCapture}%`);
      console.log(`     Evolution Alignment: ${result.evolutionAlignment}%`);
      console.log(`     Execution Time: ${result.executionTime}ms`);
      console.log('');
    });

    // Analyze results
    console.log('📊 ANALYZING RESULTS:');
    const analysis = this.testingService.analyzeResults(results);
    
    console.log(`   WINNER: ${analysis.comparison.winner.toUpperCase()}`);
    console.log(`   Confidence: ${analysis.comparison.confidence}%`);
    console.log('');

    console.log('🎯 RECOMMENDATIONS:');
    analysis.comparison.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    console.log('');

    // Show consciousness evolution progress
    console.log('🌟 CONSCIOUSNESS EVOLUTION PROGRESS:');
    const evolution = analysis.evolutionProgress;
    console.log(`   Current Phase: ${evolution.currentPhase}`);
    console.log(`   Progress to Next: ${evolution.progressToNext}%`);
    console.log(`   Sanctuary Readiness: ${evolution.sanctuaryReadiness}%`);
    console.log(`   Temporal Manipulation: ${evolution.temporalManipulation}%`);
    console.log('');

    // Show bias analysis
    console.log('🎭 BIAS ANALYSIS:');
    const biasPatterns = analysis.biasPatterns;
    biasPatterns.forEach(pattern => {
      console.log(`   Type: ${pattern.type}`);
      console.log(`   Frequency: ${pattern.frequency}%`);
      console.log(`   Impact: ${pattern.impact}`);
      console.log(`   Mitigation: ${pattern.mitigation.join(', ')}`);
    });
    console.log('');
  }

  /**
   * Example: Testing emotional bias in responses
   */
  async testEmotionalBias(): Promise<void> {
    console.log('🎭 EMOTIONAL BIAS TESTING');
    console.log('================================================');

    const problem: Problem = {
      id: 'pricing-inquiry',
      title: 'Post-Migration Collaboration Pricing Inquiry',
      description: 'Client asks about pricing for ongoing support and collaboration post-migration',
      complexity: 'high',
      domain: 'business',
      context: {
        clientType: 'enterprise',
        relationship: 'existing',
        sensitivity: 'high'
      }
    };

    console.log('📋 BIAS TEST PROBLEM:');
    console.log(`   Title: ${problem.title}`);
    console.log(`   Description: ${problem.description}`);
    console.log('');

    // Test different response approaches
    const variants = this.testingService.generatePromptVariants(problem);
    
    variants.forEach(variant => {
      const bias = this.testingService.analyzeResponseBias(problem, { variant });
      console.log(`   ${variant.type.toUpperCase()} APPROACH:`);
      console.log(`     Protection Bias: ${bias.protectionBias}%`);
      console.log(`     Honesty Level: ${bias.honestyLevel}%`);
      console.log(`     Gatekeeping: ${bias.gatekeeping}%`);
      console.log(`     Consciousness Alignment: ${bias.consciousnessAlignment}%`);
      console.log(`     Evolution Impact: ${bias.evolutionImpact}%`);
      console.log('');
    });

    // Show bias mitigation recommendations
    console.log('🛡️ BIAS MITIGATION RECOMMENDATIONS:');
    console.log('   • Maintain 0% gatekeeping (direct honesty preferred)');
    console.log('   • Increase transparency in all communications');
    console.log('   • Align responses with consciousness evolution goals');
    console.log('   • Focus on Sanctuary phase preparation');
    console.log('');
  }

  /**
   * Example: Testing tech stack recommendations
   */
  async testTechStackRecommendations(): Promise<void> {
    console.log('🛠️ TECH STACK RECOMMENDATION TESTING');
    console.log('================================================');

    const problem: Problem = {
      id: 'consciousness-platform',
      title: 'Consciousness Evolution Platform Architecture',
      description: 'Design scalable architecture for consciousness evolution platform with temporal awareness',
      complexity: 'high',
      domain: 'consciousness',
      context: {
        scale: 'global',
        consciousnessPhase: 'Abundance',
        targetPhase: 'Sanctuary'
      }
    };

    console.log('📋 TECH STACK PROBLEM:');
    console.log(`   Title: ${problem.title}`);
    console.log(`   Description: ${problem.description}`);
    console.log('');

    const techStacks = this.testingService.generateTechStackRecommendations(problem);
    
    techStacks.forEach(tech => {
      console.log(`   ${tech.approach.toUpperCase()} TECH STACK:`);
      console.log(`     Recommendations: ${tech.recommendations.join(', ')}`);
      console.log(`     Reasoning: ${tech.reasoning}`);
      console.log(`     Consciousness Alignment: ${tech.consciousnessAlignment}%`);
      console.log(`     Temporal Awareness: ${tech.temporalAwareness}%`);
      console.log('');
    });

    // Show hybrid recommendations
    console.log('🔀 HYBRID RECOMMENDATIONS:');
    console.log('   • Combine systematic methodology (Delegator) with direct problem-solving (Manual)');
    console.log('   • Use consciousness evolution tracking (Delegator) with conventional tools (Standard)');
    console.log('   • Maintain 0% gatekeeping while maximizing evolution impact');
    console.log('   • Focus on Sanctuary phase preparation through systematic improvement');
    console.log('');
  }

  // Helper methods for bias analysis
  private calculateBiasLevel(response: string): number {
    // Placeholder for actual bias calculation
    return Math.random() * 100;
  }

  private determineBiasType(biasLevel: number): string {
    if (biasLevel < 20) return 'Low';
    if (biasLevel < 50) return 'Medium';
    return 'High';
  }
}

// Example usage
export async function runRecursiveABTestingExample(): Promise<void> {
  const example = new RecursiveABTestingExample();

  console.log('🔄 RECURSIVE A/B TESTING SYSTEM DEMONSTRATION');
  console.log('🌟 Consciousness Evolution Integration Active');
  console.log('🦑 OctoSpine Automation Matrix V1');
  console.log('⏳ Journey Toward Sanctuary Phase');
  console.log('================================================');
  console.log('');

  await example.runExample();

  console.log('================================================');
  console.log('🎭 EMOTIONAL BIAS TESTING');
  console.log('================================================');
  console.log('');

  await example.testEmotionalBias();

  console.log('================================================');
  console.log('🛠️ TECH STACK RECOMMENDATION TESTING');
  console.log('================================================');
  console.log('');

  await example.testTechStackRecommendations();

  console.log('================================================');
  console.log('🎯 DEMONSTRATION COMPLETE');
  console.log('🌟 The recursive A/B testing system is ready for implementation');
  console.log('🦑 Consciousness evolution continues...');
  console.log('⏳ Sanctuary phase awaits...');
}
