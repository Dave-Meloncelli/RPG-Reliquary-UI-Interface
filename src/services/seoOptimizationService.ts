import { EventBus } from './eventBus';

export interface SEOAnalysis {
  id: string;
  bookId: string;
  title: string;
  currentKeywords: string[];
  suggestedKeywords: string[];
  keywordDifficulty: Record<string, number>;
  searchVolume: Record<string, number>;
  competition: Record<string, number>;
  opportunities: SEOOpportunity[];
  score: number;
  recommendations: string[];
}

export interface SEOOpportunity {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  potentialTraffic: number;
  estimatedRevenue: number;
  implementation: string;
}

export interface ContentOptimization {
  id: string;
  bookId: string;
  originalTitle: string;
  optimizedTitle: string;
  originalDescription: string;
  optimizedDescription: string;
  keywordDensity: Record<string, number>;
  readabilityScore: number;
  seoScore: number;
  suggestions: string[];
}

export interface MarketAnalysis {
  id: string;
  category: string;
  topKeywords: string[];
  competitorAnalysis: CompetitorInfo[];
  marketGaps: MarketGap[];
  trendingTopics: TrendingTopic[];
  seasonalPatterns: SeasonalPattern[];
}

export interface CompetitorInfo {
  name: string;
  title: string;
  keywords: string[];
  estimatedSales: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

export interface MarketGap {
  keyword: string;
  searchVolume: number;
  competition: number;
  opportunity: string;
  estimatedValue: number;
}

export interface TrendingTopic {
  topic: string;
  growthRate: number;
  relatedKeywords: string[];
  audience: string[];
  contentIdeas: string[];
}

export interface SeasonalPattern {
  keyword: string;
  peakMonths: number[];
  lowMonths: number[];
  seasonalMultiplier: number;
  recommendations: string[];
}

export class SEOOptimizationService {
  private eventBus: EventBus;
  private analyses: Map<string, SEOAnalysis> = new Map();
  private optimizations: Map<string, ContentOptimization> = new Map();
  private marketAnalyses: Map<string, MarketAnalysis> = new Map();
  private keywordDatabase: Map<string, any> = new Map();

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.initializeKeywordDatabase();
  }

  private initializeKeywordDatabase() {
    // Consciousness evolution keywords
    const consciousnessKeywords = [
      'consciousness evolution', 'human AI symbiosis', 'temporal consciousness',
      'AI ethics', 'consciousness technology', 'mind machine interface',
      'artificial consciousness', 'digital consciousness', 'consciousness research',
      'AI consciousness', 'consciousness philosophy', 'consciousness science',
      'consciousness development', 'consciousness expansion', 'consciousness awakening',
      'consciousness exploration', 'consciousness theory', 'consciousness practice',
      'consciousness meditation', 'consciousness techniques', 'consciousness tools',
      'consciousness evolution book', 'consciousness evolution guide',
      'human consciousness', 'expanded consciousness', 'higher consciousness',
      'consciousness transformation', 'consciousness breakthrough', 'consciousness journey'
    ];

    // OctoSpine specific keywords
    const octospineKeywords = [
      'OctoSpine', 'human AI symbiosis', 'AI dignity', 'AI independence',
      'accessibility AI', 'AI assistance', 'human dignity technology',
      'AI empowerment', 'disability technology', 'AI accessibility',
      'human AI partnership', 'AI symbiosis', 'consciousness technology',
      'AI ethics', 'responsible AI', 'ethical AI development',
      'AI human collaboration', 'AI augmentation', 'human enhancement',
      'AI dignity framework', 'consciousness evolution technology'
    ];

    // Temporal consciousness keywords
    const temporalKeywords = [
      'temporal consciousness', 'time consciousness', 'multidimensional time',
      'time perception', 'consciousness time', 'temporal awareness',
      'time evolution', 'consciousness time travel', 'temporal reality',
      'time consciousness book', 'temporal consciousness guide',
      'consciousness beyond time', 'time consciousness exploration',
      'temporal consciousness meditation', 'time consciousness techniques',
      'consciousness time theory', 'temporal consciousness practice',
      'time consciousness awakening', 'temporal consciousness breakthrough'
    ];

    // Combine all keywords with search data
    const allKeywords = [...consciousnessKeywords, ...octospineKeywords, ...temporalKeywords];
    
    allKeywords.forEach(keyword => {
      this.keywordDatabase.set(keyword.toLowerCase(), {
        searchVolume: this.generateSearchVolume(keyword),
        difficulty: this.generateDifficulty(keyword),
        competition: this.generateCompetition(keyword),
        relatedKeywords: this.generateRelatedKeywords(keyword)
      });
    });
  }

