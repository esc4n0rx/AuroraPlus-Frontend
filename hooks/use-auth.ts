import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/auth';
import { useAppStore } from '@/lib/store';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser, setApiToken } = useAppStore();

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authResponse = await authAPI.login(credentials);
      setUser({
        id: authResponse.user.id,
        email: authResponse.user.email,
        name: authResponse.user.nome,
        profiles: [],
        currentProfile: undefined
      });
      setApiToken(authResponse.token);
      router.push('/profiles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no login');
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser, setApiToken]);

  const register = useCallback(async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authResponse = await authAPI.register(userData);
      setUser({
        id: authResponse.user.id,
        email: authResponse.user.email,
        name: authResponse.user.nome,
        profiles: [],
        currentProfile: undefined
      });
      setApiToken(authResponse.token);
      router.push('/profiles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no registro');
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser, setApiToken]);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setApiToken(null);
    router.push('/auth');
  }, [router, setUser, setApiToken]);

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}