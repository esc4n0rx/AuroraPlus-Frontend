import { useState, useCallback, useEffect } from 'react';
import { profilesAPI } from '@/lib/api/profiles';
import { useAppStore } from '@/lib/store';
import type { ProfileAPI, CreateProfileRequest, UpdateProfileRequest, Avatar } from '@/types/profile';

export function useProfiles() {
  const [profiles, setProfiles] = useState<ProfileAPI[]>([]);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUserProfiles, apiToken } = useAppStore();

  console.log('=== USE PROFILES HOOK DEBUG ===');
  console.log('Current profiles state:', profiles);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);
  console.log('API Token available:', !!apiToken);

  const loadProfiles = useCallback(async () => {
    console.log('=== LOAD PROFILES CALLED ===');
    console.log('API Token:', apiToken);
    
    if (!apiToken) {
      console.log('❌ Token não disponível, aguardando...');
      return;
    }

    console.log('✅ Token disponível, carregando perfis...');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fazendo requisição para /profiles...');
      const fetchedProfiles = await profilesAPI.getProfiles();
      console.log('✅ Perfis carregados com sucesso:', fetchedProfiles);
      
      setProfiles(fetchedProfiles);
      
      const mappedProfiles = fetchedProfiles.map(p => ({
        id: p.id,
        name: p.nome,
        avatar: p.avatarUrl,
        type: p.tipo
      }));
      
      console.log('🔄 Atualizando store com perfis:', mappedProfiles);
      setUserProfiles(mappedProfiles);
      
    } catch (err) {
      console.error('❌ Erro ao carregar perfis:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar perfis';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 Carregamento de perfis finalizado');
    }
  }, [setUserProfiles, apiToken]);

  const createProfile = useCallback(async (profileData: CreateProfileRequest) => {
    console.log('=== CREATE PROFILE CALLED ===');
    console.log('Profile data:', profileData);
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Criando perfil na API...');
      const newProfile = await profilesAPI.createProfile(profileData);
      console.log('✅ Perfil criado com sucesso:', newProfile);
      
      setProfiles(prev => {
        const updated = [...prev, newProfile].sort((a, b) => a.ordem - b.ordem);
        console.log('🔄 Atualizando lista de perfis:', updated);
        return updated;
      });
      
      return newProfile;
    } catch (err) {
      console.error('❌ Erro ao criar perfil:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (id: string, profileData: UpdateProfileRequest) => {
    console.log('=== UPDATE PROFILE CALLED ===');
    console.log('Profile ID:', id);
    console.log('Update data:', profileData);
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Atualizando perfil na API...');
      const updatedProfile = await profilesAPI.updateProfile(id, profileData);
      console.log('✅ Perfil atualizado com sucesso:', updatedProfile);
      
      setProfiles(prev => {
        const updated = prev.map(p => p.id === id ? updatedProfile : p).sort((a, b) => a.ordem - b.ordem);
        console.log('🔄 Atualizando lista de perfis:', updated);
        return updated;
      });
      
      return updatedProfile;
    } catch (err) {
      console.error('❌ Erro ao atualizar perfil:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProfile = useCallback(async (id: string) => {
    console.log('=== DELETE PROFILE CALLED ===');
    console.log('Profile ID:', id);
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Removendo perfil na API...');
      await profilesAPI.deleteProfile(id);
      console.log('✅ Perfil removido com sucesso');
      
      setProfiles(prev => {
        const updated = prev.filter(p => p.id !== id);
        console.log('🔄 Atualizando lista de perfis:', updated);
        return updated;
      });
    } catch (err) {
      console.error('❌ Erro ao remover perfil:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const authenticateProfile = useCallback(async (id: string, password: string) => {
    console.log('=== AUTHENTICATE PROFILE CALLED ===');
    console.log('Profile ID:', id);
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Autenticando perfil...');
      const authenticatedProfile = await profilesAPI.authenticateProfile(id, password);
      console.log('✅ Perfil autenticado com sucesso:', authenticatedProfile);
      
      return authenticatedProfile;
    } catch (err) {
      console.error('❌ Erro na autenticação:', err);
      const errorMessage = err instanceof Error ? err.message : 'Senha incorreta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAvatars = useCallback(async (page: number = 1, limit: number = 20) => {
    console.log('=== LOAD AVATARS CALLED ===');
    console.log('Page:', page, 'Limit:', limit);
    
    try {
      console.log('🔄 Carregando avatares...');
      const avatarsResponse = await profilesAPI.getAvatars(page, limit);
      console.log('✅ Avatares carregados:', avatarsResponse);
      
      if (page === 1) {
        setAvatars(avatarsResponse.avatars);
      } else {
        setAvatars(prev => [...prev, ...avatarsResponse.avatars]);
      }
      return avatarsResponse;
    } catch (err) {
      console.error('❌ Erro ao carregar avatares:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar avatares';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Carrega perfis quando há token disponível
  useEffect(() => {
    console.log('=== USE PROFILES EFFECT ===');
    console.log('API Token changed:', !!apiToken);
    
    if (apiToken) {
      console.log('🔄 Token disponível, carregando perfis...');
      loadProfiles();
    } else {
      console.log('❌ Token não disponível, limpando perfis');
      setProfiles([]);
      setError(null);
    }
  }, [apiToken, loadProfiles]);

  return {
    profiles,
    avatars,
    isLoading,
    error,
    loadProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    authenticateProfile,
    loadAvatars,
    clearError: () => setError(null)
  };
}