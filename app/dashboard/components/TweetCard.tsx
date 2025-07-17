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
          {tweet.status === "ai-generated" && (
            <>
              <motion.button
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction("edit", tweet.id)}
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction("regenerate", tweet.id)}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-full hover:bg-orange-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction("schedule", tweet.id)}
              >
                <Calendar className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-full hover:bg-green-50 disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={postingTweetId === tweet.id}
                onClick={() => onPost(tweet)}
              >
                {postingTweetId === tweet.id ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </>
          )}

          {tweet.status === "scheduled" && (
            <>
              <motion.button
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction("edit", tweet.id)}
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-full hover:bg-orange-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction("reschedule", tweet.id)}
              >
                <Calendar className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-full hover:bg-green-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction("post-now", tweet.id)}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </>
          )}

          {/* More Options Menu */}
          <div className="relative tweet-menu">
            <motion.button
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpenTweetMenu(!openTweetMenu)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {openTweetMenu && (
                <motion.div
                  className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-200/70 overflow-hidden z-10"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    className="flex items-center gap-2 w-full p-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      onAction("copy", tweet.id);
                      setOpenTweetMenu(false);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    className="flex items-center gap-2 w-full p-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      onAction("delete", tweet.id);
                      setOpenTweetMenu(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}