"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
  Sparkles,
  Twitter,
  Brain,
  Wand2,
  MessageSquare,
  TrendingUp,
  Heart,
  Zap,
  Coffee,
  Lightbulb,
  Rocket,
  Target,
} from "lucide-react"

export default function VoiceAnalysisPage() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)

  const analysisSteps = [
    {
      title: "Fetching your tweets",
      description: "Gathering your latest posts from X",
      icon: Twitter,
      duration: 2000,
    },
    {
      title: "Analyzing writing style",
      description: "Understanding your unique voice and tone",
      icon: Brain,
      duration: 3000,
    },
    {
      title: "Learning vocabulary patterns",
      description: "Identifying your favorite words and phrases",
      icon: MessageSquare,
      duration: 2500,
    },
    {
      title: "Studying engagement patterns",
      description: "Analyzing what resonates with your audience",
      icon: TrendingUp,
      duration: 2000,
    },
    {
      title: "Creating your voice profile",
      description: "Building your personalized AI model",
      icon: Wand2,
      duration: 1500,
    },
  ]

  const funQuotes = [
    {
      text: "Fun fact: The average person checks Twitter 14 times per day. You're about to automate that! 🚀",
      author: "Twitter Statistics",
    },
    {
      text: '&quot;The best marketing doesn&apos;t feel like marketing.&quot; - Tom Fishburne',
      author: "Marketing Wisdom",
    },
    {
      text: "Did you know? Tweets with emojis get 25% more engagement! Our AI loves emojis too 😄",
      author: "Social Media Facts",
    },
    {
      text: '&quot;Content is fire, social media is gasoline.&quot; - Jay Baer',
      author: "Content Marketing",
    },
    {
      text: "Pro tip: The best time to tweet is when your audience is awake. Revolutionary, right? ☕",
      author: "Captain Obvious",
    },
    {
      text: '&quot;Your brand is what people say about you when you&apos;re not in the room.&quot; - Jeff Bezos',
      author: "Branding Guru",
    },
    {
      text: "Breaking: Local AI learns to tweet better than humans. Humans surprisingly okay with this! 🤖",
      author: "Tech News",
    },
    {
      text: '&quot;The aim of marketing is to know and understand the customer so well the product sells itself.&quot; - Peter Drucker',
      author: "Management Legend",
    },
  ]

  const interactiveElements = [
    { icon: Heart, label: "Loves", count: 42 },
    { icon: Zap, label: "Energy", count: 89 },
    { icon: Coffee, label: "Caffeine", count: 156 },
    { icon: Lightbulb, label: "Ideas", count: 73 },
    { icon: Rocket, label: "Growth", count: 234 },
    { icon: Target, label: "Focus", count: 91 },
  ]

  useEffect(() => {
    const totalDuration = analysisSteps.reduce((sum, step) => sum + step.duration, 0)
    let elapsed = 0

    const interval = setInterval(() => {
      elapsed += 50
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(newProgress)

      // Update current step
      let stepElapsed = 0
      for (let i = 0; i < analysisSteps.length; i++) {
        if (elapsed <= stepElapsed + analysisSteps[i].duration) {
          setCurrentStep(i)
          break
        }
        stepElapsed += analysisSteps[i].duration
      }

      if (newProgress >= 100) {
        setIsComplete(true)
        setShowConfetti(true)
        clearInterval(interval)

        // Redirect after celebration
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 3000)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % funQuotes.length)
    }, 4000)

    return () => clearInterval(quoteInterval)
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const createConfetti = () => {
        for (let i = 0; i < 100; i++) {
          const confetti = document.createElement("div")
          confetti.className = "confetti"
          confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${["#3B82F6", "#8B5CF6", "#EF4444", "#10B981", "#F59E0B", "#EC4899"][Math.floor(Math.random() * 6)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
          `
          document.body.appendChild(confetti)

          setTimeout(() => {
            if (confetti.parentNode) {
              confetti.parentNode.removeChild(confetti)
            }
          }, 5000)
        }
      }

      const style = document.createElement("style")
      style.textContent = `
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)

      createConfetti()

      return () => {
        if (style.parentNode) {
          style.parentNode.removeChild(style)
        }
      }
    }
  }, [showConfetti])

  const handleInteraction = (index: number) => {
    setInteractionCount((prev) => prev + 1)
    // Add some visual feedback
    const element = document.getElementById(`interactive-${index}`)
    if (element) {
      element.style.transform = "scale(1.2)"
      setTimeout(() => {
        element.style.transform = "scale(1)"
      }, 200)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-white overflow-hidden flex items-center justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-green-100/40 to-emerald-100/40 rounded-full blur-3xl"
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
        </div>

        <motion.div
          className="relative z-10 text-center max-w-2xl mx-auto px-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, ease: "linear" },
              scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            🎉 Voice Analysis Complete!
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your AI voice model is ready! We've analyzed your unique writing style and you're all set to generate
            authentic tweets.
          </motion.p>

          <motion.div
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Redirecting to your dashboard in a few seconds...
          </motion.div>
        </motion.div>
      </div>
    )
  }

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
          className="px-6 py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Marketeer
              </span>
            </div>
            <motion.div
              className="text-sm text-gray-700 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm rounded-full border border-blue-200/60 shadow-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)" }}
              transition={{ duration: 0.2 }}
            >
              Step 3 of 4 ✨
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div className="text-center mb-12" variants={containerVariants} initial="hidden" animate="visible">
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-block mb-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-800">AI Voice Analysis in Progress</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={itemVariants} className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                AI is Learning
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
                Your Voice
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Sit back and relax while our AI analyzes your tweets to understand your unique writing style and tone.
            </motion.p>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            className="max-w-2xl mx-auto mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Progress Bar */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Analysis Progress</span>
                <span className="text-lg font-bold text-blue-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-full"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Current Step */}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  {analysisSteps[currentStep] && (() => {
                    const Icon = analysisSteps[currentStep].icon
                    return <Icon className="w-6 h-6 text-white" />
                  })()}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {analysisSteps[currentStep]?.title || "Processing..."}
                  </h3>
                  <p className="text-gray-600">{analysisSteps[currentStep]?.description || "Please wait..."}</p>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="flex gap-2">
                {analysisSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      index <= currentStep ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Elements */}
          <motion.div
            className="max-w-3xl mx-auto mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h3 variants={itemVariants} className="text-2xl font-bold text-center text-gray-900 mb-8">
              While You Wait... 🎮
            </motion.h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {interactiveElements.map((element, index) => (
                <motion.button
                  key={index}
                  id={`interactive-${index}`}
                  variants={itemVariants}
                  className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                  onClick={() => handleInteraction(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <element.icon className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:text-purple-600 transition-colors" />
                  <div className="text-sm font-semibold text-gray-900">{element.label}</div>
                  <div className="text-xs text-gray-500">{element.count + interactionCount}</div>
                </motion.button>
              ))}
            </div>

            {interactionCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-gray-600 mb-4"
              >
                🎉 You've clicked {interactionCount} times! Keep going!
              </motion.div>
            )}
          </motion.div>

          {/* Fun Quotes */}
          <motion.div
            className="max-w-2xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/60 text-center"
              >
                <p className="text-lg text-gray-700 mb-3 italic">"{funQuotes[currentQuote]?.text}"</p>
                <p className="text-sm text-gray-500 font-medium">— {funQuotes[currentQuote]?.author}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          
        </div>

        {/* Footer */}
        <motion.footer
          className="px-6 py-8 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white backdrop-blur-sm mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Marketeer</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="font-medium">Analysis typically takes 2-3 minutes</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200/50 text-center text-sm text-gray-500">
              © 2024 Marketeer. All rights reserved.
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
