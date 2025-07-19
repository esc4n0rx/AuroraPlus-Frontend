import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor para adicionar token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('aurora-token');
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('aurora-token');
  }

  public setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('aurora-token', token);
  }

  public get<T = any>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.get(url, { params });
  }

  public post<T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.post(url, data);
  }

  public put<T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.put(url, data);
  }

  public delete<T = any>(url: string): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.delete(url);
  }
}

export const apiClient = new ApiClient();