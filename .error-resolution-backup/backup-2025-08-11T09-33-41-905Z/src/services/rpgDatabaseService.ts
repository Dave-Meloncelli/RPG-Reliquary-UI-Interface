import { eventBus } from './eventBus';

export interface RPGDocument {
  id: string;
  title: string;
  system: string;
  type: 'book' | 'module' | 'supplement' | 'adventure';
  filePath: string;
  extractedText: string;
  extractedImages: ExtractedImage[];
  metadata: DocumentMetadata;
  keywords: string[];
  lore: LoreEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtractedImage {
  id: string;
  pageNumber: number;
  imageData: string; // Base64 encoded
  description: string;
  tags: string[];
  usageRights: 'public' | 'fair-use' | 'restricted';
  extractedAt: Date;
}

export interface DocumentMetadata {
  title: string;
  system: string;
  author: string;
  publisher: string;
  publicationYear: number;
  pageCount: number;
  isbn?: string;
  language: string;
  genre: string[];
  themes: string[];
  targetAudience: string[];
}

export interface LoreEntry {
  id: string;
  title: string;
  content: string;
  category: 'character' | 'location' | 'item' | 'event' | 'concept';
  system: string;
  tags: string[];
  relatedEntries: string[];
  extractedFrom: string;
}

export interface ImageSearchResult {
  image: ExtractedImage;
  document: RPGDocument;
  relevanceScore: number;
  matchingTags: string[];
}

export class RPGDatabaseService {
  private documents: Map<string, RPGDocument> = new Map();
  private imageIndex: Map<string, ExtractedImage[]> = new Map();
  private loreIndex: Map<string, LoreEntry[]> = new Map();
  private keywordIndex: Map<string, string[]> = new Map();

  constructor(private eventBus: any) {
    this.initializeService();
  }

  private async initializeService() {
    console.log('Initializing RPG Database Service...');
    await this.loadExistingDocuments();
    await this.rebuildIndexes();
  }

