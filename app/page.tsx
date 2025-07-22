"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  ArrowRight,
  Sparkles,
  Twitter,
  Calendar,
  BarChart3,
  MessageSquare,
  Users,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  Play,
  Shield,
  Wand2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import LogoBtn from "@/components/LogoBtn"

export default function ProductPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const router = useRouter()
  const { data: session } = useSession()
  useEffect(() => {
  if(session) {
    router.push("/dashboard")
  }
  }, [router, session])

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

  const features = [
    {
      icon: Twitter,
      title: "Voice Analysis & Learning",
      description:
        "Our AI analyzes your existing X posts to understand your unique tone, vocabulary, and engagement style",
      details:
        "Connect your X account and let our advanced AI study your writing patterns, preferred topics, and engagement strategies to create a personalized voice profile.",
      benefits: [
        "Maintains your authentic voice",
        "Learns from your best-performing tweets",
        "Adapts to your evolving style",
      ],
    },
    {
      icon: Sparkles,
      title: "Daily Tweet Generation",
      description: "Get fresh, personalized marketing tweets generated daily based on your SaaS product and audience",
      details:
        "Receive a curated selection of tweets every day, each crafted to promote your SaaS while sounding exactly like you wrote them.",
      benefits: ["Consistent daily content", "Product-focused messaging", "Multiple tweet options to choose from"],
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Post immediately or schedule tweets for optimal engagement times when your audience is most active",
      details:
        "Our platform analyzes your audience's activity patterns and suggests the best times to post for maximum reach and engagement.",
      benefits: ["Optimal timing recommendations", "Automated posting", "Timezone-aware scheduling"],
    },
    // {
    //   icon: BarChart3,
    //   title: "Performance Analytics",
    //   description: "Track engagement, reach, and growth metrics to understand what resonates with your audience",
    //   details:
    //     "Get detailed insights into your tweet performance, audience growth, and engagement patterns to refine your marketing strategy.",
    //   benefits: ["Detailed engagement metrics", "Audience growth tracking", "Content performance insights"],
    // },
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Save Hours Weekly",
      description: "Stop spending hours brainstorming tweets. Get ready-to-post content in minutes.",
      stat: "10+ hours saved per week",
    },
    {
      icon: Target,
      title: "Consistent Marketing",
      description: "Never miss a day of marketing. Build momentum with daily, authentic content.",
      stat: "365 days of content",
    },
    {
      icon: TrendingUp,
      title: "Authentic Growth",
      description: "Grow your audience with content that sounds genuinely like you, not generic AI.",
      stat: "3x better engagement",
    },
    {
      icon: Users,
      title: "Perfect for Solo Devs",
      description: "Built specifically for indie hackers and small SaaS teams who wear many hats.",
      stat: "500+ developers using",
    },
  ]

   const steps = [
    { step: "01", title: "Connect X Account", desc: "Sign in with Twitter OAuth" },
    { step: "02", title: "Describe Your SaaS", desc: "Tell us about your product & audience" },
    { step: "03", title: "AI Learns Your Voice", desc: "We analyze your existing tweets" },
    { step: "04", title: "Get Daily Tweets", desc: "Review, edit, and post or schedule" },
  ]

  const testimonials = [
    {
      name: "Alex Chen",
      title: "Founder of DevTools Pro",
      quote:
        "Marketeer transformed my Twitter presence. The AI perfectly captures my voice, and I've grown my audience by 300% in just 2 months.",
      avatar: "AC",
      metrics: "300% growth",
    },
    {
      name: "Sarah Rodriguez",
      title: "Solo Developer",
      quote:
        "As a solo dev, I barely had time to code, let alone tweet. Marketeer handles my marketing while I focus on building.",
      avatar: "SR",
      metrics: "10 hours saved/week",
    },
    {
      name: "Mike Johnson",
      title: "SaaS Founder",
      quote:
        "The tweets sound exactly like me. My audience can't tell the difference, and my engagement has never been higher.",
      avatar: "MJ",
      metrics: "5x engagement",
    },
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
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
          className="px-4 sm:px-6 py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Marketeer
              </span>
            </div> */}
            <LogoBtn/>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How it Works
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Testimonials
              </a>
              <motion.button
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(session ? "/dashboard" : "/onboarding")}
              >
                {session ? "Continue to Dashboard" : "Get Started"}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section className="px-4 sm:px-6 py-16" variants={containerVariants} initial="hidden" animate="visible">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                {/* Badge */}
                <motion.div variants={itemVariants} className="inline-block mb-6">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 rounded-full shadow-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-800">AI-Powered Tweet Assistant</span>
                  </div>
                </motion.div>

                {/* Main Headline */}
                <motion.h1 variants={itemVariants} className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-center lg:text-left">
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Marketing Your SaaS
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
                    Just Got Easier
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 leading-relaxed text-center lg:text-left">
                  Marketeer learns your unique voice from your existing tweets and generates daily, authentic marketing
                  content for your SaaS.
                  <span className="font-semibold text-gray-900"> Focus on building, we&apos;ll handle the marketing.</span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 flex-wrap mb-8">
                  <motion.button
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(session ? "/dashboard" : "/onboarding")}
                  >
                    <div className="flex items-center gap-2">
                      <span>{session ? "Continue to Dashboard" : "Start Free Trial"}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                  {/* <motion.button
                    className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-2xl hover:shadow-md transition-all duration-300 text-lg group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      <span>Watch Demo</span>
                    </div>
                  </motion.button> */}
                </motion.div>

                {/* Social Proof */}
                {/* <motion.div variants={itemVariants} className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"
                      ></div>
                    ))}
                  </div>
                  <span>Trusted by 500+ SaaS developers</span>
                </motion.div> */}
              </div>

              {/* Hero Visual */}
              <motion.div variants={itemVariants} className="relative">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/60 shadow-2xl p-8">
                  <div className="space-y-6">
                    {/* Mock Tweet Interface */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Twitter className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Daily Tweet Generator</div>
                        <div className="text-sm text-gray-500">AI-powered content creation</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/60">
                        <div className="text-sm text-gray-600 mb-2">Generated Tweet #1</div>
                        <div className="text-gray-900">
                          &quot;Just shipped a new feature that saves our users 2 hours per week! 🚀 Sometimes the smallest
                          improvements make the biggest impact. What&apos;s the last feature you built that surprised you
                          with its impact? #SaaS #ProductDev&quot;
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/60">
                        <div className="text-sm text-gray-600 mb-2">Generated Tweet #2</div>
                        <div className="text-gray-900">
                          &quot;Hot take: The best SaaS features are the ones users don&apos;t even notice. They just make
                          everything feel... easier. That&apos;s the magic we&apos;re chasing with every update ✨&quot;
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Post Now
                      </motion.button>
                      <motion.button
                        className="flex-1 px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Schedule
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          className="px-4 sm:px-6 py-16 bg-gradient-to-b from-gray-50/50 to-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Why SaaS Developers <span className="text-blue-600">Love Marketeer</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built specifically for indie hackers and small SaaS teams who need consistent marketing without the time
                investment
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{benefit.stat}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="px-4 sm:px-6 py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Powerful Features for <span className="text-blue-600">Authentic Growth</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to maintain a consistent, authentic presence on X while focusing on building your
                SaaS
              </p>
            </motion.div>

            <div className="grid gap-12 lg:grid-cols-2 items-start">
              {/* Feature List */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      activeFeature === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white/80"
                    }`}
                    onClick={() => setActiveFeature(index)}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          activeFeature === index ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Feature Details */}
              <motion.div
                className="lg:sticky lg:top-8"
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                    {features[activeFeature] && (() => {
                      const Icon = features[activeFeature].icon;
                      return <Icon className="w-8 h-8 text-white" />;
                    })()}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{features[activeFeature]?.title}</h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">{features[activeFeature]?.details}</p>

                  <div className="space-y-3">
                    {features[activeFeature]?.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>


        {/* How It Works */}
        <motion.section
          className="px-4 sm:px-6 py-16 bg-gradient-to-b from-gray-50/50 to-white backdrop-blur-sm"
          id="how-it-works"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600">Get started in minutes, not hours</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg hover:shadow-xl transition-shadow">
                      {step.step}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 -translate-y-1/2" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          id="testimonials"
          className="px-4 sm:px-6 py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Loved by <span className="text-blue-600">SaaS Developers</span>
              </h2>
              <p className="text-xl text-gray-600">
                See how Marketeer is helping developers grow their audience and products
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{testimonial.metrics}</div>
                    <p className="text-gray-700 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.title}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="px-4 sm:px-6 py-16 bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.h2
              className="text-3xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Transform Your SaaS Marketing?
            </motion.h2>
            <motion.p
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join hundreds of SaaS developers who&apos;ve automated their Twitter marketing with Marketeer
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 flex-wrap justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg group"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(session ? "/dashboard" : "/onboarding")}
              >
                <div className="flex items-center gap-2">
                  <span>{session ? "Continue to Dashboard" : "Start Free Trial"}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
              {/* <motion.button
                className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule Demo
              </motion.button> */}
            </motion.div>

            <motion.p
              className="text-sm mt-6 opacity-75"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.75 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {/* No credit card required • 14-day free trial • Cancel anytime */}
              Pricing model coming soon! • Sign up to be notified.
            </motion.p>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="px-4 sm:px-6 py-12 bg-gray-900 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">Marketeer</span>
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                  AI-powered tweet assistant for SaaS developers. Grow your audience authentically while focusing on
                  building your product.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>Enterprise-grade security & privacy</span>
                </div>
              </div>

              {/* <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      API
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Integrations
                    </a>
                  </li>
                </ul>
              </div> */}

              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2025 Marketeer. All rights reserved.</p>
              <p className="text-gray-400 text-sm mt-4 md:mt-0">Built with ❤️ for SaaS developers</p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}