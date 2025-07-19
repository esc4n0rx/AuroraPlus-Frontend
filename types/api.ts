export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Array<{
      field: string;
      message: string;
    }>;
  }
  
  export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
  
  export interface PaginatedResponse<T> extends ApiResponse<T> {
    data: T & {
      pagination: PaginationMeta;
    };
  }