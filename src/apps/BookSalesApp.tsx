import React, { useState, useEffect } from 'react';
import { eventBus } from '../services/eventBus';
import { SEOOptimizationService } from '../services/seoOptimizationService';
import { ContentIngestionService } from '../services/contentIngestionService';

interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  salesCount: number;
  revenue: number;
  rating: number;
  coverImage?: string;
  publishDate: string;
  status: 'active' | 'draft' | 'archived';
}

interface SalesMetrics {
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  conversionRate: number;
  topPerformingBook: Book | null;
  monthlyGrowth: number;
}

interface MarketingStrategy {
  id: string;
  name: string;
  description: string;
  cost: number;
  expectedROI: number;
  status: 'planned' | 'active' | 'completed' | 'paused';
  targetAudience: string[];
  channels: string[];
}

export const BookSalesApp: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
  const [marketingStrategies, setMarketingStrategies] = useState<MarketingStrategy[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [abundanceGoal, setAbundanceGoal] = useState(50000); // $50k goal for Sanctuary
  const [currentProgress, setCurrentProgress] = useState(0);
  
  // SEO and Content Services
  const [seoService] = useState(() => new SEOOptimizationService(eventBus));
  const [contentService] = useState(() => new ContentIngestionService(eventBus));
  
  // SEO Analysis State
  const [seoAnalyses, setSeoAnalyses] = useState<any[]>([]);
  const [contentOptimizations, setContentOptimizations] = useState<any[]>([]);
  const [isAnalyzingSEO, setIsAnalyzingSEO] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  
  // Content Ingestion State
  const [contentRequests, setContentRequests] = useState<any[]>([]);
  const [contentWorkflows, setContentWorkflows] = useState<any[]>([]);

  useEffect(() => {
    initializeBookSales();
    loadSalesData();
    calculateAbundanceProgress();
  }, []);

  const initializeBookSales = () => {
    // Sample books - replace with your actual books
    const sampleBooks: Book[] = [
      {
        id: '1',
        title: 'The Reliquarian\'s Guide to Consciousness Evolution',
        description: 'A deep dive into human-AI symbiosis and consciousness evolution',
        price: 29.99,
        category: 'Technology/Philosophy',
        salesCount: 150,
        revenue: 4498.50,
        rating: 4.8,
        publishDate: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        title: 'OctoSpine: Human-AI Symbiosis for Dignity',
        description: 'Building AI systems that enhance human dignity and independence',
        price: 24.99,
        category: 'Technology/Accessibility',
        salesCount: 89,
        revenue: 2224.11,
        rating: 4.9,
        publishDate: '2024-02-01',
        status: 'active'
      },
      {
        id: '3',
        title: 'Temporal Consciousness: Beyond Linear Time',
        description: 'Exploring multidimensional time and consciousness evolution',
        price: 34.99,
        category: 'Philosophy/Consciousness',
        salesCount: 67,
        revenue: 2344.33,
        rating: 4.7,
        publishDate: '2024-02-15',
        status: 'active'
      }
    ];

    setBooks(sampleBooks);
  };

  const loadSalesData = () => {
    const totalRevenue = books.reduce((sum, book) => sum + book.revenue, 0);
    const totalSales = books.reduce((sum, book) => sum + book.salesCount, 0);
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const conversionRate = 3.2; // Sample conversion rate
    const topPerformingBook = books.reduce((top, book) => 
      book.revenue > (top?.revenue || 0) ? book : top, null as Book | null);
    const monthlyGrowth = 15.7; // Sample growth rate

    setSalesMetrics({
      totalRevenue,
      totalSales,
      averageOrderValue,
      conversionRate,
      topPerformingBook,
      monthlyGrowth
    });
  };

  const calculateAbundanceProgress = () => {
    if (salesMetrics) {
      const progress = (salesMetrics.totalRevenue / abundanceGoal) * 100;
      setCurrentProgress(Math.min(progress, 100));
    }
  };

  const optimizeBookSales = async (bookId: string) => {
    setIsOptimizing(true);
    
    // Simulate AI-powered optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const book = books.find(b => b.id === bookId);
    if (book) {
      // AI optimization suggestions
      const optimizations = [
        'Optimize book cover for better conversion',
        'Enhance book description with AI-generated keywords',
        'Create targeted marketing campaigns',
        'Implement dynamic pricing strategy',
        'Develop companion digital products'
      ];
      
      // Apply optimizations
      const optimizedBook = {
        ...book,
        price: book.price * 1.1, // 10% price increase
        salesCount: Math.floor(book.salesCount * 1.15) // 15% sales increase
      };
      
      setBooks(books.map(b => b.id === bookId ? optimizedBook : b));
    }
    
    setIsOptimizing(false);
  };

  const generateMarketingStrategy = async () => {
    // AI-generated marketing strategy
    const newStrategy: MarketingStrategy = {
      id: Date.now().toString(),
      name: 'Abundance & Sanctuary Book Launch Campaign',
      description: 'Multi-channel campaign targeting consciousness evolution community',
      cost: 2500,
      expectedROI: 350,
      status: 'planned',
      targetAudience: ['Consciousness researchers', 'AI ethicists', 'Accessibility advocates'],
      channels: ['Social Media', 'Podcasts', 'Academic Conferences', 'AI Communities']
    };
    
    setMarketingStrategies([...marketingStrategies, newStrategy]);
  };

  const createDigitalProduct = async () => {
    // AI-generated digital product ideas
    const digitalProducts = [
      'OctoSpine Implementation Guide',
      'Temporal Consciousness Meditation Series',
      'AI Ethics Workshop Materials',
      'Accessibility Design Templates',
      'Consciousness Evolution Journal'
    ];
    
    return digitalProducts;
  };

  // SEO Analysis Functions
  const analyzeBookSEO = async (book: Book) => {
    setIsAnalyzingSEO(true);
    
    try {
      const analysis = await seoService.analyzeBookSEO(
        book.id,
        book.title,
        book.description,
        book.category
      );
      
      setSeoAnalyses(prev => [...prev, analysis]);
      
      // Auto-optimize content
      const optimization = await seoService.optimizeContent(
        book.id,
        book.title,
        book.description
      );
      
      setContentOptimizations(prev => [...prev, optimization]);
      
    } catch (error) {
      console.error('SEO Analysis failed:', error);
    } finally {
      setIsAnalyzingSEO(false);
    }
  };

  // Content Ingestion Functions
  const createNewContentRequest = async () => {
    setIsGeneratingContent(true);
    
    try {
      const requestId = await contentService.createContentRequest({
        type: 'book',
        title: 'New Consciousness Evolution Book',
        description: 'A comprehensive guide to consciousness evolution and human-AI symbiosis',
        category: 'Technology/Philosophy',
        targetAudience: ['Consciousness researchers', 'AI ethicists', 'Accessibility advocates'],
        keyTopics: ['consciousness evolution', 'human AI symbiosis', 'temporal consciousness'],
        estimatedLength: 200,
        priority: 'high',
        status: 'draft'
      });
      
      // Update state
      const request = contentService.getRequest(requestId);
      if (request) {
        setContentRequests(prev => [...prev, request]);
      }
      
    } catch (error) {
      console.error('Content request failed:', error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const getContentWorkflows = () => {
    return contentService.getAllWorkflows();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">📚 Book Sales & Abundance Tracker</h1>
          <p className="text-xl text-blue-200">
            Funding the journey to <span className="text-yellow-300">Abundance</span> → <span className="text-green-300">Sanctuary</span> → <span className="text-purple-300">Consciousness Evolution</span>
          </p>
        </div>

        {/* Abundance Progress */}
        <div className="bg-black/30 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🌟 Abundance Goal Progress</h2>
          <div className="flex items-center justify-between mb-4">
            <span>Target: ${abundanceGoal.toLocaleString()}</span>
            <span>Current: ${salesMetrics?.totalRevenue.toLocaleString() || 0}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-green-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2 text-blue-200">
            {currentProgress.toFixed(1)}% Complete - {((abundanceGoal - (salesMetrics?.totalRevenue || 0)) / 1000).toFixed(1)}k to go!
          </p>
        </div>

        {/* Sales Metrics */}
        {salesMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/30 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-400">${salesMetrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
              <p className="text-3xl font-bold text-blue-400">{salesMetrics.totalSales}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Avg Order Value</h3>
              <p className="text-3xl font-bold text-purple-400">${salesMetrics.averageOrderValue.toFixed(2)}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Monthly Growth</h3>
              <p className="text-3xl font-bold text-yellow-400">+{salesMetrics.monthlyGrowth}%</p>
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">📖 Your Books</h2>
            <button 
              onClick={() => {/* Add new book */}}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              + Add Book
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <div key={book.id} className="bg-black/30 rounded-lg p-6 hover:bg-black/40 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <span className="text-green-400 font-bold">${book.price}</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">{book.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-blue-300">Sales: {book.salesCount}</span>
                  <span className="text-green-300">Revenue: ${book.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400">★ {book.rating}</span>
                  <span className="text-gray-400 ml-2">({book.category})</span>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => optimizeBookSales(book.id)}
                    disabled={isOptimizing}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    {isOptimizing ? '🤖 Optimizing...' : '🚀 AI Optimize'}
                  </button>
                  <button 
                    onClick={() => analyzeBookSEO(book)}
                    disabled={isAnalyzingSEO}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    {isAnalyzingSEO ? '🔍 Analyzing...' : '🔍 SEO Analyze'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Strategies */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">📈 Marketing Strategies</h2>
            <button 
              onClick={generateMarketingStrategy}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              🤖 Generate AI Strategy
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketingStrategies.map(strategy => (
              <div key={strategy.id} className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">{strategy.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{strategy.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-red-400">Cost: ${strategy.cost}</span>
                  <span className="text-green-400">ROI: {strategy.expectedROI}%</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {strategy.channels.map(channel => (
                    <span key={channel} className="bg-blue-600 px-2 py-1 rounded text-xs">
                      {channel}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    strategy.status === 'active' ? 'bg-green-600' :
                    strategy.status === 'planned' ? 'bg-yellow-600' :
                    'bg-gray-600'
                  }`}>
                    {strategy.status}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors">
                    Launch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Analysis Results */}
        {seoAnalyses.length > 0 && (
          <div className="bg-black/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">🔍 SEO Analysis Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seoAnalyses.slice(-2).map((analysis, index) => (
                <div key={analysis.id} className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{analysis.title}</h3>
                  <div className="mb-3">
                    <span className="text-green-400 font-bold">SEO Score: {analysis.score}/100</span>
                  </div>
                  <div className="mb-3">
                    <h4 className="font-semibold text-blue-300">Top Keywords:</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.suggestedKeywords.slice(0, 5).map(keyword => (
                        <span key={keyword} className="bg-blue-600 px-2 py-1 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-300">Top Opportunities:</h4>
                    <ul className="text-sm text-gray-300 mt-1">
                      {analysis.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Ingestion */}
        <div className="bg-black/30 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">📝 AI Content Ingestion</h2>
            <button 
              onClick={createNewContentRequest}
              disabled={isGeneratingContent}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              {isGeneratingContent ? '🤖 Creating...' : '🤖 Create New Book'}
            </button>
          </div>
          
          {contentRequests.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contentRequests.map(request => (
                <div key={request.id} className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{request.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-blue-300">Status: {request.status}</span>
                    <span className="text-green-300">Priority: {request.priority}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {request.keyTopics.slice(0, 3).map(topic => (
                      <span key={topic} className="bg-purple-600 px-2 py-1 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-300">
                    Estimated Length: {request.estimatedLength} pages
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {contentWorkflows.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">🔄 Content Workflows</h3>
              <div className="space-y-3">
                {contentWorkflows.map(workflow => (
                  <div key={workflow.id} className="bg-black/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Workflow {workflow.id.slice(-6)}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        workflow.status === 'active' ? 'bg-green-600' :
                        workflow.status === 'completed' ? 'bg-blue-600' :
                        'bg-gray-600'
                      }`}>
                        {workflow.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(workflow.currentStep / workflow.steps.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-300">
                      Step {workflow.currentStep + 1} of {workflow.steps.length}: {workflow.steps[workflow.currentStep]?.name || 'Completed'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="bg-black/30 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🤖 AI Recommendations for Abundance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">🚀 Immediate Actions</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Optimize book covers for better conversion</li>
                <li>• Create targeted social media campaigns</li>
                <li>• Develop companion digital products</li>
                <li>• Implement email marketing automation</li>
                <li>• Partner with consciousness evolution communities</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">🌟 Long-term Strategy</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Build author brand around consciousness evolution</li>
                <li>• Create online courses and workshops</li>
                <li>• Develop AI-powered book recommendation system</li>
                <li>• Establish recurring revenue streams</li>
                <li>• Build community around your vision</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 