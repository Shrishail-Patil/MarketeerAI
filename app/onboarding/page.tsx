"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowRight, Sparkles, Twitter, Shield, CheckCircle, Eye, Clock } from "lucide-react"
import { signIn, useSession } from "next-auth/react";
import LogoBtn from "@/components/LogoBtn";

export default function OnboardingPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleTwitterLogin = () => {
    setIsLoading(true);
    signIn("twitter", { callbackUrl: window.location.href })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const isAuthenticated = Boolean(session?.user); 


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

  const benefits = [
    {
      icon: Eye,
      title: "We only read your public tweets",
      description: "No access to DMs, followers, or private information",
    },
    {
      icon: Sparkles,
      title: "AI learns your unique voice",
      description: "Analyzes your writing style to generate authentic content",
    },
    {
      icon: Clock,
      title: "Setup takes less than 2 minutes",
      description: "Connect, configure, and start generating tweets instantly",
    },
  ]

  const steps = [
    "Connect your X account",
    "Tell us about your SaaS",
    "AI analyzes your voice",
    "Start generating tweets",
  ]

  if (isAuthenticated) {
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
          className="relative z-10 text-center max-w-md mx-auto px-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Marketeer! 🎉</h1>

          <p className="text-lg text-gray-600 mb-8">
            Your X account has been connected successfully. Let&apos;s set up your AI marketing assistant.
          </p>

          <div className="px-4 sm:px-6">
            <motion.button
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg group"
              whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (window.location.href = "/setup")}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Continue Setup</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
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
          className="px-4 py-4 sm:px-6 sm:py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
            <LogoBtn />
            <motion.div
              className="text-sm text-gray-700 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm rounded-full border border-blue-200/60 shadow-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)" }}
              transition={{ duration: 0.2 }}
            >
              Step 1 of 4 ✨
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-6">
          <div className="px-4 sm:px-6 w-full">
            <motion.div
              className="max-w-2xl mx-auto text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="inline-block mb-6">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-800">Get Started in Minutes</span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Connect Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
                  X Account
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p variants={itemVariants} className="text-base sm:text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
                Let our AI learn your unique voice and writing style to generate authentic tweets that sound just like
                you.
              </motion.p>

              {/* Continue with X Button */}
              <motion.div variants={itemVariants} className="mb-12">
                <motion.button
                  onClick={handleTwitterLogin}
                  disabled={isLoading}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg group disabled:opacity-50 min-w-full sm:min-w-[280px]"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Twitter className="w-6 h-6" />
                      <span>Continue with X</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Security Note */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-12"
              >
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure OAuth connection • We never store your password</span>
              </motion.div>

              {/* Benefits */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                    whileHover={{ y: -5, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-sm">
                      <benefit.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Process Steps */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-gray-50/50 to-blue-50/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/60"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          className="px-4 sm:px-6 py-8 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Marketeer</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="font-medium">Trusted by 200+ SaaS founders</span>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Enterprise-grade security</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200/50 text-center text-sm text-gray-500">
              © 2025 Marketeer. All rights reserved. •{" "}
              <a href="#" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </a>{" "}
              •{" "}
              <a href="#" className="hover:text-gray-700 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