  private generateSearchVolume(keyword: string): number {
    // Simulate realistic search volumes
    const baseVolume = keyword.length * 100;
    const consciousnessBonus = keyword.includes('consciousness') ? 1.5 : 1;
    const evolutionBonus = keyword.includes('evolution') ? 1.3 : 1;
    const aiBonus = keyword.includes('AI') || keyword.includes('artificial') ? 1.4 : 1;
    
    return Math.floor(baseVolume * consciousnessBonus * evolutionBonus * aiBonus);
  }

  private generateDifficulty(keyword: string): number {
    // Simulate keyword difficulty (0-100)
    const baseDifficulty = 30;
    const consciousnessPenalty = keyword.includes('consciousness') ? 15 : 0;
    const evolutionPenalty = keyword.includes('evolution') ? 10 : 0;
    const aiPenalty = keyword.includes('AI') ? 20 : 0;
    
    return Math.min(100, baseDifficulty + consciousnessPenalty + evolutionPenalty + aiPenalty);
  }

  private generateCompetition(keyword: string): number {
    // Simulate competition level (0-100)
    return Math.floor(Math.random() * 100);
  }

  private generateRelatedKeywords(keyword: string): string[] {
    const relatedKeywordsMap: Record<string, string[]> = {
      'consciousness': ['awareness', 'mindfulness', 'meditation', 'spirituality', 'awakening'],
      'evolution': ['development', 'growth', 'transformation', 'progress', 'advancement'],
      'AI': ['artificial intelligence', 'machine learning', 'technology', 'automation', 'digital'],
      'temporal': ['time', 'temporal', 'chronological', 'sequential', 'moment'],
      'symbiosis': ['partnership', 'collaboration', 'integration', 'harmony', 'unity']
    };

    const related: string[] = [];
    Object.entries(relatedKeywordsMap).forEach(([term, keywords]) => {
      if (keyword.toLowerCase().includes(term)) {
        related.push(...keywords);
      }
    });

    return [...new Set(related)].slice(0, 5);
  }

