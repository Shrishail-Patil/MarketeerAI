"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase/client";
import {
  Sparkles,
  Twitter,
  MessageSquare,
  Settings,
  LogOut,
  Unlink,
  ChevronRight,
  Edit,
  Save,
  X,
  AlertTriangle,
  Bell,
  User,
  ChevronDown,
  Search,
} from "lucide-react"
import { useRouter } from "next/navigation";
import Footer from "../dashboard/components/Footer";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<{ username: string; image: string }>({ username: "", image: "" });
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { data: session } = useSession();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    xHandle: "",
    productName: "",
    productDescription: "",
    targetAudience: "",
    tonePreference: "",
  });

  const [editData, setEditData] = useState(userData);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.name) return;

      // Fetch from xusers
      const { data: xuser, error: xuserError } = await supabase
        .from("xusers")
        .select("uid,username, image")
        .eq("username", session.user.name)
        .single();

      const uid = xuser?.uid;
      setProfile({
          username: xuser.username,
          image: xuser.image,
        });

      // Fetch from user_data
      const { data: userDataRow, error: userDataError } = await supabase
        .from("user_data")
        .select("product_name, description, target_audience, tone_preference, x_id")
        .eq("user_id", uid)
        .single();

      if (xuserError || userDataError) {
        console.error("Error loading user data:", xuserError || userDataError);
        return;
      }

      const userProfile = {
        name: xuser.username,
        email: session.user.email || "",
        xHandle: userDataRow?.x_id ? `@${userDataRow.x_id}` : "",
        productName: userDataRow.product_name,
        productDescription: userDataRow.description,
        targetAudience: userDataRow.target_audience,
        tonePreference: userDataRow.tone_preference,
      };

      setUserData(userProfile);
      setEditData(userProfile);
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openProfileMenu &&
        !(event.target as Element).closest(".profile-menu")
      ) {
        setOpenProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfileMenu]);

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setUserData(editData)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditData(userData)
    setIsEditing(false)
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // Simulate logout
      await new Promise((resolve) => setTimeout(resolve, 1000))
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      // Simulate disconnect
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setShowDisconnectDialog(false)
      // Redirect to onboarding
      window.location.href = "/onboarding"
    } catch (error) {
      console.error("Disconnect failed:", error)
    } finally {
      setIsLoading(false)
    }
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
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
        {/* Header - Updated to match Dashboard */}
        <motion.header
          className="px-6 py-6 sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/70"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto">
            <div className="flex justify-between items-center">
              {/* Logo and Greeting */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Marketeer
                  </span>
                  <h1 className="text-sm text-gray-600">
                    Profile & Settings
                  </h1>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-4">
                {/* Search Toggle */}
                <motion.button
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="w-5 h-5" />
                </motion.button>

                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Profile Menu */}
                <div className="relative profile-menu">
                  <motion.button
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenProfileMenu(!openProfileMenu)}
                  >
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt="User avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {profile.username?.charAt(0) || "U"}
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {openProfileMenu && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200/70 overflow-hidden z-30"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-3 border-b border-gray-200/70">
                          <div className="flex items-center gap-3">
                            {profile.image ? (
                              <img
                                src={profile.image}
                                alt="User avatar"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                                {profile.username?.charAt(0) || "U"}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">
                                {profile.username || "Loading..."}
                              </div>
                              <div className="text-sm text-gray-600">
                                {session?.user?.email}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <button
                            className="flex items-center gap-2 w-full p-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => router.push("/dashboard")}
                          >
                            <User className="w-4 h-4" />
                            <span>Dashboard</span>
                          </button>
                          <button className="flex items-center gap-2 w-full p-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                          <button 
                            className="flex items-center gap-2 w-full p-2 text-left text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => setShowLogoutDialog(true)}
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Edit Controls - Only show when not in edit mode */}
                {!isEditing && (
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Search Bar (Expandable) */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search settings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    />
                    {searchQuery && (
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Controls Bar - Show when in edit mode */}
            {isEditing && (
              <motion.div
                className="mt-4 flex justify-end gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </motion.button>
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {/* Profile Section */}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/70 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt="User avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {profile.username?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                  <p className="text-gray-600">{userData.email}</p>
                </div>
              </div>

              {/* X Account */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-semibold text-gray-900">X Account</div>
                    <div className="text-sm text-gray-600">{userData.xHandle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </div>
              </div>
            </motion.div>

            {/* Product Information */}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/70 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Product Information
              </h3>

              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.productName}
                      onChange={(e) => setEditData({ ...editData, productName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-gray-900 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{userData.productName}</div>
                  )}
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  {isEditing ? (
                    <textarea
                      value={editData.productDescription}
                      onChange={(e) => setEditData({ ...editData, productDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border text-gray-900 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all resize-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{userData.productDescription}</div>
                  )}
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.targetAudience}
                      onChange={(e) => setEditData({ ...editData, targetAudience: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-gray-900 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{userData.targetAudience}</div>
                  )}
                </div>

                {/* Tone Preference */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tone Preference</label>
                  {isEditing ? (
                    <select
                      value={editData.tonePreference}
                      onChange={(e) => setEditData({ ...editData, tonePreference: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    >
                      <option value="Technical and friendly">Technical and friendly</option>
                      <option value="Casual and witty">Casual and witty</option>
                      <option value="Professional and formal">Professional and formal</option>
                      <option value="Enthusiastic and energetic">Enthusiastic and energetic</option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{userData.tonePreference}</div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Actions Section */}
            {!isEditing && (
              <motion.div
                variants={itemVariants}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/70 shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Account Actions
                </h3>

                <div className="space-y-3">
                  {/* Disconnect X Account */}
                  <motion.button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-orange-50 rounded-xl transition-colors group"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowDisconnectDialog(true)}
                  >
                    <div className="flex items-center gap-3">
                      <Unlink className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Disconnect X Account</div>
                        <div className="text-sm text-gray-600">Remove access to your X account</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                  </motion.button>

                  {/* Logout */}
                  <motion.button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-red-50 rounded-xl transition-colors group"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 text-red-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Sign Out</div>
                        <div className="text-sm text-gray-600">Sign out of your account</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Logout Confirmation Dialog */}
        <AnimatePresence>
          {showLogoutDialog && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLogoutDialog(false)}
              />
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <LogOut className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Sign Out</h3>
                      <p className="text-sm text-gray-600">Are you sure you want to sign out?</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-colors"
                      onClick={() => setShowLogoutDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      ) : (
                        "Sign Out"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Disconnect Confirmation Dialog */}
        <AnimatePresence>
          {showDisconnectDialog && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDisconnectDialog(false)}
              />
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Disconnect X Account</h3>
                      <p className="text-sm text-gray-600">
                        This will remove access to your X account and stop tweet generation.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-colors"
                      onClick={() => setShowDisconnectDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                      onClick={handleDisconnect}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      ) : (
                        "Disconnect"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          className="px-6 py-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
        <Footer />
        </motion.footer>
      </div>
    </div>
  )
}
