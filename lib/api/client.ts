import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    console.log('=== API CLIENT INITIALIZATION ===');
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    console.log('Base URL:', baseURL);
    
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor para adicionar token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        console.log('=== REQUEST INTERCEPTOR ===');
        console.log('URL:', config.url);
        console.log('Method:', config.method);
        console.log('Token available:', !!token);
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Token adicionado ao header');
        } else {
          console.log('❌ Token não disponível');
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log('=== RESPONSE INTERCEPTOR ===');
        console.log('Status:', response.status);
        console.log('URL:', response.config.url);
        console.log('Response data:', response.data);
        return response;
      },
      (error: AxiosError<ApiResponse>) => {
        console.error('=== RESPONSE ERROR INTERCEPTOR ===');
        console.error('Error status:', error.response?.status);
        console.error('Error URL:', error.config?.url);
        console.error('Error message:', error.message);
        console.error('Error response data:', error.response?.data);
        
        if (error.response?.status === 401) {
          console.log('🔄 401 Unauthorized - limpando token e redirecionando');
          this.clearToken();
          window.location.href = '/auth';
        }
        
        // Melhor tratamento de erros da API
        if (error.response?.data) {
          const apiError = new Error(error.response.data.message || 'Erro na API');
          console.error('API Error:', apiError.message);
          return Promise.reject(apiError);
        }
        
        const connectionError = new Error(error.message || 'Erro de conexão');
        console.error('Connection Error:', connectionError.message);
        return Promise.reject(connectionError);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('aurora-token');
    console.log('Getting token from localStorage:', !!token);
    return token;
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    console.log('Clearing token from localStorage');
    localStorage.removeItem('aurora-token');
  }

  public setToken(token: string): void {
    if (typeof window === 'undefined') return;
    console.log('Setting token in localStorage');
    localStorage.setItem('aurora-token', token);
  }

  public get<T = any>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    console.log('=== GET REQUEST ===');
    console.log('URL:', url);
    console.log('Params:', params);
    return this.client.get(url, { params });
  }

  public post<T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    console.log('=== POST REQUEST ===');
    console.log('URL:', url);
    console.log('Data:', data);
    return this.client.post(url, data);
  }

  public put<T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    console.log('=== PUT REQUEST ===');
    console.log('URL:', url);
    console.log('Data:', data);
    return this.client.put(url, data);
  }

  public delete<T = any>(url: string): Promise<AxiosResponse<ApiResponse<T>>> {
    console.log('=== DELETE REQUEST ===');
    console.log('URL:', url);
    return this.client.delete(url);
  }
}

export const apiClient = new ApiClient();