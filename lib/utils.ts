import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para corrigir URLs dos avatares (substituir porta 3001 por 3000)
export function fixAvatarUrl(url: string): string {
  if (!url) return url;
  
  if (url.includes('localhost:3001')) {
    return url.replace('localhost:3001', 'localhost:3000');
  }
  
  return url;
}

// Função para verificar se uma URL é válida
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Função para obter a URL base da API
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
}

// Função para obter a URL base dos assets
export function getAssetsBaseUrl(): string {
  const apiUrl = getApiBaseUrl();
  // Remove /api/v1 do final para obter a base dos assets
  return apiUrl.replace('/api/v1', '');
}
