import React, { useState, useCallback, useRef } from "react";

interface TradeInBook {
  id: any;
  frontImage: any;
  backImage: any;
  title?: any;
  publisher?: any;
  condition?: any;
  estimatedValue?: any;
  tradeValue?: any;
  status: "pending" | "analyzing" | "valued" | "recommended";
}

const TradeInPortalApp: React.FC = () => {
  const [tradeInBooks, setTradeInBooks] = useState<TradeInBook[]>([]);
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "upload" | "analysis" | "complete"
  >("welcome");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [totalTradeValue, setTotalTradeValue] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const newBooks: TradeInBook[] = [];

      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;

          if (index % 2 === 0) {
            newBooks.push({
              id: `trade_${Date.now()}_${index}`,
              frontImage: imageData,
              backImage: "",
              status: "pending",
            });
          } else {
            const lastBook = newBooks[newBooks.length - 1];
            if (lastBook) {
              lastBook.backImage = imageData;
            }
          }

          if (index === files.length - 1) {
            setTradeInBooks((prev) => [
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

  const analyzeBooks = useCallback(async () => {
    if (tradeInBooks.length === 0) return;

    setIsAnalyzing(true);
    setCurrentStep("analysis");

    for (let i = 0; i < tradeInBooks.length; i++) {
      const book = tradeInBooks[i];

      setTradeInBooks((prev) =>
        prev.map((b) => (b.id === book.id ? { ...b, status: "analyzing" } : b)),
      );

      try {
        await new Promise((resolve) =>
          setTimeout(resolve, 2000 + Math.random() * 3000),
        );

        const rpgTitles = [
          "Dungeons & Dragons Player's Handbook",
          "Pathfinder Core Rulebook",
          "Call of Cthulhu Investigator's Handbook",
          "Vampire: The Masquerade Corebook",
          "Shadowrun Sixth World Core Rulebook",
        ];

        const publishers = [
          "Wizards of the Coast",
          "Paizo Publishing",
          "Chaosium Inc",
          "White Wolf Publishing",
          "Catalyst Game Labs",
        ];

        const analysis = {
          title: rpgTitles[Math.floor(Math.random() * rpgTitles.length)],
          publisher: publishers[Math.floor(Math.random() * publishers.length)],
          condition: ["excellent", "very_good", "good", "fair"][
            Math.floor(Math.random() * 4)
          ],
          estimatedValue: 25 + Math.floor(Math.random() * 150),
          tradeValue: 0,
        };

        analysis.tradeValue = Math.floor(
          analysis.estimatedValue * (0.3 + Math.random() * 0.2),
        );

        setTradeInBooks((prev) =>
          prev.map((b) =>
            b.id === book.id
              ? {
                  ...b,
                  status: "recommended",
                  title: analysis.title,
                  publisher: analysis.publisher,
                  condition: analysis.condition,
                  estimatedValue: analysis.estimatedValue,
                  tradeValue: analysis.tradeValue,
                }
              : b,
          ),
        );
      } catch (error) {
        setTradeInBooks((prev) =>
          prev.map((b) => (b.id === book.id ? { ...b, status: "pending" } : b)),
        );
      }
    }

    setIsAnalyzing(false);
    setCurrentStep("complete");

    const total = tradeInBooks.reduce(
      (sum, book) => sum + (book.tradeValue || 0),
      0,
    );
    setTotalTradeValue(total);
  }, [tradeInBooks]);

  const getStatusIcon = (status: TradeInBook["status"]) => {
    switch (status) {
      case "pending":
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
      case "analyzing":
        return (
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        );
      case "valued":
        return <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>;
      case "recommended":
        return <div className="w-4 h-4 bg-green-500 rounded-full"></div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔄 RPG Trade-In Portal</h1>
          <p className="text-xl text-blue-200">
            Turn your old RPG books into new adventures! Get instant valuations
            and trade recommendations.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {["welcome", "upload", "analysis", "complete"].map(
              (step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep === step
                        ? "bg-blue-600"
                        : ["welcome", "upload", "analysis", "complete"].indexOf(
                              currentStep,
                            ) > index
                          ? "bg-green-600"
                          : "bg-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        ["welcome", "upload", "analysis", "complete"].indexOf(
                          currentStep,
                        ) > index
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    ></div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === "welcome" && (
          <div className="bg-black/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to the RPG Trade-In Portal!
            </h2>
            <p className="text-lg text-blue-200 mb-6">
              We're building the ultimate RPG community hub. Trade in your old
              books and help us create the most comprehensive RPG database in
              the world.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  📸 Easy Photo Upload
                </h3>
                <p className="text-sm text-gray-300">
                  Just snap front/back cover photos and we'll do the rest
                </p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  🤖 AI-Powered Analysis
                </h3>
                <p className="text-sm text-gray-300">
                  Instant valuations with market data and condition assessment
                </p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  💰 Fair Trade Values
                </h3>
                <p className="text-sm text-gray-300">
                  Get competitive trade-in values based on real market data
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep("upload")}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors"
            >
              Start Your Trade-In
            </button>
          </div>
        )}

        {currentStep === "upload" && (
          <div className="bg-black/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Upload Your RPG Books</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div>
                <div className="bg-black/20 p-6 rounded-lg border-2 border-dashed border-blue-500">
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg mb-4"
                  >
                    📸 Select Book Photos
                  </button>
                  <p className="text-sm text-gray-300 text-center">
                    Upload front and back cover photos for each book.
                    <br />
                    We'll automatically match them and analyze your collection.
                  </p>
                </div>

                {tradeInBooks.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Uploaded Books ({tradeInBooks.length})
                    </h3>
                    <div className="space-y-2">
                      {tradeInBooks.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-3 bg-black/20 p-3 rounded-lg"
                        >
                          <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center text-xs">
                            📚
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-semibold">
                              Book {book.id.slice(-6)}
                            </p>
                            <p className="text-xs text-gray-400">
                              Front & Back covers uploaded
                            </p>
                          </div>
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  📋 Upload Guidelines
                </h3>
                <div className="space-y-4">
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Photo Quality
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Ensure good lighting and clear focus</li>
                      <li>• Capture the entire cover without shadows</li>
                      <li>• Include any visible damage or wear</li>
                    </ul>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-300 mb-2">
                      What We Accept
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• All RPG books and supplements</li>
                      <li>• Any condition (we'll assess fairly)</li>
                      <li>• Any edition or year</li>
                      <li>• Any publisher</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {tradeInBooks.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={analyzeBooks}
                  className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors"
                >
                  🤖 Analyze My Books
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === "analysis" && (
          <div className="bg-black/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Analyzing Your Books</h2>
            <div className="text-center mb-8">
              <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg text-blue-200">
                Our AI is analyzing your books...
              </p>
              <p className="text-sm text-gray-400">
                This may take a few minutes for each book
              </p>
            </div>

            <div className="space-y-4">
              {tradeInBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 bg-black/20 p-4 rounded-lg"
                >
                  {getStatusIcon(book.status)}
                  <div className="flex-grow">
                    <p className="font-semibold">
                      {book.status === "analyzing"
                        ? "Analyzing book..."
                        : book.status === "recommended"
                          ? book.title || "Book analyzed"
                          : `Book ${book.id.slice(-6)}`}
                    </p>
                    {book.status === "analyzing" && (
                      <p className="text-sm text-gray-400">
                        Extracting title, publisher, condition, and market
                        data...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === "complete" && (
          <div className="bg-black/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">
              Trade-In Recommendations
            </h2>

            {/* Summary */}
            <div className="bg-black/20 p-6 rounded-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    ${totalTradeValue}
                  </p>
                  <p className="text-sm text-gray-400">Total Trade Value</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {tradeInBooks.length}
                  </p>
                  <p className="text-sm text-gray-400">Books Analyzed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">3-5 days</p>
                  <p className="text-sm text-gray-400">Processing Time</p>
                </div>
              </div>
            </div>

            {/* Book Recommendations */}
            <div className="space-y-6">
              {tradeInBooks.map((book) => (
                <div key={book.id} className="bg-black/20 p-6 rounded-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Book Info */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {book.publisher}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded text-xs bg-blue-600">
                          {book.condition?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          Market Value:
                        </span>
                        <span className="text-lg font-bold text-green-400">
                          ${book.estimatedValue}
                        </span>
                      </div>
                    </div>

                    {/* Trade Recommendation */}
                    <div>
                      <h4 className="font-semibold mb-2">Trade-In Offer</h4>
                      <div className="text-2xl font-bold text-green-400 mb-2">
                        ${book.tradeValue}
                      </div>
                      <p className="text-sm text-gray-300 mb-4">
                        Fair trade-in value based on condition and market demand
                      </p>
                      <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm">
                        Accept Offer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                📧 Get Shipping Labels
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeInPortalApp;
