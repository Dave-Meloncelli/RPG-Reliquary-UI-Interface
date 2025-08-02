import { eventBus } from './eventBus';

export interface ScanSettings {
  // Intelligent Auto-Adjustment
  autoDetectBook: boolean;
  maintainBorderSize: number; // 5-10mm configurable
  autoLightingAdjustment: boolean;
  keystoneCorrection: boolean;
  
  // Manual Override Controls
  lightIntensity: number; // 0-100% with real-time preview
  zoomLevel: number; // 0.5x-2.0x for different book sizes
  
  // Smart Presets
  preset: 'full_auto' | 'large_books' | 'glossy_covers' | 'vintage_modules';
}

export interface CzurNativeOcr {
  // Leverage built-in ABBYY OCR engine
  abbyyEngine: {
    accuracy: 'up to 99%';
    languages: '180+ including programming languages';
    processingTime: '0.5-1.5 seconds local';
    cost: '$0.00 per scan';
  };
  
  // Enhanced extraction capabilities
  extractedData: {
    title: string;
    subtitle?: string;
    author: string;
    publisher: string;
    isbn: string;
    edition: string;
    gameSystem?: string;
    productType?: string;
  };
  
  // Quality metrics
  confidence: number; // 0-1 score
  preprocessingApplied: ImagePreprocessing;
}

export interface ImagePreprocessing {
  backgroundOptimization: boolean;
  edgeCorrection: boolean;
  focusEnhancement: boolean;
  keystoneCorrection: boolean;
  lightingAdjustment: boolean;
}

export interface ScanProgress {
  step: 'detecting' | 'adjusting' | 'scanning' | 'ocr_processing' | 'enriching' | 'complete';
  progress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number;
}

export interface ScanResult {
  id: string;
  timestamp: Date;
  settings: ScanSettings;
  ocrResult: CzurNativeOcr;
  qualityScore: number;
  processingTime: number;
  errors?: string[];
  enrichedData?: EnrichedBookData;
}

export interface EnrichedBookData {
  marketValue: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
  condition: 'poor' | 'fair' | 'good' | 'very_good' | 'excellent' | 'mint';
  investmentPotential: 'low' | 'medium' | 'high' | 'very_high';
  collectorInterest: number; // 0-100
  marketTrend: 'declining' | 'stable' | 'rising' | 'hot';
  recommendedPricing: {
    min: number;
    max: number;
    optimal: number;
  };
}

class OCRService {
  private scanQueue: Array<{id: string, settings: ScanSettings, imageData: string}> = [];
  private activeScans: Map<string, ScanProgress> = new Map();
  private scanHistory: ScanResult[] = [];

