import React, { useState, useCallback, useRef } from 'react';
import { runAcquisitionPipeline } from '../services/acquisitionService';
import type { AcquisitionProgress, AcquisitionStep, AcquiredBookData } from '../types';

interface BatchBook {
  id: string;
  frontImage: string;
  backImage: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress?: AcquisitionProgress;
  result?: AcquiredBookData;
  error?: string;
  publisher?: string;
  estimatedValue?: number;
  condition?: string;
}

interface PublisherSilo {
  id: string;
  name: string;
  bookCount: number;
  lastUpdate: string;
  averageValue: number;
  processingQueue: number;
}

const BatchIngesterApp: React.FC = () => {
  const [batchBooks, setBatchBooks] = useState<BatchBook[]>([]);
  const [publisherSilos, setPublisherSilos] = useState<PublisherSilo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize sample publisher silos
  React.useEffect(() => {
    setPublisherSilos([
      {
        id: 'wizards',
        name: 'Wizards of the Coast',
        bookCount: 1247,
        lastUpdate: '2024-01-15',
        averageValue: 45.50,
        processingQueue: 23
      },
      {
        id: 'paizo',
        name: 'Paizo Publishing',
        bookCount: 892,
        lastUpdate: '2024-01-14',
        averageValue: 38.75,
        processingQueue: 15
      },
      {
        id: 'chaosium',
        name: 'Chaosium Inc',
        bookCount: 567,
        lastUpdate: '2024-01-13',
        averageValue: 52.30,
        processingQueue: 8
      },
      {
        id: 'white-wolf',
        name: 'White Wolf Publishing',
        bookCount: 734,
        lastUpdate: '2024-01-12',
        averageValue: 41.20,
        processingQueue: 12
      }
    ]);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newBooks: BatchBook[] = [];

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        
        // Simulate front/back image pairs
        if (index % 2 === 0) {
          newBooks.push({
            id: `book_${Date.now()}_${index}`,
            frontImage: imageData,
            backImage: '', // Will be filled by next image
            status: 'pending'
          });
        } else {
          // This is the back image for the previous book
          const lastBook = newBooks[newBooks.length - 1];
          if (lastBook) {
            lastBook.backImage = imageData;
          }
        }

        if (index === files.length - 1) {
          setBatchBooks(prev => [...prev, ...newBooks.filter(book => book.backImage)]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const processBatch = useCallback(async () => {
    if (batchBooks.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setCurrentBatch(`batch_${Date.now()}`);

    for (let i = 0; i < batchBooks.length; i++) {
      const book = batchBooks[i];
      if (book.status === 'pending') {
        // Update status to processing
        setBatchBooks(prev => prev.map(b => 
          b.id === book.id ? { ...b, status: 'processing' } : b
        ));

        try {
          // Use your existing acquisition pipeline
          const pipelineGenerator = runAcquisitionPipeline(book.frontImage, book.backImage);
          let finalProgress: AcquisitionProgress | undefined;

          for await (const update of pipelineGenerator) {
            finalProgress = update;
            // Update progress in real-time
            setBatchBooks(prev => prev.map(b => 
              b.id === book.id ? { ...b, progress: update } : b
            ));
          }

          // Mark as complete
          setBatchBooks(prev => prev.map(b => 
            b.id === book.id ? { 
              ...b, 
              status: 'complete', 
              result: finalProgress?.acquiredData,
              publisher: finalProgress?.acquiredData?.publisher,
              estimatedValue: finalProgress?.acquiredData?.estimatedValue,
              condition: finalProgress?.acquiredData?.condition
            } : b
          ));

        } catch (error) {
          setBatchBooks(prev => prev.map(b => 
            b.id === book.id ? { 
              ...b, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Unknown error'
            } : b
          ));
        }

        // Update upload progress
        setUploadProgress(((i + 1) / batchBooks.length) * 100);
      }
    }

    setIsProcessing(false);
    setCurrentBatch('');
  }, [batchBooks, isProcessing]);

  const autoAssignToSilos = useCallback(() => {
    setBatchBooks(prev => prev.map(book => {
      if (book.status === 'complete' && book.publisher) {
        // Find matching silo
        const silo = publisherSilos.find(s => 
          s.name.toLowerCase().includes(book.publisher?.toLowerCase() || '')
        );
        return { ...book, publisher: silo?.name || book.publisher };
      }
      return book;
    }));
  }, [publisherSilos]);

  const exportToShopify = useCallback(() => {
    const completeBooks = batchBooks.filter(book => book.status === 'complete');
    console.log('Exporting to Shopify:', completeBooks);
    // Here you would integrate with your existing Shopify publishing
  });

  const getStatusIcon = (status: BatchBook['status']) => {
    switch (status) {
      case 'pending': return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
      case 'processing': return <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>;
      case 'complete': return <div className="w-4 h-4 bg-green-500 rounded-full"></div>;
      case 'error': return <div className="w-4 h-4 bg-red-500 rounded-full"></div>;
    }
  };

  const getStatusColor = (status: BatchBook['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-400';
      case 'processing': return 'text-blue-400';
      case 'complete': return 'text-green-400';
      case 'error': return 'text-red-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Batch Ingester</h2>
        <p className="text-sm text-slate-400">Bulk photo processing, publisher silo integration, and automated intake.</p>
      </div>

      <div className="flex-grow flex min-h-0">
        {/* Left Panel: Publisher Silos & Upload */}
        <div className="w-1/3 p-4 border-r border-slate-700/50 flex flex-col gap-4 overflow-y-auto">
          {/* Publisher Silos */}
          <div>
            <h3 className="text-md font-bold text-indigo-300 mb-3">Publisher Silos</h3>
            <div className="space-y-2">
              {publisherSilos.map(silo => (
                <div key={silo.id} className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{silo.name}</h4>
                    <span className="text-xs bg-blue-600 px-2 py-1 rounded">{silo.processingQueue}</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Books: {silo.bookCount.toLocaleString()}</p>
                    <p>Avg Value: ${silo.averageValue}</p>
                    <p>Updated: {silo.lastUpdate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <h3 className="text-md font-bold text-indigo-300 mb-3">Batch Upload</h3>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-md mb-3"
              >
                Select Book Photos
              </button>
              <p className="text-xs text-slate-400 mb-3">
                Upload front/back cover pairs. System will auto-match them.
              </p>
              
              {batchBooks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Books in Queue: {batchBooks.length}</span>
                    <span className="text-sm text-blue-400">{uploadProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Batch Controls */}
          <div className="space-y-2">
            <button
              onClick={processBatch}
              disabled={batchBooks.length === 0 || isProcessing}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 text-white font-bold py-3 rounded-md"
            >
              {isProcessing ? 'Processing...' : 'Process Batch'}
            </button>
            
            <button
              onClick={autoAssignToSilos}
              disabled={batchBooks.filter(b => b.status === 'complete').length === 0}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 text-white font-bold py-2 rounded-md"
            >
              Auto-Assign to Silos
            </button>
            
            <button
              onClick={exportToShopify}
              disabled={batchBooks.filter(b => b.status === 'complete').length === 0}
              className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-600 text-white font-bold py-2 rounded-md"
            >
              Export to Shopify
            </button>
          </div>
        </div>

        {/* Right Panel: Batch Processing Monitor */}
        <div className="w-2/3 p-4 overflow-y-auto">
          <h3 className="text-md font-bold text-indigo-300 mb-4">Batch Processing Monitor</h3>
          
          {batchBooks.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <p>No books in batch. Upload photos to begin processing.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {batchBooks.map(book => (
                <div key={book.id} className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(book.status)}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-semibold ${getStatusColor(book.status)}`}>
                          {book.result?.title || `Book ${book.id.slice(-6)}`}
                        </h4>
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                          {book.status}
                        </span>
                      </div>
                      
                      {book.result && (
                        <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 mb-2">
                          <div>
                            <p><strong>Publisher:</strong> {book.publisher}</p>
                            <p><strong>Condition:</strong> {book.condition}</p>
                          </div>
                          <div>
                            <p><strong>Est. Value:</strong> ${book.estimatedValue}</p>
                            <p><strong>Dimensions:</strong> {book.result.dimensions ? 
                              `${book.result.dimensions.width_mm}x${book.result.dimensions.height_mm}mm` : 'N/A'}</p>
                          </div>
                        </div>
                      )}
                      
                      {book.error && (
                        <p className="text-red-400 text-xs">{book.error}</p>
                      )}
                      
                      {book.progress && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {book.progress.steps.map((step, index) => (
                              <span 
                                key={index}
                                className={`text-xs px-2 py-1 rounded ${
                                  step.status === 'complete' ? 'bg-green-600' :
                                  step.status === 'running' ? 'bg-blue-600' :
                                  'bg-slate-600'
                                }`}
                              >
                                {step.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchIngesterApp; 