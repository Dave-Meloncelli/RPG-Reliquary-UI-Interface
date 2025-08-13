import React, { useState, useEffect } from "react";

interface Publisher {
  id: any;
  name: any;
  description: any;
  founded: any;
  headquarters: any;
  website: any;
  logo: any;
  series: RPGSeries[];
  bookCount: any;
  averageRating: any;
}

interface RPGSeries {
  id: any;
  name: any;
  publisher: any;
  description: any;
  bookCount: any;
  firstPublished: any;
  lastPublished: any;
  genre: any;
  setting: any;
  complexity: "beginner" | "intermediate" | "advanced";
}

interface RPGBook {
  id: any;
  title: any;
  publisher: any;
  series: any;
  edition: any;
  year: any;
  isbn: any;
  coverImage: any;
  description: any;
  genre: any;
  setting: any;
  complexity: "beginner" | "intermediate" | "advanced";
  pageCount: any;
  price: any;
  inStock: boolean;
  affiliateLinks: AffiliateLink[];
  communityRating: any;
  reviewCount: any;
}

interface AffiliateLink {
  platform: any;
  url: any;
  price: any;
  commission: any;
  inStock: boolean;
}

interface LoreArticle {
  id: any;
  title: any;
  category: "publisher" | "series" | "genre" | "history" | "culture";
  content: any;
  author: any;
  publishDate: any;
  tags: any[];
  featured: boolean;
}

const RPGCommunityHubApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "home" | "publishers" | "series" | "books" | "lore" | "community"
  >("home");
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [books, setBooks] = useState<RPGBook[]>([]);
  const [loreArticles, setLoreArticles] = useState<LoreArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(
    null,
  );
  const [selectedSeries, setSelectedSeries] = useState<RPGSeries | null>(null);

  useEffect(() => {
    // Initialize sample data
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    const samplePublishers: Publisher[] = [
      {
        id: "wizards",
        name: "Wizards of the Coast",
        description:
          "The legendary publisher behind Dungeons & Dragons, the world's most popular tabletop roleplaying game.",
        founded: "1990",
        headquarters: "Renton, Washington",
        website: "https://dnd.wizards.com",
        logo: "🎲",
        bookCount: 1247,
        averageRating: 4.8,
        series: [
          {
            id: "dnd",
            name: "Dungeons & Dragons",
            publisher: "Wizards of the Coast",
            description:
              "The world's greatest roleplaying game. Create heroic characters, embark on epic adventures, and tell legendary stories.",
            bookCount: 456,
            firstPublished: "1974",
            lastPublished: "2024",
            genre: "Fantasy",
            setting: "Forgotten Realms, Eberron, Ravenloft",
            complexity: "intermediate",
          },
        ],
      },
      {
        id: "paizo",
        name: "Paizo Publishing",
        description:
          "Creators of Pathfinder, the award-winning fantasy roleplaying game that puts you in the role of a brave adventurer.",
        founded: "2002",
        headquarters: "Redmond, Washington",
        website: "https://paizo.com",
        logo: "⚔️",
        bookCount: 892,
        averageRating: 4.7,
        series: [
          {
            id: "pathfinder",
            name: "Pathfinder",
            publisher: "Paizo Publishing",
            description:
              "A fantasy tabletop roleplaying game that puts you in the role of a brave adventurer fighting to survive in a world beset by magic and evil.",
            bookCount: 234,
            firstPublished: "2009",
            lastPublished: "2024",
            genre: "Fantasy",
            setting: "Golarion",
            complexity: "advanced",
          },
        ],
      },
      {
        id: "chaosium",
        name: "Chaosium Inc",
        description:
          "Publishers of Call of Cthulhu, the horror roleplaying game based on the works of H.P. Lovecraft.",
        founded: "1975",
        headquarters: "Oakland, California",
        website: "https://chaosium.com",
        logo: "🐙",
        bookCount: 567,
        averageRating: 4.9,
        series: [
          {
            id: "cthulhu",
            name: "Call of Cthulhu",
            publisher: "Chaosium Inc",
            description:
              "A horror roleplaying game based on the works of H.P. Lovecraft, where investigators confront cosmic horrors.",
            bookCount: 189,
            firstPublished: "1981",
            lastPublished: "2024",
            genre: "Horror",
            setting: "1920s, Modern, Dark Ages",
            complexity: "intermediate",
          },
        ],
      },
    ];

    const sampleBooks: RPGBook[] = [
      {
        id: "dnd-phb-5e",
        title: "Dungeons & Dragons Player's Handbook",
        publisher: "Wizards of the Coast",
        series: "Dungeons & Dragons",
        edition: "5th Edition",
        year: 2014,
        isbn: "978-0786965601",
        coverImage: "📚",
        description:
          "The essential reference for every Dungeons & Dragons roleplayer. Contains rules for character creation, combat, magic, and more.",
        genre: "Fantasy",
        setting: "Forgotten Realms",
        complexity: "intermediate",
        pageCount: 320,
        price: 49.95,
        inStock: true,
        affiliateLinks: [
          {
            platform: "Amazon",
            url: "#",
            price: 49.95,
            commission: 2.5,
            inStock: true,
          },
          {
            platform: "Barnes & Noble",
            url: "#",
            price: 49.95,
            commission: 2.0,
            inStock: true,
          },
          {
            platform: "Local Game Store",
            url: "#",
            price: 49.95,
            commission: 5.0,
            inStock: true,
          },
        ],
        communityRating: 4.8,
        reviewCount: 1247,
      },
      {
        id: "pathfinder-core",
        title: "Pathfinder Core Rulebook",
        publisher: "Paizo Publishing",
        series: "Pathfinder",
        edition: "2nd Edition",
        year: 2019,
        isbn: "978-1640781689",
        coverImage: "📚",
        description:
          "The complete rules for the Pathfinder roleplaying game, including character creation, combat, magic, and equipment.",
        genre: "Fantasy",
        setting: "Golarion",
        complexity: "advanced",
        pageCount: 640,
        price: 59.99,
        inStock: false,
        affiliateLinks: [
          {
            platform: "Amazon",
            url: "#",
            price: 59.99,
            commission: 3.0,
            inStock: true,
          },
          {
            platform: "Paizo Store",
            url: "#",
            price: 59.99,
            commission: 6.0,
            inStock: true,
          },
        ],
        communityRating: 4.7,
        reviewCount: 892,
      },
    ];

    const sampleLore: LoreArticle[] = [
      {
        id: "dnd-history",
        title:
          "The Evolution of Dungeons & Dragons: From Chainmail to 5th Edition",
        category: "history",
        content:
          "Dungeons & Dragons began as a medieval wargame called Chainmail in 1971...",
        author: "The Reliquarian",
        publishDate: "2024-01-15",
        tags: ["D&D", "history", "evolution", "Gary Gygax"],
        featured: true,
      },
      {
        id: "rpg-culture",
        title: "The Light and Dark Side of RPG Culture",
        category: "culture",
        content:
          "Roleplaying games have always been a reflection of both the best and worst aspects of human nature...",
        author: "The Reliquarian",
        publishDate: "2024-01-10",
        tags: ["culture", "community", "ethics", "inclusion"],
        featured: true,
      },
    ];

    setPublishers(samplePublishers);
    setBooks(sampleBooks);
    setLoreArticles(sampleLore);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.series.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getComplexityColor = (complexity: any) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-600";
      case "intermediate":
        return "bg-yellow-600";
      case "advanced":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🏰 RPG Community Hub</h1>
          <p className="text-xl text-blue-200">
            The ultimate destination for RPG enthusiasts. Explore publishers,
            discover lore, and find your next adventure.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 bg-black/30 rounded-lg p-2">
          {[
            { id: "home", label: "🏠 Home", icon: "🏠" },
            { id: "publishers", label: "🏢 Publishers", icon: "🏢" },
            { id: "series", label: "📚 Series", icon: "📚" },
            { id: "books", label: "📖 Books", icon: "📖" },
            { id: "lore", label: "📜 Lore", icon: "📜" },
            { id: "community", label: "👥 Community", icon: "👥" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg mx-1 transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search books, publishers, or series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-blue-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Content */}
        {activeTab === "home" && (
          <div className="space-y-8">
            {/* Featured Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-black/30 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">
                  🌟 Featured Publisher
                </h2>
                <div className="text-center">
                  <div className="text-6xl mb-4">🎲</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Wizards of the Coast
                  </h3>
                  <p className="text-gray-300 mb-4">
                    The legendary publisher behind Dungeons & Dragons
                  </p>
                  <button
                    onClick={() => setActiveTab("publishers")}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                  >
                    Explore Publisher
                  </button>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">📜 Latest Lore</h2>
                <div className="space-y-4">
                  {loreArticles.slice(0, 2).map((article) => (
                    <div
                      key={article.id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <h3 className="font-semibold">{article.title}</h3>
                      <p className="text-sm text-gray-400">
                        {article.publishDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-black/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {publishers.length}
                </div>
                <div className="text-sm text-gray-400">Publishers</div>
              </div>
              <div className="bg-black/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-400">
                  {books.length}
                </div>
                <div className="text-sm text-gray-400">Books</div>
              </div>
              <div className="bg-black/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {loreArticles.length}
                </div>
                <div className="text-sm text-gray-400">Lore Articles</div>
              </div>
              <div className="bg-black/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-400">∞</div>
                <div className="text-sm text-gray-400">Adventures</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "publishers" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">🏢 RPG Publishers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishers.map((publisher) => (
                <div
                  key={publisher.id}
                  className="bg-black/30 rounded-lg p-6 hover:bg-black/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedPublisher(publisher)}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{publisher.logo}</div>
                    <h3 className="text-lg font-semibold">{publisher.name}</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    {publisher.description}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-400">
                      {publisher.bookCount} books
                    </span>
                    <span className="text-yellow-400">
                      ★ {publisher.averageRating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "books" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">📖 RPG Books Database</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-black/30 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{book.coverImage}</div>
                    <div className="flex-grow">
                      <h3 className="font-semibold mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-400">{book.publisher}</p>
                      <p className="text-sm text-gray-400">
                        {book.series} ({book.edition})
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-4">
                    {book.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getComplexityColor(book.complexity)}`}
                    >
                      {book.complexity.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">{book.genre}</span>
                    <span className="text-sm text-gray-400">
                      ★ {book.communityRating}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {book.affiliateLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-black/20 p-2 rounded"
                      >
                        <span className="text-sm">{link.platform}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-semibold">
                            ${link.price}
                          </span>
                          {link.inStock ? (
                            <span className="text-xs bg-green-600 px-2 py-1 rounded">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-xs bg-red-600 px-2 py-1 rounded">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "lore" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">📜 RPG Lore & Culture</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loreArticles.map((article) => (
                <div key={article.id} className="bg-black/30 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-600 rounded text-xs">
                      {article.category}
                    </span>
                    {article.featured && (
                      <span className="px-2 py-1 bg-yellow-600 rounded text-xs">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    By {article.author} • {article.publishDate}
                  </p>
                  <p className="text-gray-300 mb-4">
                    {article.content.substring(0, 200)}...
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "community" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">👥 RPG Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  🤝 Community Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Respect all players and their preferences</li>
                  <li>• Welcome newcomers with open arms</li>
                  <li>• Share knowledge and help others learn</li>
                  <li>• Celebrate diversity in gaming</li>
                  <li>• Support local game stores and communities</li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">🌟 Get Involved</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                    📧 Join Our Newsletter
                  </button>
                  <button className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                    🎲 Find Local Groups
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
                    💬 Community Forum
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Publisher Detail Modal */}
        {selectedPublisher && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedPublisher.name}</h2>
                <button
                  onClick={() => setSelectedPublisher(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{selectedPublisher.logo}</div>
                <p className="text-gray-300 mb-4">
                  {selectedPublisher.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Founded:</span>
                    <p className="font-semibold">{selectedPublisher.founded}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Headquarters:</span>
                    <p className="font-semibold">
                      {selectedPublisher.headquarters}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Series</h3>
              <div className="space-y-3">
                {selectedPublisher.series.map((series) => (
                  <div key={series.id} className="bg-black/20 p-4 rounded">
                    <h4 className="font-semibold">{series.name}</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      {series.description}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-600 rounded">
                        {series.genre}
                      </span>
                      <span className="px-2 py-1 bg-green-600 rounded">
                        {series.bookCount} books
                      </span>
                      <span
                        className={`px-2 py-1 rounded ${getComplexityColor(series.complexity)}`}
                      >
                        {series.complexity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RPGCommunityHubApp;
