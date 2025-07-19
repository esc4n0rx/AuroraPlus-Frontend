"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { authAPI } from "@/lib/api/auth"

export default function HomePage() {
  const { user, apiToken, setUser, setApiToken } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    // Check if user has stored token but no user data
    const storedToken = authAPI.getStoredToken()
    
    if (storedToken && !user) {
      // Token exists but no user data - set token and redirect to profiles
      setApiToken(storedToken)
      router.push("/profiles")
    } else if (user) {
      // User exists - check if has current profile
      if (user.currentProfile) {
        router.push("/home")
      } else {
        router.push("/profiles")
      }
    } else {
      // No token and no user - redirect to auth
      router.push("/auth")
    }
  }, [user, apiToken, router, setApiToken])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Aurora
        </h1>
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    </div>
  )
}