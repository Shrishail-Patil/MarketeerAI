"use client";

import { motion } from "framer-motion";
import { Filter, RefreshCw, CheckCircle2, BarChart3, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import TweetCard from "./TweetCard";

interface Tweet {
  id: number;
  content: string;
  status: string;
  timestamp: string;
  engagement: {
    likes: number;
    replies: number;
    retweets: number;
  };
  tweet_id?: string;
  product_name?: string;
}

interface PostedTweetsProps {
  tweets: Tweet[];
  searchQuery: string;
  onAction: (action: string, id: number) => void;
  onPost: (tweet: Tweet) => Promise<void>;
  postingTweetId: number | null;
  tweetIds: Record<number, string>;
  onRefresh: () => void;
  onClearSearch: () => void;
}

interface AnalyticsData {
  [tweetId: string]: {
    impressions?: number;
    likes?: number;
    replies?: number;
    retweets?: number;
    quotes?: number;
    video_views?: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
};

export default function PostedTweets({
  tweets,
  searchQuery,
  onAction,
  onPost,
  postingTweetId,
  tweetIds,
  onRefresh,
  onClearSearch,
}: PostedTweetsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({});
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [lastAnalyticsUpdate, setLastAnalyticsUpdate] = useState<Date | null>(null);

  // Fetch analytics for posted tweets
  const fetchAnalytics = async () => {
    const tweetIdsToFetch = tweets
      .filter(tweet => tweet.tweet_id) // Only tweets that have been posted to Twitter
      .map(tweet => tweet.tweet_id!)
      .filter(Boolean);

    if (tweetIdsToFetch.length === 0) return;

    setIsLoadingAnalytics(true);
    try {
      const response = await fetch('/api/get-analytic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tweetIds: tweetIdsToFetch,
          granularity: 'total',
          fields: ['impressions', 'likes', 'replies', 'retweets', 'quotes', 'video_views']
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const { analytics } = await response.json();
      
      // Transform the analytics data
      const transformedAnalytics: AnalyticsData = {};
      
      if (analytics?.data) {
        analytics.data.forEach((tweetAnalytics: any) => {
          const tweetId = tweetAnalytics.id;
          const metrics = tweetAnalytics.organic_metrics || tweetAnalytics.non_public_metrics || {};
          
          transformedAnalytics[tweetId] = {
            impressions: metrics.impression_count || 0,
            likes: metrics.like_count || 0,
            replies: metrics.reply_count || 0,
            retweets: metrics.retweet_count || 0,
            quotes: metrics.quote_count || 0,
            video_views: metrics.video_view_count || 0,
          };
        });
      }

      setAnalyticsData(transformedAnalytics);
      setLastAnalyticsUpdate(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Auto-fetch analytics when component mounts and tweets change
  useEffect(() => {
    if (tweets.length > 0) {
      fetchAnalytics();
    }
  }, [tweets.length]);

  // Enhanced refresh function
  const handleRefreshWithAnalytics = async () => {
    await Promise.all([
      onRefresh(),
      fetchAnalytics()
    ]);
  };

  // Merge analytics data with tweets
  const tweetsWithAnalytics = tweets.map(tweet => {
    if (tweet.tweet_id && analyticsData[tweet.tweet_id]) {
      const analytics = analyticsData[tweet.tweet_id];
      return {
        ...tweet,
        engagement: {
          likes: analytics.likes || tweet.engagement.likes,
          replies: analytics.replies || tweet.engagement.replies,
          retweets: analytics.retweets || tweet.engagement.retweets,
        },
        analytics: {
          ...analytics,
          impressions: analytics.impressions || 0,
        }
      };
    }
    return tweet;
  });

  // Calculate total analytics
  const totalAnalytics = tweetsWithAnalytics.reduce((acc, tweet) => {
    if ('analytics' in tweet && tweet.analytics) {
      acc.impressions += tweet.analytics.impressions || 0;
      acc.likes += tweet.engagement.likes || 0;
      acc.replies += tweet.engagement.replies || 0;
      acc.retweets += tweet.engagement.retweets || 0;
    }
    return acc;
  }, { impressions: 0, likes: 0, replies: 0, retweets: 0 });

  return (
    <>
      {/* Analytics Summary */}
      {tweets.length > 0 && (
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
            </div>
            <div className="flex items-center gap-2">
              {lastAnalyticsUpdate && (
                <span className="text-xs text-gray-500">
                  Updated {lastAnalyticsUpdate.toLocaleTimeString()}
                </span>
              )}
              <motion.button
                className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchAnalytics}
                disabled={isLoadingAnalytics}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/70 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalAnalytics.impressions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Impressions</div>
            </div>
            <div className="bg-white/70 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-500">
                {totalAnalytics.likes.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
            <div className="bg-white/70 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalAnalytics.retweets.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Retweets</div>
            </div>
            <div className="bg-white/70 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalAnalytics.replies.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Replies</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {tweets.length} posted tweet{tweets.length !== 1 ? "s" : ""}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
        <div className="flex items-center gap-2">
          {isLoadingAnalytics && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Updating analytics...</span>
            </div>
          )}
          <motion.button
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefreshWithAnalytics}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Tweet List */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={`posted-${searchQuery}`}
      >
        {tweetsWithAnalytics.length > 0 ? (
          tweetsWithAnalytics
            .filter((tweet) =>
              tweet.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((tweet) => (
              <TweetCard
                key={tweet.id}
                tweet={tweet}
                onAction={onAction}
                onPost={onPost}
                postingTweetId={postingTweetId}
                tweetIds={tweetIds}
              />
            ))
        ) : (
          <motion.div
            className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/70 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No posted tweets
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No posted tweets matching "${searchQuery}"`
                : "You haven't posted any tweets yet."}
            </p>
            {searchQuery ? (
              <button
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                onClick={onClearSearch}
              >
                Clear search
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                onClick={() => console.log("Create a tweet")}
              >
                Create a tweet
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}