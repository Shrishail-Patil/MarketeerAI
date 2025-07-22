import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Edit,
  RefreshCw,
  Calendar,
  Send,
  MoreHorizontal,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
  MessageCircle,
  Repeat,
} from "lucide-react";

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

interface TweetCardProps {
  tweet: Tweet;
  onAction: (action: string, id: number) => void;
  onPost: (tweet: Tweet) => void;
  postingTweetId: number | null;
  tweetIds: Record<number, string>;
}

export default function TweetCard({
  tweet,
  onAction,
  onPost,
  postingTweetId,
  tweetIds,
}: TweetCardProps) {
  const [openTweetMenu, setOpenTweetMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ai-generated":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "scheduled":
        return "bg-purple-100 text-purple-600 border-purple-200";
      case "posted":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ai-generated":
        return <Sparkles className="w-3 h-3" />;
      case "scheduled":
        return <Clock className="w-3 h-3" />;
      case "posted":
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    return status === "ai-generated"
      ? "AI-Generated"
      : status.charAt(0).toUpperCase() + status.slice(1);
  };

  return ( 
    <motion.div
      className="p-6 bg-white rounded-2xl border border-gray-200/70 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tweet Content */}
      <div className="mb-4">
        <p className="text-gray-900 leading-relaxed">{tweet.content}</p>
      </div>

      {/* Tweet Meta */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              tweet.status
            )}`}
          >
            {getStatusIcon(tweet.status)}
            <span>{getStatusLabel(tweet.status)}</span>
          </div>

          {/* Timestamp */}
          <span className="text-xs text-gray-500">{tweet.timestamp}</span>

          {/* Tweet ID Display */}
          {tweetIds[tweet.id] && (
            <span className="ml-2 text-xs text-green-600">
              Tweeted ✔️ ID: {tweetIds[tweet.id]}
            </span>
          )}

          {/* Engagement (only for posted tweets) */}
          {tweet.status === "posted" && (
            <div className="flex items-center gap-3 ml-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Heart className="w-3 h-3" />
                <span>{tweet.id}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Heart className="w-3 h-3" />
                <span>{tweet.engagement.likes}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MessageCircle className="w-3 h-3" />
                <span>{tweet.engagement.replies}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Repeat className="w-3 h-3" />
                <span>{tweet.engagement.retweets}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {(tweet.status === "ai-generated" || tweet.status === "scheduled") && (
            <div className="flex items-center gap-2">
              {/* Animated Post Button */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 border border-green-600 transition-all duration-200 rounded-sm shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.0005, boxShadow: "0 4px 20px 0 green-100" }}
                  whileTap={{ scale: 0.95 }}
                  disabled={postingTweetId === tweet.id}
                  onClick={() => onPost(tweet)}
                >
                  {postingTweetId === tweet.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Post
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Animated Copy Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-sm shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.0005, boxShadow: "0 4px 20px 0 blue-100" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(tweet.content)
                      .then(() => console.log('Tweet copied to clipboard!'))
                      .catch((err) => console.error('Failed to copy tweet:', err));
                  }}
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}