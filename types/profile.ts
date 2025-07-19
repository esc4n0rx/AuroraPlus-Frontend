import { PaginationMeta } from './api';

export interface ProfileAPI {
    id: string;
    nome: string;
    tipo: 'normal' | 'kids';
    avatar: string;
    avatarUrl: string;
    ativo: boolean;
    ordem: number;
    hasPassword?: boolean;
    created_at: string;
  }
  
  export interface CreateProfileRequest {
    nome: string;
    tipo?: 'normal' | 'kids';
    avatar?: string;
    senha?: string;
    ordem?: number;
  }
  
  export interface UpdateProfileRequest {
    nome?: string;
    avatar?: string;
    senha?: string | null;
    ordem?: number;
  }
  
  export interface ProfileAuthRequest {
    senha: string;
  }
  
  export interface Avatar {
    filename: string;
    url: string;
    isDefault: boolean;
  }
  
  export interface AvatarsResponse {
    avatars: Avatar[];
    pagination: PaginationMeta;
  }
  
  export interface ProfilesResponse {
    profiles: ProfileAPI[];
  }