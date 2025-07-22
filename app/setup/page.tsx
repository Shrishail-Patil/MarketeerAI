"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowRight, Sparkles, Wand2, X, Plus, Twitter, Save } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import LogoBtn from "@/components/LogoBtn"

export default function SetupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    targetAudience: "",
    keyFeatures: [] as string[],
    tonePreference: "",
    customTone: "",
    xId: "",
  })

  const [currentFeature, setCurrentFeature] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveMessage, setSaveMessage] = useState("")

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/onboarding")
      return
    }
  }, [session, status, router])

  // Load existing data on component mount
  useEffect(() => {
    if (session) {
      loadExistingData()
    }
  }, [session])

  const loadExistingData = async () => {
    try {
      const response = await fetch('/api/save-setup', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.data) {
          setFormData({
            productName: result.data.product_name || "",
            description: result.data.description || "",
            targetAudience: result.data.target_audience || "",
            keyFeatures: result.data.key_features || [],
            tonePreference: result.data.tone_preference || "",
            customTone: result.data.custom_tone || "",
            xId: result.data.x_id || "",
          })
        }
      }
    } catch (error) {
      console.error("Error loading existing data:", error)
    }
  }

  const toneOptions = [
    { value: "technical", label: "Technical", description: "Professional and detailed" },
    { value: "friendly", label: "Friendly", description: "Warm and approachable" },
    { value: "witty", label: "Witty", description: "Clever and humorous" },
    { value: "formal", label: "Formal", description: "Professional and serious" },
    { value: "custom", label: "Custom", description: "Define your own tone" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addFeature = () => {
    if (currentFeature.trim() && !formData.keyFeatures.includes(currentFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, currentFeature.trim()],
      }))
      setCurrentFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((f) => f !== feature),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addFeature()
    }
  }

  const enhanceWithAI = async () => {
    setIsEnhancing(true)
    try {
      // Simulate AI enhancement
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Enhanced example data
      const enhanced = {
        description: formData.description
          ? `${formData.description} Our platform leverages cutting-edge technology to streamline workflows and boost productivity for modern teams.`
          : "A revolutionary SaaS platform that transforms how teams collaborate and manage their projects with intelligent automation and seamless integrations.",
        keyFeatures: [
          ...formData.keyFeatures,
          "Real-time collaboration",
          "Advanced analytics",
          "API integrations",
          "Mobile-first design",
        ].slice(0, 6), // Limit to 6 features
      }

      setFormData((prev) => ({
        ...prev,
        description: enhanced.description,
        keyFeatures: enhanced.keyFeatures,
      }))
    } catch (error) {
      console.error("Enhancement error:", error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = "Target audience is required"
    }
    if (!formData.tonePreference) {
      newErrors.tonePreference = "Please select a tone preference"
    }
    if (formData.tonePreference === "custom" && !formData.customTone.trim()) {
      newErrors.customTone = "Please describe your custom tone"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!session) {
      setSaveMessage("Please sign in to continue")
      return
    }

    setIsLoading(true)
    setSaveMessage("")

    try {
      const response = await fetch('/api/save-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: formData.productName,
          description: formData.description,
          targetAudience: formData.targetAudience,
          keyFeatures: formData.keyFeatures,
          tonePreference: formData.tonePreference,
          customTone: formData.customTone,
          xId: formData.xId,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSaveMessage("Setup saved successfully!")
        // Redirect to next step after a short delay
        setTimeout(() => {
          router.push("/voice-analysis")
        }, 1500)
      } else {
        setSaveMessage(result.error || "Failed to save setup")
      }
    } catch (error) {
      console.error("Save error:", error)
      setSaveMessage("An error occurred while saving")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading if session is still being fetched
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-lg text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  // Show sign in prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to sign in to access the setup page.</p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
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
          className="px-4 sm:px-6 lg:px-8 py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <LogoBtn />
            <motion.div
              className="text-sm text-gray-700 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm rounded-full border border-blue-200/60 shadow-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)" }}
              transition={{ duration: 0.2 }}
            >
              Step 2 of 4 ✨
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={containerVariants} initial="hidden" animate="visible">
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-block mb-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-800">Personalize Your Experience</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Tell Us About
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
                Your SaaS
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Help our AI understand your product so we can generate tweets that perfectly represent your brand and
              resonate with your audience.
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-8">
              {/* Product Name */}
              <motion.div variants={itemVariants} className="relative">
                <input
                  type="text"
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange("productName", e.target.value)}
                  className={`w-full px-6 py-4 rounded-2xl border-2 ${
                    errors.productName ? "border-red-300" : "border-gray-200"
                  } focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-lg text-gray-900 transition-all bg-white/90 backdrop-blur-sm peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="productName"
                  className="absolute left-6 top-4 text-gray-500 text-lg transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:-top-2 peer-focus:left-4 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2"
                >
                  Product Name *
                </label>
                {errors.productName && <p className="text-red-500 text-sm mt-2">{errors.productName}</p>}
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants} className="relative">
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className={`w-full px-6 py-4 rounded-2xl border-2 ${
                    errors.description ? "border-red-300" : "border-gray-200"
                  } focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-lg text-gray-900 transition-all bg-white/90 backdrop-blur-sm peer resize-none`}
                  placeholder=" "
                />
                <label
                  htmlFor="description"
                  className="absolute left-6 top-4 text-gray-500 text-lg transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:-top-2 peer-focus:left-4 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2"
                >
                  Short Description *
                </label>
                {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}

                {/* Enhance with AI Button */}
                <motion.button
                  type="button"
                  onClick={enhanceWithAI}
                  disabled={isEnhancing}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-sm disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isEnhancing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Enhance with AI</span>
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Target Audience */}
              <motion.div variants={itemVariants} className="relative">
                <input
                  type="text"
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                  className={`w-full px-6 py-4 rounded-2xl border-2 ${
                    errors.targetAudience ? "border-red-300" : "border-gray-200"
                  } focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-lg text-gray-900 transition-all bg-white/90 backdrop-blur-sm peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="targetAudience"
                  className="absolute left-6 top-4 text-gray-500 text-lg transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:-top-2 peer-focus:left-4 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2"
                >
                  Target Audience *
                </label>
                {errors.targetAudience && <p className="text-red-500 text-sm mt-2">{errors.targetAudience}</p>}
                <p className="text-gray-500 text-sm mt-2">
                  e.g., &quot;SaaS founders&quot;, &quot;Small business owners&quot;, &quot;Marketing teams&quot;
                </p>
              </motion.div>

              {/* Key Features */}
              <motion.div variants={itemVariants} className="relative">
                <div className="space-y-3">
                  <label className="block text-lg font-medium text-gray-700">Key Features</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentFeature}
                      onChange={(e) => setCurrentFeature(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-lg text-gray-900 transition-all bg-white/90 backdrop-blur-sm"
                      placeholder="Add a key feature..."
                    />
                    <motion.button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Feature Pills */}
                  {formData.keyFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.keyFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 rounded-full shadow-sm"
                        >
                          <span className="text-sm font-medium text-gray-800">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-500 text-sm">
                    Add key features that make your product unique. Press Enter or click + to add.
                  </p>
                </div>
              </motion.div>

              {/* Tone Preference */}
              <motion.div variants={itemVariants} className="space-y-3">
                <label className="block text-lg font-medium text-gray-700">
                  Tone Preference <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {toneOptions.map((option) => (
                    <motion.label
                      key={option.value}
                      className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.tonePreference === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="tonePreference"
                        value={option.value}
                        checked={formData.tonePreference === option.value}
                        onChange={(e) => handleInputChange("tonePreference", e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                      {formData.tonePreference === option.value && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </motion.label>
                  ))}
                </div>
                {errors.tonePreference && <p className="text-red-500 text-sm">{errors.tonePreference}</p>}

                {/* Custom Tone Input */}
                {formData.tonePreference === "custom" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="relative mt-4"
                  >
                    <textarea
                      id="customTone"
                      value={formData.customTone}
                      onChange={(e) => handleInputChange("customTone", e.target.value)}
                      rows={3}
                      className={`w-full px-6 py-4 rounded-2xl border-2 ${
                        errors.customTone ? "border-red-300" : "border-gray-200"
                      } focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-lg text-gray-900 transition-all bg-white/90 backdrop-blur-sm peer resize-none`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="customTone"
                      className="absolute left-6 top-4 text-gray-500 text-lg transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:-top-2 peer-focus:left-4 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2"
                    >
                      Describe your custom tone
                    </label>
                    {errors.customTone && <p className="text-red-500 text-sm mt-2">{errors.customTone}</p>}
                  </motion.div>
                )}
              </motion.div>

              {/* X ID (Optional) */}
              <motion.div variants={itemVariants} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <Twitter className="w-5 h-5 text-gray-600" />
                  <label className="text-lg font-medium text-gray-700">X (Twitter) Username</label>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                </div>
                <input
                  type="text"
                  id="xId"
                  value={formData.xId}
                  onChange={(e) => handleInputChange("xId", e.target.value.replace("@", ""))}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-lg text-gray-900 transition-all bg-white/90 backdrop-blur-sm"
                  placeholder="your_username"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Help us find your public tweets to better understand your voice (without @)
                </p>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-8">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg group disabled:opacity-50"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" />
                      <span>Save & Continue</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.form>
        </div>

        {/* Footer */}
        <motion.footer
          className="px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white backdrop-blur-sm mt-16"
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
                <span className="font-medium">Your data is secure and encrypted</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200/50 text-center text-sm text-gray-500">
              © 2025 Marketeer. All rights reserved.
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}