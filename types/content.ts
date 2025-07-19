export interface ContentAPI {
    name: string;
    originalName: string;
    displayName?: string;
    poster: string;
    category: string;
    subcategory?: string;
    year?: number;
    type: 'movie' | 'series';
    streamUrl: string;
    season?: number;
    episode?: number;
  }
  
  export interface SeriesContentAPI extends ContentAPI {
    episodes?: {
      season: number;
      episode: number;
      streamUrl: string;
      originalName: string;
    }[];
  }
  
  export interface TMDBData {
    tmdbId: number;
    title: string;
    originalTitle: string;
    overview: string;
    releaseDate: string;
    rating: number;
    voteCount: number;
    popularity: number;
    poster: string;
    backdrop: string;
    genres: {
      id: number;
      name: string;
    }[];
    runtime?: number;
    budget?: number;
    revenue?: number;
    numberOfSeasons?: number;
    numberOfEpisodes?: number;
    productionCompanies?: {
      id: number;
      name: string;
      logo_path: string;
    }[];
  }
  
  export interface ContentWithTMDB extends ContentAPI {
    tmdbData?: TMDBData;
  }
  
  export interface ContentSearchParams {
    query?: string;
    type?: 'movie' | 'series' | 'all';
    category?: string;
    subcategory?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'year' | 'rating' | 'popularity';
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface ContentSearchResponse {
    contents: (ContentAPI | SeriesContentAPI)[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters?: object;
  }
  
  export interface CategoryStats {
    categories: Record<string, number>;
    subcategories: Record<string, number>;
  }
  
  export interface ContentStats {
    total: number;
    movies: number;
    series: number;
    categories: Record<string, number>;
    subcategories: Record<string, number>;
    byYear: Record<string, number>;
    lastLoadTime: string;
    cacheStats: {
      size: number;
      entries: string[];
    };
  }