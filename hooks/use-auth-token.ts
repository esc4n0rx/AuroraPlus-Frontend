import { useAppStore } from "@/lib/store"

export function useAuthToken() {
  const { apiToken } = useAppStore()
  
  const getToken = () => {
    // Tenta pegar do localStorage primeiro
    const token = localStorage.getItem('aurora-token')
    if (token) return token
    
    // Se não tiver no localStorage, tenta pegar do store
    return apiToken || ''
  }
  
  const setToken = (token: string) => {
    localStorage.setItem('aurora-token', token)
  }
  
  const clearToken = () => {
    localStorage.removeItem('aurora-token')
  }
  
  return {
    getToken,
    setToken,
    clearToken,
    hasToken: !!getToken()
  }
} 