  // Auto-adjustment workflow
  async autoAdjustForBook(imageData: string, settings: ScanSettings): Promise<ScanSettings> {
    const progress: ScanProgress = {
      step: 'detecting',
      progress: 0,
      message: 'Detecting book boundaries and dimensions...'
    };

    try {
      // 1. Detect book boundaries and dimensions
      progress.step = 'detecting';
      progress.progress = 20;
      progress.message = 'Analyzing book dimensions...';
      
      const bookDimensions = await this.detectBookBoundaries(imageData);
      
      // 2. Calculate optimal zoom
      progress.progress = 40;
      progress.message = 'Calculating optimal zoom level...';
      
      const optimalZoom = this.calculateOptimalZoom(bookDimensions, settings.maintainBorderSize);
      
      // 3. Analyze paper reflectivity for lighting optimization
      progress.progress = 60;
      progress.message = 'Optimizing lighting for paper type...';
      
      const lightingSettings = await this.analyzePaperReflectivity(imageData);
      
      // 4. Measure keystone distortion angle
      progress.progress = 80;
      progress.message = 'Measuring keystone distortion...';
      
      const keystoneAngle = await this.measureKeystoneDistortion(imageData);
      
      // 5. Apply corrections
      progress.progress = 90;
      progress.message = 'Applying corrections...';
      
      const adjustedSettings: ScanSettings = {
        ...settings,
        zoomLevel: optimalZoom,
        lightIntensity: lightingSettings.intensity,
        keystoneCorrection: keystoneAngle > 2, // Apply if distortion > 2 degrees
        autoLightingAdjustment: true
      };
      
      progress.progress = 100;
      progress.message = 'Auto-adjustment complete';
      
      return adjustedSettings;
      
    } catch (error) {
      console.error('Auto-adjustment failed:', error);
      throw new Error(`Auto-adjustment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Enhanced OCR processing with ABBYY engine
  async processOCR(imageData: string, settings: ScanSettings): Promise<CzurNativeOcr> {
    const progress: ScanProgress = {
      step: 'ocr_processing',
      progress: 0,
      message: 'Initializing ABBYY OCR engine...'
    };

    try {
      // Preprocessing
      progress.progress = 10;
      progress.message = 'Applying image preprocessing...';
      
      const preprocessedImage = await this.applyPreprocessing(imageData, settings);
      
      // OCR Processing
      progress.progress = 30;
      progress.message = 'Running ABBYY OCR analysis...';
      
      const ocrResult = await this.runABBYYOCR(preprocessedImage);
      
      // Data Extraction
      progress.progress = 70;
      progress.message = 'Extracting structured data...';
      
      const extractedData = await this.extractStructuredData(ocrResult);
      
      // Quality Assessment
      progress.progress = 90;
      progress.message = 'Assessing OCR quality...';
      
      const confidence = await this.assessOCRQuality(ocrResult);
      
      progress.progress = 100;
      progress.message = 'OCR processing complete';
      
      return {
        abbyyEngine: {
          accuracy: 'up to 99%',
          languages: '180+ including programming languages',
          processingTime: '0.5-1.5 seconds local',
          cost: '$0.00 per scan'
        },
        extractedData,
        confidence,
        preprocessingApplied: {
          backgroundOptimization: settings.autoLightingAdjustment,
          edgeCorrection: true,
          focusEnhancement: true,
          keystoneCorrection: settings.keystoneCorrection,
          lightingAdjustment: settings.autoLightingAdjustment
        }
      };
      
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Book enrichment with market analysis
  async enrichBookData(ocrResult: CzurNativeOcr): Promise<EnrichedBookData> {
    const progress: ScanProgress = {
      step: 'enriching',
      progress: 0,
      message: 'Starting market analysis...'
    };

    try {
      // Market value analysis
      progress.progress = 20;
      progress.message = 'Analyzing market value...';
      
      const marketValue = await this.analyzeMarketValue(ocrResult.extractedData);
      
      // Rarity assessment
      progress.progress = 40;
      progress.message = 'Assessing rarity...';
      
      const rarity = await this.assessRarity(ocrResult.extractedData);
      
      // Condition analysis
      progress.progress = 60;
      progress.message = 'Analyzing condition...';
      
      const condition = await this.analyzeCondition(ocrResult.extractedData);
      
      // Investment potential
      progress.progress = 80;
      progress.message = 'Calculating investment potential...';
      
      const investmentPotential = await this.calculateInvestmentPotential(
        marketValue, rarity, condition
      );
      
      // Pricing recommendations
      progress.progress = 90;
      progress.message = 'Generating pricing recommendations...';
      
      const recommendedPricing = await this.generatePricingRecommendations(
        marketValue, rarity, condition, investmentPotential
      );
      
      progress.progress = 100;
      progress.message = 'Enrichment complete';
      
      return {
        marketValue,
        rarity: rarity as 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary',
        condition: condition as 'poor' | 'fair' | 'good' | 'very_good' | 'excellent' | 'mint',
        investmentPotential: investmentPotential as 'low' | 'medium' | 'high' | 'very_high',
        collectorInterest: this.calculateCollectorInterest(rarity, marketValue),
        marketTrend: await this.analyzeMarketTrend(ocrResult.extractedData) as 'declining' | 'stable' | 'rising' | 'hot',
        recommendedPricing
      };
      
    } catch (error) {
      console.error('Book enrichment failed:', error);
      throw new Error(`Book enrichment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Complete scan workflow
  async performCompleteScan(imageData: string, settings: ScanSettings): Promise<ScanResult> {
    const scanId = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    const progress: ScanProgress = {
      step: 'detecting',
      progress: 0,
      message: 'Starting complete scan workflow...'
    };
    
    this.activeScans.set(scanId, progress);
    
    try {
      // Auto-adjustment
      progress.step = 'adjusting';
      progress.progress = 10;
      progress.message = 'Performing auto-adjustment...';
      
      const adjustedSettings = await this.autoAdjustForBook(imageData, settings);
      
      // Scanning
      progress.step = 'scanning';
      progress.progress = 30;
      progress.message = 'Scanning document...';
      
      const scannedImage = await this.performScan(imageData, adjustedSettings);
      
      // OCR Processing
      progress.step = 'ocr_processing';
      progress.progress = 50;
      progress.message = 'Processing OCR...';
      
      const ocrResult = await this.processOCR(scannedImage, adjustedSettings);
      
      // Enrichment
      progress.step = 'enriching';
      progress.progress = 80;
      progress.message = 'Enriching with market data...';
      
      const enrichedData = await this.enrichBookData(ocrResult);
      
      // Complete
      progress.step = 'complete';
      progress.progress = 100;
      progress.message = 'Scan complete';
      
      const result: ScanResult = {
        id: scanId,
        timestamp: new Date(),
        settings: adjustedSettings,
        ocrResult,
        qualityScore: ocrResult.confidence,
        processingTime: Date.now() - startTime,
        enrichedData
      };
      
      this.scanHistory.push(result);
      this.activeScans.delete(scanId);
      
      // Publish event
      eventBus.publish('ocr.scan.complete', { result });
      
      return result;
      
    } catch (error) {
      this.activeScans.delete(scanId);
      throw error;
    }
  }

  // Utility methods (implementations would connect to actual CZUR hardware)
  private async detectBookBoundaries(imageData: string): Promise<any> {
    // Implementation would use computer vision to detect book boundaries
    return { width: 800, height: 600, aspectRatio: 1.33 };
  }

  private calculateOptimalZoom(bookDimensions: any, borderSize: number): number {
    // Calculate optimal zoom based on book size and desired border
    const scannerArea = 800 * 600; // Example scanner area
    const bookArea = bookDimensions.width * bookDimensions.height;
    const targetArea = scannerArea - (2 * borderSize * (bookDimensions.width + bookDimensions.height));
    return Math.min(2.0, Math.max(0.5, Math.sqrt(targetArea / bookArea)));
  }

  private async analyzePaperReflectivity(imageData: string): Promise<{intensity: number}> {
    // Analyze paper type and adjust lighting accordingly
    return { intensity: 75 }; // 75% intensity for typical paper
  }

  private async measureKeystoneDistortion(imageData: string): Promise<number> {
    // Measure keystone distortion angle
    return 1.5; // 1.5 degrees of distortion
  }

  private async applyPreprocessing(imageData: string, settings: ScanSettings): Promise<string> {
    // Apply image preprocessing based on settings
    return imageData; // Return preprocessed image
  }

  private async runABBYYOCR(imageData: string): Promise<any> {
    // Run ABBYY OCR engine (would connect to actual CZUR hardware)
    return {
      text: "Sample OCR text",
      confidence: 0.95,
      regions: []
    };
  }

  private async extractStructuredData(ocrResult: any): Promise<any> {
    // Extract structured data from OCR result
    return {
      title: "Sample RPG Book Title",
      author: "Sample Author",
      publisher: "Sample Publisher",
      isbn: "1234567890123",
      edition: "1st Edition",
      gameSystem: "D&D",
      productType: "Core Rulebook"
    };
  }

  private async assessOCRQuality(ocrResult: any): Promise<number> {
    // Assess OCR quality and return confidence score
    return ocrResult.confidence || 0.85;
  }

  private async analyzeMarketValue(extractedData: any): Promise<number> {
    // Analyze market value based on extracted data
    return 150.00; // Example market value
  }

  private async assessRarity(extractedData: any): Promise<string> {
    // Assess rarity based on extracted data
    return 'rare';
  }

  private async analyzeCondition(extractedData: any): Promise<string> {
    // Analyze condition based on extracted data
    return 'very_good';
  }

  private async calculateInvestmentPotential(
    marketValue: number, 
    rarity: string, 
    condition: string
  ): Promise<string> {
    // Calculate investment potential
    return 'high';
  }

  private calculateCollectorInterest(rarity: string, marketValue: number): number {
    // Calculate collector interest score
    return 85; // 85% collector interest
  }

  private async analyzeMarketTrend(extractedData: any): Promise<string> {
    // Analyze market trend
    return 'rising';
  }

  private async generatePricingRecommendations(
    marketValue: number,
    rarity: string,
    condition: string,
    investmentPotential: string
  ): Promise<any> {
    // Generate pricing recommendations
    return {
      min: marketValue * 0.8,
      max: marketValue * 1.3,
      optimal: marketValue * 1.05
    };
  }

  private async performScan(imageData: string, settings: ScanSettings): Promise<string> {
    // Perform actual scan with CZUR hardware
    return imageData; // Return scanned image
  }

  // Public methods
  getActiveScans(): Map<string, ScanProgress> {
    return new Map(this.activeScans);
  }

  getScanHistory(): ScanResult[] {
    return [...this.scanHistory];
  }

  getScanById(id: string): ScanResult | undefined {
    return this.scanHistory.find(scan => scan.id === id);
  }

  clearScanHistory(): void {
    this.scanHistory = [];
  }
}

export const ocrService = new OCRService(); 