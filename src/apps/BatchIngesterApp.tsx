import React, { useState, useCallback, useRef } from "react";

import type {
  AcquisitionProgress,
  AcquisitionStep,
  AcquiredBookData,
} from "../types";

interface BatchBook {
  id: any;
  frontImage: any;
  backImage: any;
  status: any;
  progress?: AcquisitionProgress;
  result?: AcquiredBookData;
  error?: any;
  publisher?: any;
  estimatedValue?: any;
  condition?: any;
}

interface PublisherSilo {
  id: any;
  name: any;
  bookCount: any;
  lastUpdate: any;
  averageValue: any;
  processingQueue: any;
}

const BatchIngesterApp: React.FC = () => {
  const [batchBooks, setBatchBooks] = useState<BatchBook[]>([]);
  const [publisherSilos, setPublisherSilos] = useState<PublisherSilo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize sample publisher silos
  React.useEffect(() => {
    setPublisherSilos([
      {
        id: "silo-1",
        name: "Academic Press",
        bookCount: 150,
        lastUpdate: "2025-08-11",
        averageValue: 45.5,
        processingQueue: 12,
      },
      {
        id: "silo-2",
        name: "Technical Publications",
        bookCount: 89,
        lastUpdate: "2025-08-10",
        averageValue: 32.75,
        processingQueue: 8,
      },
      {
        id: "silo-3",
        name: "Consciousness Research",
        bookCount: 67,
        lastUpdate: "2025-08-09",
        averageValue: 28.9,
        processingQueue: 5,
      },
      {
        id: "silo-4",
        name: "Philosophy Texts",
        bookCount: 234,
        lastUpdate: "2025-08-08",
        averageValue: 22.45,
        processingQueue: 15,
      },
    ]);
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const newBooks: BatchBook[] = [];

      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;

          // Simulate front/back image pairs
          if (index % 2 === 0) {
            newBooks.push({
              id: any,
              frontImage: any,
              backImage: any, // Will be filled by next image
              status: any,
            });
          } else {
            // This is the back image for the previous book
            const lastBook = newBooks[newBooks.length - 1];
            if (lastBook) {
              lastBook.backImage = imageData;
            }
          }

          if (index === files.length - 1) {
            setBatchBooks((prev) => [
              ...prev,
              ...newBooks.filter((book) => book.backImage),
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [],
  );

  const processBatch = useCallback(async () => {
    if (batchBooks.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setCurrentBatch(`batch_${Date.now()}`);

    for (let i = 0; i < batchBooks.length; i++) {
      const book = batchBooks[i];
      if (book.status === "pending") {
        // Update status to processing
        setBatchBooks((prev) =>
          prev.map((b) =>
            b.id === book.id ? { ...b, status: "processing" } : b,
          ),
        );

        try {
          // Use your existing acquisition pipeline
          const pipelineGenerator = runAcquisitionPipeline(
            book.frontImage,
            book.backImage,
          );
          let finalProgress: any;

          for await (const update of pipelineGenerator) {
            finalProgress = update;
            // Update progress in real-time
            setBatchBooks((prev) =>
              prev.map((b) =>
                b.id === book.id ? { ...b, progress: progress } : b,
              ),
            );
          }

          // Mark as complete
          setBatchBooks((prev) =>
            prev.map((b) =>
              b.id === book.id
                ? {
                    ...b,
                    status: any,
                    result: any,
                    publisher: any,
                    estimatedValue: any,
                    condition: any,
                  }
                : b,
            ),
          );
        } catch (error) {
          setBatchBooks((prev) =>
            prev.map((b) =>
              b.id === book.id
                ? {
                    ...b,
                    status: any,
                    error: any,
                  }
                : b,
            ),
          );
        }

        // Update upload progress
        setUploadProgress(((i + 1) / batchBooks.length) * 100);
      }
    }

    setIsProcessing(false);
    setCurrentBatch("");
  }, [batchBooks, isProcessing]);

  const autoAssignToSilos = useCallback(() => {
    setBatchBooks((prev) =>
      prev.map((book) => {
        if (book.status === "complete" && book.publisher) {
          // Find matching silo
          const silo = publisherSilos.find((s) =>
            s.name.toLowerCase().includes(book.publisher?.toLowerCase() || ""),
          );
          return { ...book, publisher: silo.name };
        }
        return book;
      }),
    );
  }, [publisherSilos]);

  const exportToShopify = useCallback(() => {
    const completeBooks = batchBooks.filter(
      (book) => book.status === "complete",
    );
    console.log("Exporting to Shopify:", completeBooks);
    // Here you would integrate with your existing Shopify publishing
  });

  const getStatusIcon = (status: any) => {
    switch (status) {
      case "pending":
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
      case "processing":
        return (
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        );
      case "complete":
        return <div className="w-4 h-4 bg-green-500 rounded-full"></div>;
      case "error":
        return <div className="w-4 h-4 bg-red-500 rounded-full"></div>;
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "pending":
        return "text-gray-400";
      case "processing":
        return "text-blue-400";
      case "complete":
        return "text-green-400";
      case "error":
        return "text-red-400";
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Batch Ingester</h2>
        <p className="text-sm text-slate-400">
          Bulk photo processing, publisher silo integration, and automated
          intake.
        </p>
      </div>

      <div className="flex-grow flex min-h-0">
        {/* Left Panel: any
        <div className="w-1/3 p-4 border-r border-slate-700/50 flex flex-col gap-4 overflow-y-auto">
          {/* Publisher Silos */}
        <div>
          <h3 className="text-md font-bold text-indigo-300 mb-3">
            Publisher Silos
          </h3>
          <div className="space-y-2">
            {publisherSilos.map((silo) => (
              <div key={silo.id} className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{silo.name}</h4>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                    {silo.processingQueue}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>Books: {silo.bookCount}</p>
                  <p>Avg Value: ${silo.averageValue}</p>
                  <p>Updated: {silo.lastUpdate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <h3 className="text-md font-bold text-indigo-300 mb-3">
            Batch Upload
          </h3>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Select Book Photos
            </button>
            <p className="text-xs text-slate-400 mb-3">
              Upload front/back cover pairs. System will auto-match them.
            </p>

            {batchBooks.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    Books in Queue: {batchBooks.length}
                  </span>
                  <span className="text-sm text-blue-400">
                    {uploadProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
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
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {isProcessing ? "Processing..." : "Process Batch"}
          </button>

          <button
            onClick={autoAssignToSilos}
            disabled={
              batchBooks.filter((b) => b.status === "complete").length === 0
            }
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Auto-Assign to Silos
          </button>

          <button
            onClick={exportToShopify}
            disabled={
              batchBooks.filter((b) => b.status === "complete").length === 0
            }
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Export to Shopify
          </button>
        </div>
      </div>

      {/* Right Panel: Batch Processing Monitor */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <h3 className="text-md font-bold text-indigo-300 mb-4">
          Batch Processing Monitor
        </h3>

        {batchBooks.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <p>No books in batch. Upload photos to begin processing.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {batchBooks.map((book) => (
              <div key={book.id} className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  {getStatusIcon(book.status)}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h4
                        className={`font-semibold ${getStatusColor(book.status)}`}
                      >
                        {book.result?.title || `Book ${book.id.slice(-6)}`}
                      </h4>
                      <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                        {book.status}
                      </span>
                    </div>

                    {book.result && (
                      <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 mb-2">
                        <div>
                          <p>
                            <strong>Publisher:</strong>{" "}
                            {book.result.publisher || "Unknown"}
                          </p>
                          <p>
                            <strong>Condition:</strong>{" "}
                            {book.result.condition || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Est. Value:</strong> $
                            {book.result.estimatedValue || "Unknown"}
                          </p>
                          <p>
                            <strong>Dimensions:</strong>{" "}
                            {book.result.dimensions
                              ? `${book.result.dimensions.width_mm}x${book.result.dimensions.height_mm}mm`
                              : "N/A"}
                          </p>
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
                                step.status === "complete"
                                  ? "bg-green-600"
                                  : step.status === "running"
                                    ? "bg-blue-600"
                                    : "bg-slate-600"
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
  );
};

export default BatchIngesterApp;
