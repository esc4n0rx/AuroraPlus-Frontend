"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { authAPI } from "@/lib/api/auth"

export default function HomePage() {
  const { user, apiToken, setUser, setApiToken } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user has stored token but no user data
      const storedToken = authAPI.getStoredToken()
      
      if (storedToken && !user) {
        // Token exists but no user data - set token and redirect to profiles
        console.log('Token encontrado, redirecionando para perfis...')
        setApiToken(storedToken)
        router.push("/profiles")
      } else if (user && apiToken) {
        // User exists - check if has current profile
        if (user.currentProfile) {
          console.log('Usuário com perfil selecionado, redirecionando para home...')
          router.push("/home")
        } else {
          console.log('Usuário sem perfil selecionado, redirecionando para perfis...')
          router.push("/profiles")
        }
      } else {
        // No token and no user - redirect to auth
        console.log('Sem autenticação, redirecionando para login...')
        router.push("/auth")
      }
    }

    checkAuth()
  }, [user, apiToken, router, setApiToken])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Aurora
        </h1>
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}