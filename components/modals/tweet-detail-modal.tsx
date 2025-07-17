"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, MessageCircle, Repeat, Calendar, Sparkles } from "lucide-react"

interface TweetDetailModalProps {
  isOpen: boolean
  onClose: () => void
  tweet: {
    id: number
    content: string
    status: string
    timestamp: string
    engagement: {
      likes: number
      replies: number
      retweets: number
    }
    postedAt?: string
  }
}

export default function TweetDetailModal({ isOpen, onClose, tweet }: TweetDetailModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ai-generated":
        return "bg-blue-100 text-blue-600 border-blue-200"
      case "scheduled":
        return "bg-purple-100 text-purple-600 border-purple-200"
      case "posted":
        return "bg-green-100 text-green-600 border-green-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/70">
                <h2 className="text-xl font-bold text-gray-900">Tweet Details</h2>
                <motion.button
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                {/* Tweet Content */}
                <div className="mb-6">
                  <p className="text-lg text-gray-900 leading-relaxed whitespace-pre-wrap">{tweet.content}</p>
                </div>

                {/* Metadata */}
                <div className="space-y-4 mb-6">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        tweet.status,
                      )}`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>
                        {tweet.status === "ai-generated"
                          ? "AI-Generated"
                          : tweet.status.charAt(0).toUpperCase() + tweet.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Created/Posted Time */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {tweet.status === "posted" ? "Posted:" : "Created:"}
                    </span>
                    <span className="text-sm text-gray-600">{tweet.timestamp}</span>
                  </div>

                  {/* Posted via Marketeer */}
                  {tweet.status === "posted" && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Posted via Marketeer</span>
                    </div>
                  )}
                </div>

                {/* Engagement Metrics (only for posted tweets) */}
                {tweet.status === "posted" && (
                  <div className="border-t border-gray-200/70 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Heart className="w-5 h-5 text-red-500" />
                          <span className="text-2xl font-bold text-gray-900">{tweet.engagement.likes}</span>
                        </div>
                        <span className="text-sm text-gray-600">Likes</span>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <MessageCircle className="w-5 h-5 text-blue-500" />
                          <span className="text-2xl font-bold text-gray-900">{tweet.engagement.replies}</span>
                        </div>
                        <span className="text-sm text-gray-600">Replies</span>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Repeat className="w-5 h-5 text-green-500" />
                          <span className="text-2xl font-bold text-gray-900">{tweet.engagement.retweets}</span>
                        </div>
                        <span className="text-sm text-gray-600">Retweets</span>
                      </div>
                    </div>

                    {/* Total Engagement */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/60">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900 mb-1">
                          {tweet.engagement.likes + tweet.engagement.replies + tweet.engagement.retweets}
                        </div>
                        <div className="text-sm text-blue-700">Total Engagements</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Character Count */}
                <div className="border-t border-gray-200/70 pt-6 mt-6">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Character count:</span>
                    <span className="font-medium">{tweet.content.length} / 280 characters</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((tweet.content.length / 280) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