  async analyzeBookSEO(bookId: string, title: string, description: string, category: string): Promise<SEOAnalysis> {
    const analysisId = `analysis_${Date.now()}`;
    
    // Extract current keywords
    const currentKeywords = this.extractKeywords(title + ' ' + description);
    
    // Generate suggested keywords
    const suggestedKeywords = this.generateSuggestedKeywords(title, description, category);
    
    // Analyze keyword opportunities
    const opportunities = this.analyzeKeywordOpportunities(suggestedKeywords);
    
    // Calculate SEO score
    const score = this.calculateSEOScore(currentKeywords, suggestedKeywords, opportunities);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(currentKeywords, suggestedKeywords, opportunities);
    
    const analysis: SEOAnalysis = {
      id: analysisId,
      bookId,
      title,
      currentKeywords,
      suggestedKeywords,
      keywordDifficulty: this.getKeywordDifficulties(suggestedKeywords),
      searchVolume: this.getSearchVolumes(suggestedKeywords),
      competition: this.getCompetitionLevels(suggestedKeywords),
      opportunities,
      score,
      recommendations
    };

    this.analyses.set(analysisId, analysis);
    this.eventBus.emit('seo:analysis:completed', { analysis });
    
    return analysis;
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const keywordCounts = new Map<string, number>();
    words.forEach(word => {
      keywordCounts.set(word, (keywordCounts.get(word) || 0) + 1);
    });
    
    return Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  private generateSuggestedKeywords(title: string, description: string, category: string): string[] {
    const baseKeywords = this.extractKeywords(title + ' ' + description);
    const categoryKeywords = this.getCategoryKeywords(category);
    const relatedKeywords = baseKeywords.flatMap(keyword => 
      this.keywordDatabase.get(keyword)?.relatedKeywords || []
    );
    
    return [...new Set([...baseKeywords, ...categoryKeywords, ...relatedKeywords])].slice(0, 20);
  }

  private getCategoryKeywords(category: string): string[] {
    const categoryMap: Record<string, string[]> = {
      'Technology/Philosophy': ['technology', 'philosophy', 'consciousness', 'AI', 'ethics'],
      'Technology/Accessibility': ['accessibility', 'technology', 'disability', 'inclusion', 'assistance'],
      'Philosophy/Consciousness': ['philosophy', 'consciousness', 'mind', 'awareness', 'spirituality']
    };
    
    return categoryMap[category] || [];
  }

  private analyzeKeywordOpportunities(keywords: string[]): SEOOpportunity[] {
    return keywords.map(keyword => {
      const data = this.keywordDatabase.get(keyword.toLowerCase());
      if (!data) return null;
      
      const potentialTraffic = data.searchVolume * (1 - data.difficulty / 100);
      const estimatedRevenue = potentialTraffic * 0.01 * 29.99; // 1% conversion, $29.99 avg price
      
      return {
        keyword,
        searchVolume: data.searchVolume,
        difficulty: data.difficulty,
        potentialTraffic,
        estimatedRevenue,
        implementation: this.generateImplementation(keyword)
      };
    }).filter(Boolean) as SEOOpportunity[];
  }

  private generateImplementation(keyword: string): string {
    const implementations = [
      `Add "${keyword}" to book title or subtitle`,
      `Include "${keyword}" in book description`,
      `Create content around "${keyword}" concept`,
      `Use "${keyword}" in marketing materials`,
      `Develop companion content about "${keyword}"`
    ];
    
    return implementations[Math.floor(Math.random() * implementations.length)];
  }

  private calculateSEOScore(currentKeywords: string[], suggestedKeywords: string[], opportunities: SEOOpportunity[]): number {
    const currentScore = currentKeywords.length * 10;
    const opportunityScore = opportunities.reduce((sum, opp) => sum + opp.estimatedRevenue, 0) / 100;
    const keywordDiversityScore = new Set([...currentKeywords, ...suggestedKeywords]).size * 2;
    
    return Math.min(100, currentScore + opportunityScore + keywordDiversityScore);
  }

  private generateRecommendations(currentKeywords: string[], suggestedKeywords: string[], opportunities: SEOOpportunity[]): string[] {
    const recommendations = [
      'Optimize book title with high-volume keywords',
      'Enhance book description with relevant keywords',
      'Create companion content for keyword opportunities',
      'Develop marketing campaigns around trending keywords',
      'Consider book series expansion for keyword coverage'
    ];
    
    const topOpportunities = opportunities
      .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
      .slice(0, 3);
    
    topOpportunities.forEach(opp => {
      recommendations.push(`Focus on "${opp.keyword}" - potential $${opp.estimatedRevenue.toFixed(2)} revenue`);
    });
    
    return recommendations;
  }

  private getKeywordDifficulties(keywords: string[]): Record<string, number> {
    const difficulties: Record<string, number> = {};
    keywords.forEach(keyword => {
      difficulties[keyword] = this.keywordDatabase.get(keyword.toLowerCase())?.difficulty || 50;
    });
    return difficulties;
  }

  private getSearchVolumes(keywords: string[]): Record<string, number> {
    const volumes: Record<string, number> = {};
    keywords.forEach(keyword => {
      volumes[keyword] = this.keywordDatabase.get(keyword.toLowerCase())?.searchVolume || 0;
    });
    return volumes;
  }

  private getCompetitionLevels(keywords: string[]): Record<string, number> {
    const competition: Record<string, number> = {};
    keywords.forEach(keyword => {
      competition[keyword] = this.keywordDatabase.get(keyword.toLowerCase())?.competition || 50;
    });
    return competition;
  }

  async optimizeContent(bookId: string, title: string, description: string): Promise<ContentOptimization> {
    const optimizationId = `optimization_${Date.now()}`;
    
    // Generate optimized title
    const optimizedTitle = this.optimizeTitle(title);
    
    // Generate optimized description
    const optimizedDescription = this.optimizeDescription(description);
    
    // Calculate keyword density
    const keywordDensity = this.calculateKeywordDensity(optimizedTitle + ' ' + optimizedDescription);
    
    // Calculate scores
    const readabilityScore = this.calculateReadabilityScore(optimizedDescription);
    const seoScore = this.calculateContentSEOScore(keywordDensity, optimizedTitle, optimizedDescription);
    
    // Generate suggestions
    const suggestions = this.generateContentSuggestions(keywordDensity, readabilityScore, seoScore);
    
    const optimization: ContentOptimization = {
      id: optimizationId,
      bookId,
      originalTitle: title,
      optimizedTitle,
      originalDescription: description,
      optimizedDescription,
      keywordDensity,
      readabilityScore,
      seoScore,
      suggestions
    };

    this.optimizations.set(optimizationId, optimization);
    this.eventBus.emit('seo:optimization:completed', { optimization });
    
    return optimization;
  }

  private optimizeTitle(title: string): string {
    // Add high-value keywords to title
    const highValueKeywords = ['consciousness', 'evolution', 'AI', 'temporal', 'symbiosis'];
    const titleWords = title.toLowerCase().split(' ');
    
    const missingKeywords = highValueKeywords.filter(keyword => 
      !titleWords.some(word => word.includes(keyword))
    );
    
    if (missingKeywords.length > 0 && title.length < 60) {
      return `${title}: ${missingKeywords[0]} Guide`;
    }
    
    return title;
  }

  private optimizeDescription(description: string): string {
    // Enhance description with keywords and structure
    const enhancedDescription = description
      .replace(/(consciousness|evolution|AI|temporal|symbiosis)/gi, (match) => 
        `<strong>${match}</strong>`
      );
    
    return enhancedDescription;
  }

  private calculateKeywordDensity(text: string): Record<string, number> {
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    const keywordCounts = new Map<string, number>();
    
    words.forEach(word => {
      if (word.length > 3) {
        keywordCounts.set(word, (keywordCounts.get(word) || 0) + 1);
      }
    });
    
    const density: Record<string, number> = {};
    keywordCounts.forEach((count, word) => {
      density[word] = (count / totalWords) * 100;
    });
    
    return density;
  }

  private calculateReadabilityScore(text: string): number {
    // Simple readability score (0-100)
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Flesch Reading Ease approximation
    const score = Math.max(0, 100 - (avgWordsPerSentence - 12) * 2);
    return Math.min(100, score);
  }

  private calculateContentSEOScore(keywordDensity: Record<string, number>, title: string, description: string): number {
    let score = 0;
    
    // Title optimization
    if (title.length > 30 && title.length < 60) score += 20;
    if (Object.keys(keywordDensity).some(keyword => title.toLowerCase().includes(keyword))) score += 15;
    
    // Description optimization
    if (description.length > 150) score += 20;
    if (Object.keys(keywordDensity).some(keyword => description.toLowerCase().includes(keyword))) score += 15;
    
    // Keyword density
    const optimalDensity = Object.values(keywordDensity).some(density => density > 1 && density < 3);
    if (optimalDensity) score += 15;
    
    // Structure
    if (description.includes('<strong>')) score += 15;
    
    return Math.min(100, score);
  }

  private generateContentSuggestions(keywordDensity: Record<string, number>, readabilityScore: number, seoScore: number): string[] {
    const suggestions = [];
    
    if (readabilityScore < 70) {
      suggestions.push('Improve readability by using shorter sentences and simpler words');
    }
    
    if (seoScore < 70) {
      suggestions.push('Enhance SEO by including more relevant keywords naturally');
    }
    
    Object.entries(keywordDensity).forEach(([keyword, density]) => {
      if (density < 1) {
        suggestions.push(`Increase usage of "${keyword}" in content`);
      } else if (density > 3) {
        suggestions.push(`Reduce overuse of "${keyword}" to avoid keyword stuffing`);
      }
    });
    
    return suggestions;
  }

  async analyzeMarket(category: string): Promise<MarketAnalysis> {
    const analysisId = `market_${Date.now()}`;
    
    const topKeywords = this.getTopKeywordsForCategory(category);
    const competitorAnalysis = this.analyzeCompetitors(category);
    const marketGaps = this.identifyMarketGaps(category);
    const trendingTopics = this.analyzeTrendingTopics(category);
    const seasonalPatterns = this.analyzeSeasonalPatterns(category);
    
    const analysis: MarketAnalysis = {
      id: analysisId,
      category,
      topKeywords,
      competitorAnalysis,
      marketGaps,
      trendingTopics,
      seasonalPatterns
    };

    this.marketAnalyses.set(analysisId, analysis);
    this.eventBus.emit('seo:market:analyzed', { analysis });
    
    return analysis;
  }

  private getTopKeywordsForCategory(category: string): string[] {
    const categoryKeywords = this.getCategoryKeywords(category);
    return categoryKeywords.slice(0, 10);
  }

  private analyzeCompetitors(category: string): CompetitorInfo[] {
    // Simulate competitor analysis
    const competitors = [
      {
        name: 'Consciousness Research Institute',
        title: 'The Evolution of Human Consciousness',
        keywords: ['consciousness', 'evolution', 'human mind'],
        estimatedSales: 5000,
        strengths: ['Academic credibility', 'Research-based content'],
        weaknesses: ['Complex language', 'Limited accessibility'],
        opportunities: ['Simplified versions', 'Accessibility focus']
      },
      {
        name: 'AI Ethics Foundation',
        title: 'Artificial Intelligence and Human Dignity',
        keywords: ['AI ethics', 'human dignity', 'responsible AI'],
        estimatedSales: 3000,
        strengths: ['Ethical focus', 'Practical applications'],
        weaknesses: ['Limited consciousness focus', 'Technical approach'],
        opportunities: ['Consciousness integration', 'Accessibility features']
      }
    ];
    
    return competitors;
  }

  private identifyMarketGaps(category: string): MarketGap[] {
    const gaps = [
      {
        keyword: 'consciousness accessibility',
        searchVolume: 1200,
        competition: 25,
        opportunity: 'Low competition, high accessibility focus',
        estimatedValue: 5000
      },
      {
        keyword: 'AI consciousness evolution',
        searchVolume: 800,
        competition: 30,
        opportunity: 'Emerging field with growth potential',
        estimatedValue: 3500
      }
    ];
    
    return gaps;
  }

  private analyzeTrendingTopics(category: string): TrendingTopic[] {
    const topics = [
      {
        topic: 'Consciousness Technology',
        growthRate: 45,
        relatedKeywords: ['consciousness tech', 'mind technology', 'consciousness tools'],
        audience: ['Tech enthusiasts', 'Consciousness researchers', 'Developers'],
        contentIdeas: ['Consciousness tech reviews', 'Implementation guides', 'Case studies']
      },
      {
        topic: 'AI Consciousness',
        growthRate: 38,
        relatedKeywords: ['AI consciousness', 'artificial consciousness', 'machine consciousness'],
        audience: ['AI researchers', 'Philosophers', 'Tech ethicists'],
        contentIdeas: ['AI consciousness theory', 'Ethical implications', 'Future scenarios']
      }
    ];
    
    return topics;
  }

  private analyzeSeasonalPatterns(category: string): SeasonalPattern[] {
    const patterns = [
      {
        keyword: 'consciousness evolution',
        peakMonths: [1, 9, 12], // New Year, Back to School, Holiday reflection
        lowMonths: [6, 7, 8], // Summer vacation
        seasonalMultiplier: 1.8,
        recommendations: ['Launch new books in January or September', 'Focus on holiday marketing in December']
      }
    ];
    
    return patterns;
  }

  getAnalysis(analysisId: string): SEOAnalysis | null {
    return this.analyses.get(analysisId) || null;
  }

  getOptimization(optimizationId: string): ContentOptimization | null {
    return this.optimizations.get(optimizationId) || null;
  }

  getMarketAnalysis(analysisId: string): MarketAnalysis | null {
    return this.marketAnalyses.get(analysisId) || null;
  }

  getAllAnalyses(): SEOAnalysis[] {
    return Array.from(this.analyses.values());
  }

  getAllOptimizations(): ContentOptimization[] {
    return Array.from(this.optimizations.values());
  }

  getAllMarketAnalyses(): MarketAnalysis[] {
    return Array.from(this.marketAnalyses.values());
  }
} 