"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Calendar, Clock, X, CheckCircle, AlertCircle } from "lucide-react"

interface ScheduleTweetModalProps {
  isOpen: boolean
  onClose: () => void
  tweet: {
    id: number
    content: string
  }
  onSchedule: (date: Date) => void
}

export default function ScheduleTweetModal({ isOpen, onClose, tweet, onSchedule }: ScheduleTweetModalProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setSelectedDate(tomorrow.toISOString().split("T")[0])
      setSelectedTime("09:00")
      setError("")
    }
  }, [isOpen])

  const validateDateTime = () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time")
      return false
    }

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`)
    const now = new Date()

    if (scheduledDateTime <= now) {
      setError("Scheduled time must be in the future")
      return false
    }

    setError("")
    return true
  }

  const handleSchedule = async () => {
    if (!validateDateTime()) return

    setIsLoading(true)
    try {
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`)

      // Simulate API call to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onSchedule(scheduledDateTime)
      onClose()
    } catch (error) {
      setError("Failed to schedule tweet. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatScheduledTime = () => {
    if (!selectedDate || !selectedTime) return ""
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`)
    return scheduledDateTime.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
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
                <h2 className="text-xl font-bold text-gray-900">Schedule Tweet</h2>
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
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Tweet Preview */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Tweet Preview</h3>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                    <p className="text-gray-900 leading-relaxed">{tweet.content}</p>
                  </div>
                </div>

                {/* Date and Time Pickers */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Date Picker */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>

                  {/* Time Picker */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Scheduled Time Preview */}
                {selectedDate && selectedTime && !error && (
                  <motion.div
                    className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200/70"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 text-blue-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Scheduled for:</span>
                    </div>
                    <p className="text-blue-900 font-semibold mt-1">{formatScheduledTime()}</p>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200/70"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">{error}</span>
                    </div>
                  </motion.div>
                )}

                {/* Schedule Button */}
                <motion.button
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSchedule}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Scheduling...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Schedule Tweet</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
