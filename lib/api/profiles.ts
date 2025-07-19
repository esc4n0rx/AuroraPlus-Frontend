import { apiClient } from './client';
import type { 
  ProfileAPI, 
  CreateProfileRequest, 
  UpdateProfileRequest,
  ProfileAuthRequest,
  ProfilesResponse,
  AvatarsResponse
} from '@/types/profile';
import type { PaginatedResponse } from '@/types/api';

export class ProfilesAPI {
  async getProfiles(): Promise<ProfileAPI[]> {
    const response = await apiClient.get<ProfilesResponse>('/profiles');
    
    if (response.data.success && response.data.data) {
      return response.data.data.profiles;
    }
    
    throw new Error(response.data.message || 'Erro ao buscar perfis');
  }

  async getProfile(id: string): Promise<ProfileAPI> {
    const response = await apiClient.get<{ profile: ProfileAPI }>(`/profiles/${id}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data.profile;
    }
    
    throw new Error(response.data.message || 'Perfil não encontrado');
  }

  async createProfile(profileData: CreateProfileRequest): Promise<ProfileAPI> {
    const response = await apiClient.post<{ profile: ProfileAPI }>('/profiles', profileData);
    
    if (response.data.success && response.data.data) {
      return response.data.data.profile;
    }
    
    throw new Error(response.data.message || 'Erro ao criar perfil');
  }

  async updateProfile(id: string, profileData: UpdateProfileRequest): Promise<ProfileAPI> {
    const response = await apiClient.put<{ profile: ProfileAPI }>(`/profiles/${id}`, profileData);
    
    if (response.data.success && response.data.data) {
      return response.data.data.profile;
    }
    
    throw new Error(response.data.message || 'Erro ao atualizar perfil');
  }

  async deleteProfile(id: string): Promise<void> {
    const response = await apiClient.delete(`/profiles/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao remover perfil');
    }
  }

  async authenticateProfile(id: string, password: string): Promise<ProfileAPI> {
    const response = await apiClient.post<{ profile: ProfileAPI }>(`/profiles/${id}/auth`, { senha: password });
    
    if (response.data.success && response.data.data) {
      return response.data.data.profile;
    }
    
    throw new Error(response.data.message || 'Senha incorreta');
  }

  async getAvatars(page: number = 1, limit: number = 20): Promise<AvatarsResponse> {
    const response = await apiClient.get<AvatarsResponse>('/profiles/avatars', { page, limit });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao buscar avatares');
  }
}

export const profilesAPI = new ProfilesAPI();