"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Save, Send, Calendar, AlertCircle } from "lucide-react"

interface EditTweetModalProps {
  isOpen: boolean
  onClose: () => void
  tweet: {
    id: number
    content: string
  }
  onSave: (content: string) => void
  onPost: (content: string) => void
  onSchedule: (content: string) => void
}

export default function EditTweetModal({ isOpen, onClose, tweet, onSave, onPost, onSchedule }: EditTweetModalProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [actionType, setActionType] = useState<"save" | "post" | "schedule" | null>(null)

  const maxLength = 280
  const remainingChars = maxLength - content.length
  const isOverLimit = remainingChars < 0

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent(tweet.content)
      setActionType(null)
    }
  }, [isOpen, tweet.content])

  const handleAction = async (action: "save" | "post" | "schedule") => {
    if (isOverLimit) return

    setIsLoading(true)
    setActionType(action)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      switch (action) {
        case "save":
          onSave(content)
          break
        case "post":
          onPost(content)
          break
        case "schedule":
          onSchedule(content)
          break
      }

      onClose()
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      setIsLoading(false)
      setActionType(null)
    }
  }

  const getCharCountColor = () => {
    if (remainingChars < 0) return "text-red-500"
    if (remainingChars < 20) return "text-orange-500"
    return "text-gray-500"
  }

  const getCharCountBg = () => {
    if (remainingChars < 0) return "bg-red-100"
    if (remainingChars < 20) return "bg-orange-100"
    return "bg-gray-100"
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
            className="fixed inset-x-0 bottom-0 z-50"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-white rounded-t-3xl shadow-2xl max-w-2xl mx-auto">
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/70">
                <h2 className="text-xl font-bold text-gray-900">Edit Tweet</h2>
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
              <div className="p-6">
                {/* Text Editor */}
                <div className="mb-4">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's happening?"
                    className="w-full h-32 p-4 text-lg resize-none border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    maxLength={maxLength + 50} // Allow typing over limit to show error
                  />

                  {/* Character Counter */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">
                      {content.length} / {maxLength} characters
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCharCountBg()} ${getCharCountColor()}`}
                    >
                      {remainingChars >= 0 ? `${remainingChars} left` : `${Math.abs(remainingChars)} over`}
                    </div>
                  </div>

                  {/* Over Limit Warning */}
                  {isOverLimit && (
                    <motion.div
                      className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200/70"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Tweet is {Math.abs(remainingChars)} characters over the limit
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Save Button */}
                  <motion.button
                    className="px-4 py-3 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAction("save")}
                    disabled={isLoading || isOverLimit}
                  >
                    {isLoading && actionType === "save" ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </div>
                    )}
                  </motion.button>

                  {/* Schedule Button */}
                  <motion.button
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAction("schedule")}
                    disabled={isLoading || isOverLimit}
                  >
                    {isLoading && actionType === "schedule" ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Scheduling...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Schedule</span>
                      </div>
                    )}
                  </motion.button>

                  {/* Post Now Button */}
                  <motion.button
                    className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAction("post")}
                    disabled={isLoading || isOverLimit}
                  >
                    {isLoading && actionType === "post" ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Posting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        <span>Post Now</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
