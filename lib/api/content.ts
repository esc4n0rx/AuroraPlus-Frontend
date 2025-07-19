import { apiClient } from './client';
import type { 
  ContentAPI, 
  SeriesContentAPI, 
  ContentWithTMDB, 
  ContentSearchParams, 
  ContentSearchResponse,
  CategoryStats,
  ContentStats
} from '@/types/content';
import type { ApiResponse } from '@/types/api';

export class ContentService {
  async searchContents(params: ContentSearchParams = {}): Promise<ContentSearchResponse> {
    try {
      console.log('=== SEARCH CONTENTS API CALL ===');
      console.log('Search params:', params);
      
      const response = await apiClient.get<ContentSearchResponse>('/contents', params);
      
      if (response.data.success && response.data.data) {
        const contentResponse = response.data.data;
        console.log('Contents search result:', contentResponse);
        
        return contentResponse;
      }
      
      throw new Error(response.data.message || 'Erro ao buscar conteúdos');
    } catch (error) {
      console.error('Erro ao buscar conteúdos:', error);
      throw error;
    }
  }

  async getContentByName(name: string, type: 'movie' | 'series', year?: number): Promise<ContentWithTMDB> {
    try {
      console.log('=== GET CONTENT BY NAME API CALL ===');
      console.log('Name:', name, 'Type:', type, 'Year:', year);
      
      const params: any = { type };
      if (year) params.year = year;
      
      const response = await apiClient.get<{ content: ContentWithTMDB }>(`/contents/search/${encodeURIComponent(name)}`, params);
      
      if (response.data.success && response.data.data) {
        const content = response.data.data.content;
        console.log('Content found:', content);
        
        return content;
      }
      
      throw new Error(response.data.message || 'Conteúdo não encontrado');
    } catch (error) {
      console.error('Erro ao buscar conteúdo por nome:', error);
      throw error;
    }
  }

  async getContentByTMDBId(tmdbId: number, type: 'movie' | 'series'): Promise<ContentWithTMDB> {
    try {
      console.log('=== GET CONTENT BY TMDB ID API CALL ===');
      console.log('TMDB ID:', tmdbId, 'Type:', type);
      
      const response = await apiClient.get<{ content: ContentWithTMDB }>(`/contents/${tmdbId}`, { type });
      
      if (response.data.success && response.data.data) {
        const content = response.data.data.content;
        console.log('TMDB content found:', content);
        
        return content;
      }
      
      throw new Error(response.data.message || 'Conteúdo não encontrado no TMDB');
    } catch (error) {
      console.error('Erro ao buscar conteúdo por TMDB ID:', error);
      throw error;
    }
  }

  async getSimilarContents(name: string, category: string, limit: number = 10): Promise<ContentAPI[]> {
    try {
      console.log('=== GET SIMILAR CONTENTS API CALL ===');
      console.log('Name:', name, 'Category:', category, 'Limit:', limit);
      
      const response = await apiClient.get<{ similar: ContentAPI[] }>(`/contents/${encodeURIComponent(name)}/similar`, { 
        category, 
        limit 
      });
      
      if (response.data.success && response.data.data) {
        const similar = response.data.data.similar;
        console.log('Similar contents found:', similar);
        
        return similar;
      }
      
      throw new Error(response.data.message || 'Erro ao buscar conteúdos similares');
    } catch (error) {
      console.error('Erro ao buscar conteúdos similares:', error);
      throw error;
    }
  }

  async getCategories(includeCount: boolean = false): Promise<CategoryStats> {
    try {
      console.log('=== GET CATEGORIES API CALL ===');
      console.log('Include count:', includeCount);
      
      const response = await apiClient.get<CategoryStats>('/contents/categories', { 
        type: 'both', 
        includeCount 
      });
      
      if (response.data.success && response.data.data) {
        const categories = response.data.data;
        console.log('Categories found:', categories);
        
        return categories;
      }
      
      throw new Error(response.data.message || 'Erro ao buscar categorias');
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  async getStats(): Promise<ContentStats> {
    try {
      console.log('=== GET CONTENT STATS API CALL ===');
      
      const response = await apiClient.get<{ stats: ContentStats }>('/contents/stats');
      
      if (response.data.success && response.data.data) {
        const stats = response.data.data.stats;
        console.log('Content stats:', stats);
        
        return stats;
      }
      
      throw new Error(response.data.message || 'Erro ao buscar estatísticas');
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  async reloadContents(force: boolean = false): Promise<any> {
    try {
      console.log('=== RELOAD CONTENTS API CALL ===');
      console.log('Force:', force);
      
      const response = await apiClient.post('/contents/reload', { force });
      
      if (response.data.success) {
        console.log('Contents reloaded successfully');
        
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Erro ao recarregar conteúdos');
    } catch (error) {
      console.error('Erro ao recarregar conteúdos:', error);
      throw error;
    }
  }
}

export const contentAPI = new ContentService();