  async processPDFDocument(filePath: string): Promise<RPGDocument> {
    console.log(`Processing PDF: ${filePath}`);

    try {
      // Extract text and images using PDF processing
      const { text, images, metadata } = await this.extractPDFContent(filePath);

      // Generate document ID
      const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Extract lore and keywords
      const keywords = await this.extractKeywordsFromText(text);
      const lore = await this.extractLoreFromText(text, documentId);

      // Create document object
      const document: RPGDocument = {
        id: documentId,
        title: metadata.title || 'Unknown Title',
        system: metadata.system || 'Unknown System',
        type: this.determineDocumentType(metadata.title, text),
        filePath,
        extractedText: text,
        extractedImages: images,
        metadata,
        keywords,
        lore,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store document
      this.documents.set(documentId, document);

      // Update indexes
      await this.updateIndexes(document);

      // Emit event
      this.eventBus.emit('rpg:document:processed', { document });

      return document;

    } catch (error) {
      console.error(`Failed to process PDF ${filePath}:`, error);
      throw error;
    }
  }

  private async extractPDFContent(filePath: string): Promise<{
    text: string;
    images: ExtractedImage[];
    metadata: DocumentMetadata;
  }> {
    // This would integrate with a PDF processing library
    // For now, we'll simulate the extraction
    const text = await this.extractTextFromPDF(filePath);
    const images = await this.extractImagesFromPDF(filePath);
    const metadata = await this.extractMetadataFromPDF(filePath);

    return { text, images, metadata };
  }

  private async extractTextFromPDF(filePath: string): Promise<string> {
    // Integration with PDF.js or similar library
    // This would extract all text content from the PDF
    return 'Extracted text content from PDF...';
  }

  private async extractImagesFromPDF(filePath: string): Promise<ExtractedImage[]> {
    const images: ExtractedImage[] = [];

    // This would extract images from each page
    // For now, we'll simulate the extraction
    images.push({
      id: `img-${Date.now()}`,
      pageNumber: 1,
      imageData: 'base64-encoded-image-data',
      description: 'Sample extracted image',
      tags: ['sample', 'extracted'],
      usageRights: 'fair-use',
      extractedAt: new Date()
    });

    return images;
  }

  private async extractMetadataFromPDF(filePath: string): Promise<DocumentMetadata> {
    // This would extract metadata from PDF properties
    // For now, we'll return simulated metadata
    return {
      title: 'Sample RPG Document',
      system: 'D&D 5e',
      author: 'Unknown Author',
      publisher: 'Unknown Publisher',
      publicationYear: 2023,
      pageCount: 100,
      language: 'English',
      genre: ['fantasy', 'rpg'],
      themes: ['adventure', 'heroism'],
      targetAudience: ['adults', 'teens']
    };
  }

  private determineDocumentType(title: string, text: string): RPGDocument['type'] {
    const titleLower = title.toLowerCase();
    const textLower = text.toLowerCase();

    if (titleLower.includes('module') || titleLower.includes('adventure')) {
      return 'adventure';
    }

    if (titleLower.includes('supplement') || titleLower.includes('expansion')) {
      return 'supplement';
    }

    if (textLower.includes('character creation') || textLower.includes('rules')) {
      return 'book';
    }

    return 'book';
  }

  private async extractLoreFromText(text: string, documentId: string): Promise<LoreEntry[]> {
    const lore: LoreEntry[] = [];

    // Use AI to identify and extract lore entries
    // This would integrate with our AI services

    return lore;
  }

  private async extractKeywordsFromText(text: string): Promise<string[]> {
    const keywords: string[] = [];
    const textLower = text.toLowerCase();

    // Common RPG keywords
    const rpgKeywords = [
      'character', 'adventure', 'quest', 'dungeon', 'magic', 'spells',
      'weapons', 'armor', 'monsters', 'npcs', 'campaign', 'story',
      'roleplay', 'dice', 'skills', 'abilities', 'classes', 'races'
    ];

    rpgKeywords.forEach(keyword => {
      if (textLower.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    return keywords;
  }

  async searchImages(query: string, filters?: {
    system?: string;
    category?: string;
    usageRights?: string[];
  }): Promise<ImageSearchResult[]> {
    const results: ImageSearchResult[] = [];
    const queryLower = query.toLowerCase();

    for (const [documentId, document] of this.documents) {
      for (const image of document.extractedImages) {
        let relevanceScore = 0;
        const matchingTags: string[] = [];

        // Calculate relevance based on query

        // Check image description
        if (image.description.toLowerCase().includes(queryLower)) {
          relevanceScore += 10;
          matchingTags.push('description');
        }

        // Check image tags
        image.tags.forEach(tag => {
          if (tag.toLowerCase().includes(queryLower)) {
            relevanceScore += 5;
            matchingTags.push(tag);
          }
        });

        // Apply filters
        if (filters?.system && document.system !== filters.system) {
          continue;
        }

        if (filters?.usageRights && !filters.usageRights.includes(image.usageRights)) {
          continue;
        }

        if (relevanceScore > 0) {
          results.push({
            image,
            document,
            relevanceScore: relevanceScore,
            matchingTags
          });
        }
      }
    }

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  async searchLore(query: string, filters?: {
    system?: string;
    category?: string;
  }): Promise<LoreEntry[]> {
    const results: LoreEntry[] = [];
    const queryLower = query.toLowerCase();

    for (const [documentId, document] of this.documents) {
      for (const lore of document.lore) {
        // Apply filters
        if (filters?.system && lore.system !== filters.system) {
          continue;
        }

        if (filters?.category && lore.category !== filters.category) {
          continue;
        }

        // Check if query matches
        if (lore.title.toLowerCase().includes(queryLower) ||
          lore.content.toLowerCase().includes(queryLower) ||
          lore.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
          results.push(lore);
        }
      }
    }

    return results;
  }

  async generateCharacterSheet(system: string, theme: string, accessibility: 'standard' | 'neurodiverse'): Promise<string> {
    // Generate character sheet based on system and accessibility needs
    const template = await this.getCharacterSheetTemplate(system, accessibility);
    const themedTemplate = await this.applyThemeToTemplate(template, theme);

    return themedTemplate;
  }

  private async getCharacterSheetTemplate(system: string, accessibility: string): Promise<string> {
    // Return appropriate character sheet template
    const templates: Record<string, Record<string, string>> = {
      'dnd5e': {
        'standard': 'Standard D&D 5e character sheet template',
        'neurodiverse': 'Neurodiverse-friendly D&D 5e character sheet template'
      },
      'pathfinder': {
        'standard': 'Standard Pathfinder character sheet template',
        'neurodiverse': 'Neurodiverse-friendly Pathfinder character sheet template'
      }
    };

    return templates[system]?.[accessibility] || 'Generic character sheet template';
  }

  private async applyThemeToTemplate(template: string, theme: string): Promise<string> {
    // Apply visual theme to character sheet
    return `${template} with ${theme} theme applied`;
  }

  private async updateIndexes(document: RPGDocument) {
    // Update image index
    this.imageIndex.set(document.id, document.extractedImages);

    // Update lore index
    this.loreIndex.set(document.id, document.lore);

    // Update keyword index
    this.keywordIndex.set(document.id, document.keywords);
  }

  private async loadExistingDocuments() {
    // Load existing documents from storage
    console.log('Loading existing RPG documents...');
  }

  private async rebuildIndexes() {
    // Rebuild all indexes
    console.log('Rebuilding RPG database indexes...');
  }

  getDocument(documentId: string): RPGDocument | null {
    return this.documents.get(documentId) || null;
  }

  getAllDocuments(): RPGDocument[] {
    return Array.from(this.documents.values());
  }

  getDocumentsBySystem(system: string): RPGDocument[] {
    return Array.from(this.documents.values()).filter(doc => doc.system === system);
  }

  getDocumentsByType(type: RPGDocument['type']): RPGDocument[] {
    return Array.from(this.documents.values()).filter(doc => doc.type === type);
  }
}

export const rpgDatabaseService = new RPGDatabaseService(eventBus); 