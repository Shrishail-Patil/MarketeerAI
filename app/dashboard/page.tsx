"use client";

import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  Edit,
  RefreshCw,
  Send,
  MoreHorizontal,
  Copy,
  Trash2,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Search,
  Filter,
  ArrowUp,
  CheckCircle2,
  MessageCircle,
  Repeat,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import MarketeerLogoutButton from "./components/Logout/logout";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase/client"; // adjust path if needed
import TweetCard from "./components/TweetCard"; // Adjust path based on your folder structure
import Footer from "./components/Footer";
import GeneratedTweets from "./components/GeneratedTweets";
import ScheduledTweets from "./components/ScheduledTweets";
import PostedTweets from "./components/PostedTweets";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("generated");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  // const [openTweetMenu, setOpenTweetMenu] = useState<number | null>(null);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  // top of the component, right next to your other useState hooks
  const [tweetIds, setTweetIds] = useState<Record<number, string>>({}); // localId → real tweet id
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // Replace the existing useState declarations with:
  const [generatedTweets, setGeneratedTweets] = useState([]);
  const [scheduledTweets, setScheduledTweets] = useState([]);
  const [postedTweets, setPostedTweets] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postingTweetId, setPostingTweetId] = useState<number | null>(null);
  const { data: session } = useSession();
  const [profile, setProfile] = useState<{ username: string; image: string }>({
    username: "",
    image: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.name) return;

      const { data, error } = await supabase
        .from("xusers")
        .select("username, image")
        .eq("username", session.user.name)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        // alert(data);
        setProfile({
          username: data.username,
          image: data.image,
        });
      }
    };

    fetchUserProfile();
  }, [session]);

  // helper that actually posts and stores the returned tweet id
  const postIt = async (tweet: { id: number; content: string }) => {
    try {
      setPostingTweetId(tweet.id);

      const res = await fetch("/api/tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tweet.content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Twitter API failed");

      // Update tweet status in database
      const updateRes = await fetch("/api/tweets/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tweetId: tweet.id, // ✅ This is your local Supabase UUID (from generatedTweets[])
          category: "posted",
          update_at: new Date().toISOString(),
          tweet_id: data.tweet_id, // ✅ Twitter tweet ID (for analytics/linking)
          analytics: { likes: 0, replies: 0, retweets: 0 },
        }),
      });

      if (!updateRes.ok) throw new Error("Failed to update tweet status");

      // Move tweet from generated to posted
      setGeneratedTweets((prev) => prev.filter((t) => t.id !== tweet.id));
      setPostedTweets((prev) => [
        ...prev,
        {
          ...tweet,
          status: "posted",
          timestamp: "Just now",
          tweet_id: data.tweet_id,
          engagement: { likes: 0, replies: 0, retweets: 0 },
        },
      ]);
    } catch (err) {
      console.error("Error posting tweet:", err);
      alert("Could not post tweet, check console.");
    } finally {
      setPostingTweetId(null);
    }
  };

  const fetchTweets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tweets");
      if (!response.ok) throw new Error("Failed to fetch tweets");

      const { tweets } = await response.json();

      // Transform and categorize tweets
      const transformedTweets = tweets.map((tweet) => ({
        id: tweet.id,
        content: tweet.content,
        status:
          tweet.category === "generated" ? "ai-generated" : tweet.category,
        timestamp: formatTimestamp(tweet.created_at),
        engagement: tweet.analytics || { likes: 0, replies: 0, retweets: 0 },
        tweet_id: tweet.tweet_id,
        product_name: tweet.product_name,
      }));

      // Separate tweets by category
      const generated = transformedTweets.filter(
        (t) => t.status === "ai-generated"
      );
      const scheduled = transformedTweets.filter(
        (t) => t.status === "scheduled"
      );
      const posted = transformedTweets.filter((t) => t.status === "posted");

      setGeneratedTweets(generated);
      setScheduledTweets(scheduled);
      setPostedTweets(posted);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const tweetTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - tweetTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getTweets = () => {
    switch (activeTab) {
      case "generated":
        return generatedTweets;
      case "scheduled":
        return scheduledTweets;
      case "posted":
        return postedTweets;
      default:
        return generatedTweets;
    }
  };

  const filteredTweets = getTweets().filter((tweet) =>
    tweet.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowScrollTop(scrollRef.current.scrollTop > 300);
    }
  };

  const generateTweets = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/writer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: "Marketeer",
          description: "AI-powered tweet generator for indie hackers",
          keyFeatures: ["AI tweet generation", "Scheduling", "Analytics"],
          targetAudience: "indie hackers, developers, entrepreneurs",
          tonePreference: "casual",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate tweets");
      }

      const { tweets, stored } = await response.json();

      // Transform stored tweets to match UI format
      const formattedTweets = stored.map((tweet) => ({
        id: tweet.id, // Use Supabase generated ID
        content: tweet.content,
        status: "ai-generated",
        timestamp: "Just now",
        engagement: { likes: 0, replies: 0, retweets: 0 },
        product_name: tweet.product_name,
      }));

      setGeneratedTweets((prev) => [...formattedTweets, ...prev]);
    } catch (error) {
      console.error("Error generating tweets:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "generated") {
      generateTweets();
    } else {
      fetchTweets(); // Refresh all tweets from database
    }
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleTweetAction = (action: string, id: number) => {
    console.log(`Action: ${action}, Tweet ID: ${id}`);
    // setOpenTweetMenu(null);
  };

  const renderTweetSection = () => {
    const commonProps = {
      searchQuery,
      onAction: handleTweetAction,
      onPost: postIt,
      postingTweetId,
      tweetIds,
      onRefresh: handleRefresh,
      onClearSearch: () => setSearchQuery(""),
    };

    switch (activeTab) {
      case "generated":
        return (
          <GeneratedTweets
            tweets={filteredTweets}
            isGenerating={isGenerating}
            onGenerateTweets={generateTweets}
            {...commonProps}
          />
        );
      case "scheduled":
        return <ScheduledTweets tweets={filteredTweets} {...commonProps} />;
      case "posted":
        return <PostedTweets tweets={filteredTweets} {...commonProps} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openProfileMenu &&
        !(event.target as Element).closest(".profile-menu")
      ) {
        setOpenProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfileMenu]); // Remove openTweetMenu dependency

  useEffect(() => {
    if (session) {
      fetchTweets();
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-100/30 to-yellow-100/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="px-6 py-6 sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/70"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto">
            <div className="flex justify-between items-center">
              {/* Logo and Greeting */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Marketeer
                  </span>
                  <h1 className="text-sm text-gray-600">
                    Welcome back, {profile.username || "User"}!
                  </h1>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-4">
                {/* Search Toggle */}
                <motion.button
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="w-5 h-5" />
                </motion.button>

                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-5 h-5" />
                    {/* TODO: Add unread notifications badge when notification data is available */}
                  </motion.button>
                </div>

                {/* Profile Menu */}
                <div className="relative profile-menu">
                  <motion.button
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenProfileMenu(!openProfileMenu)}
                  >
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt="User avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {profile.username?.charAt(0) || "U"}
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {openProfileMenu && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200/70 overflow-hidden z-30"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-3 border-b border-gray-200/70">
                          <div className="flex items-center gap-3">
                            {profile.image ? (
                              <img
                                src={profile.image}
                                alt="User avatar"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                                {profile.username?.charAt(0) || "U"}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">
                                {profile.username || "Loading..."}
                              </div>
                              <div className="text-sm text-gray-600">
                                {session?.user?.email}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <button
                            className="flex items-center gap-2 w-full p-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => router.push("/profile")}
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </button>
                          <button className="flex items-center gap-2 w-full p-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                          <MarketeerLogoutButton />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Search Bar (Expandable) */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search tweets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    />
                    {searchQuery && (
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchQuery("")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex mt-6 border-b border-gray-200/70">
              <button
                className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                  activeTab === "generated"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("generated")}
              >
                Generated
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                  {generatedTweets.length}
                </span>
                {activeTab === "generated" && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                    layoutId="activeTab"
                  />
                )}
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                  activeTab === "scheduled"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("scheduled")}
              >
                Scheduled
                <span className="ml-2 bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full">
                  {scheduledTweets.length}
                </span>
                {activeTab === "scheduled" && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                    layoutId="activeTab"
                  />
                )}
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                  activeTab === "posted"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("posted")}
              >
                Posted
                <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                  {postedTweets.length}
                </span>
                {activeTab === "posted" && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                    layoutId="activeTab"
                  />
                )}
              </button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div
          className=" mx-auto px-6 py-6 h-[calc(100vh-180px)] overflow-y-auto"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {/* Refresh Indicator */}
          <AnimatePresence>
            {(isRefreshing || isGenerating) && (
              <motion.div
                className="flex justify-center mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {isGenerating ? "Generating tweets..." : "Refreshing..."}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render appropriate tweet section */}
          {renderTweetSection()}
        </div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              className="fixed bottom-18 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg z-20"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
        {/* Footer */}
        <motion.footer
          className="px-6 py-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Footer />
        </motion.footer>
      </div>
    </div>
  );
}
