import React, { useState, useEffect } from "react";

interface SocialPost {
  id: any;
  platform:
    | "facebook"
    | "instagram"
    | "twitter"
    | "pinterest"
    | "youtube"
    | "tiktok";
  content: any;
  image?: any;
  hashtags: any[];
  scheduledDate?: any;
  status: "draft" | "scheduled" | "published" | "failed";
  engagement: {
    likes: any;
    shares: any;
    comments: any;
    clicks: any;
  };
  targetAudience: any[];
  contentType:
    | "lore"
    | "community"
    | "book-showcase"
    | "tips"
    | "news"
    | "behind-scenes";
}

interface SocialAccount {
  platform: any;
  username: any;
  followers: any;
  engagement: any;
  connected: boolean;
  lastPost: any;
}

interface ContentCalendar {
  date: any;
  posts: SocialPost[];
  theme: any;
  notes: any;
}

const SocialMediaHubApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "content" | "calendar" | "analytics" | "accounts"
  >("overview");
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [contentCalendar, setContentCalendar] = useState<ContentCalendar[]>([]);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  useEffect(() => {
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    const samplePosts: SocialPost[] = [
      {
        id: "1",
        platform: "facebook",
        content:
          "🎲 Did you know that the first edition of Dungeons & Dragons was published in 1974? Today we're exploring the evolution of the world's greatest roleplaying game! What's your favorite D&D memory? #DnD #RPG #TabletopGaming #Community",
        hashtags: ["DnD", "RPG", "TabletopGaming", "Community"],
        status: "published",
        engagement: { likes: 45, shares: 12, comments: 8, clicks: 23 },
        targetAudience: ["RPG enthusiasts", "D&D players", "Gamers"],
        contentType: "lore",
      },
      {
        id: "2",
        platform: "instagram",
        content:
          "📚 Today's #BookShowcase: The Pathfinder Core Rulebook! This comprehensive guide has everything you need to start your adventure in the world of Golarion. Perfect for both new players and veterans looking to explore a rich fantasy setting. What RPG books are you reading this week? 📖✨ #Pathfinder #RPG #Fantasy #Gaming",
        image: "📚",
        hashtags: ["BookShowcase", "Pathfinder", "RPG", "Fantasy", "Gaming"],
        status: "scheduled",
        scheduledDate: "2024-01-20T10:00:00Z",
        engagement: { likes: 0, shares: 0, comments: 0, clicks: 0 },
        targetAudience: ["RPG collectors", "Fantasy fans", "Gamers"],
        contentType: "book-showcase",
      },
      {
        id: "3",
        platform: "twitter",
        content:
          "🤝 The RPG community is built on friendship, creativity, and shared adventures. Today we're celebrating the amazing people who make this hobby so special. Tag a friend who introduced you to RPGs! #RPGCommunity #Friendship #Gaming #Creativity",
        hashtags: ["RPGCommunity", "Friendship", "Gaming", "Creativity"],
        status: "draft",
        engagement: { likes: 0, shares: 0, comments: 0, clicks: 0 },
        targetAudience: ["RPG community", "Gamers", "Creatives"],
        contentType: "community",
      },
    ];

    const sampleAccounts: SocialAccount[] = [
      {
        platform: "Facebook",
        username: "@RPGVaultCommunity",
        followers: 1247,
        engagement: 4.2,
        connected: true,
        lastPost: "2 hours ago",
      },
      {
        platform: "Instagram",
        username: "@rpg_vault",
        followers: 892,
        engagement: 6.8,
        connected: true,
        lastPost: "1 day ago",
      },
      {
        platform: "Twitter",
        username: "@RPGVault",
        followers: 567,
        engagement: 3.5,
        connected: false,
        lastPost: "3 days ago",
      },
      {
        platform: "Pinterest",
        username: "RPG Vault",
        followers: 234,
        engagement: 2.1,
        connected: true,
        lastPost: "1 week ago",
      },
    ];

    setSocialPosts(samplePosts);
    setAccounts(sampleAccounts);
  };

  const getPlatformIcon = (platform: any) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return "📘";
      case "instagram":
        return "📷";
      case "twitter":
        return "🐦";
      case "pinterest":
        return "📌";
      case "youtube":
        return "📺";
      case "tiktok":
        return "🎵";
      default:
        return "📱";
    }
  };

  const getContentTypeColor = (type: any) => {
    switch (type) {
      case "lore":
        return "bg-purple-600";
      case "community":
        return "bg-blue-600";
      case "book-showcase":
        return "bg-green-600";
      case "tips":
        return "bg-yellow-600";
      case "news":
        return "bg-red-600";
      case "behind-scenes":
        return "bg-indigo-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "published":
        return "text-green-400";
      case "scheduled":
        return "text-yellow-400";
      case "draft":
        return "text-gray-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const createPost = () => {
    setIsCreatingPost(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">📱 Social Media Hub</h1>
          <p className="text-xl text-blue-200">
            Build community, share knowledge, and grow our RPG family - all
            while being respectful and genuine.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 bg-black/30 rounded-lg p-2">
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "content", label: "📝 Content" },
            { id: "calendar", label: "📅 Calendar" },
            { id: "analytics", label: "📈 Analytics" },
            { id: "accounts", label: "🔗 Accounts" },
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

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-black/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-400">2,940</div>
                <div className="text-sm text-gray-400">Total Followers</div>
              </div>
              <div className="bg-black/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-400">4.2%</div>
                <div className="text-sm text-gray-400">Avg Engagement</div>
              </div>
              <div className="bg-black/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-400">12</div>
                <div className="text-sm text-gray-400">Posts This Week</div>
              </div>
              <div className="bg-black/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-400">156</div>
                <div className="text-sm text-gray-400">
                  Community Interactions
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-black/30 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">
                  📊 Recent Performance
                </h2>
                <div className="space-y-4">
                  {socialPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-4 bg-black/20 p-3 rounded"
                    >
                      <div className="text-2xl">
                        {getPlatformIcon(post.platform)}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-semibold">{post.platform}</p>
                        <p className="text-xs text-gray-400">
                          {post.content.substring(0, 50)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-400">
                          {post.engagement.likes}
                        </p>
                        <p className="text-xs text-gray-400">likes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">🎯 Content Strategy</h2>
                <div className="space-y-4">
                  <div className="bg-black/20 p-4 rounded">
                    <h3 className="font-semibold mb-2">
                      Community-First Approach
                    </h3>
                    <p className="text-sm text-gray-300">
                      Focus on building genuine connections, not just sales
                    </p>
                  </div>
                  <div className="bg-black/20 p-4 rounded">
                    <h3 className="font-semibold mb-2">Educational Content</h3>
                    <p className="text-sm text-gray-300">
                      Share RPG lore, tips, and behind-the-scenes insights
                    </p>
                  </div>
                  <div className="bg-black/20 p-4 rounded">
                    <h3 className="font-semibold mb-2">Inclusive Messaging</h3>
                    <p className="text-sm text-gray-300">
                      Welcome all players regardless of experience level
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">📝 Content Management</h2>
              <button
                onClick={createPost}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                ✨ Create Post
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {socialPosts.map((post) => (
                <div key={post.id} className="bg-black/30 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-3xl">
                      {getPlatformIcon(post.platform)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{post.platform}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs ${getContentTypeColor(post.contentType)}`}
                        >
                          {post.contentType}
                        </span>
                        <span
                          className={`text-xs ${getStatusColor(post.status)}`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {post.content.substring(0, 100)}...
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-600 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                      <p className="text-green-400 font-semibold">
                        {post.engagement.likes}
                      </p>
                      <p className="text-gray-400">Likes</p>
                    </div>
                    <div>
                      <p className="text-blue-400 font-semibold">
                        {post.engagement.shares}
                      </p>
                      <p className="text-gray-400">Shares</p>
                    </div>
                    <div>
                      <p className="text-purple-400 font-semibold">
                        {post.engagement.comments}
                      </p>
                      <p className="text-gray-400">Comments</p>
                    </div>
                    <div>
                      <p className="text-yellow-400 font-semibold">
                        {post.engagement.clicks}
                      </p>
                      <p className="text-gray-400">Clicks</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "accounts" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">🔗 Connected Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div
                  key={account.platform}
                  className="bg-black/30 rounded-lg p-6"
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">
                      {getPlatformIcon(account.platform)}
                    </div>
                    <h3 className="text-lg font-semibold">
                      {account.platform}
                    </h3>
                    <p className="text-sm text-gray-400">{account.username}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Followers:</span>
                      <span className="text-sm font-semibold">
                        {account.followers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Engagement:</span>
                      <span className="text-sm font-semibold">
                        {account.engagement}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Last Post:</span>
                      <span className="text-sm text-gray-400">
                        {account.lastPost}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      className={`w-full px-4 py-2 rounded text-sm ${
                        account.connected
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      {account.connected ? "✅ Connected" : "🔗 Connect"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">📈 Analytics & Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  📊 Engagement Trends
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Facebook</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Instagram</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">78%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Twitter</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full"
                          style={{ width: "42%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">42%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  🎯 Content Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lore Posts</span>
                    <span className="text-sm font-semibold text-purple-400">
                      4.8% engagement
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Community Posts</span>
                    <span className="text-sm font-semibold text-blue-400">
                      5.2% engagement
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Book Showcases</span>
                    <span className="text-sm font-semibold text-green-400">
                      3.9% engagement
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tips & Guides</span>
                    <span className="text-sm font-semibold text-yellow-400">
                      6.1% engagement
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post Creation Modal */}
        {isCreatingPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">Create New Post</h2>
                <button
                  onClick={() => setIsCreatingPost(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Platform
                  </label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2">
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>Twitter</option>
                    <option>Pinterest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Content Type
                  </label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2">
                    <option>Community</option>
                    <option>Lore</option>
                    <option>Book Showcase</option>
                    <option>Tips</option>
                    <option>News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Content
                  </label>
                  <textarea
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 h-32"
                    placeholder="Write your post content here..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                    placeholder="#RPG #Community #Gaming"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">
                  Save Draft
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                  Schedule Post
                </button>
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                  Publish Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaHubApp;
