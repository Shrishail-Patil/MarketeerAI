"use client";

import { motion } from "framer-motion";
import { Filter, RefreshCw } from "lucide-react";
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

interface GeneratedTweetsProps {
  tweets: Tweet[];
  searchQuery: string;
  onAction: (action: string, id: number) => void;
  onPost: (tweet: Tweet) => Promise<void>;
  postingTweetId: number | null;
  tweetIds: Record<number, string>;
  isGenerating: boolean;
  onGenerateTweets: () => void;
  onRefresh: () => void;
  onClearSearch: () => void;
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

export default function GeneratedTweets({
  tweets,
  searchQuery,
  onAction,
  onPost,
  postingTweetId,
  tweetIds,
  isGenerating,
  onGenerateTweets,
  onRefresh,
  onClearSearch,
}: GeneratedTweetsProps) {
  return (
    <>
      {/* Filter Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {tweets.length} generated tweet{tweets.length !== 1 ? "s" : ""}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
        <motion.button
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Tweet List */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={`generated-${searchQuery}`}
      >
        {tweets.length > 0 ? (
          tweets.map((tweet) => (
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
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tweets found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No generated tweets matching "${searchQuery}"`
                : "You don't have any generated tweets yet."}
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                onClick={onGenerateTweets}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate new tweets"}
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}