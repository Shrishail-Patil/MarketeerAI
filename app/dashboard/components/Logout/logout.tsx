"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { LogOut, Loader2, CheckCircle2 } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface LogoutButtonProps {
  className?: string
  variant?: "icon" | "full" | "dropdown"
  onLogoutStart?: () => void
  onLogoutComplete?: () => void
  onLogoutError?: (error: Error) => void
  redirectTo?: string
}

export default function LogoutButton({ 
  className = "",
  variant = "full",
  onLogoutStart,
  onLogoutComplete,
  onLogoutError,
  redirectTo = "/onboarding"
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [logoutSuccess, setLogoutSuccess] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  // Main logout function using NextAuth
  const handleLogout = async () => {
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)
      onLogoutStart?.()

      // Show success state briefly before redirect
      setLogoutSuccess(true)
      
      // Wait a moment to show success animation
      await new Promise(resolve => setTimeout(resolve, 600))

      onLogoutComplete?.()
      
      // Use NextAuth signOut with proper redirect
      await signOut({ 
        callbackUrl: redirectTo,
        redirect: true 
      })

    } catch (error) {
      console.error('Logout error:', error)
      onLogoutError?.(error as Error)
      setIsLoggingOut(false)
      setLogoutSuccess(false)
    }
  }

  // Confirmation dialog handler
  const handleLogoutClick = () => {
    if (variant === "dropdown") {
      // For dropdown variant, show confirmation
      setShowConfirmation(true)
    } else {
      // For other variants, logout immediately
      handleLogout()
    }
  }

  // Don't render if user is not authenticated
  if (!session) {
    return null
  }

  // Render different variants
  const renderButton = () => {
    switch (variant) {
      case "icon":
        return (
          <motion.button
            className={`p-2 text-gray-600 hover:text-red-600 transition-colors rounded-full hover:bg-red-50 ${className}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            title={isLoggingOut ? "Signing out..." : "Sign out"}
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : logoutSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </motion.button>
        )

      case "dropdown":
        return (
          <button 
            className={`flex items-center gap-2 w-full p-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : logoutSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>
              {isLoggingOut ? "Signing out..." : logoutSuccess ? "Success!" : "Sign Out"}
            </span>
          </button>
        )

      default: // "full"
        return (
          <motion.button
            className={`flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            whileHover={{ scale: isLoggingOut ? 1 : 1.02 }}
            whileTap={{ scale: isLoggingOut ? 1 : 0.98 }}
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : logoutSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>
              {isLoggingOut ? "Signing out..." : logoutSuccess ? "Success!" : "Sign Out"}
            </span>
          </motion.button>
        )
    }
  }

  return (
    <>
      {renderButton()}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoggingOut && setShowConfirmation(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {isLoggingOut ? (
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                  ) : logoutSuccess ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <LogOut className="w-8 h-8 text-red-600" />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isLoggingOut ? "Signing out..." : logoutSuccess ? "Success!" : "Sign Out"}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {isLoggingOut 
                    ? "Please wait while we sign you out..."
                    : logoutSuccess 
                    ? "You have been signed out successfully."
                    : "Are you sure you want to sign out? This will end your current session."
                  }
                </p>
                
                {!isLoggingOut && !logoutSuccess && (
                  <div className="flex gap-3">
                    <button
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setShowConfirmation(false)}
                    >
                      Cancel
                    </button>
                    
                    <motion.button
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleLogout()
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}