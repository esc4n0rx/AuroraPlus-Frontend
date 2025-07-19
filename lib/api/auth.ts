import { apiClient } from './client';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export class AuthAPI {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data.success && response.data.data) {
      apiClient.setToken(response.data.data.token);
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro no login');
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    if (response.data.success && response.data.data) {
      apiClient.setToken(response.data.data.token);
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro no registro');
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aurora-token');
    }
  }

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('aurora-token');
  }
}

export const authAPI = new AuthAPI();