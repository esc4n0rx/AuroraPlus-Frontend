import { apiClient } from './client';
import { fixAvatarUrl } from '@/lib/utils';
import type { 
  ProfileAPI, 
  CreateProfileRequest, 
  UpdateProfileRequest,
  ProfileAuthRequest,
  ProfilesResponse,
  AvatarsResponse
} from '@/types/profile';

export class ProfilesAPI {
  // Função para corrigir URLs dos avatares
  private fixAvatarUrls(profile: ProfileAPI): ProfileAPI {
    if (profile.avatarUrl) {
      profile.avatarUrl = fixAvatarUrl(profile.avatarUrl);
    }
    return profile;
  }

  // Função para corrigir URLs de múltiplos perfis
  private fixProfilesAvatarUrls(profiles: ProfileAPI[]): ProfileAPI[] {
    return profiles.map(profile => this.fixAvatarUrls(profile));
  }

  async getProfiles(): Promise<ProfileAPI[]> {
    try {
      console.log('=== GET PROFILES API CALL ===');
      const response = await apiClient.get<ProfilesResponse>('/profiles');
      
      if (response.data.success && response.data.data) {
        const profiles = response.data.data.profiles;
        console.log('Profiles from API (before fix):', profiles);
        
        const fixedProfiles = this.fixProfilesAvatarUrls(profiles);
        console.log('Profiles after fixing URLs:', fixedProfiles);
        
        return fixedProfiles;
      }
      
      throw new Error(response.data.message || 'Erro ao buscar perfis');
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
      throw error;
    }
  }

  async getProfile(id: string): Promise<ProfileAPI> {
    try {
      console.log('=== GET PROFILE API CALL ===');
      console.log('Profile ID:', id);
      
      const response = await apiClient.get<{ profile: ProfileAPI }>(`/profiles/${id}`);
      
      if (response.data.success && response.data.data) {
        const profile = response.data.data.profile;
        console.log('Profile from API (before fix):', profile);
        
        const fixedProfile = this.fixAvatarUrls(profile);
        console.log('Profile after fixing URLs:', fixedProfile);
        
        return fixedProfile;
      }
      
      throw new Error(response.data.message || 'Perfil não encontrado');
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  }

  async createProfile(profileData: CreateProfileRequest): Promise<ProfileAPI> {
    try {
      console.log('=== CREATE PROFILE API CALL ===');
      console.log('Profile data:', profileData);
      
      // Validação básica antes de enviar
      if (!profileData.nome || profileData.nome.trim().length === 0) {
        throw new Error('Nome do perfil é obrigatório');
      }

      if (profileData.nome.length > 50) {
        throw new Error('Nome do perfil deve ter no máximo 50 caracteres');
      }

      if (profileData.senha && (profileData.senha.length < 4 || profileData.senha.length > 20)) {
        throw new Error('Senha deve ter entre 4 e 20 caracteres');
      }

      const response = await apiClient.post<{ profile: ProfileAPI }>('/profiles', profileData);
      
      if (response.data.success && response.data.data) {
        const profile = response.data.data.profile;
        console.log('Created profile from API (before fix):', profile);
        
        const fixedProfile = this.fixAvatarUrls(profile);
        console.log('Created profile after fixing URLs:', fixedProfile);
        
        return fixedProfile;
      }
      
      throw new Error(response.data.message || 'Erro ao criar perfil');
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      throw error;
    }
  }

  async updateProfile(id: string, profileData: UpdateProfileRequest): Promise<ProfileAPI> {
    try {
      console.log('=== UPDATE PROFILE API CALL ===');
      console.log('Profile ID:', id);
      console.log('Update data:', profileData);
      
      // Validação básica antes de enviar
      if (profileData.nome !== undefined && profileData.nome.trim().length === 0) {
        throw new Error('Nome do perfil é obrigatório');
      }

      if (profileData.nome && profileData.nome.length > 50) {
        throw new Error('Nome do perfil deve ter no máximo 50 caracteres');
      }

      if (profileData.senha && (profileData.senha.length < 4 || profileData.senha.length > 20)) {
        throw new Error('Senha deve ter entre 4 e 20 caracteres');
      }

      const response = await apiClient.put<{ profile: ProfileAPI }>(`/profiles/${id}`, profileData);
      
      if (response.data.success && response.data.data) {
        const profile = response.data.data.profile;
        console.log('Updated profile from API (before fix):', profile);
        
        const fixedProfile = this.fixAvatarUrls(profile);
        console.log('Updated profile after fixing URLs:', fixedProfile);
        
        return fixedProfile;
      }
      
      throw new Error(response.data.message || 'Erro ao atualizar perfil');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  async deleteProfile(id: string): Promise<void> {
    try {
      console.log('=== DELETE PROFILE API CALL ===');
      console.log('Profile ID:', id);
      
      const response = await apiClient.delete(`/profiles/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao remover perfil');
      }
      
      console.log('Profile deleted successfully');
    } catch (error) {
      console.error('Erro ao remover perfil:', error);
      throw error;
    }
  }

  async authenticateProfile(id: string, password: string): Promise<ProfileAPI> {
    try {
      console.log('=== AUTHENTICATE PROFILE API CALL ===');
      console.log('Profile ID:', id);
      
      if (!password || password.trim().length === 0) {
        throw new Error('Senha é obrigatória');
      }

      const response = await apiClient.post<{ profile: ProfileAPI }>(`/profiles/${id}/auth`, { senha: password });
      
      if (response.data.success && response.data.data) {
        const profile = response.data.data.profile;
        console.log('Authenticated profile from API (before fix):', profile);
        
        const fixedProfile = this.fixAvatarUrls(profile);
        console.log('Authenticated profile after fixing URLs:', fixedProfile);
        
        return fixedProfile;
      }
      
      throw new Error(response.data.message || 'Senha incorreta');
    } catch (error) {
      console.error('Erro na autenticação do perfil:', error);
      throw error;
    }
  }

  async getAvatars(page: number = 1, limit: number = 20): Promise<AvatarsResponse> {
    try {
      console.log('=== GET AVATARS API CALL ===');
      console.log('Page:', page, 'Limit:', limit);
      
      const response = await apiClient.get<AvatarsResponse>('/profiles/avatars', { page, limit });
      
      if (response.data.success && response.data.data) {
        const avatarsResponse = response.data.data;
        console.log('Avatars from API (before fix):', avatarsResponse);
        
        // Corrigir URLs dos avatares
        const fixedAvatars = avatarsResponse.avatars.map(avatar => ({
          ...avatar,
          url: fixAvatarUrl(avatar.url)
        }));
        
        const fixedResponse = {
          ...avatarsResponse,
          avatars: fixedAvatars
        };
        
        console.log('Avatars after fixing URLs:', fixedResponse);
        return fixedResponse;
      }
      
      throw new Error(response.data.message || 'Erro ao buscar avatares');
    } catch (error) {
      console.error('Erro ao buscar avatares:', error);
      throw error;
    }
  }
}

export const profilesAPI = new ProfilesAPI();