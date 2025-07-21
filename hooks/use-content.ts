import { useState, useCallback } from 'react';
import { contentAPI } from '@/lib/api/content';
import type { 
  ContentAPI, 
  ContentWithTMDB, 
  ContentSearchParams, 
  ContentSearchResponse,
  CategoryStats,
  ContentStats
} from '@/types/content';

export function useContent() {
  const [contents, setContents] = useState<ContentAPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchContents = useCallback(async (params: ContentSearchParams = {}) => {
    console.log('=== USE CONTENT - SEARCH CONTENTS ===');
    console.log('Search params:', params);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await contentAPI.searchContents(params);
      console.log('✅ Contents loaded successfully:', response);
      
      setContents(response.contents);
      return response;
    } catch (err) {
      console.error('❌ Error loading contents:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar conteúdos';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getContentByName = useCallback(async (name: string, year?: number) => {
    console.log('=== USE CONTENT - GET CONTENT BY NAME ===');
    console.log('Name:', name, 'Year:', year);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const content = await contentAPI.getContentByName(name, year);
      console.log('✅ Content loaded successfully:', content);
      
      return content;
    } catch (err) {
      console.error('❌ Error loading content:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar conteúdo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getContentByTMDBId = useCallback(async (tmdbId: number) => {
    console.log('=== USE CONTENT - GET CONTENT BY TMDB ID ===');
    console.log('TMDB ID:', tmdbId);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const content = await contentAPI.getContentByTMDBId(tmdbId);
      console.log('✅ TMDB content loaded successfully:', content);
      
      return content;
    } catch (err) {
      console.error('❌ Error loading TMDB content:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar conteúdo do TMDB';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSimilarContents = useCallback(async (name: string, category: string, limit: number = 10) => {
    console.log('=== USE CONTENT - GET SIMILAR CONTENTS ===');
    console.log('Name:', name, 'Category:', category, 'Limit:', limit);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const similar = await contentAPI.getSimilarContents(name, category, limit);
      console.log('✅ Similar contents loaded successfully:', similar);
      
      return similar;
    } catch (err) {
      console.error('❌ Error loading similar contents:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar conteúdos similares';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    contents,
    isLoading,
    error,
    searchContents,
    getContentByName,
    getContentByTMDBId,
    getSimilarContents,
    clearError: () => setError(null)
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryStats>({ categories: {}, subcategories: {} });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async (includeCount: boolean = false) => {
    console.log('=== USE CATEGORIES - LOAD CATEGORIES ===');
    console.log('Include count:', includeCount);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const categoriesData = await contentAPI.getCategories(includeCount);
      console.log('✅ Categories loaded successfully:', categoriesData);
      
      setCategories(categoriesData);
      return categoriesData;
    } catch (err) {
      console.error('❌ Error loading categories:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    categories,
    isLoading,
    error,
    loadCategories,
    clearError: () => setError(null)
  };
}

export function useContentStats() {
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    console.log('=== USE CONTENT STATS - LOAD STATS ===');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const statsData = await contentAPI.getStats();
      console.log('✅ Stats loaded successfully:', statsData);
      
      setStats(statsData);
      return statsData;
    } catch (err) {
      console.error('❌ Error loading stats:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    isLoading,
    error,
    loadStats,
    clearError: () => setError(null)
  };
}