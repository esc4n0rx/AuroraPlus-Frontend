"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  const { user } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.currentProfile) {
        router.push("/home")
      } else {
        router.push("/profiles")
      }
    }
  }, [user, router])

  if (user) {
    return null // Redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
